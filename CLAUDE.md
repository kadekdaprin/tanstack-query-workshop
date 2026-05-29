# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (also starts MSW)
npm run build     # tsc type-check + vite build
npm run lint      # eslint
npm run preview   # preview production build
```

No test runner is configured yet.

## Architecture

This is a frontend-only TanStack Query learning project. There is no backend — all API responses come from MSW (Mock Service Worker) intercepting fetch calls in the browser.

### Startup flow

`main.tsx` boots the MSW worker before mounting React. The order matters: `worker.start()` resolves first, then the React tree renders. This ensures no real network requests escape during development. MSW only runs when `import.meta.env.DEV` is true.

### Provider stack (main.tsx)

```
QueryClientProvider (queryClient)
  └── RouterProvider (router)
        └── ReactQueryDevtools
```

`QueryClient` is configured with `retry: 1` and `staleTime: 1 minute` as global defaults. Individual queries can override these.

### Query pattern

`useQuery` / `useMutation` calls live in hooks under `features/<domain>/hooks/`, never directly in page components. Pages import hooks, not raw query calls.

### Mock API

All handlers are in `src/mocks/handlers.ts`. Every handler calls `simulateNetwork()` which adds a 500–2000 ms random delay and throws a network error ~10% of the time. This is intentional — it exercises loading states, error boundaries, and retry logic throughout the project.

Mock data is an in-memory array inside `handlers.ts`. Mutations that update data (cart, wishlist) need to mutate that array to persist within a session.

### Routing

Routes are registered in `main.tsx` using `createBrowserRouter`. Add new routes there and create corresponding page components in `src/routes/`.

### Shared type

`src/types/product.ts` exports the single `Product` type used everywhere. Do not duplicate or inline this type elsewhere.

### Tailwind

Uses Tailwind v4 with the Vite plugin (`@tailwindcss/vite`). The CSS entry point is a single `@import "tailwindcss"` line — no `tailwind.config.js` needed.

## Checkpoint Notes Convention

Each checkpoint has a notes file at `notes/checkpoint-XX.md`. When working on or explaining any checkpoint, always ensure that file contains a **Key Concepts** section that explains the *why* behind what was implemented — not just what the code does, but the underlying concept (e.g. what staleTime means, why provider order matters, how a pattern works). Use `###` subheadings per concept and include code snippets where helpful.
