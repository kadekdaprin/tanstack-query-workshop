# What I Learned

- `select` transforms data at subscription time — the raw server response stays in the cache unchanged; only the subscribing component sees the transformed result.
- Sort state belongs outside the query key because it doesn't change what data is fetched, only how the already-fetched data is presented.
- Changing the sort never triggers a new network request — TanStack Query re-runs `select` on the cached data immediately.

## Key Concepts

### `select` — transform at read time, not at storage time

`select` is a function you give to `useQuery` that receives the raw cached data and returns whatever shape the component needs:

```ts
useQuery({
  queryKey: ['products', category, search],
  queryFn: () => getProducts(category, search),
  select: (data) => [...data].sort((a, b) => a.price - b.price),
})
```

The cache always holds the raw array from the server. The component receives the sorted array. If two components subscribe to the same query with different `select` functions, each gets its own transformed view — the cache entry is shared, the derived views are independent.

### Sort state is NOT in the query key

The query key drives fetches. If `sortBy` were in the key:

```ts
// Wrong — triggers a new fetch every time sort changes
queryKey: ['products', category, search, sortBy]
```

Every sort change would be a cache miss and a new network request, even though the server doesn't know or care about sort order. Sort is a client-side concern. Keeping it out of the key means:

- Changing sort → `select` re-runs on cached data → instant, no fetch
- Changing filter → key changes → new fetch (correct, different data)

```ts
// Correct — key drives fetches, select drives presentation
queryKey: ['products', category, search],   // ← no sortBy here
select: sortBy !== 'default' ? (data) => sortProducts(data, sortBy) : undefined,
```

### `select` runs when data changes OR when `select` itself changes

TanStack Query calls `select` whenever the cached data updates or when the `select` reference changes. Since `select` is an inline function in `useQuery`, it re-runs on every render — but because of structural sharing, the component only re-renders if the *result* actually changes.

Passing `undefined` when no sort is needed (`sortBy === 'default'`) skips the transform entirely and returns the raw array as-is.

### Sorting must copy the array before sorting

`Array.prototype.sort` mutates in place. Mutating the cached array directly would corrupt the cache for every subscriber. The fix is always to spread first:

```ts
// Wrong — mutates the cached array
data.sort((a, b) => a.price - b.price)

// Correct — sorts a copy
[...data].sort((a, b) => a.price - b.price)
```

# Problems I Faced

- Defining `SORT_OPTIONS` and `setSortBy` in the component before wiring them to the JSX triggered TypeScript "declared but never read" warnings. The fix is to complete the JSX in the same edit.

# Notes

- `select` is also useful for picking a single item out of a list (e.g., find a product by id from the full product array), which is the basis of `initialData` seeding in checkpoint-09.
- Computed properties like `isLowStock: product.stock <= 5` are another common `select` use case — derive once at the query boundary instead of recalculating in every render.
