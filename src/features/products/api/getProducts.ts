import type { Product } from '../../../types/product'

export async function getProducts(category?: string, search?: string): Promise<Product[]> {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (search) params.set('search', search)
  const query = params.toString()
  const res = await fetch(query ? `/api/products?${query}` : '/api/products')
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}
