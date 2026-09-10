import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, Truck } from 'lucide-react';
import { ChatBox } from '../ChatBox';
import { CheckoutModal } from '../CheckoutModal';
import { ProductDetailView } from '../ProductDetailView';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { initialSavedItems, FREE_SHIPPING_THRESHOLD, calcCartTotals } from '../../data/cart';
import { products } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { CartHeader } from './CartHeader';
import { CartItem } from './CartItem';
import { SavedItem } from './SavedItem';
import { OrderSummary } from './OrderSummary';

const MotionDiv = motion.div;

const SUPPORT_OWNER = {
  name: 'ShewaCraft Support',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  responseTime: 'Within 3 hours',
};

function resolveCartProduct(item) {
  return (
    products.find((product) => product.id === item.productId) || {
      id: item.productId,
      name: item.name,
      price: item.price,
      description: '',
      category: '',
      images: [item.image],
      inStock: item.inStock,
      rating: 0,
      reviews: 0,
      colors: item.color ? [item.color] : [],
      specifications: [],
      owner: item.owner || SUPPORT_OWNER,
    }
  );
}

export function CartPage() {
  const {
    cartItems,
    setCartItems,
    updateQuantity,
    removeFromCart,
    cartCount,
  } = useShop();
  const { showToast } = useToast();
  const [savedItems, setSavedItems] = useState(initialSavedItems);
  const [chatItem, setChatItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  const saveForLater = (item) => {
    setSavedItems((items) => [
      ...items,
      {
        id: item.id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        inStock: item.inStock,
      },
    ]);
    removeFromCart(item.id);
    showToast({
      type: 'success',
      title: 'Saved for later',
      message: `${item.name} was moved to Saved for later.`,
    });
  };

  const moveToCart = (savedItem) => {
    setCartItems((items) => [
      ...items,
      {
        id: savedItem.id,
        productId: savedItem.productId,
        name: savedItem.name,
        image: savedItem.image,
        price: savedItem.price,
        quantity: 1,
        inStock: savedItem.inStock,
        owner: SUPPORT_OWNER,
      },
    ]);
    setSavedItems((items) => items.filter((item) => item.id !== savedItem.id));
  };

  const removeSavedItem = (id) => {
    setSavedItems((items) => items.filter((item) => item.id !== id));
  };

  const { subtotal, shipping, tax, total } = calcCartTotals(cartItems);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <CartHeader itemCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/products"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Continue shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white rounded-lg">
                <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Browse the collection and add furniture you love.
                </p>
                <Link
                  to="/products"
                  className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="border border-gray-200 bg-white rounded-lg p-4 flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Add{' '}
                      <span className="text-gray-900">
                        ${amountToFreeShipping.toFixed(2)}
                      </span>{' '}
                      more to unlock free shipping.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <MotionDiv
                        key={item.id}
                        layout={!prefersReducedMotion}
                        initial={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8, transition: { duration: 0.2 } }
                        }
                      >
                        <CartItem
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={() => setPendingRemove(item)}
                          onSaveForLater={saveForLater}
                          onChat={setChatItem}
                          onViewProduct={(cartItem) =>
                            setSelectedProduct(resolveCartProduct(cartItem))
                          }
                        />
                      </MotionDiv>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}

            {savedItems.length > 0 && (
              <div className="mt-10">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">
                  Saved for later ({savedItems.length})
                </h2>
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <SavedItem
                      key={item.id}
                      item={item}
                      onMoveToCart={moveToCart}
                      onRemove={removeSavedItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              itemCount={cartCount}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              onCheckout={() => setShowCheckout(true)}
            />
          </div>
        </div>
      </div>

      {chatItem && (
        <ChatBox
          product={{
            id: chatItem.productId,
            name: chatItem.name,
            price: chatItem.price,
            images: [chatItem.image],
            owner: chatItem.owner || SUPPORT_OWNER,
          }}
          onClose={() => setChatItem(null)}
        />
      )}

      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          showAddToCart={false}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCheckout(false)}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Remove from cart?"
        message={
          pendingRemove
            ? `${pendingRemove.name} will be removed from your cart.`
            : ''
        }
        confirmLabel="Remove"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (pendingRemove) removeFromCart(pendingRemove.id);
          setPendingRemove(null);
        }}
      />
    </div>
  );
}
