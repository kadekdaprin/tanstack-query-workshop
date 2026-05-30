# What I Learned

- `enabled` is a switch that tells a query whether it's allowed to run. Set it to `false` and the query just sits there doing nothing.
- You can tie `enabled` to a value from another query — that's how you make one query wait for another to finish first.
- The related products query uses the same query key shape as the home page filter, so it can reuse the cached data if the user already visited that category.

## Key Concepts

### `enabled` — letting a query run only when it's ready

By default a query fires as soon as the component mounts. You can block it with `enabled`:

```ts
useQuery({
  queryKey: ['products', category, undefined],
  queryFn: () => getProducts(category),
  enabled: !!category,   // only run when category is a real value
})
```

When `enabled` is `false`, nothing happens — no fetch, no loading spinner, no error. The query just waits. The moment `enabled` flips to `true`, TanStack Query fires the fetch on its own.

### Waiting for one query before starting another

On the detail page, we need the product's category before we can fetch related products. So we chain them:

```
1. useProduct(id)  →  loads  →  product.category = 'electronics'
2. useRelatedProducts(product?.category)  →  enabled flips true  →  fetch fires
```

While step 1 is still loading, `product?.category` is `undefined`, so step 2 does nothing. Once the product arrives with a category, step 2 wakes up and fetches automatically. No `useEffect` needed.

### Free cache hit when keys match

The related products query uses this key:

```ts
queryKey: ['products', category, undefined]
```

That's the exact same key the home page uses when a category filter is selected. So if the user already browsed "Electronics" on the home page and then navigates to an electronics product, the related products appear instantly — the data is already cached.

### Removing the current product with `select`

The API returns all products in the category, including the one the user is already looking at. `select` strips it out before the component sees the data:

```ts
select: (data) => data.filter(p => p.id !== excludeId),
```

The cache keeps the full list. The component just gets a filtered view.

### `enabled: false` doesn't clear cached data

Turning `enabled` off only stops new fetches — it doesn't delete anything already in the cache. If the query already has data, that data stays until it's explicitly invalidated or removed.

# Problems I Faced

- Forgetting to check `related && related.length > 0` before rendering the Related Products section caused an empty heading to show when a product had no others in its category.

# Notes

- `enabled: !!user` is a common pattern for auth-gated queries — the query doesn't run until a logged-in user is available.
- In checkpoint-11 (mutations), the wishlist toggle will invalidate `['products']` — because the detail and list queries share that namespace, one call clears both.
