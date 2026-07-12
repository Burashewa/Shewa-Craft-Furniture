import { Link } from 'react-router-dom';
import { Armchair, BedDouble, UtensilsCrossed, Briefcase, ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Living Room',
    description: 'Sofas, tables, and accent pieces',
    icon: Armchair,
    image:
      'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bedroom',
    description: 'Beds, nightstands, and storage',
    icon: BedDouble,
    image:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dining',
    description: 'Tables and seating for gathering',
    icon: UtensilsCrossed,
    image:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Office',
    description: 'Desks and chairs for focused work',
    icon: Briefcase,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
];

export function CategorySection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Browse</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-2 max-w-xl">
              Start with the room you want to furnish
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
          >
            View all rooms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3 text-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-5 h-5" />
                      <h3 className="text-xl sm:text-2xl">{category.name}</h3>
                    </div>
                    <p className="text-sm text-white/80">{category.description}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-sm opacity-90 group-hover:opacity-100 transition">
                    Shop
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
