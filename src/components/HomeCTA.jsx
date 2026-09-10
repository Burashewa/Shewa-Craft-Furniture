import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomeCTA() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl mb-6">Experience ShewaCraft</h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          Discover furniture designed to elevate your living and working spaces
          with comfort and character.
        </p>
        <Link
          to="/products"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 hover:-translate-y-0.5 transition duration-200 motion-reduce:transform-none"
        >
          Explore Collection
          <ArrowRight
            className="w-5 h-5 transition duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
