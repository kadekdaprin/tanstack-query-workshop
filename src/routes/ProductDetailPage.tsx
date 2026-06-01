import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../features/products/hooks/useProduct'
import { useRelatedProducts } from '../features/products/hooks/useRelatedProducts'
import { useToggleWishlist } from '../features/products/hooks/useToggleWishlist'
import ProductCard from '../features/products/components/ProductCard'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError, error, refetch } = useProduct(id!)
  const { data: related } = useRelatedProducts(product?.category, id)
  const { mutate: toggleWishlist, isPending: isTogglingWishlist } = useToggleWishlist()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Back to products
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">FakeStore Pro</h1>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="w-full h-80 bg-gray-200" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
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

        {product && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {product.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {product.title}
              </h2>
              <div className="flex items-center justify-between mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      product.stock > 5
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    disabled={isTogglingWishlist}
                    aria-label={product.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <span className={`text-base leading-none ${product.isWishlisted ? 'text-red-500' : 'text-gray-400'}`}>
                      {product.isWishlisted ? '♥' : '♡'}
                    </span>
                    {product.isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {related && related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
