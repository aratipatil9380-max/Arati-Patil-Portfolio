import { profile } from '../../content/profile';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';

/**
 * Build · Lead · Create — a decorative editorial marquee that separates the
 * hero from Selected Work. Purely presentational: `aria-hidden` (the words
 * already carry meaning in the hero's chapter index and the page title), and
 * the track pauses on hover/focus and holds still under reduced motion.
 *
 * On top of the CSS loop, GSAP skews the band by scroll velocity so the strip
 * reacts to how fast the page is moving — a small, purposeful transition cue.
 */

/** Two identical groups make the translateX(-50%) loop seamless. */
const copies = [0, 1];

export function Marquee() {
  const ref = useGsap<HTMLDivElement>(({ scope, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const inner = scope.querySelector<HTMLElement>('.marquee__inner');
      if (!inner) return;

      const setSkew = gsap.quickTo(inner, 'skewX', {
        duration: 0.5,
        ease: 'power3',
      });
      let reset: gsap.core.Tween | null = null;

      ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = gsap.utils.clamp(-12, 12, self.getVelocity() / -320);
          setSkew(skew);
          reset?.kill();
          reset = gsap.delayedCall(0.16, () => setSkew(0));
        },
      });
    });
  });

  return (
    <div className="marquee" aria-hidden="true" ref={ref}>
      <div className="marquee__inner">
        <div className="marquee__track">
          {copies.map((copy) => (
            <ul className="marquee__group" key={copy}>
              {profile.concept.map((word) => (
                <li className="marquee__item" key={word}>
                  <span className="marquee__word">{word}</span>
                  <span className="marquee__dot" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
