# FakeStore Pro

A frontend-only e-commerce app for learning TanStack Query step by step.

## Stack

- React 19 + TypeScript + Vite
- TanStack Query v5 + Devtools
- React Router v7
- Tailwind CSS v4
- MSW v2 (Mock Service Worker)

## Commands

```bash
npm run dev       # start dev server (MSW starts automatically)
npm run build     # type-check + production build
npm run lint      # eslint
npm run preview   # preview production build
```

## How it works

There is no backend. All API responses come from MSW intercepting fetch calls in the browser. Every handler adds a 500–2000 ms random delay and fails ~10% of the time to simulate real network conditions.

The app boots MSW before mounting React — see `src/main.tsx`. This ensures no requests escape the mock during development.

## Mock API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (supports `?category=` and `?search=`) |
| GET | `/api/products/:id` | Single product |

## Learning checkpoints

Progress is tracked in `notes/checkpoint-XX.md` after each checkpoint. See `START.md` for the full checkpoint list (01–16).
