import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    notes: { type: String, default: '' },
    preferredPayment: { type: String, default: '' },
    passwordResetToken: { type: String, select: false, default: '' },
    passwordResetExpires: { type: Date, select: false, default: null },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.passwordHash;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

export function publicUser(user) {
  const json = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return {
    id: json.id || String(json._id),
    fullName: json.fullName,
    email: json.email,
    role: json.role,
  };
}

export const User = mongoose.model('User', userSchema);
