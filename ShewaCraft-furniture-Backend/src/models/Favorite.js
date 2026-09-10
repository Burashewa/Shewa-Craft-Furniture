import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

favoriteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = String(ret._id);
    ret.productId = String(ret.product);
    delete ret._id;
    delete ret.user;
    delete ret.product;
    return ret;
  },
});

export function publicFavorite(doc, liveProduct) {
  const json = typeof doc.toJSON === 'function' ? doc.toJSON() : doc;
  const live =
    liveProduct && typeof liveProduct.toJSON === 'function'
      ? liveProduct.toJSON()
      : liveProduct;

  return {
    id: json.id,
    productId: json.productId,
    name: live?.name ?? json.name,
    image: live?.images?.[0] ?? json.image,
    price: live?.price ?? json.price,
    inStock: live?.inStock ?? json.inStock,
  };
}

export const Favorite = mongoose.model('Favorite', favoriteSchema);
