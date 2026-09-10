import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productName: { type: String, default: '' },
    productImage: { type: String, default: '' },
    productPrice: { type: Number, default: null },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    orderPublicId: { type: String, default: '' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: null },
    customerUnread: { type: Number, default: 0, min: 0 },
    adminUnread: { type: Boolean, default: false },
  },
  { timestamps: true }
);

conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ adminUnread: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
