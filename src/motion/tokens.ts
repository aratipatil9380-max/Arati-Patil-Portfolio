// JS-side mirror of the CSS motion tokens (src/styles/tokens.css) so GSAP and
// CSS animations share a single easing/duration scale instead of drifting apart.
export const MOTION = {
  ease: {
    out: 'power3.out',
    soft: 'power2.out',
    inOut: 'power2.inOut',
    expo: 'expo.out',
  },
  dur: {
    fast: 0.18,
    base: 0.35,
    slow: 0.6,
    reveal: 0.9,
    entrance: 1.1,
  },
} as const;
