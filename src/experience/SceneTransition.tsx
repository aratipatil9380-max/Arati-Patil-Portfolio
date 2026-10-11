import { gsap } from '../motion/gsap';
import { useGsap } from '../motion/useGsap';

/**
 * A quiet full-bleed chapter divider that marks the shift between the site's
 * movements ("Lead", "Create"). Decorative and `aria-hidden` — it adds a
 * purposeful scene transition without hiding or duplicating any content.
 */
export function SceneTransition({ label }: { label: string }) {
  const ref = useGsap<HTMLDivElement>(({ scope, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(scope);

      gsap.fromTo(
        q('.scene-band__word'),
        { xPercent: -6, autoAlpha: 0 },
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: scope, start: 'top 90%', once: true },
        },
      );

      gsap.fromTo(
        q('.scene-band__rule'),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power4.out',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: scope, start: 'top 92%', once: true },
        },
      );
    });
  });

  return (
    <div className="scene-band" aria-hidden="true" ref={ref}>
      <div className="container scene-band__inner">
        <span className="scene-band__word">{label}</span>
        <span className="scene-band__rule" />
      </div>
    </div>
  );
}
