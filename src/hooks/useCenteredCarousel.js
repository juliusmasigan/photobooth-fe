import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Tracks which item in a scrollable carousel is closest to the container's
 * center, so the centered item can be highlighted and the rest dimmed.
 *
 * Works for vertical or horizontal scrolling. With axis 'auto' it scrolls
 * horizontally in landscape and vertically in portrait, following rotation and
 * keeping the active item centered; pair it with Tailwind `landscape:` classes.
 *
 * With `{ loop: true }` the carousel scrolls infinitely: the caller renders
 * the items three times in a row, and the hook keeps the view on the middle
 * copy by silently shifting the scroll position by one copy whenever scrolling
 * settles in the first or last copy. `activeIndex` is the rendered index.
 *
 * Usage:
 *   const { containerRef, activeIndex, setItemRef, scrollToIndex } = useCenteredCarousel(items.length);
 *   <div ref={containerRef}> ... </div>
 *   items.map((item, i) => <div ref={setItemRef(i)} ...>)
 */
export default function useCenteredCarousel(count, axis = 'vertical', { loop = false } = {}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(loop && count > 1 ? count : 0);
  const looping = loop && count > 1;
  const isLandscape = useIsLandscape(axis === 'auto');
  const horizontal = axis === 'horizontal' || (axis === 'auto' && isLandscape);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const setItemRef = useCallback(
    (index) => (el) => {
      itemRefs.current[index] = el;
    },
    []
  );

  // Center the active item before paint: on mount (the first item of the
  // middle copy when looping), when items load, and after the axis flips.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = itemRefs.current[activeIndexRef.current];
    if (!container || !el) return;
    const rect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (horizontal) {
      container.scrollLeft += r.left + r.width / 2 - (rect.left + rect.width / 2);
    } else {
      container.scrollTop += r.top + r.height / 2 - (rect.top + rect.height / 2);
    }
  }, [count, horizontal]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const findCentered = () => {
      const rect = container.getBoundingClientRect();
      const center = horizontal
        ? rect.left + rect.width / 2
        : rect.top + rect.height / 2;

      let best = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = horizontal ? r.left + r.width / 2 : r.top + r.height / 2;
        const dist = Math.abs(c - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    let raf = null;
    const computeActive = () => {
      raf = null;
      setActiveIndex(findCentered());
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(computeActive);
    };

    // Jump back into the middle copy once scrolling has come to rest.
    const recenter = () => {
      const first = itemRefs.current[0];
      const next = itemRefs.current[count];
      if (!first || !next) return;
      const span = horizontal
        ? next.offsetLeft - first.offsetLeft
        : next.offsetTop - first.offsetTop;
      const index = findCentered();
      const shift = index < count ? span : index >= 2 * count ? -span : 0;
      if (!shift) return;
      if (horizontal) container.scrollLeft += shift;
      else container.scrollTop += shift;
      setActiveIndex(findCentered());
    };

    let settleTimer = null;
    const supportsScrollEnd = 'onscrollend' in window;
    const onScrollSettle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(recenter, 120);
    };

    computeActive();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (looping) {
      if (supportsScrollEnd) container.addEventListener('scrollend', recenter);
      else container.addEventListener('scroll', onScrollSettle, { passive: true });
    }
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      container.removeEventListener('scrollend', recenter);
      container.removeEventListener('scroll', onScrollSettle);
      clearTimeout(settleTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, horizontal, looping]);

  // Scroll so the item at the given rendered index sits in the center.
  const scrollToIndex = useCallback(
    (index, behavior = 'smooth') => {
      const container = containerRef.current;
      const el = itemRefs.current[index];
      if (!container || !el) return;
      const rect = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (horizontal) {
        container.scrollBy({ left: r.left + r.width / 2 - (rect.left + rect.width / 2), behavior });
      } else {
        container.scrollBy({ top: r.top + r.height / 2 - (rect.top + rect.height / 2), behavior });
      }
    },
    [horizontal]
  );

  return { containerRef, activeIndex, setItemRef, scrollToIndex };
}

const landscapeQuery = '(orientation: landscape)';

// Tracks whether the screen is landscape, using the same media query as
// Tailwind's `landscape:` variant so the JS axis and the CSS agree.
export function useIsLandscape(enabled = true) {
  const [isLandscape, setIsLandscape] = useState(
    () => enabled && window.matchMedia(landscapeQuery).matches
  );

  useEffect(() => {
    if (!enabled) return;
    const mql = window.matchMedia(landscapeQuery);
    const onChange = () => setIsLandscape(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [enabled]);

  return isLandscape;
}
