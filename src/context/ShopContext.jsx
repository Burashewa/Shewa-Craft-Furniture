import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialCartItems } from '../data/cart';

const CART_KEY = 'shewacraft_cart';
const FAVORITES_KEY = 'shewacraft_favorites';

const ShopContext = createContext(null);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = readJson(CART_KEY, null);
    return stored ?? initialCartItems;
  });
  const [favorites, setFavorites] = useState(() => readJson(FAVORITES_KEY, []));

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = useCallback(
    ({ product, quantity = 1, color }) => {
      const selectedColor = color || product.colors?.[0] || '';
      const exists = cartItems.some(
        (item) =>
          item.productId === product.id && (item.color || '') === selectedColor
      );

      setCartItems((prev) => {
        const matchIndex = prev.findIndex(
          (item) =>
            item.productId === product.id && (item.color || '') === selectedColor
        );

        if (matchIndex >= 0) {
          return prev.map((item, index) =>
            index === matchIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...prev,
          {
            id: Date.now(),
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            quantity,
            color: selectedColor,
            inStock: product.inStock,
            owner: product.owner,
          },
        ];
      });

      return { addedAsNew: !exists };
    },
    [cartItems]
  );

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isFavorite = useCallback(
    (productId) => favorites.some((item) => item.productId === productId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (product) => {
      const exists = favorites.some((item) => item.productId === product.id);

      if (exists) {
        setFavorites((prev) => prev.filter((item) => item.productId !== product.id));
        return { wasAdded: false };
      }

      setFavorites((prev) => [
        ...prev,
        {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          inStock: product.inStock,
        },
      ]);
      return { wasAdded: true };
    },
    [favorites]
  );

  const removeFavorite = useCallback((productId) => {
    setFavorites((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  const value = useMemo(
    () => ({
      cartItems,
      favorites,
      cartCount,
      favoritesCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
      setCartItems,
      setFavorites,
    }),
    [
      cartItems,
      favorites,
      cartCount,
      favoritesCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
