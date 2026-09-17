import { ShoppingCart, Mail, Menu, X, LogOut, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useMessages } from '../context/MessagesContext';

const MotionSpan = motion.span;

const navLinkClass = ({ isActive }) =>
  `transition duration-200 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700 hover:text-gray-900'}`;

function IconBadge({ count }) {
  if (!count || count < 1) return null;
  return (
    <span className="absolute top-1 right-1 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center border-2 border-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function DesktopNavLink({ to, end, prefersReducedMotion, overlay, compact, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative inline-flex items-center transition duration-200 ${
          compact ? 'h-14' : 'h-16'
        } ${
          overlay
            ? isActive
              ? 'text-white font-medium'
              : 'text-white/85 hover:text-white'
            : isActive
              ? 'text-gray-900 font-medium'
              : 'text-gray-700 hover:text-gray-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive &&
            (prefersReducedMotion ? (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  overlay ? 'bg-white' : 'bg-gray-900'
                }`}
              />
            ) : (
              <MotionSpan
                layoutId="nav-underline"
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  overlay ? 'bg-white' : 'bg-gray-900'
                }`}
                transition={{ duration: 0.2 }}
              />
            ))}
        </>
      )}
    </NavLink>
  );
}

const baseNavItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
];

const aboutNavItem = { to: '/about', label: 'About' };
const ordersNavItem = { to: '/orders', label: 'Orders' };

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const { cartCount, favoritesCount } = useShop();
  const { unreadCount: messagesUnread } = useMessages();
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const isHome = location.pathname === '/';
  const overlay = isHome && !scrolled && !mobileMenuOpen;
  const compact = isHome && scrolled;
  const navItems = isAuthenticated
    ? [...baseNavItems, ordersNavItem, aboutNavItem]
    : [...baseNavItems, aboutNavItem];

  const iconActions = [
    {
      to: '/favorites',
      icon: Heart,
      title: 'Favorites',
      count: favoritesCount,
      ariaLabel: favoritesCount > 0 ? `Favorites, ${favoritesCount} saved` : 'Favorites',
    },
    {
      to: '/cart',
      icon: ShoppingCart,
      title: 'Cart',
      count: cartCount,
      ariaLabel: `Shopping cart, ${cartCount} items`,
    },
    {
      to: '/messages',
      icon: Mail,
      title: 'Messages',
      count: messagesUnread,
      ariaLabel: messagesUnread > 0 ? `Messages, ${messagesUnread} unread` : 'Messages',
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOut = () => {
    closeMobileMenu();
    navigate('/', { replace: true });
    signOut();
  };

  const iconLinkClass = ({ isActive }) =>
    `relative inline-flex items-center justify-center w-10 h-10 rounded-md transition duration-200 focus-visible:outline-none focus-visible:ring-2 ${
      overlay
        ? `focus-visible:ring-white ${
            isActive ? 'text-white bg-white/15' : 'text-white hover:text-white hover:bg-white/10'
          }`
        : `focus-visible:ring-gray-900 ${
            isActive
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition duration-200 ${
        overlay
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
      } ${scrolled && !overlay ? 'shadow-sm' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-200 ${
            compact ? 'h-14' : 'h-16'
          }`}
        >
          <Link
            to="/"
            className={`shrink-0 text-2xl font-semibold tracking-tight transition duration-200 ${
              overlay ? 'text-white' : 'text-gray-900'
            }`}
            onClick={closeMobileMenu}
          >
            ShewaCraft
          </Link>

          <nav className="hidden md:flex items-center space-x-8 -mb-px" aria-label="Main">
            {navItems.map((item) => (
              <DesktopNavLink
                key={item.to}
                to={item.to}
                end={item.end}
                prefersReducedMotion={prefersReducedMotion}
                overlay={overlay}
                compact={compact}
              >
                {item.label}
              </DesktopNavLink>
            ))}
            {user?.role === 'admin' && (
              <DesktopNavLink
                to="/admin"
                prefersReducedMotion={prefersReducedMotion}
                overlay={overlay}
                compact={compact}
              >
                Admin
              </DesktopNavLink>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-0.5" role="group" aria-label="Account actions">
                  {iconActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <NavLink
                        key={action.to}
                        to={action.to}
                        className={iconLinkClass}
                        title={action.title}
                        aria-label={action.ariaLabel}
                      >
                        <Icon className="w-5 h-5" />
                        <IconBadge count={action.count} />
                      </NavLink>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className={`hidden sm:inline-flex items-center gap-1.5 h-10 px-2.5 text-sm rounded-md transition duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                    overlay
                      ? 'text-white hover:bg-white/10 focus-visible:ring-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-900'
                  }`}
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/auth/signin"
                  className={`text-sm transition duration-200 ${
                    overlay ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className={`px-4 py-1.5 rounded-md text-sm transition duration-200 ${
                    overlay
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              type="button"
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md transition duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                overlay
                  ? 'text-white hover:bg-white/10 focus-visible:ring-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
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
                  <NavLink to="/cart" className={navLinkClass} onClick={closeMobileMenu}>
                    Cart{cartCount > 0 ? ` (${cartCount})` : ''}
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
                    className="text-left text-gray-700 hover:text-gray-900 transition duration-200"
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
                    className="inline-flex w-fit px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 transition duration-200"
                  >
                    Get Started
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
