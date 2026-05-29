# What I Learned

- `QueryClientProvider` must wrap the entire app so all hooks can access the shared cache.
- MSW `worker.start()` must resolve before React mounts — otherwise early fetch calls bypass the mock.
- `createBrowserRouter` + `RouterProvider` is the modern React Router v6+ approach (no `<BrowserRouter>` wrapper needed).
- `ReactQueryDevtools` is placed inside `QueryClientProvider` but outside the router — it doesn't need routing context.
- Tailwind v4 only needs `@import "tailwindcss"` in CSS — no config file required when using `@tailwindcss/vite`.

# Problems I Faced

- MSW v2 uses `setupWorker` from `msw/browser` (not `msw`) — the import path changed from v1.
- Tailwind v4 setup is different from v3: no `tailwind.config.js`, no `@tailwind base/components/utilities` directives.

# Notes

- Global `QueryClient` defaults: `retry: 1`, `staleTime: 60s`. These are intentionally loose for a learning project.
- `simulateNetwork()` in handlers introduces 500–2000ms delay + 10% random failure rate — this makes loading and error states easy to observe without special tooling.
- `App.tsx` is unused; the router in `main.tsx` owns the layout. It can be deleted in a future cleanup.
