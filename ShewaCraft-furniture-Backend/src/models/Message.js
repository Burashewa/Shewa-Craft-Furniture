import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: String,
      enum: ['customer', 'admin'],
      required: true,
    },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

export const Message = mongoose.model('Message', messageSchema);
