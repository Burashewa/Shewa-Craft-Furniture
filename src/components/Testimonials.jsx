import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { testimonials } from '../data/testimonials';

const MotionDiv = motion.div;

const GAP_PX = 32;
const SPEED_PX_PER_SEC = 36;
const NUDGE_SECONDS = 0.45;
const MD_QUERY = '(min-width: 768px)';
const NUDGE_EASE = [0.22, 1, 0.36, 1];

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm h-full">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star
            key={index}
            className="w-5 h-5 fill-gray-900 text-gray-900"
          />
        ))}
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div>
        <p className="text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
  );
}

function TestimonialsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}

function normalizeX(value, setWidth) {
  if (setWidth <= 0) return 0;
  let next = value % setWidth;
  if (next > 0) next -= setWidth;
  if (next <= -setWidth + 0.5) return 0;
  return next;
}

function SectionHeading() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl text-gray-900 mb-4">What Our Customers Say</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Real stories from people who furnished their spaces with ShewaCraft
      </p>
    </div>
  );
}

export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const count = testimonials.length;
  const slides = [...testimonials, ...testimonials];

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const animationRef = useRef(null);
  const runningRef = useRef(false);

  const x = useMotionValue(0);

  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [step, setStep] = useState(0);
  const [setWidth, setSetWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  const canAnimate = !prefersReducedMotion && count > 1;
  const shouldRun = canAnimate && inView && !hovered && !hidden && setWidth > 0;

  const stopConveyor = () => {
    animationRef.current?.stop();
    animationRef.current = null;
  };

  const startConveyor = () => {
    if (!runningRef.current || setWidth <= 0) return;
    stopConveyor();
    const from = normalizeX(x.get(), setWidth);
    x.set(from);
    animationRef.current = animate(x, from - setWidth, {
      duration: setWidth / SPEED_PX_PER_SEC,
      ease: 'linear',
      onComplete: () => {
        x.set(from);
        if (runningRef.current) startConveyor();
      },
    });
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || prefersReducedMotion) return undefined;

    const measure = () => {
      const viewportWidth = viewport.clientWidth;
      const visible = window.matchMedia(MD_QUERY).matches ? 3 : 1;
      const nextCardWidth =
        visible === 1
          ? viewportWidth
          : (viewportWidth - GAP_PX * (visible - 1)) / visible;
      const nextStep = nextCardWidth + GAP_PX;
      setCardWidth(nextCardWidth);
      setStep(nextStep);
      setSetWidth(count * nextStep);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [prefersReducedMotion, count]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const onVisibility = () => {
      setHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!step || !setWidth) return undefined;
    return x.on('change', (value) => {
      const offset = Math.abs(normalizeX(value, setWidth));
      setActiveDot(Math.round(offset / step) % count);
    });
  }, [x, step, setWidth, count]);

  useEffect(() => {
    runningRef.current = shouldRun;
    if (shouldRun) {
      startConveyor();
    } else {
      stopConveyor();
    }
    return stopConveyor;
    // startConveyor reads latest setWidth/x via closure when this effect re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart only when run conditions change
  }, [shouldRun, setWidth]);

  const nudgeBy = (direction) => {
    if (!setWidth || !step) return;
    stopConveyor();

    let from = normalizeX(x.get(), setWidth);
    let target = from - direction * step;

    if (direction > 0 && target < -setWidth) {
      from += setWidth;
      x.set(from);
      target = from - step;
    } else if (direction < 0 && target > 0) {
      from -= setWidth;
      x.set(from);
      target = from + step;
    }

    animationRef.current = animate(x, target, {
      duration: NUDGE_SECONDS,
      ease: NUDGE_EASE,
      onComplete: () => {
        x.set(normalizeX(target, setWidth));
        if (runningRef.current) startConveyor();
      },
    });
  };

  const goToDot = (dotIndex) => {
    if (!setWidth || !step) return;
    stopConveyor();
    const target = normalizeX(-dotIndex * step, setWidth);
    animationRef.current = animate(x, target, {
      duration: NUDGE_SECONDS,
      ease: NUDGE_EASE,
      onComplete: () => {
        x.set(target);
        if (runningRef.current) startConveyor();
      },
    });
  };

  if (prefersReducedMotion) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading />
          <TestimonialsGrid />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading />

        <div
          className="relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setHovered(false);
            }
          }}
        >
          <div
            ref={viewportRef}
            className="overflow-hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
            aria-live="off"
          >
            <MotionDiv className="flex" style={{ x, gap: GAP_PX }}>
              {slides.map((testimonial, slideIndex) => (
                <div
                  key={`${testimonial.id}-${slideIndex}`}
                  className="flex-none"
                  style={{ width: cardWidth || '100%' }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </MotionDiv>
          </div>

          <button
            type="button"
            onClick={() => nudgeBy(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-4 inline-flex items-center justify-center w-11 h-11 bg-white border border-gray-200 shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => nudgeBy(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-4 inline-flex items-center justify-center w-11 h-11 bg-white border border-gray-200 shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonials">
          {testimonials.map((testimonial, dotIndex) => {
            const active = activeDot === dotIndex;
            return (
              <button
                key={testimonial.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Go to testimonial ${dotIndex + 1}`}
                onClick={() => goToDot(dotIndex)}
                className={`h-2.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                  active ? 'w-6 bg-gray-900' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
