import { useQuery } from '@tanstack/react-query'
import type { Product } from '../../../types/product'
import { getProducts } from '../api/getProducts'

export type SortBy = 'default' | 'price-asc' | 'price-desc' | 'name'

function sortProducts(data: Product[], sortBy: SortBy): Product[] {
  if (sortBy === 'price-asc') return [...data].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') return [...data].sort((a, b) => b.price - a.price)
  if (sortBy === 'name') return [...data].sort((a, b) => a.title.localeCompare(b.title))
  return data
}

export function useProducts(category?: string, search?: string, sortBy: SortBy = 'default') {
  return useQuery({
    queryKey: ['products', category, search],
    queryFn: () => getProducts(category, search),
    placeholderData: (prev) => prev,
    select: sortBy !== 'default' ? (data) => sortProducts(data, sortBy) : undefined,
  })
}
