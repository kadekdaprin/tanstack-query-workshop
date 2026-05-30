# What I Learned

- Debouncing the search input prevents a new query on every keystroke — TanStack Query only fires when the debounced value settles.
- Each unique `[category, search]` combination gets its own cache entry, so switching between searches is instant on revisit.
- Normalizing the search value to `undefined` when empty keeps `['products', undefined, undefined]` and `['products', undefined, '']` from being treated as different cache entries.

## Key Concepts

### Debounce — delay the query until the user stops typing

Without debounce, every keystroke produces a new query key which fires a new network request. A 300 ms debounce waits until the user pauses before committing the new key:

```
user types "head"  →  searchInput = "head"  (input updates immediately)
                   →  debouncedSearch still "hea" (timer restarted)
300ms of silence   →  debouncedSearch = "head"  (query fires)
```

The controlled `<input>` uses `searchInput` so it stays responsive. Only the query key uses `debouncedSearch`.

```ts
// useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)  // cancel on next keystroke
  }, [value, delay])
  return debounced
}
```

The cleanup function (`clearTimeout`) is the key piece — it cancels the previous timer when the value changes before the delay expires.

### Growing query keys — adding search to the key array

The query key now has three positions:

```ts
queryKey: ['products', category, search]
```

Each unique combination is a separate cache slot:

```
['products', undefined, undefined]       → all products
['products', 'electronics', undefined]   → electronics
['products', undefined, 'headphones']    → search "headphones"
['products', 'electronics', 'keyboard']  → electronics + "keyboard"
```

Order matters for cache equality — `['products', 'electronics', 'keyboard']` and `['products', 'keyboard', 'electronics']` are different keys.

### Normalizing to `undefined` avoids phantom cache entries

An empty string `''` and `undefined` look the same to the user, but they are different values in a query key. Always normalize:

```ts
// In HomePage
const debouncedSearch = useDebounce(searchInput.trim() || undefined, 300)

// This ensures:
// searchInput = ""   → debouncedSearch = undefined
// searchInput = "  " → debouncedSearch = undefined (trim handles whitespace)
// searchInput = "x"  → debouncedSearch = "x"
```

Without this, clearing the search box would create a `['products', undefined, '']` entry instead of hitting the already-cached `['products', undefined, undefined]`.

### Dynamic query keys — TanStack Query re-fetches when the key changes

When `debouncedSearch` changes, the query key changes, and TanStack Query automatically fires a new fetch for that key. No manual trigger or `useEffect` needed:

```
key: ['products', undefined, undefined]  →  fetch all products
key: ['products', undefined, 'head']     →  fetch search="head"  ← automatic
key: ['products', undefined, 'headp']   →  fetch search="headp" ← automatic
key: ['products', undefined, undefined]  →  cache hit, no fetch  ← back to all
```

This is the same mechanism as checkpoint-04's category filter — TanStack Query drives fetches from keys, not from imperative calls.

# Problems I Faced

- Forgetting to normalize empty string to `undefined` made clearing the search input fire a redundant request for `search=""` instead of reusing the `search=undefined` cache entry.

# Notes

- 300 ms is a common debounce delay for search inputs — fast enough to feel responsive, slow enough to avoid hammering the API on every keystroke.
- In checkpoint-14 (query cancellation), fast typing will be revisited — at that point we add `AbortController` so in-flight requests for stale search terms are cancelled.
