import { useProducts } from '../features/products/hooks/useProducts'
import ProductCard from '../features/products/components/ProductCard'

export default function HomePage() {
  const { data: products, isLoading, isError, error } = useProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">FakeStore Pro</h1>
      </header>
      <main className="px-6 py-8">
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-500">
            Error: {error instanceof Error ? error.message : 'Something went wrong'}
          </div>
        )}

        {!isLoading && !isError && products?.length === 0 && (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
