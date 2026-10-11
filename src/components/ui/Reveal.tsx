import { createElement } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { gsap } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';

/** Motion treatment for the reveal. */
export type RevealVariant = 'rise' | 'mask' | 'clip' | 'scale' | 'rule' | 'fade';

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render (defaults to a div). */
  as?: ElementType;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Motion variant: rise (default), mask, clip, scale, rule, or fade. */
  variant?: RevealVariant;
  /** Optional link target when rendered as an anchor. */
  href?: string;
  /** Opt this element into the desktop magnetic pull (contextual cursor layer). */
  magnetic?: boolean;
  children?: ReactNode;
};

// Each variant has a distinct entrance language so sections don't all share one
// fade-up: rise (drift up), mask (clip wipe from the baseline), clip (side wipe),
// scale (subtle settle), rule (line draw), fade (opacity only).
const FROM: Record<RevealVariant, gsap.TweenVars> = {
  rise: { y: 40, autoAlpha: 0 },
  fade: { autoAlpha: 0 },
  mask: { clipPath: 'inset(0% 0% 100% 0%)', y: 26 },
  clip: { clipPath: 'inset(0% 100% 0% 0%)' },
  scale: { scale: 0.94, autoAlpha: 0 },
  rule: { scaleX: 0, transformOrigin: 'left center' },
};

const TO: Record<RevealVariant, gsap.TweenVars> = {
  rise: { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
  fade: { autoAlpha: 1, duration: 1, ease: 'power2.out' },
  // End on a slightly larger clip box so descenders/focus rings are never cut.
  mask: {
    clipPath: 'inset(-20% -8% -30% -8%)',
    y: 0,
    duration: 1.05,
    ease: 'power3.out',
  },
  clip: { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: 'power3.out' },
  scale: { scale: 1, autoAlpha: 1, duration: 0.85, ease: 'power3.out' },
  rule: { scaleX: 1, duration: 0.85, ease: 'power3.out' },
};

/**
 * Reveal-on-scroll powered by GSAP ScrollTrigger. Visibility is the CSS default
 * (no hidden state in the stylesheet): the hidden "from" state is only applied
 * by GSAP, inside a `prefers-reduced-motion: no-preference` scope. So without
 * JavaScript, under reduced motion, or if GSAP errors, content stays fully
 * visible — motion is a pure enhancement.
 */
export function Reveal({
  as,
  delay = 0,
  variant = 'rise',
  className,
  style,
  magnetic = false,
  children,
  ...rest
}: RevealProps) {
  const ref = useGsap(
    ({ scope, mm }) => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(scope, { ...FROM[variant] }, {
          ...TO[variant],
          delay: delay / 1000,
          scrollTrigger: {
            trigger: scope,
            start: 'top 86%',
            once: true,
          },
        });
      });
    },
    [variant, delay],
  );

  const classes = ['reveal', `reveal--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return createElement(
    (as ?? 'div') as ElementType,
    {
      ref,
      className: classes,
      style,
      'data-magnetic': magnetic ? '' : undefined,
      ...rest,
    },
    children,
  );
}
