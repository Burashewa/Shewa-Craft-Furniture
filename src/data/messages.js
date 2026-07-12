export const conversations = [
  {
    id: 'c1',
    contactName: 'ShewaCraft Support',
    productName: 'Luxury Velvet Armchair',
    productId: 1,
    preview: 'Yes, we have that available in Navy and Emerald.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    unread: 1,
    messages: [
      {
        id: 1,
        sender: 'owner',
        text: 'Hi! Thanks for your interest in the Luxury Velvet Armchair. How can I help you today?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 2,
        sender: 'user',
        text: 'Do you have this in Navy, and can it ship this week?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 3,
        sender: 'owner',
        text: 'Yes, we have that available in Navy and Emerald.',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
  },
  {
    id: 'c2',
    contactName: 'ShewaCraft Support',
    productName: 'Premium Velvet Sofa',
    productId: 3,
    preview: 'Delivery for your area is typically 3–5 business days.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'owner',
        text: 'Hello! Happy to help with the Premium Velvet Sofa.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
      {
        id: 2,
        sender: 'user',
        text: 'What is the delivery timeline to Addis Ababa?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5).toISOString(),
      },
      {
        id: 3,
        sender: 'owner',
        text: 'Delivery for your area is typically 3–5 business days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: 'c3',
    contactName: 'ShewaCraft Support',
    productName: 'Minimalist Nightstand',
    productId: 5,
    preview: 'Great choice! This item is in stock and ready to ship.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Is the nightstand still available in White?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
      },
      {
        id: 2,
        sender: 'owner',
        text: 'Great choice! This item is in stock and ready to ship.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      },
    ],
  },
];

export function formatMessageTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const OWNER_RESPONSES = [
  "That's a great question! Let me provide you with more details.",
  "I'd be happy to help you with that. This piece is one of our bestsellers!",
  'Absolutely! I can arrange that for you.',
  'Yes, we have that available. Would you like to know more about the dimensions?',
  'Great choice! This item is currently in stock and ready to ship.',
];
