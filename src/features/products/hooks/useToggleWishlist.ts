import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Product } from '../../../types/product'
import { toggleWishlist } from '../api/toggleWishlist'

export function useToggleWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleWishlist,

    onMutate: async (id) => {
      // Cancel in-flight fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['products'] })

      // Snapshot every cached entry under ['products'] for rollback
      const snapshot = queryClient.getQueriesData<Product | Product[]>({ queryKey: ['products'] })

      // Optimistically flip isWishlisted on every list that contains this product
      queryClient.setQueriesData<Product[]>({ queryKey: ['products'] }, (old) => {
        if (!Array.isArray(old)) return old
        return old.map(p => p.id === id ? { ...p, isWishlisted: !p.isWishlisted } : p)
      })

      // Also update the individual product detail cache entry
      queryClient.setQueryData<Product>(['products', id], (old) => {
        if (!old) return old
        return { ...old, isWishlisted: !old.isWishlisted }
      })

      return { snapshot }
    },

    onError: (_err, _id, context) => {
      // Roll back every entry to its pre-mutation snapshot
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },

    onSettled: () => {
      // Sync with the server regardless of success or failure
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
