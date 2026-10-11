import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';

type MatchMedia = ReturnType<typeof gsap.matchMedia>;

type SetupArgs = {
  /** The scoping element — use as the selector root for `gsap.utils.toArray`. */
  scope: HTMLElement;
  /** Add media conditions here; all motion created inside is auto-reverted. */
  mm: MatchMedia;
};

/**
 * Runs a GSAP setup once per mount inside a `gsap.matchMedia()` scope, so every
 * tween / ScrollTrigger created inside is automatically reverted on unmount
 * (StrictMode-safe, no leaks).
 *
 * Contract: register ALL motion inside `mm.add('(prefers-reduced-motion: no-preference)', …)`.
 * When that condition is false (or JS/GSAP never runs) nothing is applied and
 * the CSS base state — fully visible — stands. A setup error also reverts and
 * clears inline styles so content can never be left hidden.
 */
export function useGsap<T extends HTMLElement = HTMLElement>(
  setup: (args: SetupArgs) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scopeRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia();
    try {
      setup({ scope, mm });
    } catch (error) {
      // Never strand content hidden because of a setup failure.
      console.error('[motion] setup failed', error);
      mm.revert();
      gsap.set(scope.querySelectorAll('*'), { clearProps: 'all' });
    }

    // Element + font layout can still settle after mount; recalc trigger points.
    ScrollTrigger.refresh();

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
