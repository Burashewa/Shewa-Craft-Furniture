import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Eye,
  Package,
  PackageX,
  Star,
  Filter,
} from 'lucide-react';
import { products as initialProducts } from '../../data/products';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor'];

const EMPTY_FORM = {
  name: '',
  price: '',
  category: 'Living Room',
  description: '',
  images: [],
  rating: 5,
  reviews: 0,
  inStock: true,
  featured: false,
  stockCount: 10,
  colors: [],
  assembly: '',
  specifications: [
    { label: 'Material', value: '' },
    { label: 'Warranty', value: '' },
    { label: 'Dimensions', value: '' },
  ],
  owner: {
    name: 'Admin',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    responseTime: 'Within 2 hours',
  },
};

function getSpec(product, label) {
  const specs = product?.specifications || [];
  const match = specs.find(
    (s) => s.label?.toLowerCase() === label.toLowerCase()
  );
  // Support legacy typo "Warrenty" in seed data
  if (!match && label.toLowerCase() === 'warranty') {
    return specs.find((s) => s.label?.toLowerCase() === 'warrenty')?.value || '';
  }
  return match?.value || '';
}

function upsertSpec(specs = [], label, value) {
  const next = [...specs];
  const index = next.findIndex(
    (s) =>
      s.label?.toLowerCase() === label.toLowerCase() ||
      (label === 'Warranty' && s.label?.toLowerCase() === 'warrenty')
  );
  if (index >= 0) {
    next[index] = { label, value };
  } else {
    next.push({ label, value });
  }
  return next;
}

function normalizeProduct(product) {
  return {
    ...product,
    featured: Boolean(product.featured),
    stockCount:
      typeof product.stockCount === 'number'
        ? product.stockCount
        : product.inStock
          ? 12
          : 0,
    images: Array.isArray(product.images) ? product.images : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    specifications: Array.isArray(product.specifications)
      ? product.specifications
      : [],
    assembly:
      product.assembly ||
      getSpec(product, 'Assembly') ||
      '',
  };
}

export function ProductsManagement() {
  const { showToast } = useToast();
  const [products, setProducts] = useState(() =>
    initialProducts.map(normalizeProduct)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [colorInput, setColorInput] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.inStock).length;
    const outOfStock = total - inStock;
    const featured = products.filter((p) => p.featured).length;
    const lowStock = products.filter(
      (p) => p.inStock && Number(p.stockCount) > 0 && Number(p.stockCount) <= 5
    ).length;
    return { total, inStock, outOfStock, featured, lowStock };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = products.filter((product) => {
      const material = getSpec(product, 'Material').toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        material.includes(query);

      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter;

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in' && product.inStock) ||
        (stockFilter === 'out' && !product.inStock) ||
        (stockFilter === 'low' &&
          product.inStock &&
          Number(product.stockCount) > 0 &&
          Number(product.stockCount) <= 5);

      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'yes' && product.featured) ||
        (featuredFilter === 'no' && !product.featured);

      return matchesSearch && matchesCategory && matchesStock && matchesFeatured;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock':
          return Number(b.stockCount) - Number(a.stockCount);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [
    products,
    searchQuery,
    categoryFilter,
    stockFilter,
    featuredFilter,
    sortBy,
  ]);

  const readFilesAsDataUrls = (files) =>
    Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

  const handleImagesChange = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const urls = await readFilesAsDataUrls(files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
    } catch {
      showToast({
        type: 'success',
        title: 'Upload failed',
        message: 'One or more photos could not be read. Please try again.',
      });
    }

    e.target.value = '';
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    setFormData((prev) => {
      const images = [...(prev.images || [])];
      if (toIndex < 0 || toIndex >= images.length) return prev;
      const [moved] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, moved);
      return { ...prev, images };
    });
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setColorInput('');
    setFormData({ ...EMPTY_FORM, images: [], colors: [], specifications: [
      { label: 'Material', value: '' },
      { label: 'Warranty', value: '' },
      { label: 'Dimensions', value: '' },
    ]});
    setShowFormModal(true);
  };

  const handleOpenEditModal = (product) => {
    const normalized = normalizeProduct(product);
    setEditingProduct(normalized);
    setFormData({
      ...normalized,
      price: normalized.price,
      images: [...normalized.images],
      colors: [...normalized.colors],
      specifications: [
        { label: 'Material', value: getSpec(normalized, 'Material') },
        { label: 'Warranty', value: getSpec(normalized, 'Warranty') },
        { label: 'Dimensions', value: getSpec(normalized, 'Dimensions') },
      ],
    });
    setColorInput('');
    setViewingProduct(null);
    setShowFormModal(true);
  };

  const addColor = (value) => {
    const v = value.trim();
    if (!v) return;
    const exists = (formData.colors || []).some(
      (c) => c.toLowerCase() === v.toLowerCase()
    );
    if (exists) return;
    setFormData({ ...formData, colors: [...(formData.colors || []), v] });
  };

  const removeColor = (idx) => {
    setFormData({
      ...formData,
      colors: (formData.colors || []).filter((_, i) => i !== idx),
    });
  };

  const handleViewProduct = (product) => {
    setViewingProduct(normalizeProduct(product));
    setDetailImageIndex(0);
  };

  const setSpecField = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: upsertSpec(prev.specifications, label, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productImages = formData.images || [];
    if (productImages.length === 0) {
      showToast({
        type: 'success',
        title: 'Photos required',
        message: 'Upload at least one product photo before saving.',
      });
      return;
    }

    if (!formData.name?.trim()) {
      showToast({
        type: 'success',
        title: 'Name required',
        message: 'Please enter a product name.',
      });
      return;
    }

    const price = Number(formData.price);
    if (!Number.isFinite(price) || price < 0) {
      showToast({
        type: 'success',
        title: 'Invalid price',
        message: 'Enter a valid product price.',
      });
      return;
    }

    const stockCount = formData.inStock
      ? Math.max(0, Number(formData.stockCount) || 0)
      : 0;

    let specifications = [...(formData.specifications || [])];
    if (formData.assembly?.trim()) {
      specifications = upsertSpec(specifications, 'Assembly', formData.assembly.trim());
    }

    const payload = normalizeProduct({
      ...formData,
      name: formData.name.trim(),
      price,
      stockCount,
      inStock: formData.inStock && stockCount > 0,
      featured: Boolean(formData.featured),
      images: productImages,
      specifications,
      assembly: formData.assembly?.trim() || '',
    });

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...payload, id: editingProduct.id } : p
        )
      );
      showToast({
        type: 'success',
        title: 'Product updated',
        message: `${payload.name} was updated successfully.`,
      });
    } else {
      const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts((prev) => [...prev, { ...payload, id: newId }]);
      showToast({
        type: 'success',
        title: 'Product added',
        message: `${payload.name} was added to your inventory.`,
      });
    }

    setShowFormModal(false);
  };

  const handleDelete = (id) => {
    const product = products.find((p) => p.id === id);
    if (
      !window.confirm(
        `Delete “${product?.name || 'this product'}”? This cannot be undone.`
      )
    ) {
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (viewingProduct?.id === id) setViewingProduct(null);
    showToast({
      type: 'success',
      title: 'Product deleted',
      message: `${product?.name || 'Product'} was removed from inventory.`,
    });
  };

  const handleQuickStockToggle = (product) => {
    const nextInStock = !product.inStock;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              inStock: nextInStock,
              stockCount: nextInStock
                ? Math.max(1, Number(p.stockCount) || 10)
                : 0,
            }
          : p
      )
    );
    showToast({
      type: 'success',
      title: nextInStock ? 'Marked in stock' : 'Marked out of stock',
      message: `${product.name} is now ${nextInStock ? 'available' : 'unavailable'}.`,
    });
  };

  const stockBadge = (product) => {
    if (!product.inStock || Number(product.stockCount) <= 0) {
      return {
        className: 'bg-rose-50 text-rose-800 border-rose-200',
        label: 'Out of stock',
      };
    }
    if (Number(product.stockCount) <= 5) {
      return {
        className: 'bg-amber-50 text-amber-800 border-amber-200',
        label: `Low · ${product.stockCount}`,
      };
    }
    return {
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      label: `In stock · ${product.stockCount}`,
    };
  };

  return (
    <div className="lg:pt-0 pt-16">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">
              Manage catalog listings, stock levels, and featured items
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            <Plus className="w-5 h-5" />
            Add product
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total products</p>
            <p className="text-2xl text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Package className="w-3.5 h-3.5" />
              In stock
            </div>
            <p className="text-2xl text-gray-900">{stats.inStock}</p>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <PackageX className="w-3.5 h-3.5" />
              Out of stock
            </div>
            <p className="text-2xl text-gray-900">{stats.outOfStock}</p>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Low stock (≤5)</p>
            <p className="text-2xl text-gray-900">{stats.lowStock}</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Star className="w-3.5 h-3.5" />
              Featured
            </div>
            <p className="text-2xl text-gray-900">{stats.featured}</p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 p-4 md:p-5">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
            <Filter className="w-4 h-4" />
            Search & filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or material..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search products"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by stock"
            >
              <option value="all">All stock</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by featured"
            >
              <option value="all">Featured: all</option>
              <option value="yes">Featured only</option>
              <option value="no">Not featured</option>
            </select>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="text-gray-900 font-medium">
                {filteredProducts.length}
              </span>{' '}
              of {products.length} products
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Sort products"
            >
              <option value="name-asc">Sort: Name A–Z</option>
              <option value="name-desc">Sort: Name Z–A</option>
              <option value="price-asc">Sort: Price low–high</option>
              <option value="price-desc">Sort: Price high–low</option>
              <option value="stock">Sort: Stock high–low</option>
            </select>
          </div>
        </section>

        <section className="bg-white border border-gray-200 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">No products found</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Try adjusting search or filters, or add a new product to your catalog.
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                <Plus className="w-4 h-4" />
                Add product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const badge = stockBadge(product);
                    const material = getSpec(product, 'Material');
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-12 h-12 object-cover border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {material || 'No material listed'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-1 text-xs border border-gray-200 bg-gray-50 text-gray-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums">
                          ${Number(product.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleQuickStockToggle(product)}
                            title="Toggle stock status"
                            className={`inline-block px-2 py-1 text-xs border ${badge.className}`}
                          >
                            {badge.label}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.featured ? (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-900">
                              <Star className="w-3.5 h-3.5 fill-gray-900" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewProduct(product)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                              aria-label={`View ${product.name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full my-8 max-h-[92vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl text-gray-900">
                  {editingProduct ? 'Edit product' : 'Add product'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Details shown here appear on the storefront product page.
                </p>
              </div>
              <button type="button" onClick={() => setShowFormModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product photos
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500">
                      Upload one or more photos. The first image is the main thumbnail.
                    </p>

                    {(formData.images || []).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {formData.images.map((image, index) => (
                          <div
                            key={`${index}-${String(image).slice(0, 24)}`}
                            className="relative group border border-gray-200 overflow-hidden bg-gray-50"
                          >
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            {index === 0 && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-gray-900 text-white text-[10px]">
                                Main
                              </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 flex gap-1 p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                              <button
                                type="button"
                                onClick={() => moveImage(index, index - 1)}
                                disabled={index === 0}
                                className="flex-1 text-[10px] text-white disabled:opacity-40"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="flex-1 text-[10px] text-white"
                              >
                                Remove
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(index, index + 1)}
                                disabled={index === formData.images.length - 1}
                                className="flex-1 text-[10px] text-white disabled:opacity-40"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={getSpec(formData, 'Material')}
                    onChange={(e) => setSpecField('Material', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={getSpec(formData, 'Warranty')}
                    onChange={(e) => setSpecField('Warranty', e.target.value)}
                    placeholder="2 years"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={getSpec(formData, 'Dimensions')}
                    onChange={(e) => setSpecField('Dimensions', e.target.value)}
                    placeholder='e.g., 32" W x 34" D x 36" H'
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockCount: e.target.value,
                        inStock: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    0 marks the product out of stock. 1–5 counts as low stock.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors
                  </label>
                  <div className="border border-gray-300 px-3 py-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(formData.colors || []).map((color, idx) => (
                        <span
                          key={`${color}-${idx}`}
                          className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-2 py-1 text-sm"
                        >
                          <span>{color}</span>
                          <button
                            type="button"
                            onClick={() => removeColor(idx)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label={`Remove ${color}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addColor(colorInput);
                          setColorInput('');
                        }
                      }}
                      placeholder="Type a color and press Enter"
                      className="w-full px-2 py-1 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assembly notes
                  </label>
                  <input
                    type="text"
                    value={formData.assembly || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, assembly: e.target.value })
                    }
                    placeholder="e.g., Requires minimal assembly"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-6 pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inStock: e.target.checked,
                          stockCount: e.target.checked
                            ? Math.max(1, Number(formData.stockCount) || 10)
                            : 0,
                        })
                      }
                    />
                    Available for purchase
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.featured)}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                    />
                    Featured on homepage
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  {editingProduct ? 'Save changes' : 'Add product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full my-8 max-h-[92vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl text-gray-900">Product details</h2>
              <button type="button" onClick={() => setViewingProduct(null)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={viewingProduct.images[detailImageIndex] || viewingProduct.images[0]}
                    alt={viewingProduct.name}
                    className="w-full h-80 object-cover border border-gray-200"
                  />
                  {viewingProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {viewingProduct.images.map((img, idx) => (
                        <button
                          key={`${viewingProduct.id}-thumb-${idx}`}
                          type="button"
                          onClick={() => setDetailImageIndex(idx)}
                          className={`border overflow-hidden ${
                            detailImageIndex === idx
                              ? 'border-gray-900'
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs border ${
                          stockBadge(viewingProduct).className
                        }`}
                      >
                        {stockBadge(viewingProduct).label}
                      </span>
                      {viewingProduct.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 bg-gray-50 text-gray-900">
                          <Star className="w-3.5 h-3.5 fill-gray-900" />
                          Featured
                        </span>
                      )}
                      <span className="inline-block px-2 py-1 text-xs border border-gray-200 bg-gray-50 text-gray-800">
                        {viewingProduct.category}
                      </span>
                    </div>
                    <h3 className="text-2xl text-gray-900">{viewingProduct.name}</h3>
                    <p className="text-3xl text-gray-900 mt-2 tabular-nums">
                      ${Number(viewingProduct.price).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {viewingProduct.description}
                    </p>
                  </div>

                  {(viewingProduct.specifications || []).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Specifications
                      </p>
                      <div className="border border-gray-200 divide-y divide-gray-200">
                        {viewingProduct.specifications.map((spec, idx) => (
                          <div
                            key={`${spec.label}-${idx}`}
                            className="flex justify-between gap-4 px-3 py-2 text-sm"
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

                  {viewingProduct.assembly && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Assembly</p>
                      <p className="text-sm text-gray-600">{viewingProduct.assembly}</p>
                    </div>
                  )}

                  {viewingProduct.colors?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Available colors
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {viewingProduct.colors.map((color) => (
                          <span
                            key={color}
                            className="px-3 py-1 bg-gray-100 text-sm text-gray-800"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-sm text-gray-500">
                    Rating {viewingProduct.rating} · {viewingProduct.reviews} reviews
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDelete(viewingProduct.id)}
                className="px-6 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 transition"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => handleOpenEditModal(viewingProduct)}
                className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Edit product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
