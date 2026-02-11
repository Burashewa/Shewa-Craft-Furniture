import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-semibold text-gray-900">FURNISH</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              Living Room
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              Bedroom
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              Dining
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              Office
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              Sale
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search always visible */}
            <button className="text-gray-700 hover:text-gray-900 transition">
              <Search className="w-5 h-5" />
            </button>

            {!isAuthenticated ? (
              /* BEFORE SIGN IN */
              <>
                <button
                  className="text-gray-700 hover:text-gray-900 transition text-sm"
                  onClick={() => setIsAuthenticated(true)}
                >
                  <Link to="../auth/signin">Sign In</Link>
                </button>
                <button
                  className="px-4 py-1 bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
                  onClick={() => setIsAuthenticated(true)}
                >
                  <Link to="../auth/signup">Sign Up</Link>
                </button>
              </>
            ) : (
              /* AFTER SIGN IN */
              <>
                <button className="text-gray-700 hover:text-gray-900 transition">
                  <User className="w-5 h-5" />
                </button>

                <button className="text-gray-700 hover:text-gray-900 transition relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </button>
              </>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                Living Room
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                Bedroom
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                Dining
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                Office
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                Sale
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
