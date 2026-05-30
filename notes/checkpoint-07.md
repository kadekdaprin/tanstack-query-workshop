# What I Learned

- `placeholderData: (prev) => prev` makes TanStack Query serve the last successful result while a new fetch runs, so the grid never goes blank when filters change.
- `isFetching` is true during any in-flight request — including background refetches — while `isLoading` is only true when there is no cached data at all.
- The opacity dimming pattern (`isFetching && !isLoading`) communicates "stale data in view, update coming" without destroying the layout.

## Key Concepts

### `placeholderData` — keep the previous result visible

Before this checkpoint, switching categories or typing in the search caused `isLoading` to become `true` and the skeleton grid to flash in. That happens because each new key combination (`['products', 'electronics', undefined]`) starts with no data in cache.

`placeholderData: (prev) => prev` tells TanStack Query: while the new key's data is loading, show the last data this query returned as a temporary stand-in:

```ts
useQuery({
  queryKey: ['products', category, search],
  queryFn: () => getProducts(category, search),
  placeholderData: (prev) => prev,   // ← hold the previous page in view
})
```

The result: the grid stays populated during the transition. Only the very first query (cold cache, no previous data) shows skeletons.

### v4 → v5 rename: `keepPreviousData` → `placeholderData`

In TanStack Query v4 this was a boolean flag:

```ts
// v4 — no longer valid in v5
keepPreviousData: true
```

In v5 it became a function so you can be selective about which previous data to keep:

```ts
// v5
placeholderData: (previousData) => previousData   // keep all
placeholderData: (prev) => prev?.slice(0, 4)      // keep first four only
placeholderData: undefined                         // opt out (default)
```

Passing the identity function `(prev) => prev` is the direct v5 equivalent of the old flag.

### `isLoading` vs `isFetching` — two different loading states

| Flag | True when |
|---|---|
| `isLoading` | No cached/placeholder data AND a fetch is in flight |
| `isFetching` | Any fetch is in flight (first load, background refetch, filter change) |

With `placeholderData` active, `isLoading` is almost always `false` after the very first load because there is always placeholder data to show. `isFetching` takes over as the signal that something is happening in the background:

```
first visit → isLoading: true,  isFetching: true  → show skeleton
filter change → isLoading: false, isFetching: true  → dim grid (placeholder visible)
data arrives → isLoading: false, isFetching: false → full opacity
```

### Dimming vs skeleton — choosing the right visual

Skeletons are the right choice when there is no meaningful content to show. Dimming is the right choice when the previous content is still partially relevant (same product list, just filtering):

```tsx
<div className={`grid ... transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
```

A 200 ms CSS transition prevents a jarring flash on fast responses while still giving visual feedback on slower ones.

# Problems I Faced

- Destructuring `isFetching` but not using it immediately triggered a TypeScript "declared but never read" warning. The fix was wiring it into the JSX in the same edit.

# Notes

- `placeholderData` is discarded as soon as the real data arrives — it never writes to the cache. The query key's cache slot stays empty until the fetch succeeds.
- In checkpoint-09 (`initialData`), the detail page will use a different mechanism: seeding from the list cache entry so the detail renders instantly with real (not placeholder) data.
