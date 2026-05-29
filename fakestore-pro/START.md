# TanStack Query Learning Project

## FakeStore Pro

A simple frontend-only e-commerce app to learn TanStack Query step by step using realistic examples.

---

# Main Goal

Learn TanStack Query by building a small e-commerce application with:

* Loading states
* Error handling
* Pagination
* Infinite scrolling
* Optimistic updates
* Background refetching
* Cache persistence

No backend required.

---

# Core Stack

## Frontend

* React
* Vite
* TypeScript
* React Router DOM
* TanStack Query
* Tailwind CSS

## Mock API

* MSW (Mock Service Worker)

## Dev Tools

* TanStack Query Devtools

---

# Main Learning Focus

Focus ONLY on:

* TanStack Query
* Server state
* Async UI handling
* Query caching

Do NOT focus on:

* backend development
* authentication
* payment systems
* advanced UI design

---

# Global Rules

## IMPORTANT

Keep everything simple and easy to understand.

---

### 1. Use a simple folder structure

```txt
src/
├── api/
├── components/
├── features/
├── mocks/
├── routes/
└── main.tsx
```

---

### 2. Keep feature folders simple

```txt
features/
  products/
    components/
    hooks/
    api/
```

---

### 3. Put queries inside hooks

Avoid:

```tsx
useQuery(...)
```

directly inside pages.

Instead use:

```txt
hooks/useProducts.ts
hooks/useProduct.ts
```

---

### 4. Simulate real API behavior

All mocked APIs should:

* have loading delay
* sometimes fail

Example:

```ts
delay: 500ms - 2000ms
failure rate: 10%
```

---

### 5. Keep TypeScript simple

Avoid:

* any

Use clear types.

---

# Project Theme

## FakeStore Pro

A simple e-commerce frontend app.

Features:

* product list
* categories
* search
* cart
* wishlist
* product detail
* infinite scroll

---

# Product Schema

```ts
type Product = {
  id: string
  title: string
  price: number
  category: string
  image: string
  stock: number
  isWishlisted: boolean
}
```

---

# Simple Folder Structure

```txt
src/
├── api/
├── components/
├── features/
│   ├── products/
│   ├── cart/
│   └── wishlist/
├── mocks/
├── routes/
└── main.tsx
```

---

# Checkpoints

---

# CHECKPOINT 01

## Project Setup

## Goal

Setup the project.

## Requirements

Install:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router DOM
* TanStack Query
* TanStack Query Devtools
* MSW

Create:

* basic folder structure
* QueryClient provider
* Router setup

## Deliverables

* app runs successfully
* Query Devtools visible
* MSW working

## Git Commit

```bash
git commit -m "checkpoint-01-project-setup"
```

---

# CHECKPOINT 02

## Product List Query

## Goal

Learn basic `useQuery`.

## Requirements

Create:

* product list page
* product card

Mock:

* GET /products

Learn:

* useQuery
* queryKey
* queryFn

Handle:

* loading
* success
* empty
* error

## Git Commit

```bash
git commit -m "checkpoint-02-product-query"
```

---

# CHECKPOINT 03

## Network Delay and Errors

## Goal

Learn loading and error handling.

## Requirements

Create:

* simulateNetwork utility

Features:

* random delay
* random error

Learn:

* retry
* staleTime

## Git Commit

```bash
git commit -m "checkpoint-03-network-simulation"
```

---

# CHECKPOINT 04

## Product Categories

## Goal

Learn query keys.

## Requirements

Add:

* category filter

Example:

```ts
["products", category]
```

Learn:

* query caching

## Git Commit

```bash
git commit -m "checkpoint-04-query-keys"
```

---

# CHECKPOINT 05

## Product Search

## Goal

Learn dynamic queries.

## Requirements

Add:

* search input
* debounce

Learn:

* dynamic query keys
* query invalidation

## Git Commit

```bash
git commit -m "checkpoint-05-search-query"
```

---

# CHECKPOINT 06

## Product Detail Page

## Goal

Learn cache reuse.

## Requirements

Add:

* product detail page

Learn:

* enabled
* cached data reuse

## Git Commit

```bash
git commit -m "checkpoint-06-product-detail"
```

---

# CHECKPOINT 07

## Add To Cart

## Goal

Learn mutations.

## Requirements

Add:

* add to cart button

Learn:

* useMutation
* invalidateQueries

## Git Commit

```bash
git commit -m "checkpoint-07-cart-mutation"
```

---

# CHECKPOINT 08

## Optimistic Update

## Goal

Learn optimistic UI.

## Requirements

Cart updates immediately before API response.

Learn:

* onMutate
* rollback

## Git Commit

```bash
git commit -m "checkpoint-08-optimistic-update"
```

---

# CHECKPOINT 09

## Wishlist Feature

## Goal

Learn cache updates.

## Requirements

Add:

* wishlist toggle

Learn:

* setQueryData

## Git Commit

```bash
git commit -m "checkpoint-09-cache-update"
```

---

# CHECKPOINT 10

## Pagination

## Goal

Learn paginated queries.

## Requirements

Add:

* pagination

Learn:

* keepPreviousData

## Git Commit

```bash
git commit -m "checkpoint-10-pagination"
```

---

# CHECKPOINT 11

## Infinite Scroll

## Goal

Learn infinite queries.

## Requirements

Add:

* infinite scrolling

Learn:

* useInfiniteQuery
* fetchNextPage

## Git Commit

```bash
git commit -m "checkpoint-11-infinite-query"
```

---

# CHECKPOINT 12

## Prefetching

## Goal

Learn prefetching.

## Requirements

When hovering a product:

* prefetch product detail

Learn:

* prefetchQuery

## Git Commit

```bash
git commit -m "checkpoint-12-prefetch-query"
```

---

# CHECKPOINT 13

## Background Refetching

## Goal

Learn stale data handling.

## Requirements

Simulate:

* stock updates

Learn:

* staleTime
* refetchInterval

## Git Commit

```bash
git commit -m "checkpoint-13-background-refetch"
```

---

# CHECKPOINT 14

## Query Cancellation

## Goal

Learn request cancellation.

## Requirements

Use:

* fast search typing

Learn:

* AbortController

## Git Commit

```bash
git commit -m "checkpoint-14-query-cancellation"
```

---

# CHECKPOINT 15

## Cache Persistence

## Goal

Learn cache persistence.

## Requirements

Persist query cache.

Behavior:

* refresh browser
* data still available

Learn:

* persistQueryClient

## Git Commit

```bash
git commit -m "checkpoint-15-cache-persistence"
```

---

# CHECKPOINT 16

## Simple Refactor

## Goal

Clean up the project structure.

## Requirements

Refactor:

* hooks
* api functions
* query keys

Keep everything simple and readable.

## Git Commit

```bash
git commit -m "checkpoint-16-refactor"
```

---

# Simple Query Key Example

```ts
export const productKeys = {
  all: ["products"] as const,
  detail: (id: string) => ["products", id] as const,
}
```

---

# Learning Notes

After every checkpoint create:

```txt
notes/
  checkpoint-01.md
```

Template:

```md
# What I Learned

# Problems I Faced

# Notes
```

---

# Important Concepts To Learn

By the end of the project understand:

* server state
* caching
* stale data
* optimistic updates
* pagination
* infinite query
* invalidation
* mutations
* query cancellation
* persistence

---

# Final Goal

By the end of this project:

* understand TanStack Query clearly
* understand server state
* build confidence with async UI
* know common TanStack Query patterns
* understand when and why to use TanStack Query
