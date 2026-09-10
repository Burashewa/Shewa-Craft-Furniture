import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchProducts } from '../services/productService';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const next = await fetchProducts();
    setProducts(next);
    setError('');
    return next;
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const next = await fetchProducts();
        if (active) {
          setProducts(next);
          setError('');
        }
      } catch (err) {
        if (active) {
          setProducts([]);
          setError(err.message || 'Unable to load products');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const getProductById = useCallback(
    (id) => {
      if (id == null) return undefined;
      return products.find((product) => String(product.id) === String(id));
    },
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      getProductById,
      refresh,
    }),
    [products, loading, error, getProductById, refresh]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
