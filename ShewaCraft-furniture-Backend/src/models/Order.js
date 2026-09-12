import mongoose from 'mongoose';

const customerSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    color: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const totalsSchema = new mongoose.Schema(
  {
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, default: 'bank_transfer' },
    bank: { type: String, default: '' },
    screenshot: { type: String, default: '' },
    reference: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: { type: customerSnapshotSchema, default: () => ({}) },
    items: { type: [orderItemSchema], default: [] },
    totals: { type: totalsSchema, required: true },
    payment: { type: paymentSchema, default: () => ({}) },
    shippingLabel: { type: String, default: 'Standard - 3-5 days' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'shipped', 'delivered', 'completed'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
    destinationConfirmedAt: { type: Date, default: null },
    customerReceivedAt: { type: Date, default: null },
    rating: { type: Number, default: null },
    review: { type: String, default: '' },
    reviewFeatured: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, date: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ reviewFeatured: 1, rating: -1 });

export const Order = mongoose.model('Order', orderSchema);
