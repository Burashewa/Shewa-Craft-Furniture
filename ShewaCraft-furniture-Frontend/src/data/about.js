import { Award, Hammer, HeartHandshake, Sparkles, Trees, Truck } from 'lucide-react';

export const foundedYear = 2020;

export const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?auto=format&fit=crop&w=1080&q=80',
    alt: 'ShewaCraft Furniture living space',
  },
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    alt: 'ShewaCraft Furniture workshop',
  },
  {
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1080&q=80',
    alt: 'Crafted living room furniture',
  },
];

export const values = [
  {
    title: 'Quality Craftsmanship',
    desc: 'Premium materials and skilled artisans ensure every piece is built for durability and elegance.',
    icon: Award,
  },
  {
    title: 'Timeless Design',
    desc: 'Modern aesthetics balanced with classic comfort — furniture that feels right for years, not seasons.',
    icon: Sparkles,
  },
  {
    title: 'Customer First',
    desc: 'From browsing to delivery, your satisfaction shapes how we design, build, and support every order.',
    icon: HeartHandshake,
  },
];

export const steps = [
  {
    step: '01',
    title: 'Design with purpose',
    desc: 'Each piece starts with how people live — comfort, proportion, and lasting beauty.',
  },
  {
    step: '02',
    title: 'Craft with care',
    desc: 'Skilled makers select materials and finish every detail by hand where it matters.',
  },
  {
    step: '03',
    title: 'Deliver with trust',
    desc: 'Safe packaging and reliable delivery so your furniture arrives ready for your space.',
  },
];

export const features = [
  {
    title: 'Premium Materials',
    description: 'High-quality wood and finishes for strength and elegance.',
    icon: Trees,
  },
  {
    title: 'Expert Craftsmanship',
    description: 'Hand-crafted by skilled artisans with attention to detail.',
    icon: Hammer,
  },
  {
    title: 'Reliable Delivery',
    description: 'Safe and timely delivery directly to your location.',
    icon: Truck,
  },
];

export function getAboutStats({ reviewCount = 0, averageRating = 0 } = {}) {
  const years = Math.max(0, new Date().getFullYear() - foundedYear);
  const reviews = Math.max(0, Number(reviewCount) || 0);
  const rating = reviews > 0 ? Number(Number(averageRating).toFixed(1)) : 0;

  return [
    {
      id: 'years',
      label: 'Years of craftsmanship',
      value: years,
      format: 'integer',
    },
    {
      id: 'reviews',
      label: 'Customer reviews',
      value: reviews,
      format: 'integer',
    },
    {
      id: 'rating',
      label: 'Average rating',
      value: rating,
      format: 'decimal',
    },
  ];
}
