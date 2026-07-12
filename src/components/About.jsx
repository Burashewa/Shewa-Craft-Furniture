import { ArrowRight, Award, HeartHandshake, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeCTA } from './HomeCTA';

const values = [
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

const steps = [
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

export function About() {
  return (
    <main className="pt-16">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav
            className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-gray-900 transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">About</span>
          </nav>
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Our brand</p>
          <h1 className="text-3xl sm:text-5xl text-gray-900 mb-3">ShewaCraft</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Crafting timeless furniture that blends tradition, comfort, and modern design.
          </p>
        </div>
      </div>

      {/* Hero image */}
      <section className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80"
          alt="ShewaCraft Furniture workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10">
          <p className="text-white text-lg sm:text-xl max-w-xl">
            Furniture made to elevate everyday living — built with care, meant to last.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-3">Our story</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-6">
              More than furniture — a way of living
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              ShewaCraft Furniture was founded with a simple belief: furniture should be more
              than functional — it should tell a story, create comfort, and last for generations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Inspired by Ethiopian craftsmanship and refined with modern design principles,
              each piece we create reflects quality, care, and attention to detail.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Shop the collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="aspect-[4/5] overflow-hidden bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1080&q=80"
              alt="Crafted living room furniture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-3">What we stand for</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">Values that shape every piece</h2>
            <p className="text-gray-600">
              Every ShewaCraft piece is built around principles that define how we work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200 p-8"
                >
                  <Icon className="w-7 h-7 text-gray-900 mb-5" />
                  <h3 className="text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-3">How we work</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">From idea to your home</h2>
            <p className="text-gray-600">
              A simple process focused on craft, clarity, and care at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((item) => (
              <div key={item.step} className="border-t border-gray-900 pt-6">
                <p className="text-sm text-gray-500 mb-3">{item.step}</p>
                <h3 className="text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeCTA />
    </main>
  );
}
