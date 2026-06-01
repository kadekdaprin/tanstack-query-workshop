import type { Product } from '../../../types/product'

export async function toggleWishlist(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}/wishlist`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to toggle wishlist')
  return res.json()
}
