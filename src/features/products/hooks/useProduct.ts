import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Product } from '../../../types/product'
import { getProduct } from '../api/getProduct'

export function useProduct(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    initialData: () => {
      const entries = queryClient.getQueriesData<Product[]>({ queryKey: ['products'] })
      for (const [, data] of entries) {
        if (!Array.isArray(data)) continue
        const match = data.find(p => p.id === id)
        if (match) return match
      }
    },
    initialDataUpdatedAt: 0,
  })
}
