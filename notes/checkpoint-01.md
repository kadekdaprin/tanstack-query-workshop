# What I Learned

- `QueryClientProvider` must wrap the entire app so all hooks can access the shared cache.
- MSW `worker.start()` must resolve before React mounts — otherwise early fetch calls bypass the mock.
- `createBrowserRouter` + `RouterProvider` is the modern React Router v6+ approach (no `<BrowserRouter>` wrapper needed).
- `ReactQueryDevtools` is placed inside `QueryClientProvider` but outside the router — it doesn't need routing context.
- Tailwind v4 only needs `@import "tailwindcss"` in CSS — no config file required when using `@tailwindcss/vite`.

## Key Concepts

### Bootstrap order (`prepare()` pattern)
```
prepare()  ← starts MSW worker first
  └── then: createRoot().render()  ← only then mounts React
```
If React rendered before MSW was ready, the first fetch would escape to the real network (which doesn't exist here), causing errors. MSW must be able to intercept from the very first render.

### Provider stack
```
<QueryClientProvider client={queryClient}>   ← shares the cache globally
  <RouterProvider router={router} />          ← handles routing
  <ReactQueryDevtools />                      ← inspect cache state in browser
</QueryClientProvider>
```

### `staleTime` — the most important QueryClient concept
`staleTime: 60000` means cached data is considered "fresh" for 1 minute. During that window, navigating away and back will **not** trigger a new network request — it reads from the cache. After 1 minute the data is "stale" and the next mount/focus refetch will hit the network again.

### `retry: 1`
When a request fails (including the 10% random failures from `simulateNetwork()`), TanStack Query will automatically retry it once before surfacing an error to the UI.

# Problems I Faced

- MSW v2 uses `setupWorker` from `msw/browser` (not `msw`) — the import path changed from v1.
- Tailwind v4 setup is different from v3: no `tailwind.config.js`, no `@tailwind base/components/utilities` directives.

# Notes

- Global `QueryClient` defaults: `retry: 1`, `staleTime: 60s`. These are intentionally loose for a learning project.
- `simulateNetwork()` in handlers introduces 500–2000ms delay + 10% random failure rate — this makes loading and error states easy to observe without special tooling.
- `App.tsx` is unused; the router in `main.tsx` owns the layout. It can be deleted in a future cleanup.
