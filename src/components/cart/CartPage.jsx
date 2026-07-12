import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck } from 'lucide-react';
import { ChatBox } from '../ChatBox';
import { CheckoutModal } from '../CheckoutModal';
import {
  initialCartItems,
  initialSavedItems,
  FREE_SHIPPING_THRESHOLD,
  calcCartTotals,
} from '../../data/cart';
import { CartHeader } from './CartHeader';
import { CartItem } from './CartItem';
import { SavedItem } from './SavedItem';
import { OrderSummary } from './OrderSummary';

export function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [savedItems, setSavedItems] = useState(initialSavedItems);
  const [chatItem, setChatItem] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

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
    removeItem(item.id);
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
        owner: {
          name: 'ShewaCraft Support',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          responseTime: 'Within 3 hours',
        },
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
      <CartHeader itemCount={cartItems.length} />

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
              <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white">
                <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Browse the collection and add furniture you love.
                </p>
                <Link
                  to="/products"
                  className="inline-flex px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="border border-gray-200 bg-white p-4 flex items-start gap-3">
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
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      onSaveForLater={saveForLater}
                      onChat={setChatItem}
                    />
                  ))}
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
              itemCount={cartItems.length}
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
            owner: chatItem.owner,
          }}
          onClose={() => setChatItem(null)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
