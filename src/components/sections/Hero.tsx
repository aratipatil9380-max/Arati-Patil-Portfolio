import { profile } from '../../content/profile';
import { gsap } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';
import { SignalField } from '../../experience/SignalField';

const nameLines = profile.name.split(' ');
const chapters = profile.concept;

/**
 * Hero — the opening statement of the site.
 *
 * Motion (all GSAP, all inside a reduced-motion:no-preference scope):
 *  1. a quick page-entry curtain that wipes up (not a loading screen),
 *  2. a mask + character stagger for the name, with the eyebrow, supporting
 *     copy, CTAs, chapter labels and divider entering on an overlapped timeline,
 *  3. a scrubbed exit where the type, the supporting column and the background
 *     layers move at deliberately different rates.
 *
 * The accessible name lives on the <h1 aria-label>; the split characters are
 * aria-hidden so screen readers still read "Arati Patil".
 */
export function Hero() {
  const scope = useGsap(({ scope: root, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);
      const chars = q('.hero__char');

      // --- Entrance -----------------------------------------------------
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance
        .fromTo(
          q('.hero__curtain'),
          { yPercent: 0 },
          { yPercent: -100, duration: 0.85, ease: 'power4.inOut' },
        )
        .from(
          chars,
          {
            yPercent: 118,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.028,
          },
          '-=0.5',
        )
        .from(q('.hero__eyebrow'), { autoAlpha: 0, y: 14, duration: 0.7 }, '-=0.85')
        .from(q('.hero__descriptor'), { autoAlpha: 0, y: 18, duration: 0.7 }, '-=0.62')
        .from(q('.hero__intro'), { autoAlpha: 0, y: 18, duration: 0.7 }, '-=0.56')
        .from(
          q('.hero__actions > *'),
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 },
          '-=0.56',
        )
        .from(
          q('.chapter'),
          { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.12 },
          '-=0.6',
        )
        .from(
          q('.chapter__rule'),
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.7,
            stagger: 0.12,
          },
          '<',
        )
        .from(
          q('.hero__divider'),
          { scaleX: 0, transformOrigin: 'left center', duration: 0.9 },
          '-=0.7',
        );

      // --- Exit / parallax (scrubbed) -----------------------------------
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
        .to(q('.hero__bg-glow'), { yPercent: 28, ease: 'none' }, 0)
        .to(q('.hero__bg-grid'), { yPercent: 12, ease: 'none' }, 0)
        .to(q('.hero__signal'), { yPercent: 18, autoAlpha: 0, ease: 'none' }, 0)
        .to(q('.hero__title'), { yPercent: -16, autoAlpha: 0, ease: 'none' }, 0)
        .to(
          q('.hero__eyebrow, .hero__descriptor, .hero__intro, .hero__actions'),
          { y: -80, autoAlpha: 0, ease: 'none' },
          0.04,
        )
        .to(q('.hero__chapters'), { y: -120, autoAlpha: 0, ease: 'none' }, 0.08)
        .to(q('.hero__divider'), { y: -24, ease: 'none' }, 0);
    });
  });

  return (
    <section
      id="hero"
      className="section hero"
      aria-labelledby="hero-title"
      ref={scope}
    >
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__bg-grid" />
        <span className="hero__bg-glow" />
        <span className="hero__bg-grain" />
        <SignalField />
      </div>

      <div className="container hero__grid">
        <div className="hero__lead">
          <p className="eyebrow hero__eyebrow">{profile.tagline}</p>

          <h1 id="hero-title" className="hero__title" aria-label={profile.name}>
            {nameLines.map((line) => (
              <span className="hero__title-line" key={line} aria-hidden="true">
                <span className="hero__title-mask">
                  {Array.from(line).map((char, i) => (
                    <span className="hero__char" key={`${char}-${i}`}>
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero__descriptor">{profile.role}</p>
          <p className="hero__intro measure">{profile.intro}</p>

          <div className="hero__actions">
            <a className="button" href="#work">
              Explore my work
            </a>
            <a className="button button--ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>

        <ol className="hero__chapters" aria-label="Three movements">
          {chapters.map((word) => (
            <li className="chapter" key={word}>
              <span className="chapter__word">{word}</span>
              <span className="chapter__rule" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <span className="hero__divider" aria-hidden="true" />
      </div>

      <span className="hero__curtain" aria-hidden="true" />
    </section>
  );
}
