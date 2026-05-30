import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/getProducts'

export function useRelatedProducts(category: string | undefined, excludeId: string | undefined) {
  return useQuery({
    queryKey: ['products', category, undefined],
    queryFn: () => getProducts(category),
    enabled: !!category,
    select: (data) => data.filter(p => p.id !== excludeId),
  })
}
