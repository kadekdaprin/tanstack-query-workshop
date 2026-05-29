# What I Learned

- `useQuery` is the core hook for fetching and caching server data.
- A `queryKey` uniquely identifies a query in the cache — same key = shared cache entry.
- `queryFn` is a plain async function that must return data or throw an error.
- TanStack Query manages four states: `pending`, `error`, `success`, and `empty` (success with empty array).
- The hook returns `isLoading`, `isError`, `data`, and `error` — no manual `useState` needed.

## Key Concepts

### `useQuery` — what it does

`useQuery` fetches data, caches it, and gives you reactive state flags. You never write `useState` for loading/error/data manually.

```ts
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['products'],
  queryFn: getProducts,
})
```

On first mount it fires `queryFn`. On re-mount within `staleTime` it reads from cache instead of refetching.

### `queryKey` — the cache address

The query key is an array that uniquely names this cache entry. Two hooks with the same key share the same cached data.

```ts
queryKey: ['products']          // all products
queryKey: ['products', 'electronics']  // filtered — different cache entry (checkpoint 04)
queryKey: ['products', '42']    // single product detail (checkpoint 06)
```

Keys must be serializable. Arrays are used so you can compose them with parameters later.

### `queryFn` — just a fetch

`queryFn` is a plain async function. It must either resolve with data or throw. TanStack Query uses the throw to detect errors — never return `null` to signal failure.

```ts
export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}
```

### Handling all four UI states

```tsx
if (isLoading) return <p>Loading...</p>
if (isError)   return <p>Error: {error.message}</p>
if (data?.length === 0) return <p>No products found.</p>
return <ProductGrid products={data} />
```

`isLoading` is `true` only on the very first fetch (no cached data yet). After the first success, background refetches keep `data` populated so the UI never flashes back to a loading spinner.

### Why queries live in hooks, not pages

Keeping `useQuery` inside `features/products/hooks/useProducts.ts` means:
- Multiple pages can reuse the same query (they'll share the cache automatically).
- Pages stay thin and readable.
- The query key and fetch logic live in one place.

# Problems I Faced

- `isLoading` vs `isPending`: `isLoading` is `true` only when there is no cached data AND a fetch is in flight. `isPending` is `true` whenever the query hasn't resolved yet (including background retries). For a first-load spinner, `isLoading` is the right flag.

# Notes

- `queryKey: ['products']` is a static key — checkpoint 04 will expand it to `['products', category]` to support per-category caching.
- The 10% random failure from `simulateNetwork()` makes the error state easy to observe without special setup — just refresh a few times.
