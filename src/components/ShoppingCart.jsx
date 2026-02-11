import { useState } from 'react';
import { Trash2, Plus, Minus, Heart, ShoppingBag, Lock, ArrowLeft, Truck, MessageCircle } from 'lucide-react';
import { ChatBox } from './ChatBox';
import { CheckoutModal } from './CheckoutModal';

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 1,
      name: 'Luxury Velvet Armchair',
      image: 'https://images.unsplash.com/photo-1765663241884-ebd171bdda1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcm1jaGFpciUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzAzNjY0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 899,
      quantity: 1,
      color: 'Navy',
      inStock: true,
      owner: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        responseTime: 'Within 2 hours'
      }
    },
    {
      id: 2,
      productId: 2,
      name: 'Modern Coffee Table',
      image: 'https://images.unsplash.com/photo-1642657547271-722df15ce6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NzAzNjY0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 549,
      quantity: 2,
      color: 'Walnut',
      inStock: true,
      owner: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        responseTime: 'Within 1 hour'
      }
    },
    {
      id: 3,
      productId: 5,
      name: 'Minimalist Nightstand',
      image: 'https://images.unsplash.com/photo-1762856490803-8e200418973a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbmlnaHRzdGFuZHxlbnwxfHx8fDE3NzAzNjY0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 329,
      quantity: 1,
      color: 'White',
      inStock: true,
      owner: {
        name: 'Lisa Anderson',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
        responseTime: 'Within 2 hours'
      }
    },
  ]);

  const [savedItems, setSavedItems] = useState([
    {
      id: 4,
      productId: 4,
      name: 'Modern Bookshelf Unit',
      image: 'https://images.unsplash.com/photo-1765371512707-9e0e96fd9e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc2hlbGYlMjB3b29kJTIwbW9kZXJufGVufDF8fHx8MTc3MDM0MTc1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 699,
      inStock: false,
    },
  ]);

  const [chatItem, setChatItem] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const saveForLater = (item) => {
    const savedItem = {
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      inStock: item.inStock,
    };
    setSavedItems([...savedItems, savedItem]);
    removeItem(item.id);
  };

  const moveToCart = (savedItem) => {
    const cartItem = {
      id: savedItem.id,
      productId: savedItem.productId,
      name: savedItem.name,
      image: savedItem.image,
      price: savedItem.price,
      quantity: 1,
      inStock: savedItem.inStock,
      owner: {
        name: 'Owner Name',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        responseTime: 'Within 3 hours'
      }
    };
    setCartItems([...cartItems, cartItem]);
    setSavedItems(savedItems.filter(item => item.id !== savedItem.id));
  };

  const removeSavedItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4">
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping Banner */}
                {subtotal < 500 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-900">
                      Add <span className="font-semibold">${(500 - subtotal).toFixed(2)}</span> more to get FREE shipping!
                    </p>
                  </div>
                )}

                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-32 h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg text-gray-900 mb-1">{item.name}</h3>
                              {item.color && (
                                <p className="text-sm text-gray-600">Color: {item.color}</p>
                              )}
                              {item.inStock ? (
                                <p className="text-sm text-green-600 mt-1">In Stock</p>
                              ) : (
                                <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition p-1"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Price and Quantity Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => saveForLater(item)}
                                className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
                              >
                                <Heart className="w-4 h-4" />
                                Save for Later
                              </button>
                              <span className="text-xl text-gray-900">
                                ${(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Chat with Owner Button */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => setChatItem(item)}
                              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat with {item.owner.name}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Saved for Later Section */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl text-gray-900 mb-4">Saved for Later ({savedItems.length})</h2>
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-gray-900">{item.name}</h3>
                              <p className="text-gray-600 mt-1">${item.price.toLocaleString()}</p>
                              {!item.inStock && (
                                <p className="text-sm text-red-600 mt-1">Currently Unavailable</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeSavedItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition p-1"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <button
                            onClick={() => moveToCart(item)}
                            disabled={!item.inStock}
                            className="mt-2 px-4 py-2 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition text-sm disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 mb-6">
                <span className="text-xl text-gray-900">Total</span>
                <span className="text-2xl text-gray-900">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                disabled={cartItems.length === 0}
                onClick={() => setShowCheckout(true)}
                className="w-full px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                <Lock className="w-5 h-5" />
                Proceed to Checkout
              </button>

              {/* Security Notice */}
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Lock className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600">
                  Secure checkout - Your payment information is protected
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $500</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Box */}
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

      {/* Checkout Modal */}
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