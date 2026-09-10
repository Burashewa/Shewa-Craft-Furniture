import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { calcCartTotals } from '../services/cartTotals.js';

export async function seedDeliveredOrder() {
  const customer = await User.findOne({ email: 'customer@shewacraft.com' });
  if (!customer) return;

  const existing = await Order.exists({
    $or: [
      { publicId: 'ORD-1004' },
      { user: customer._id, status: 'delivered' },
    ],
  });
  if (existing) return;

  const product = await Product.findOne({ name: 'Luxury Velvet Armchair' });
  if (!product) return;

  const quantity = 1;
  const totals = calcCartTotals([{ price: product.price, quantity }]);
  const deliveredAt = new Date();
  deliveredAt.setDate(deliveredAt.getDate() - 2);

  await Order.create({
    publicId: 'ORD-1004',
    user: customer._id,
    customer: {
      name: customer.fullName,
      email: customer.email,
      phone: customer.phone || '+1234567890',
      location: customer.location || '123 Main St, New York, NY 10001',
    },
    items: [
      {
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        color: product.colors?.[0] || 'Navy',
        quantity,
        unitPrice: product.price,
      },
    ],
    totals,
    payment: {
      method: 'bank_transfer',
      bank: 'Bank of America',
      screenshot: '',
    },
    shippingLabel: 'Standard - 3-5 days',
    status: 'delivered',
    date: new Date(deliveredAt.getTime() - 2 * 24 * 60 * 60 * 1000),
    destinationConfirmedAt: deliveredAt,
  });
  console.info('[seed] Created delivered demo order ORD-1004');
}
