import { Link } from 'react-router-dom'
import type { Product } from '../../../types/product'

type Props = {
  
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>
        <h2 className="font-semibold text-gray-800 mt-1 leading-tight">
          {product.title}
        </h2>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">{product.stock} in stock</span>
        </div>
      </div>
    </Link>
  )
}
