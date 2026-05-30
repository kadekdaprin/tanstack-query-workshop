import type { Product } from '../../../types/product'

export async function getProducts(category?: string): Promise<Product[]> {
  const url = category ? `/api/products?category=${category}` : '/api/products'
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}
