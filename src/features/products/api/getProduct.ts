import type { Product } from '../../../types/product'

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? 'Failed to fetch product')
  }
  return res.json()
}
