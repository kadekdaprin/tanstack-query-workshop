import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/getProducts'

export function useProducts(category?: string, search?: string) {
  return useQuery({
    queryKey: ['products', category, search],
    queryFn: () => getProducts(category, search),
  })
}
