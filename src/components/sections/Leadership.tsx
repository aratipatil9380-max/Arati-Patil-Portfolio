import { useEffect } from 'react';
import { roles } from '../../content/roles';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';
import { OrbitalSculpture } from '../../experience/OrbitalSculpture';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Leadership — role timeline. The accent rail draws down as the section moves
 * through the viewport (scrubbed, so it tracks the reader) while each role
 * entry staggers in.
 */
export function Leadership() {
  const ref = useGsap(({ scope, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(scope);
      gsap.fromTo(
        q('.role-timeline__rail'),
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
          },
        },
      );
    });
  });

  // Scroll-reactive highlight: the role currently crossing the reader lights up.
  // Metadata, not motion — runs regardless of reduced-motion preference.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const entries = Array.from(root.querySelectorAll<HTMLElement>('.role-entry'));
    if (!entries.length) return;

    const triggers = entries.map((entry) =>
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 62%',
        end: 'bottom 42%',
        onToggle: (self) => entry.toggleAttribute('data-active', self.isActive),
      }),
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [ref]);

  return (
    <section
      id="leadership"
      className="section"
      aria-labelledby="leadership-title"
      ref={ref}
    >
      <div className="container">
        <SectionHeading
          id="leadership-title"
          index="03"
          eyebrow="Leadership"
          title="Community & roles"
          lede="Student leadership, community work, and technical committees."
        />

        <div className="section__block sculpture-block">
          <OrbitalSculpture />
        </div>

        <div className="section__block">
          <span className="role-timeline__rail" aria-hidden="true" />
          <ol className="role-timeline">
            {roles.map((role, i) => (
              <Reveal
                as="li"
                key={role.id}
                delay={i * 90}
                className={
                  role.current ? 'role-entry role-entry--current' : 'role-entry'
                }
              >
                <p className="role-entry__meta">
                  {role.kind ? (
                    <span className="role-entry__kind">{role.kind}</span>
                  ) : null}
                  {role.kind && role.period ? (
                    <span className="role-entry__sep" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  {role.period ? (
                    <span className="role-entry__period">{role.period}</span>
                  ) : null}
                </p>
                <h3 className="role-entry__title">{role.role}</h3>
                <p className="role-entry__org">{role.org}</p>
                {role.detail ? (
                  <p className="role-entry__detail">{role.detail}</p>
                ) : null}
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
