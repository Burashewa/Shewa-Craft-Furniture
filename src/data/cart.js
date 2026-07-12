export const initialCartItems = [
  {
    id: 1,
    productId: 1,
    name: 'Luxury Velvet Armchair',
    image:
      'https://images.unsplash.com/photo-1765663241884-ebd171bdda1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 899,
    quantity: 1,
    color: 'Navy',
    inStock: true,
    owner: {
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      responseTime: 'Within 2 hours',
    },
  },
  {
    id: 2,
    productId: 2,
    name: 'Modern Coffee Table',
    image:
      'https://images.unsplash.com/photo-1642657547271-722df15ce6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 549,
    quantity: 2,
    color: 'Walnut',
    inStock: true,
    owner: {
      name: 'Michael Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      responseTime: 'Within 1 hour',
    },
  },
  {
    id: 3,
    productId: 5,
    name: 'Minimalist Nightstand',
    image:
      'https://images.unsplash.com/photo-1762856490803-8e200418973a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 329,
    quantity: 1,
    color: 'White',
    inStock: true,
    owner: {
      name: 'Lisa Anderson',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
      responseTime: 'Within 2 hours',
    },
  },
];

export const initialSavedItems = [
  {
    id: 4,
    productId: 4,
    name: 'Modern Bookshelf Unit',
    image:
      'https://images.unsplash.com/photo-1765371512707-9e0e96fd9e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 699,
    inStock: false,
  },
];

export const FREE_SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING = 49;
export const TAX_RATE = 0.08;

export function calcCartTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || cartItems.length === 0 ? 0 : FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}
