import { Link } from "react-router-dom";
import { forwardRef } from "react";

export const AboutSection = forwardRef((props, ref) => {
  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">About ShewaCraft Furniture</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            ShewaCraft Furniture blends traditional craftsmanship with modern design
            to create durable, elegant, and functional furniture for every space.
          </p>
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <div className="h-96 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?auto=format&fit=crop&w=1080&q=80"
              alt="ShewaCraft Furniture Workshop"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-3xl text-gray-900 mb-4">
              Crafted Comfort, Built to Last
            </h3>
            <p className="text-gray-600 mb-4">
              At ShewaCraft Furniture, every piece is designed with purpose.
              We carefully select premium materials and apply skilled craftsmanship
              to ensure long-lasting quality and timeless beauty.
            </p>
            <p className="text-gray-600 mb-6">
              Whether it’s your living room, bedroom, office, or dining space,
              our furniture is built to elevate your everyday living.
            </p>

            <Link to="/about" className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition">
              Learn More About Us →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-gray-200">

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🪵</span>
            </div>
            <h3 className="text-xl mb-2 text-gray-900">Premium Materials</h3>
            <p className="text-gray-600">
              High-quality wood and finishes for strength and elegance.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛠️</span>
            </div>
            <h3 className="text-xl mb-2 text-gray-900">Expert Craftsmanship</h3>
            <p className="text-gray-600">
              Hand-crafted by skilled artisans with attention to detail.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-xl mb-2 text-gray-900">Reliable Delivery</h3>
            <p className="text-gray-600">
              Safe and timely delivery directly to your location.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
});
