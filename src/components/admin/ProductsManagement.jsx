import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Eye } from 'lucide-react';
import { products as initialProducts } from '../../data/products';

export function ProductsManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Living Room',
    description: '',
    images: [],
    rating: 5,
    reviews: 0,
    inStock: true,
    colors: [],
    assembly: '',
    specifications: [],
    owner: {
      name: 'Admin',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      responseTime: 'Within 2 hours'
    }
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
    setColorInput('');
    setFormData({
      name: '',
      price: 0,
      category: 'Living Room',
      description: '',
      images: [],
      rating: 5,
      reviews: 0,
      inStock: true,
      colors: [],
      assembly: '',
      specifications: [],
      owner: {
        name: 'Admin',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        responseTime: 'Within 2 hours'
      }
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.images[0] || '');
    setImageFile(null);
    setColorInput('');
    setShowAddModal(true);
  };

  const addColor = (value) => {
    const v = value.trim();
    if (!v) return;
    const exists = (formData.colors || []).some((c) => c.toLowerCase() === v.toLowerCase());
    if (exists) return;
    const newColors = [...(formData.colors || []), v];
    setFormData({ ...formData, colors: newColors });
  };

  const removeColor = (idx) => {
    const newColors = (formData.colors || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, colors: newColors });
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setShowDetailModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productImages = imagePreview
      ? [imagePreview, ...(formData.images ? formData.images.slice(1) : [])]
      : formData.images || [];

    if (editingProduct) {
      // Edit existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...formData, id: editingProduct.id, images: productImages }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id:
          products.length > 0
            ? Math.max(...products.map((p) => p.id)) + 1
            : 1,
        images: productImages
      };

      setProducts([...products, newProduct]);
    }

    setShowAddModal(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };


  return (
    <div className="lg:pt-0 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">Products Management</h1>
            <p className="text-gray-600 mt-1">Manage your furniture inventory</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.images}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.material}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[100vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  >
                    <option>Living Room</option>
                    <option>Bedroom</option>
                    <option>Dining</option>
                    <option>Office</option>
                    <option>Outdoor</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload product image from your device</p>
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded object-cover border border-gray-300"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formData.specifications?.find(s => s.label === 'Material')?.value || ''}
                    onChange={(e) => {
                      const specs = formData.specifications || [];
                      const materialIndex = specs.findIndex(s => s.label === 'Material');
                      const newSpecs = [...specs];
                      if (materialIndex >= 0) {
                        newSpecs[materialIndex] = { label: 'Material', value: e.target.value };
                      } else {
                        newSpecs.push({ label: 'Material', value: e.target.value });
                      }
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={formData.specifications?.find(s => s.label === 'Warranty')?.value || ''}
                    onChange={(e) => {
                      const specs = formData.specifications || [];
                      const warrantyIndex = specs.findIndex(s => s.label === 'Warranty');
                      const newSpecs = [...specs];
                      if (warrantyIndex >= 0) {
                        newSpecs[warrantyIndex] = { label: 'Warranty', value: e.target.value };
                      } else {
                        newSpecs.push({ label: 'Warranty', value: e.target.value });
                      }
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    placeholder="2 years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.specifications?.find(s => s.label === 'Dimensions')?.value || ''}
                    onChange={(e) => {
                      const specs = formData.specifications || [];
                      const dimensionsIndex = specs.findIndex(s => s.label === 'Dimensions');
                      const newSpecs = [...specs];
                      if (dimensionsIndex >= 0) {
                        newSpecs[dimensionsIndex] = { label: 'Dimensions', value: e.target.value };
                      } else {
                        newSpecs.push({ label: 'Dimensions', value: e.target.value });
                      }
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    placeholder='e.g., 32" W x 34" D x 36" H'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                  <div className="border border-gray-300 rounded-lg px-3 py-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(formData.colors || []).map((color, idx) => (
                        <span key={idx} className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                          <span>{color}</span>
                          <button type="button" onClick={() => removeColor(idx)} className="text-gray-500 hover:text-gray-700">×</button>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assembly</label>
                  <input
                    type="text"
                    value={formData.assembly || ''}
                    onChange={(e) => setFormData({ ...formData, assembly: e.target.value })}
                    placeholder="e.g., Requires minimal assembly"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded"
                    />
                    In Stock
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showDetailModal && viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl text-gray-900">Product Details</h2>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div>
                  <img
                    src={viewingProduct.images[0]}
                    alt={viewingProduct.name}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {viewingProduct.images.slice(1).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${viewingProduct.name} ${idx + 2}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{viewingProduct.name}</h3>
                    <p className="text-3xl text-gray-900 font-bold mb-2">${viewingProduct.price}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      viewingProduct.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingProduct.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Category</p>
                    <p className="text-gray-900">{viewingProduct.category}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-gray-600">{viewingProduct.description}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Specifications</p>
                    <div className="space-y-2">
                      {viewingProduct.specifications.map((spec, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">{spec.label}</span>
                          <span className="text-gray-900 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {viewingProduct.colors && viewingProduct.colors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Available Colors</p>
                      <div className="flex gap-2">
                        {viewingProduct.colors.map((color, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">{viewingProduct.rating}</span>
                      <span className="text-gray-500">({viewingProduct.reviews} reviews)</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}