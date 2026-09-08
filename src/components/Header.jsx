import { ShoppingCart, Mail, Menu, X, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { conversations, getUnreadCount } from '../data/messages';

const desktopNavLinkClass = ({ isActive }) =>
  `inline-flex items-center h-16 border-b-2 transition ${
    isActive
      ? 'text-gray-900 font-medium border-gray-900'
      : 'text-gray-700 hover:text-gray-900 border-transparent'
  }`;

const navLinkClass = ({ isActive }) =>
  `transition ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700 hover:text-gray-900'}`;

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
];

const authNavItems = [{ to: '/orders', label: 'Orders' }];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const { cartCount, favoritesCount } = useShop();
  const navigate = useNavigate();
  const messagesUnread = getUnreadCount(conversations);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOut = () => {
    closeMobileMenu();
    navigate('/', { replace: true });
    signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="shrink-0 text-2xl font-semibold text-gray-900 tracking-tight"
            onClick={closeMobileMenu}
          >
            ShewaCraft
          </Link>

          <nav className="hidden md:flex items-center space-x-8 -mb-px" aria-label="Main">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={desktopNavLinkClass}>
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated &&
              authNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={desktopNavLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={desktopNavLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="relative text-gray-700 hover:text-gray-900 transition"
                  aria-label="Favorites"
                >
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center border-2 border-white">
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-gray-900 transition"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center border-2 border-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                </Link>

                <Link
                  to="/messages"
                  className="relative text-gray-700 hover:text-gray-900 transition"
                  aria-label={
                    messagesUnread > 0
                      ? `Messages, ${messagesUnread} unread`
                      : 'Messages'
                  }
                >
                  <Mail className="w-5 h-5" />
                  {messagesUnread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center border-2 border-white">
                      {messagesUnread > 99 ? '99+' : messagesUnread}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/auth/signin"
                  className="text-sm text-gray-700 hover:text-gray-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              type="button"
              className="md:hidden text-gray-700 hover:text-gray-900 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3" aria-label="Mobile">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navLinkClass}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated &&
                authNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
              {user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass} onClick={closeMobileMenu}>
                  Admin
                </NavLink>
              )}
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/favorites"
                    className={navLinkClass}
                    onClick={closeMobileMenu}
                  >
                    Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ''}
                  </NavLink>
                  <NavLink
                    to="/messages"
                    className={navLinkClass}
                    onClick={closeMobileMenu}
                  >
                    Messages
                    {messagesUnread > 0 ? ` (${messagesUnread})` : ''}
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-left text-gray-700 hover:text-gray-900 transition"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/auth/signin"
                    className={navLinkClass}
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </NavLink>
                  <Link
                    to="/auth/signup"
                    onClick={closeMobileMenu}
                    className="inline-flex w-fit px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
