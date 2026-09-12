import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.div;

const GAP_PX = 32;
const SPEED_PX_PER_SEC = 36;
const NUDGE_SECONDS = 0.45;
const NUDGE_EASE = [0.22, 1, 0.36, 1];

function normalizeX(value, setWidth) {
  if (setWidth <= 0) return 0;
  let next = value % setWidth;
  if (next > 0) next -= setWidth;
  if (next <= -setWidth + 0.5) return 0;
  return next;
}

function resolveVisibleCount(breakpoints) {
  const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  for (const point of sorted) {
    if (window.matchMedia(`(min-width: ${point.minWidth}px)`).matches) {
      return Math.max(1, point.count);
    }
  }
  return 1;
}

export function ConveyorSlider({
  items,
  getKey,
  renderItem,
  visibleAt,
  ariaLabel,
  previousLabel,
  nextLabel,
  dotsLabel,
  itemLabel,
  fallback,
  overflowOnly = false,
}) {
  const prefersReducedMotion = useReducedMotion();
  const count = items.length;
  const itemKeys = items.map(getKey).join('|');
  const slides = useMemo(() => [...items, ...items], [items]);
  const [visibleCount, setVisibleCount] = useState(() =>
    typeof window === 'undefined' ? 1 : resolveVisibleCount(visibleAt)
  );
  const canAnimate =
    !prefersReducedMotion && count > (overflowOnly ? visibleCount : 1);

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

  useLayoutEffect(() => {
    const updateVisible = () => setVisibleCount(resolveVisibleCount(visibleAt));
    updateVisible();
    const media = visibleAt.map((point) =>
      window.matchMedia(`(min-width: ${point.minWidth}px)`)
    );
    media.forEach((query) => query.addEventListener('change', updateVisible));
    return () => {
      media.forEach((query) => query.removeEventListener('change', updateVisible));
    };
  }, [visibleAt]);

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
    if (!viewport || !canAnimate) return undefined;

    const measure = () => {
      const viewportWidth = viewport.clientWidth;
      const visible = resolveVisibleCount(visibleAt);
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

    const media = visibleAt.map((point) =>
      window.matchMedia(`(min-width: ${point.minWidth}px)`)
    );
    media.forEach((query) => query.addEventListener('change', measure));

    return () => {
      observer.disconnect();
      media.forEach((query) => query.removeEventListener('change', measure));
    };
  }, [canAnimate, count, visibleAt]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !canAnimate) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [canAnimate]);

  useEffect(() => {
    const onVisibility = () => {
      setHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!step || !setWidth || !count) return undefined;
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

  useEffect(() => {
    x.set(0);
    setActiveDot(0);
  }, [itemKeys, x]);

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

  if (!canAnimate) {
    return fallback ?? null;
  }

  return (
    <div ref={sectionRef}>
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
          aria-label={ariaLabel}
          aria-live="off"
        >
          <MotionDiv className="flex" style={{ x, gap: GAP_PX }}>
            {slides.map((item, slideIndex) => (
              <div
                key={`${getKey(item)}-${slideIndex}`}
                className="flex-none"
                style={{ width: cardWidth || '100%' }}
              >
                {renderItem(item, slideIndex)}
              </div>
            ))}
          </MotionDiv>
        </div>

        <button
          type="button"
          onClick={() => nudgeBy(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-4 inline-flex items-center justify-center w-11 h-11 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          aria-label={previousLabel}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => nudgeBy(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-4 inline-flex items-center justify-center w-11 h-11 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          aria-label={nextLabel}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label={dotsLabel}>
        {items.map((item, dotIndex) => {
          const active = activeDot === dotIndex;
          return (
            <button
              key={getKey(item)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={itemLabel(item, dotIndex)}
              onClick={() => goToDot(dotIndex)}
              className={`h-2.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                active ? 'w-6 bg-gray-900' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
