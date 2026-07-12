import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function CartHeader({ itemCount }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-gray-900 transition">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Cart</span>
        </nav>
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Checkout</p>
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {itemCount === 0
            ? 'Your cart is empty'
            : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout`}
        </p>
      </div>
    </div>
  );
}
