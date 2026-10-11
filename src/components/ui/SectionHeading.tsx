import { gsap } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';

type SectionHeadingProps = {
  /** id for the <h2>, referenced by the section's aria-labelledby. */
  id: string;
  /** Movement index label, e.g. "01". */
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  /** Editorial two-column masthead at wide viewports (title left, lede right). */
  variant?: 'split';
};

/**
 * A coordinated heading reveal: the accent rule draws in, the eyebrow rises,
 * the title wipes up from behind a mask, and the lede follows. One timeline so
 * the four beats overlap intentionally rather than firing as separate fades.
 */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  lede,
  variant,
}: SectionHeadingProps) {
  const ref = useGsap<HTMLDivElement>(({ scope, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(scope);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope, start: 'top 85%', once: true },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        q('.section-heading__rule'),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power2.inOut' },
      )
        .fromTo(
          q('.section-heading__eyebrow'),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          '-=0.45',
        )
        .fromTo(
          q('.section-heading__title'),
          { clipPath: 'inset(0% 0% 100% 0%)', y: 34 },
          {
            clipPath: 'inset(-20% -8% -30% -8%)',
            y: 0,
            duration: 0.95,
            ease: 'power4.out',
          },
          '-=0.35',
        )
        .fromTo(
          q('.section-heading__lede'),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          '-=0.55',
        );
    });
  });

  return (
    <div
      className={`section-heading${variant ? ` section-heading--${variant}` : ''}`}
      ref={ref}
    >
      <p className="section-heading__eyebrow eyebrow">
        <span className="section-heading__rule" aria-hidden="true" />
        <span className="section-heading__index">{index}</span>
        <span aria-hidden="true">/</span>
        {eyebrow}
      </p>
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
      {lede ? <p className="section-heading__lede measure">{lede}</p> : null}
    </div>
  );
}
