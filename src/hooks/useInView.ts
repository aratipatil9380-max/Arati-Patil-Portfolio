import { useEffect, useRef, useState } from 'react';

type Options = {
  rootMargin?: string;
  threshold?: number;
  /** Stop observing after the first intersection (default: keep tracking). */
  once?: boolean;
};

/**
 * Minimal IntersectionObserver hook. Returns a ref and whether the element is
 * in view. If IntersectionObserver is unavailable the element is treated as
 * permanently visible, so nothing that depends on it is ever hidden.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: Options = {},
) {
  const { rootMargin = '0px', threshold = 0, once = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
}
