# What I Learned

- `useMutation` is how TanStack Query handles side effects — POST, PATCH, DELETE — anything that changes data on the server.
- `onSuccess` with `invalidateQueries` is the simplest correct approach: after a mutation succeeds, mark related queries stale so they refetch.
- Optimistic updates make the UI feel instant by writing the expected result into the cache *before* the server responds, then rolling back if the server rejects it.
- Broad invalidation by query key namespace (`['products']`) clears both list and detail queries in one call because they share the same root key.

## Key Concepts

### `useMutation` vs `useQuery`

`useQuery` is for reads — it runs automatically, caches the result, and re-runs when the cache goes stale. `useMutation` is for writes — it does nothing until you call `mutate(...)`, and it never caches.

```ts
const { mutate, isPending } = useMutation({
  mutationFn: (id: string) => toggleWishlist(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  },
})

// Triggered by the user, not automatically
mutate(product.id)
```

`isPending` is `true` while the request is in flight — use it to disable the button and prevent double-submits.

### `invalidateQueries` — the simple, always-correct approach

After a successful mutation, call `invalidateQueries` with the affected key prefix. TanStack Query marks every matching cached query as stale and immediately refetches any that are currently mounted.

```ts
// Invalidates ALL queries whose key starts with ['products']:
// ['products', undefined, undefined]  ← home page (all)
// ['products', 'electronics', undefined]  ← filtered list
// ['products', '5']  ← detail page
queryClient.invalidateQueries({ queryKey: ['products'] })
```

This works because `invalidateQueries` does a prefix match — one call clears the entire namespace.

### Optimistic updates — the `onMutate` / `onError` / `onSettled` triplet

Invalidating after success means the user sees a loading state while waiting for the refetch. Optimistic updates skip that: write the expected outcome into the cache immediately, then confirm (or roll back) once the server responds.

```ts
useMutation({
  mutationFn: toggleWishlist,

  onMutate: async (id) => {
    // 1. Cancel any in-flight fetches that might overwrite the optimistic state
    await queryClient.cancelQueries({ queryKey: ['products'] })

    // 2. Snapshot the current cache for rollback
    const snapshot = queryClient.getQueriesData<Product | Product[]>({ queryKey: ['products'] })

    // 3. Write the optimistic state — flip isWishlisted in every list
    queryClient.setQueriesData<Product[]>({ queryKey: ['products'] }, (old) => {
      if (!Array.isArray(old)) return old
      return old.map(p => p.id === id ? { ...p, isWishlisted: !p.isWishlisted } : p)
    })

    // 4. Also update the detail page cache directly
    queryClient.setQueryData<Product>(['products', id], (old) =>
      old ? { ...old, isWishlisted: !old.isWishlisted } : old
    )

    return { snapshot }  // passed to onError as context
  },

  onError: (_err, _id, context) => {
    // Roll back every entry to its snapshot
    context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
  },

  onSettled: () => {
    // Always sync with the server at the end, success or failure
    queryClient.invalidateQueries({ queryKey: ['products'] })
  },
})
```

The three callbacks fire in this order:
- `onMutate` → before the request leaves the browser
- `onError` → if the request fails (rollback)
- `onSettled` → always fires last (cleanup / final sync)

### Why `cancelQueries` matters in `onMutate`

If a background refetch is already in flight when the user clicks Wishlist, that refetch could land *after* the optimistic update and overwrite it with stale server data. Cancelling in-flight queries prevents that race condition.

### `setQueriesData` handles multiple cached lists at once

`setQueriesData` accepts a filter object (same as `invalidateQueries`) and applies the updater function to every matching cache entry. This is how one call updates "All products", "Electronics", and any other filtered list that happens to contain the product.

# Problems I Faced

- Forgetting `e.stopPropagation()` on the wishlist button inside `ProductCard` caused the card's `<Link>` to navigate when the button was clicked.
- `setQueriesData` calls the updater for *all* matching entries, including the detail query which stores a single `Product`, not `Product[]`. The `if (!Array.isArray(old)) return old` guard handles this — the detail entry is then updated separately with `setQueryData`.

# Notes

- `onSettled` is preferred over `onSuccess` for the final invalidation because it runs even when the request fails, ensuring the cache is always eventually consistent with the server.
- Checkpoint-12 will explore `useInfiniteQuery` for paginated product lists.
