import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../api/getProduct'

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
  })
}
