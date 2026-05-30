# What I Learned

- Query keys are arrays — adding a category value creates a separate cache entry per category.
- Switching between filters shows a loading skeleton on the first visit but reads instantly from cache on return visits.
- The MSW handler already supported `?category=` filtering; the TanStack Query work was purely about cache keys and hook API.

## Key Concepts

### Dynamic Query Keys — separate cache per filter

Every unique query key maps to its own cache slot. By including `category` in the key:

```ts
queryKey: ['products', category]
```

TanStack Query stores each result independently:

```
['products', undefined]     → all products
['products', 'electronics'] → electronics only
['products', 'clothing']    → clothing only
```

Switching from "All" to "Electronics" triggers a new fetch (cache miss). Switching back to "All" reads from the cache (no fetch) if the data is still within `staleTime`. This is the core mechanic that makes filter/search UIs fast after the first load.

### Why `undefined` in a query key is valid

When no category is selected, `category` is `undefined`. TanStack Query serializes `undefined` in keys correctly — it does **not** skip the key element. So `['products', undefined]` and `['products', 'electronics']` are distinct, separate cache entries.

### Cache isolation means no stale cross-filter data

Without category in the key, a single `['products']` cache entry would be overwritten on every filter switch. Users could briefly see the wrong products before the fetch completes. Putting category in the key ensures each filtered view has its own isolated, independently-managed cache slot.

### queryFn must close over the dynamic value

Because the key includes `category`, the `queryFn` must also use it:

```ts
// Wrong — queryFn ignores category even though key includes it
queryKey: ['products', category],
queryFn: getProducts,  // no category passed

// Correct — queryFn and key are in sync
queryKey: ['products', category],
queryFn: () => getProducts(category),
```

TanStack Query calls `queryFn` when it needs fresh data for a key. If `queryFn` doesn't match the key semantics, the cached data will be wrong.

### `staleTime` applies per cache entry

Each `['products', category]` entry has its own freshness clock. Visiting "Electronics", waiting 30 seconds, then visiting "Clothing" starts a fresh 60-second window for the "Clothing" entry — "Electronics" still has 30 seconds of freshness remaining.

# Problems I Faced

- `queryFn: getProducts` (without a wrapper) would ignore the `category` argument even after adding it to the key. The fix is `queryFn: () => getProducts(category)` so the closure captures the current value.

# Notes

- In TanStack Query v5 `queryFn` also receives a `QueryFunctionContext` with `queryKey` — you could read `context.queryKey[1]` inside `getProducts` instead of passing category directly. Both approaches work; the explicit parameter is clearer.
- Once checkpoint-05 (search) is implemented, the key pattern will grow: `['products', category, search]`. Keeping the order consistent matters for cache key equality.
