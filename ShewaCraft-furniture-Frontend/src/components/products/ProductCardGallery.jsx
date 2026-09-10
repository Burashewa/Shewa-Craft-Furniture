import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const hoverReveal =
  'opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100';

function useFineHover() {
  const [fineHover, setFineHover] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFineHover(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return fineHover;
}

function GalleryIconButton({ label, disabled, pressed, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      className={`w-9 h-9 bg-white rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white ${focusRing}`}
    >
      {children}
    </button>
  );
}

export function ProductCardGallery({ product, onQuickView, frameClassName, children }) {
  const images = product.images?.length ? product.images : [];
  const imageCount = images.length;
  const showCarousel = imageCount > 2;
  const fineHover = useFineHover();

  const { isAuthenticated } = useAuth();
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const { showToast } = useToast();

  const [isHovering, setIsHovering] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const favorited = isFavorite(product.id);
  const hoverPreviewIndex = imageCount >= 2 ? 1 : 0;
  const displayIndex = userPicked
    ? activeIndex
    : isHovering && fineHover
      ? hoverPreviewIndex
      : 0;

  const resetGallery = useCallback(() => {
    setIsHovering(false);
    setUserPicked(false);
    setActiveIndex(0);
  }, []);

  const currentIndex = userPicked
    ? activeIndex
    : isHovering && fineHover && imageCount >= 2
      ? 1
      : 0;

  const goTo = (index) => {
    if (imageCount < 1) return;
    const next = (index + imageCount) % imageCount;
    setUserPicked(true);
    setActiveIndex(next);
  };

  const requireAuth = (actionLabel) => {
    if (isAuthenticated) return true;
    showToast({
      type: 'success',
      title: 'Sign in required',
      message: `Sign in to ${actionLabel}.`,
      actionLabel: 'Sign in',
      actionTo: '/auth/signin',
    });
    return false;
  };

  const handleWishlist = async () => {
    if (!requireAuth('save favorites')) return;
    try {
      const { wasAdded } = await toggleFavorite(product);
      showToast({
        type: 'favorite',
        title: wasAdded ? 'Saved to favorites' : 'Removed from favorites',
        message: wasAdded
          ? `${product.name} was saved to your favorites.`
          : `${product.name} was removed from your favorites.`,
        actionLabel: wasAdded ? 'View favorites' : undefined,
        actionTo: wasAdded ? '/favorites' : undefined,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not update favorites',
        message: err.message || 'Unable to update favorites.',
      });
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    if (!requireAuth('add items to your cart')) return;
    try {
      const { addedAsNew } = await addToCart({ product, quantity: 1 });
      showToast({
        type: 'success',
        title: addedAsNew ? 'Added to cart' : 'Cart updated',
        message: addedAsNew
          ? `${product.name} was added to your cart.`
          : `${product.name} quantity was updated in your cart.`,
        actionLabel: 'View cart',
        actionTo: '/cart',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not update cart',
        message: err.message || 'Unable to update cart.',
      });
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${frameClassName}`}
      onMouseEnter={() => fineHover && setIsHovering(true)}
      onMouseLeave={resetGallery}
    >
      {images.map((src, index) => (
        <img
          key={`${product.id}-${src}`}
          src={src}
          alt=""
          aria-hidden={index !== displayIndex}
          loading={index === 0 ? 'lazy' : 'eager'}
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 motion-reduce:transition-none motion-reduce:duration-0 ${
            index === displayIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <button
        type="button"
        onClick={() => onQuickView(product)}
        className={`absolute inset-0 z-10 ${focusRing}`}
        aria-label={`View details for ${product.name}`}
      />

      <div className="absolute inset-0 z-20 pointer-events-none">
        {children ? <div className="absolute inset-0">{children}</div> : null}

        <div
          className={`pointer-events-auto absolute top-3 right-3 flex flex-col gap-2 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none [@media(hover:hover)_and_(pointer:fine)]:translate-x-1 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0 ${hoverReveal}`}
        >
          <GalleryIconButton
            label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
            pressed={favorited}
            onClick={handleWishlist}
          >
            <Heart
              className={`w-4 h-4 ${favorited ? 'fill-gray-900 text-gray-900' : ''}`}
              aria-hidden
            />
          </GalleryIconButton>
          <GalleryIconButton
            label="Quick view"
            onClick={() => onQuickView(product)}
          >
            <Eye className="w-4 h-4" aria-hidden />
          </GalleryIconButton>
          <GalleryIconButton
            label={product.inStock ? 'Add to cart' : 'Out of stock'}
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" aria-hidden />
          </GalleryIconButton>
        </div>

        {showCarousel && (
          <>
            <button
              type="button"
              title="Previous image"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                goTo(currentIndex - 1);
              }}
              className={`pointer-events-auto absolute left-2 bottom-12 w-8 h-8 bg-white/95 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition duration-200 motion-reduce:transition-none ${hoverReveal} ${focusRing}`}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden />
            </button>
            <button
              type="button"
              title="Next image"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                goTo(currentIndex + 1);
              }}
              className={`pointer-events-auto absolute right-2 bottom-12 w-8 h-8 bg-white/95 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition duration-200 motion-reduce:transition-none ${hoverReveal} ${focusRing}`}
            >
              <ChevronRight className="w-4 h-4" aria-hidden />
            </button>
            <div
              className={`pointer-events-auto absolute bottom-3 inset-x-0 flex justify-center gap-1.5 transition duration-200 motion-reduce:transition-none ${hoverReveal}`}
              role="tablist"
              aria-label="Product images"
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={displayIndex === index}
                  title={`Show image ${index + 1}`}
                  aria-label={`Show image ${index + 1} of ${imageCount}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goTo(index);
                  }}
                  className={`h-1.5 rounded-full transition ${focusRing} ${
                    displayIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
