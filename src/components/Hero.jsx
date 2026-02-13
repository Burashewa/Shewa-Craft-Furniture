import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero({ onAboutClick }) {
  return (
    <section className="relative h-[90vh] mt-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwZnVybml0dXJlfGVufDF8fHx8MTc3MDIyNTQ0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6">
            Transform Your Space
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-lg">
            Discover premium furniture that combines comfort, style, and quality craftsmanship for every room in your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="../../Products" className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition flex items-center justify-center gap-2">
              Shop Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link onClick={onAboutClick} className="px-8 py-4 bg-transparent text-white border-2 border-white hover:bg-white/10 transition">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
