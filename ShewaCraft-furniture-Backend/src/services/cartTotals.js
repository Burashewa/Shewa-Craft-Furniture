export const FREE_SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING = 49;
export const TAX_RATE = 0.08;

export function calcCartTotals(items = []) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const shipping =
    subtotal > FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}
