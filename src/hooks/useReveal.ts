import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * `idle`  — default, fully visible (content shows even if JS/observation fails).
 * `armed` — hidden, set only once an active IntersectionObserver is attached.
 * `in`    — revealed.
 */
export type RevealState = 'idle' | 'armed' | 'in';

type Options = {
  rootMargin?: string;
  threshold?: number;
  /** Re-hide when the element leaves the viewport. Defaults to reveal-once. */
  once?: boolean;
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Lightweight reveal-on-scroll primitive. Dependency-free.
 *
 * Guarantees:
 * - If the observer is unavailable or the user prefers reduced motion, the
 *   element is left visible (`in`) — content is never hidden permanently.
 * - Content is only hidden (`armed`) after the observer is actually ready, so
 *   nothing is hidden before observation can restore it.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options: Options = {},
) {
  const { rootMargin = '0px 0px -12% 0px', threshold = 0.15, once = true } =
    options;
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<RevealState>('idle');

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setState('in');
      return;
    }

    setState('armed');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('in');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setState('armed');
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, state };
}
