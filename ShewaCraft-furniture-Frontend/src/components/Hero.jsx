import { useMemo, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_INTERVAL_MS, heroSlides } from '../data/hero';
import { useCatalog } from '../context/CatalogContext';

const MotionButton = motion.button;
const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

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
  const { products } = useCatalog();
  const count = heroSlides.length;
  const current = heroSlides[index];
  const catalogProduct = useMemo(
    () =>
      products.find((product) => product.featured && product.images?.[0]) ||
      products.find((product) => product.images?.[0]),
    [products]
  );
  const catalogImage = catalogProduct?.images?.[0];

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
      className="relative h-screen min-h-[90vh] overflow-hidden group"
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
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start text-center pt-20 sm:pt-24 pb-36 min-w-0">
        <MotionDiv className="w-full max-w-5xl min-w-0" {...(intro ?? fadeUp(0))}>
          <div className="relative" aria-live="polite">
            {heroSlides.map((slide, slideIndex) => {
              const active = slideIndex === index;
              return (
                <h1
                  key={slide.heading}
                  className={`mx-auto w-full max-w-[16rem] sm:max-w-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9] ${stackLayerClass(
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
      </div>

      <div className="absolute inset-x-0 bottom-16 sm:bottom-20 z-10 px-4 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-4 min-w-0">
          <MotionDiv className="min-w-0 max-w-44 sm:max-w-xs text-left" {...(intro ?? fadeUp(0.12))}>
            <div className="relative">
              {heroSlides.map((slide, slideIndex) => {
                const active = slideIndex === index;
                return (
                  <p
                    key={slide.heading}
                    className={`text-sm text-white/90 leading-relaxed ${stackLayerClass(
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
            {count > 1 && (
              <div
                className="mt-4 flex gap-1.5"
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
          </MotionDiv>

          {catalogImage && (
            <MotionDiv className="shrink-0" {...(intro ?? fadeUp(0.24))}>
              <Link
                to="/products"
                className={`group/catalog block w-32 sm:w-40 md:w-44 lg:w-48 bg-white p-2.5 sm:p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 motion-reduce:transform-none ${focusRing}`}
              >
                <div className="flex items-center justify-end gap-1 text-[10px] sm:text-xs text-gray-900 mb-2">
                  <span>Shop Collection</span>
                  <ArrowRight
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition duration-200 group-hover/catalog:translate-x-0.5 motion-reduce:group-hover/catalog:translate-x-0"
                    aria-hidden
                  />
                </div>
                <img
                  src={catalogImage}
                  alt={catalogProduct.name || 'Shop collection'}
                  className="w-full aspect-square object-cover"
                />
              </Link>
            </MotionDiv>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {current?.heading}
      </p>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
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
