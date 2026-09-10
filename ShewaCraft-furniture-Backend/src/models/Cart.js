import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    responseTime: { type: String, default: '' },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    color: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    owner: { type: ownerSchema, default: () => ({}) },
  },
  { timestamps: false }
);

const savedItemSchema = new mongoose.Schema(
  {
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
  { timestamps: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
    savedForLater: { type: [savedItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
