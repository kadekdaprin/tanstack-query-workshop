# What I Learned

- `simulateNetwork` extracted into its own file makes the delay/failure logic reusable across all handlers.
- Skeleton UIs use the same grid layout as the real content, so the page doesn't jump when data arrives.
- `refetch()` from `useQuery` lets the user manually retry after an error without reloading the page.
- TanStack Query's `retry` config silently retries before ever surfacing an error to the UI.
- `staleTime` controls how long cached data is trusted before a background refetch is triggered.

## Key Concepts

### `retry` — automatic silent retries

When `queryFn` throws, TanStack Query retries before setting `isError: true`. With `retry: 1` (the global default here), the flow is:

```
fetch fails → retry once → still fails → isError = true
```

The user sees the skeleton during both attempts. They only see the error state if all retries are exhausted. This is why the 10% error rate from `simulateNetwork` doesn't surface an error every time it triggers.

To disable retries for a specific query:
```ts
useQuery({ queryKey: ['products'], queryFn: getProducts, retry: false })
```

### `staleTime` — when does a cached result expire?

`staleTime` sets how long TanStack Query treats cached data as "fresh". During this window, navigating away and back **will not trigger a new fetch** — it reads from the cache.

```
staleTime: 60_000   // data is fresh for 1 minute
```

After 1 minute the data becomes "stale". The next focus or mount will refetch in the background — but crucially, the stale data is still shown immediately while the background fetch runs. The user never sees a blank screen or skeleton on re-visit.

```
         mount          re-mount (< 60s)     re-mount (> 60s)
           │                  │                     │
   fetch from network    read from cache    show stale + refetch
```

### Skeleton UI — why it beats a spinner

A skeleton matches the shape of the final content. This avoids layout shift when data loads and gives the user a sense of what's coming.

```tsx
{isLoading && (
  <div className="grid ...">
    {Array.from({ length: 8 }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)}
```

`animate-pulse` (Tailwind) fades the placeholder in and out to signal activity without a spinning icon.

### `refetch` — manual retry button

`useQuery` returns a `refetch` function that re-runs the query on demand. Use it to give users a way out of the error state:

```tsx
const { isError, error, refetch } = useQuery(...)

{isError && (
  <button onClick={() => refetch()}>Try Again</button>
)}
```

`refetch` bypasses `staleTime` — it always hits the network regardless of cache freshness.

### `simulateNetwork` as a shared utility

Extracting to `src/mocks/simulateNetwork.ts` means every new handler automatically gets the same delay/failure behavior by importing one function:

```ts
import { simulateNetwork } from './simulateNetwork'

http.get('/api/something', async () => {
  try { await simulateNetwork() } catch { return HttpResponse.json(..., { status: 500 }) }
  // ...
})
```

# Problems I Faced

- `isLoading` is only `true` on the very first fetch (no cached data). On background refetches after `staleTime` expires, `isLoading` stays `false` so the skeleton doesn't flash again — that's the correct behavior.

# Notes

- The skeleton count (8) is hardcoded to match the number of mock products. In a real app you'd use a page size value.
- `refetch` always goes to the network — useful for "pull to refresh" or manual retry buttons, but avoid calling it unnecessarily or you bypass the cache benefits.
