import { useState } from 'react'
import { useProducts } from '../features/products/hooks/useProducts'
import ProductCard from '../features/products/components/ProductCard'
import ProductCardSkeleton from '../features/products/components/ProductCardSkeleton'

const CATEGORIES = ['electronics', 'clothing', 'kitchen', 'sports'] as const

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const { data: products, isLoading, isError, error, refetch } = useProducts(selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">FakeStore Pro</h1>
      </header>
      <main className="px-6 py-8">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
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
