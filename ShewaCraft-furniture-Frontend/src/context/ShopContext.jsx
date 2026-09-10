import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  addFavorite as apiAddFavorite,
  clearFavorites as apiClearFavorites,
  listFavorites,
  removeFavorite as apiRemoveFavorite,
} from '../services/favoriteService';
import {
  addCartItem as apiAddCartItem,
  getCart,
  moveSavedItemToCart as apiMoveToCart,
  removeCartItem as apiRemoveCartItem,
  removeSavedCartItem as apiRemoveSavedItem,
  saveCartItemForLater as apiSaveForLater,
  updateCartItem as apiUpdateCartItem,
} from '../services/cartService';

const EMPTY_TOTALS = { subtotal: 0, shipping: 0, tax: 0, total: 0 };

const ShopContext = createContext(null);

function sameId(a, b) {
  return String(a) === String(b);
}

export function ShopProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [totals, setTotals] = useState(EMPTY_TOTALS);
  const [favorites, setFavorites] = useState([]);

  const applyCart = useCallback((data) => {
    setCartItems(Array.isArray(data?.items) ? data.items : []);
    setSavedForLater(Array.isArray(data?.savedForLater) ? data.savedForLater : []);
    setTotals(data?.totals || EMPTY_TOTALS);
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!user?.id) {
      setFavorites([]);
      applyCart({ items: [], savedForLater: [], totals: EMPTY_TOTALS });
      return undefined;
    }

    let active = true;
    Promise.all([listFavorites(), getCart()])
      .then(([nextFavorites, cart]) => {
        if (!active) return;
        setFavorites(nextFavorites);
        applyCart(cart);
      })
      .catch(() => {
        if (!active) return;
        setFavorites([]);
        applyCart({ items: [], savedForLater: [], totals: EMPTY_TOTALS });
      });

    return () => {
      active = false;
    };
  }, [user?.id, authLoading, applyCart]);

  const addToCart = useCallback(
    async ({ product, quantity = 1, color }) => {
      const selectedColor = color || product.colors?.[0] || '';
      const exists = cartItems.some(
        (item) =>
          sameId(item.productId, product.id) && (item.color || '') === selectedColor
      );
      const cart = await apiAddCartItem({
        productId: product.id,
        quantity,
        color: selectedColor,
      });
      applyCart(cart);
      return { addedAsNew: !exists };
    },
    [applyCart, cartItems]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity < 1) return;
      const cart = await apiUpdateCartItem(id, quantity);
      applyCart(cart);
    },
    [applyCart]
  );

  const removeFromCart = useCallback(
    async (id) => {
      const cart = await apiRemoveCartItem(id);
      applyCart(cart);
    },
    [applyCart]
  );

  const saveForLater = useCallback(
    async (item) => {
      const cart = await apiSaveForLater(item.id);
      applyCart(cart);
    },
    [applyCart]
  );

  const moveToCart = useCallback(
    async (item) => {
      const cart = await apiMoveToCart(item.id);
      applyCart(cart);
    },
    [applyCart]
  );

  const removeSavedItem = useCallback(
    async (id) => {
      const cart = await apiRemoveSavedItem(id);
      applyCart(cart);
    },
    [applyCart]
  );

  const refreshCart = useCallback(async () => {
    if (!user?.id) {
      applyCart({ items: [], savedForLater: [], totals: EMPTY_TOTALS });
      return;
    }
    const cart = await getCart();
    applyCart(cart);
  }, [applyCart, user?.id]);

  const isFavorite = useCallback(
    (productId) => favorites.some((item) => sameId(item.productId, productId)),
    [favorites]
  );

  const removeFavorite = useCallback(async (productId) => {
    const id = String(productId);
    await apiRemoveFavorite(id);
    setFavorites((prev) => prev.filter((item) => !sameId(item.productId, id)));
  }, []);

  const toggleFavorite = useCallback(
    async (product) => {
      const productId = String(product.id);
      const exists = favorites.some((item) => sameId(item.productId, productId));

      if (exists) {
        await removeFavorite(productId);
        return { wasAdded: false };
      }

      const favorite = await apiAddFavorite(productId);
      setFavorites((prev) => {
        if (prev.some((item) => sameId(item.productId, productId))) return prev;
        return [favorite, ...prev];
      });
      return { wasAdded: true };
    },
    [favorites, removeFavorite]
  );

  const clearFavorites = useCallback(async () => {
    await apiClearFavorites();
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
      savedForLater,
      totals,
      favorites,
      cartCount,
      favoritesCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      removeSavedItem,
      refreshCart,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [
      cartItems,
      savedForLater,
      totals,
      favorites,
      cartCount,
      favoritesCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      removeSavedItem,
      refreshCart,
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
