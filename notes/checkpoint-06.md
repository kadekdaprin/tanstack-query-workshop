# What I Learned

- A detail query uses the same `useQuery` API as a list query — the only differences are the query key and the fetch function.
- The query key `['products', id]` is intentionally nested under the same `'products'` namespace as the list, which enables cache sharing via `initialData`.
- `useParams` from React Router provides the `:id` segment; the hook receives it as a plain string argument so it stays framework-agnostic.

## Key Concepts

### Single-resource queries — same pattern, scoped key

A list query and a detail query follow the same `useQuery` shape. The key difference is specificity:

```ts
// list
queryKey: ['products', category, search]

// detail
queryKey: ['products', id]
```

Each product ID gets its own cache slot. Navigating to `/products/3`, back to `/`, then to `/products/3` again is a cache hit on the second visit — no extra request.

### Query key namespacing — why `['products', id]` and not `['product', id]`

Using the same top-level namespace (`'products'`) groups related queries together. This matters for:

- **Cache invalidation**: `queryClient.invalidateQueries({ queryKey: ['products'] })` invalidates both the list and any detail entries at once — useful after a mutation.
- **`initialData` seeding** (covered in a later checkpoint): you can seed a detail entry from the already-fetched list without an extra network round-trip.

Using a different namespace (`['product', id]`) would silo the entries and break both benefits.

### `useParams` at the route boundary, id passed down as a prop/arg

`useParams` is React Router API — it only works inside a routed component. The hook (`useProduct`) receives `id` as a plain argument so it stays reusable and testable outside of a routing context:

```ts
// route component — only place that knows about routing
const { id } = useParams<{ id: string }>()

// hook — knows nothing about routing
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
  })
}
```

This separation mirrors the same boundary enforced on the list — pages know about routing, hooks know about data.

### Graceful 404 handling — throwing in the API layer

The API function throws when `res.ok` is false, including 404s from the server. TanStack Query catches the throw and sets `isError: true`. The component renders an error state with a retry button rather than crashing:

```ts
// getProduct.ts
if (!res.ok) {
  const body = await res.json().catch(() => ({}))
  throw new Error(body.message ?? 'Failed to fetch product')
}
```

Throwing with the server's message (`"Product not found"`) gives the UI something meaningful to display.

### Skeleton loading on the detail page

Like the list's `ProductCardSkeleton`, the detail page renders a pulsing placeholder while `isLoading` is true. The key rule: the placeholder must match the layout of the real content so there is no jarring shift when data arrives.

# Problems I Faced

- Forgetting to close the `<Link>` wrapper in `ProductCard` (used `</div>` instead of `</Link>`) caused a JSX type error caught immediately by the IDE.

# Notes

- In checkpoint-09 (initialData), the detail query will be seeded from the list cache so navigating to a product detail page shows content instantly while a background refresh runs.
- In checkpoint-12 (mutations), the detail page will gain Add to Cart / Wishlist buttons.
