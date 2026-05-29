 import { http, HttpResponse, delay } from 'msw'
import type { Product } from '../types/product'

const products: Product[] = [
  { id: '1', title: 'Wireless Headphones', price: 79.99, category: 'electronics', image: 'https://picsum.photos/seed/headphones/300/300', stock: 15, isWishlisted: false },
  { id: '2', title: 'Running Shoes', price: 49.99, category: 'clothing', image: 'https://picsum.photos/seed/shoes/300/300', stock: 30, isWishlisted: false },
  { id: '3', title: 'Coffee Maker', price: 34.99, category: 'kitchen', image: 'https://picsum.photos/seed/coffee/300/300', stock: 8, isWishlisted: true },
  { id: '4', title: 'Yoga Mat', price: 24.99, category: 'sports', image: 'https://picsum.photos/seed/yoga/300/300', stock: 20, isWishlisted: false },
  { id: '5', title: 'Mechanical Keyboard', price: 129.99, category: 'electronics', image: 'https://picsum.photos/seed/keyboard/300/300', stock: 5, isWishlisted: true },
  { id: '6', title: 'Backpack', price: 59.99, category: 'clothing', image: 'https://picsum.photos/seed/backpack/300/300', stock: 12, isWishlisted: false },
  { id: '7', title: 'Blender', price: 44.99, category: 'kitchen', image: 'https://picsum.photos/seed/blender/300/300', stock: 7, isWishlisted: false },
  { id: '8', title: 'Dumbbells Set', price: 89.99, category: 'sports', image: 'https://picsum.photos/seed/dumbbells/300/300', stock: 3, isWishlisted: false },
]

async function simulateNetwork() {
  const ms = 500 + Math.random() * 1500
  await delay(ms)
  if (Math.random() < 0.1) {
    throw new Error('Network error')
  }
}

export const handlers = [
  http.get('/api/products', async ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')

    try {
      await simulateNetwork()
    } catch {
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }

    let result = products
    if (category) result = result.filter(p => p.category === category)
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

    return HttpResponse.json(result)
  }),

  http.get('/api/products/:id', async ({ params }) => {
    try {
      await simulateNetwork()
    } catch {
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }

    const product = products.find(p => p.id === params.id)
    if (!product) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),
]
