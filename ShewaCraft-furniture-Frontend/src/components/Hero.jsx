import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_INTERVAL_MS, heroSlides } from '../data/hero';

const MotionButton = motion.button;
const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

const hoverReveal =
  'opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100';

function fadeUp(delay) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  };
}

function stackLayerClass(active, isFirst, prefersReducedMotion) {
  return `${isFirst ? 'relative' : 'absolute inset-0'} ${
    active ? '' : 'pointer-events-none'
  } ${
    prefersReducedMotion
      ? active
        ? 'opacity-100'
        : 'opacity-0'
      : `transition-opacity duration-700 motion-reduce:transition-none ${
          active ? 'opacity-100' : 'opacity-0'
        }`
  }`;
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const count = heroSlides.length;
  const current = heroSlides[index];

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
      setIndex((currentIndex) => (currentIndex + 1) % count);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, hovered, tabHidden, count]);

  const scrollToNext = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const intro = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : null;

  return (
    <section
      ref={sectionRef}
      className="relative h-[90vh] mt-16 overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-roledescription="carousel"
      aria-label="Featured interiors"
    >
      <div className="absolute inset-0 bg-gray-900">
        {heroSlides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 overflow-hidden ${
                prefersReducedMotion
                  ? active
                    ? 'opacity-100'
                    : 'opacity-0'
                  : `transition-opacity duration-700 motion-reduce:transition-none ${
                      active ? 'opacity-100' : 'opacity-0'
                    }`
              }`}
              aria-hidden={!active}
            >
              <img
                src={slide.image}
                alt={active ? slide.alt : ''}
                className={`w-full h-full object-cover object-center motion-reduce:transform-none ${
                  prefersReducedMotion
                    ? ''
                    : `ease-out ${
                        active
                          ? 'scale-105 transition-transform duration-6000'
                          : 'scale-100 transition-none'
                      }`
                }`}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl w-full">
          <MotionDiv {...(intro ?? fadeUp(0))}>
            <div className="relative" aria-live="polite">
              {heroSlides.map((slide, slideIndex) => {
                const active = slideIndex === index;
                return (
                  <h1
                    key={slide.heading}
                    className={`text-5xl sm:text-6xl lg:text-7xl text-white mb-6 ${stackLayerClass(
                      active,
                      slideIndex === 0,
                      prefersReducedMotion
                    )}`}
                    aria-hidden={!active}
                  >
                    {slide.heading}
                  </h1>
                );
              })}
            </div>
          </MotionDiv>

          <MotionDiv className="mb-8" {...(intro ?? fadeUp(0.12))}>
            <div className="relative">
              {heroSlides.map((slide, slideIndex) => {
                const active = slideIndex === index;
                return (
                  <p
                    key={slide.heading}
                    className={`text-xl text-white/90 max-w-lg ${stackLayerClass(
                      active,
                      slideIndex === 0,
                      prefersReducedMotion
                    )}`}
                    aria-hidden={!active}
                  >
                    {slide.description}
                  </p>
                );
              })}
            </div>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col sm:flex-row gap-4"
            {...(intro ?? fadeUp(0.24))}
          >
            <Link
              to="/products"
              className="group/cta px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 hover:-translate-y-0.5 transition duration-200 motion-reduce:transform-none flex items-center justify-center gap-2"
            >
              Shop Collection
              <ArrowRight
                className="w-5 h-5 transition duration-200 group-hover/cta:translate-x-0.5 motion-reduce:group-hover/cta:translate-x-0"
                aria-hidden
              />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-md hover:bg-white/10 hover:-translate-y-0.5 transition duration-200 motion-reduce:transform-none flex items-center justify-center"
            >
              Learn More
            </Link>
          </MotionDiv>

          {count > 1 && (
            <div
              className="mt-8 flex gap-1.5"
              role="tablist"
              aria-label="Hero slides"
            >
              {heroSlides.map((slide, slideIndex) => (
                <button
                  key={slide.image}
                  type="button"
                  role="tab"
                  aria-selected={index === slideIndex}
                  title={slide.heading}
                  aria-label={`Show slide ${slideIndex + 1} of ${count}: ${slide.heading}`}
                  onClick={() => goTo(slideIndex)}
                  className={`h-1.5 rounded-full transition duration-200 ${focusRing} ${
                    index === slideIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            title="Previous slide"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition duration-200 motion-reduce:transition-none ${hoverReveal} ${focusRing}`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            title="Next slide"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition duration-200 motion-reduce:transition-none ${hoverReveal} ${focusRing}`}
          >
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
        </>
      )}

      <p className="sr-only" aria-live="polite">
        {current?.heading}
      </p>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <MotionButton
          type="button"
          onClick={scrollToNext}
          aria-label="Scroll to next section"
          className={`${focusRing} rounded-full`}
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-2 bg-white/50 rounded-full" />
          </div>
        </MotionButton>
      </div>
    </section>
  );
}
