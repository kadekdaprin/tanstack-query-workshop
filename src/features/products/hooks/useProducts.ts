import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/getProducts'

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => getProducts(category),
  })
}
