# What I Learned

- `initialData` seeds a query's cache entry with data you already have elsewhere — the detail page renders with content instantly instead of showing a skeleton when navigating from the list.
- Setting `initialDataUpdatedAt: 0` tells TanStack Query the seed data is already stale, so it always background-refetches the real detail endpoint even when initial data was found.
- Without `initialDataUpdatedAt`, TanStack Query treats `initialData` as fresh and skips the background refetch entirely — the detail endpoint is never hit.

## Key Concepts

### `initialData` vs `placeholderData` — cache vs view

Both let you show something immediately, but they behave very differently:

| | `placeholderData` | `initialData` |
|---|---|---|
| Written to cache? | No | Yes |
| Counts toward `staleTime`? | No | Yes (via `initialDataUpdatedAt`) |
| Shows in Devtools? | No | Yes |
| Re-renders when real data arrives? | Yes | Yes (if stale) |

Use `placeholderData` when you have a rough stand-in (previous list while filtering).  
Use `initialData` when you have real data that belongs in the cache (a product already fetched as part of a list).

### Seeding from the list cache with `getQueriesData`

`queryClient.getQueriesData` does a prefix scan of the cache. Passing `{ queryKey: ['products'] }` returns every entry whose key starts with `['products']` — list queries like `['products', 'electronics', undefined]` AND detail queries like `['products', '1']`.

The runtime guard skips non-array entries (detail pages cache a single object, not an array):

```ts
initialData: () => {
  const entries = queryClient.getQueriesData<Product[]>({ queryKey: ['products'] })
  for (const [, data] of entries) {
    if (!Array.isArray(data)) continue          // skip ['products', id] entries
    const match = data.find(p => p.id === id)
    if (match) return match
  }
},
```

The first list entry that contains the product wins. If nothing is found, `initialData` returns `undefined` — standard loading skeleton takes over.

### `initialDataUpdatedAt: 0` — always background-refetch

`initialData` writes to the cache, which means `staleTime` applies. With a global `staleTime: 1 minute`, initialData from the list would be treated as fresh for a full minute — the detail endpoint would never be called.

Setting `initialDataUpdatedAt: 0` (epoch zero) tells TanStack Query the data was updated at the beginning of time — it is immediately stale, so a background refetch runs every time:

```ts
initialDataUpdatedAt: 0,   // always stale → background refetch always fires
```

The user sees content immediately from the cache. The background refetch silently updates it with the authoritative response from `/api/products/:id`.

### The navigation flow with initialData

```
User browses list → ['products', undefined, undefined] cached
User clicks product 3 → navigates to /products/3
  → useProduct('3') calls initialData()
  → scans list cache → finds product 3
  → returns it immediately: isLoading: false, data: <product>
  → background fetch fires for ['products', '3']
  → fetch resolves → cache updated with authoritative data
```

Without `initialData`, every navigation to a detail page shows a skeleton, even though the data was already downloaded as part of the list.

# Problems I Faced

- Omitting `initialDataUpdatedAt` caused the detail endpoint to never be called after initialData was found — the seeded data was treated as fresh for the full `staleTime` window.
- Not guarding with `Array.isArray(data)` would cause `.find()` to throw at runtime if a detail cache entry (a plain `Product` object) was matched by the prefix scan.

# Notes

- In a real app you'd set `initialDataUpdatedAt` to the list query's actual `dataUpdatedAt` timestamp (via `queryClient.getQueryState`). That way, the detail background-refetches only when the list data is itself stale, not unconditionally. For this workshop, `0` is simpler and always correct.
- Checkpoint-10 builds on this: `enabled` lets us fire a second *dependent* query (related products) only after the product's category is known.
