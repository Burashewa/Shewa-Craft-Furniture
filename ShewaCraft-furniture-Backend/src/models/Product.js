import mongoose from 'mongoose';

export const PRODUCT_CATEGORIES = [
  'Living Room',
  'Bedroom',
  'Dining',
  'Office',
  'Outdoor',
];

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
    },
    featured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    specifications: { type: [specSchema], default: [] },
    colors: { type: [String], default: [] },
    assembly: { type: String, default: '' },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ featured: 1, rating: -1 });
productSchema.index({ price: 1 });

export function normalizeSpecifications(specs = []) {
  return specs.map((spec) => {
    const label =
      String(spec.label || '').toLowerCase() === 'warrenty'
        ? 'Warranty'
        : String(spec.label || '').trim();
    return { label, value: String(spec.value || '').trim() };
  });
}

productSchema.pre('save', function syncStockAndSpecs(next) {
  if (this.stockCount === 0) {
    this.inStock = false;
  }
  if (Array.isArray(this.specifications)) {
    this.specifications = normalizeSpecifications(this.specifications);
    if (!this.assembly) {
      const assemblySpec = this.specifications.find(
        (spec) => spec.label.toLowerCase() === 'assembly'
      );
      if (assemblySpec?.value) this.assembly = assemblySpec.value;
    }
  }
  next();
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.owner;
    return ret;
  },
});

export const Product = mongoose.model('Product', productSchema);
