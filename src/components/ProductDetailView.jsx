import { AnimatePresence, motion } from 'framer-motion'
import { useState,useEffect } from 'react';
import { X, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatBox } from './ChatBox';

export function ProductDetailView({ product, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

   /* ---------------- BODY SCROLL LOCK ---------------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ---------------- ESC CLOSE ---------------- */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (isChatOpen) {
          setIsChatOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isChatOpen, onClose]);

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
    <motion.div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isChatOpen) onClose();
        }}
      >
      <div className="min-h-screen px-4 py-8">
        <motion.div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Close Button */}
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-700 mx-auto" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
            <div>
              <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index
                          ? 'border-gray-900'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <h1 className="text-3xl text-gray-900 mb-3">{product.name}</h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl text-gray-900">${product.price.toLocaleString()}</span>
                    {!product.inStock && (
                      <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-700 mb-3">Color: {selectedColor}</p>
                      <div className="flex gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border-2 rounded-lg transition ${
                              selectedColor === color
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-3">Quantity</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="mb-6">
                    <h3 className="text-lg text-gray-900 mb-3">Specifications</h3>
                    <div className="space-y-2">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{spec.label}</span>
                          <span className="text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    disabled={!product.inStock}
                    className="w-full px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat with Owner
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Warranty</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Easy Returns</p>
                  </div>
                </div>

                {/* Owner Info */}
                {/* <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Sold by</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.owner.avatar}
                      alt={product.owner.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-900">{product.owner.name}</p>
                      <p className="text-sm text-gray-500">Response time: {product.owner.responseTime}</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </motion.div>

      {/* Chat Box */}
      <AnimatePresence>
      {isChatOpen && (
        <ChatBox
          product={product}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </AnimatePresence>
  </>
  );
}
