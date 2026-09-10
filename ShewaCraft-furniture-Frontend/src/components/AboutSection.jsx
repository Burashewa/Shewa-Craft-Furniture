import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { features, gallery, getAboutStats } from '../data/about';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const hoverReveal =
  'opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100';

function AboutImageGallery() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const count = gallery.length;

  const goTo = (next) => {
    if (count < 1) return;
    setIndex(((next % count) + count) % count);
  };

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || hovered || tabHidden || count < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, hovered, tabHidden, count]);

  const current = gallery[index];

  return (
    <div
      className="relative h-96 rounded-lg overflow-hidden bg-gray-100 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
              : `transition-opacity duration-300 motion-reduce:transition-none ${
                  imageIndex === index ? 'opacity-100' : 'opacity-0'
                }`
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
            aria-label="About images"
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

function formatStat(value, format) {
  if (format === 'decimal') return value.toFixed(1);
  return String(Math.round(value));
}

function useCountUp(target, enabled, duration = 800) {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return undefined;

    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 2;
      setValue(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target, prefersReducedMotion, duration]);

  if (!enabled) return 0;
  if (prefersReducedMotion) return target;
  return value;
}

function AboutStat({ label, value, format, active }) {
  const displayed = useCountUp(value, active);
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl text-gray-900 tabular-nums">
        {formatStat(displayed, format)}
      </p>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  );
}

function AboutStats() {
  const stats = getAboutStats();
  const rowRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-100"
    >
      {stats.map((stat) => (
        <AboutStat
          key={stat.id}
          label={stat.label}
          value={stat.value}
          format={stat.format}
          active={active}
        />
      ))}
    </div>
  );
}

export const AboutSection = forwardRef(function AboutSection(props, ref) {
  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">About ShewaCraft Furniture</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            ShewaCraft Furniture blends traditional craftsmanship with modern design
            to create durable, elegant, and functional furniture for every space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AboutImageGallery />

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

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-gray-200">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group text-center transition duration-200 motion-reduce:transition-none hover:-translate-y-1 motion-reduce:hover:translate-y-0"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    className="w-7 h-7 text-gray-900 transition duration-200 motion-reduce:transition-none group-hover:scale-110 motion-reduce:group-hover:scale-100"
                    aria-hidden
                  />
                </div>
                <h3 className="text-xl mb-2 text-gray-800 transition duration-200 group-hover:text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 transition duration-200 group-hover:text-gray-700">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <AboutStats />
      </div>
    </section>
  );
});
