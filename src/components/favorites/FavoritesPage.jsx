import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { products } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { ProductDetailView } from '../ProductDetailView';
import { FavoritesHeader } from './FavoritesHeader';
import { FavoriteCard } from './FavoriteCard';

export function FavoritesPage() {
  const {
    favorites,
    addToCart,
    removeFavorite,
    clearFavorites,
  } = useShop();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const resolveProduct = (favorite) =>
    products.find((product) => product.id === favorite.productId) || {
      id: favorite.productId,
      name: favorite.name,
      price: favorite.price,
      images: [favorite.image],
      inStock: favorite.inStock,
      colors: [],
      owner: {
        name: 'ShewaCraft Support',
        responseTime: 'Within 2 hours',
      },
    };

  const handleAddToCart = (favorite) => {
    if (!favorite.inStock) return;

    const product = resolveProduct(favorite);
    const { addedAsNew } = addToCart({ product, quantity: 1 });

    showToast({
      type: 'success',
      title: addedAsNew ? 'Added to cart' : 'Cart updated',
      message: addedAsNew
        ? `${favorite.name} was added to your cart.`
        : `${favorite.name} quantity was updated in your cart.`,
      actionLabel: 'View cart',
      actionTo: '/cart',
    });
  };

  const handleRemove = (productId) => {
    const favorite = favorites.find((item) => item.productId === productId);
    removeFavorite(productId);
    showToast({
      type: 'favorite',
      title: 'Removed from favorites',
      message: favorite
        ? `${favorite.name} was removed from your favorites.`
        : 'Item was removed from your favorites.',
    });
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    clearFavorites();
    showToast({
      type: 'favorite',
      title: 'Favorites cleared',
      message: 'All saved items were removed from your favorites.',
    });
  };

  const handleViewDetails = (favorite) => {
    setSelectedProduct(resolveProduct(favorite));
  };

  const handleAddAllInStock = () => {
    const inStockItems = favorites.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      showToast({
        type: 'success',
        title: 'Nothing to add',
        message: 'None of your favorites are currently in stock.',
      });
      return;
    }

    inStockItems.forEach((favorite) => {
      addToCart({ product: resolveProduct(favorite), quantity: 1 });
    });

    showToast({
      type: 'success',
      title: 'Added to cart',
      message: `${inStockItems.length} in-stock ${
        inStockItems.length === 1 ? 'item was' : 'items were'
      } added to your cart.`,
      actionLabel: 'View cart',
      actionTo: '/cart',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <FavoritesHeader count={favorites.length} onClearAll={handleClearAll} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white">
            <Heart className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Browse the collection and tap Save on products you want to come back to.
            </p>
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <p className="text-sm text-gray-600">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
              </p>
              <button
                type="button"
                onClick={handleAddAllInStock}
                className="px-4 py-2.5 border border-gray-900 text-sm text-gray-900 hover:bg-gray-50 transition self-start sm:self-auto"
              >
                Add all in stock to cart
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <FavoriteCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemove}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
