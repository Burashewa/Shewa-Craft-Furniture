import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { ChatBox } from './ChatBox';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ProductDetailView({ product, onClose, showAddToCart = true }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, toggleFavorite, isFavorite, cartItems } = useShop();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatButtonRef = useRef(null);

  const canAct = isAuthenticated;
  const cartDisabled = !canAct || !product.inStock;
  const favorited = isFavorite(product.id);
  const inCart = cartItems.some((item) => item.productId === product.id);

  const handleCloseChat = () => {
    setIsChatOpen(false);
    requestAnimationFrame(() => {
      chatButtonRef.current?.focus();
    });
  };

  const handleAddToCart = () => {
    if (cartDisabled) return;

    const { addedAsNew } = addToCart({
      product,
      quantity,
      color: selectedColor,
    });

    showToast({
      type: 'success',
      title: addedAsNew ? 'Added to cart' : 'Cart updated',
      message: addedAsNew
        ? `${product.name} was added to your cart.`
        : `${product.name} quantity was updated in your cart.`,
      actionLabel: 'View cart',
      actionTo: '/cart',
    });
  };

  const handleSaveFavorite = () => {
    if (!canAct) return;

    const { wasAdded } = toggleFavorite(product);

    showToast({
      type: 'favorite',
      title: wasAdded ? 'Saved to favorites' : 'Removed from favorites',
      message: wasAdded
        ? `${product.name} was saved to your favorites.`
        : `${product.name} was removed from your favorites.`,
      actionLabel: wasAdded ? 'View favorites' : undefined,
      actionTo: wasAdded ? '/favorites' : undefined,
    });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key !== 'Escape') return;
      if (isChatOpen) {
        handleCloseChat();
      } else {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isChatOpen, onClose]);

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleOpenChat = () => {
    if (!canAct) return;
    setIsChatOpen(true);
  };

  const modalMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 8 },
      };

  return (
    <>
      <MotionDiv
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        onClick={() => {
          if (!isChatOpen) onClose();
        }}
      >
        <div className="min-h-full flex items-start md:items-center justify-center px-4 py-6 sm:py-8">
          <MotionDiv
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            className="relative w-full max-w-6xl max-h-[90vh] bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col rounded-xl"
            {...modalMotion}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 w-10 h-10 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 transition ${focusRing}`}
              aria-label="Close product details"
            >
              <X className="w-5 h-5 mx-auto" />
            </button>

            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
                <div>
                  <div className="relative mb-4 bg-gray-100 overflow-hidden aspect-square rounded-lg">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {product.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 rounded-md flex items-center justify-center hover:bg-white transition shadow-sm ${focusRing}`}
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 rounded-md flex items-center justify-center hover:bg-white transition shadow-sm ${focusRing}`}
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>

                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image, index) => {
                        const isActive = selectedImage === index;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedImage(index)}
                            aria-label={`View image ${index + 1} of ${product.images.length}`}
                            aria-current={isActive ? 'true' : undefined}
                            className={`aspect-square overflow-hidden rounded-md border-2 transition ${focusRing} ${
                              isActive
                                ? 'border-gray-900 opacity-100'
                                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${product.name} view ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                        {product.category}
                      </p>
                      <h1
                        id="product-detail-title"
                        className="text-3xl text-gray-900 mb-3"
                      >
                        {product.name}
                      </h1>

                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex items-center gap-1"
                          aria-label={`Rated ${product.rating} out of 5`}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-gray-900 text-gray-900'
                                  : 'text-gray-300'
                              }`}
                              aria-hidden
                            />
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      <div className="mb-6 flex items-center gap-4">
                        <span className="text-4xl text-gray-900">
                          ${product.price.toLocaleString()}
                        </span>
                        {!product.inStock && (
                          <span className="inline-block px-2 py-1 text-xs border rounded-sm bg-rose-50 text-rose-800 border-rose-200">
                            Out of stock
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm text-gray-700 mb-3">
                            Color:{' '}
                            <span className="text-gray-900">{selectedColor}</span>
                          </p>
                          <div className="flex flex-wrap gap-2" role="group" aria-label="Color options">
                            {product.colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                aria-pressed={selectedColor === color}
                                className={`px-4 py-2 border rounded-md text-sm transition ${focusRing} ${
                                  selectedColor === color
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {showAddToCart && (
                        <div className="mb-6">
                          <p className="text-sm text-gray-700 mb-3" id="quantity-label">
                            Quantity
                          </p>
                          <div
                            className="flex items-center gap-3"
                            role="group"
                            aria-labelledby="quantity-label"
                          >
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className={`w-10 h-10 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition ${focusRing}`}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-lg" aria-live="polite">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(quantity + 1)}
                              className={`w-10 h-10 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition ${focusRing}`}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {product.specifications?.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
                            Specifications
                          </h3>
                          <div className="space-y-2">
                            {product.specifications.map((spec, index) => (
                              <div
                                key={index}
                                className="flex justify-between gap-4 py-2 border-b border-gray-100"
                              >
                                <span className="text-gray-600">{spec.label}</span>
                                <span className="text-gray-900 text-right">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      {showAddToCart && (
                        <button
                          type="button"
                          disabled={cartDisabled}
                          onClick={handleAddToCart}
                          className={`w-full px-6 py-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${focusRing}`}
                        >
                          {inCart ? (
                            <Check className="w-5 h-5" aria-hidden />
                          ) : (
                            <ShoppingCart className="w-5 h-5" aria-hidden />
                          )}
                          {inCart ? 'Added to cart' : 'Add to Cart'}
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={!canAct}
                          onClick={handleSaveFavorite}
                          className={`px-6 py-3 border rounded-md transition flex items-center justify-center gap-2 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed ${focusRing} ${
                            favorited
                              ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800'
                              : 'border-gray-900 text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`}
                            aria-hidden
                          />
                          {favorited ? 'Saved' : 'Save'}
                        </button>
                        <button
                          ref={chatButtonRef}
                          type="button"
                          disabled={!canAct}
                          onClick={handleOpenChat}
                          className={`px-6 py-3 border border-gray-900 rounded-md text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed ${focusRing}`}
                        >
                          <MessageCircle className="w-5 h-5" aria-hidden />
                          {showAddToCart
                            ? 'Chat with Owner'
                            : 'Chat with ShewaCraft Support'}
                        </button>
                      </div>
                      {!canAct && (
                        <p className="text-sm text-gray-600 text-center">
                          <Link
                            to="/auth/signin"
                            state={{ from: { pathname: '/products' } }}
                            className={`text-gray-900 underline underline-offset-2 hover:no-underline ${focusRing}`}
                            onClick={onClose}
                          >
                            Sign in
                          </Link>{' '}
                          {showAddToCart
                            ? 'to add to cart, save, or chat with support.'
                            : 'to save or chat with support.'}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                      <div className="text-center">
                        <Truck
                          className="w-6 h-6 text-gray-700 mx-auto mb-2"
                          aria-hidden
                        />
                        <p className="text-xs text-gray-600">Free Shipping</p>
                      </div>
                      <div className="text-center">
                        <Shield
                          className="w-6 h-6 text-gray-700 mx-auto mb-2"
                          aria-hidden
                        />
                        <p className="text-xs text-gray-600">Warranty</p>
                      </div>
                      <div className="text-center">
                        <RotateCcw
                          className="w-6 h-6 text-gray-700 mx-auto mb-2"
                          aria-hidden
                        />
                        <p className="text-xs text-gray-600">Easy Returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>

      <AnimatePresence>
        {isChatOpen && (
          <ChatBox product={product} onClose={handleCloseChat} />
        )}
      </AnimatePresence>
    </>
  );
}
