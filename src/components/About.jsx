import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HomeCTA } from './HomeCTA';
import { Reveal } from './about/Reveal';
import { gallery, steps, values } from '../data/about';

const MotionP = motion.p;
const MotionH1 = motion.h1;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const hoverReveal =
  'opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100';

const heroImage = gallery[1];

function fadeUp(delay) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: 'easeOut' },
  };
}

function StoryGallery() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = gallery.length;

  const goTo = (next) => {
    if (count < 1) return;
    setIndex(((next % count) + count) % count);
  };

  const current = gallery[index];

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg group">
      {gallery.map((image, imageIndex) => (
        <img
          key={image.src}
          src={image.src}
          alt=""
          aria-hidden={imageIndex !== index}
          className={`absolute inset-0 w-full h-full object-cover ${
            prefersReducedMotion
              ? imageIndex === index
                ? 'opacity-100'
                : 'opacity-0'
              : `transition-all duration-500 motion-reduce:transition-none ${
                  imageIndex === index ? 'opacity-100' : 'opacity-0'
                } group-hover:scale-105 motion-reduce:group-hover:scale-100`
          }`}
        />
      ))}

      <p className="sr-only" aria-live="polite">
        {current?.alt}
      </p>

      {count > 1 && (
        <>
          <button
            type="button"
            title="Previous image"
            aria-label="Previous image"
            onClick={() => goTo(index - 1)}
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition duration-200 motion-reduce:transition-none ${hoverReveal} ${focusRing}`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            title="Next image"
            aria-label="Next image"
            onClick={() => goTo(index + 1)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition duration-200 motion-reduce:transition-none ${hoverReveal} ${focusRing}`}
          >
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
          <div
            className={`absolute bottom-3 inset-x-0 flex justify-center gap-1.5 transition duration-200 motion-reduce:transition-none ${hoverReveal}`}
            role="tablist"
            aria-label="Story images"
          >
            {gallery.map((image, imageIndex) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={index === imageIndex}
                title={image.alt}
                aria-label={`Show image ${imageIndex + 1} of ${count}`}
                onClick={() => goTo(imageIndex)}
                className={`h-1.5 rounded-full transition ${focusRing} ${
                  index === imageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function About() {
  const prefersReducedMotion = useReducedMotion();
  const intro = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : null;

  return (
    <main className="pt-16">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav
            className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-gray-900 transition duration-200">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" aria-hidden />
            <span className="text-gray-900" aria-current="page">
              About
            </span>
          </nav>
          <MotionP
            className="text-sm uppercase tracking-wider text-gray-500 mb-2"
            {...(intro ?? fadeUp(0))}
          >
            Our brand
          </MotionP>
          <MotionH1
            className="text-3xl sm:text-5xl text-gray-900 mb-3"
            {...(intro ?? fadeUp(0.08))}
          >
            ShewaCraft
          </MotionH1>
          <MotionP
            className="text-gray-600 max-w-2xl text-lg"
            {...(intro ?? fadeUp(0.16))}
          >
            Crafting timeless furniture that blends tradition, comfort, and modern design.
          </MotionP>
        </div>
      </div>

      <section className="relative h-[50vh] min-h-[320px] overflow-hidden group">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10">
          <Reveal>
            <p className="text-white text-lg sm:text-xl max-w-xl">
              Furniture made to elevate everyday living — built with care, meant to last.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
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
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 hover:-translate-y-0.5 transition duration-200 motion-reduce:transform-none"
            >
              Shop the collection
              <ArrowRight
                className="w-4 h-4 transition duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                aria-hidden
              />
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <StoryGallery />
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-3">What we stand for</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">Values that shape every piece</h2>
            <p className="text-gray-600">
              Every ShewaCraft piece is built around principles that define how we work.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="group bg-white border border-gray-200 rounded-lg p-8 transition duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:shadow-sm hover:border-gray-300 motion-reduce:hover:translate-y-0">
                    <Icon
                      className="w-7 h-7 text-gray-900 mb-5 transition duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100"
                      aria-hidden
                    />
                    <h3 className="text-xl text-gray-900 mb-3 transition duration-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed transition duration-200 group-hover:text-gray-700">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-3">How we work</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">From idea to your home</h2>
            <p className="text-gray-600">
              A simple process focused on craft, clarity, and care at every step.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="group border-t border-gray-900 pt-6 transition duration-200 motion-reduce:transition-none hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
                  <p className="text-sm text-gray-500 mb-3 transition duration-200 group-hover:text-gray-900">
                    {item.step}
                  </p>
                  <h3 className="text-xl text-gray-900 mb-3 transition duration-200">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <HomeCTA />
      </Reveal>
    </main>
  );
}
