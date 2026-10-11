import { skills } from '../../content/skills';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { gsap } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';
import { SkillConstellation } from '../../experience/SkillConstellation';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Skills — an editorial index of groups. No percentages, bars, or rankings;
 * each group is tagged as in-use or still being learned.
 *
 * Motion: one coordinated timeline rather than a uniform per-block fade — group
 * heads rise in sequence, their items stagger in after, and notes settle last.
 */
export function Skills() {
  // The constellation is an enhancement: only where a fine pointer and enough
  // width exist. Everywhere else the plain, fully-accessible list is shown.
  const enhance = useMediaQuery('(pointer: fine) and (min-width: 768px)');

  const ref = useGsap(
    ({ scope, mm }) => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The list only exists in the non-enhanced branch.
        if (!scope.querySelector('.skill-list')) return;

        const q = gsap.utils.selector(scope);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: 'top 80%', once: true },
          defaults: { ease: 'power3.out' },
        });

        tl.fromTo(
          q('.skill-group__head'),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12 },
        )
          .fromTo(
            q('.skill-group__items li'),
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.035 },
            0.1,
          )
          .fromTo(
            q('.skill-group__note'),
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 },
            0.2,
          );
      });
    },
    [enhance],
  );

  return (
    <section id="skills" className="section" aria-labelledby="skills-title" ref={ref}>
      <div className="container">
        <SectionHeading
          id="skills-title"
          index="05"
          eyebrow="Skills"
          title="Tools & technologies"
          lede="What I build with, and what I'm still learning."
        />

        {enhance ? (
          <SkillConstellation />
        ) : (
          <div className="skill-list">
            {skills.map((group) => (
              <div key={group.id} className={`skill-group skill-group--${group.stage}`}>
                <div className="skill-group__head">
                  <h3 className="skill-group__label">{group.label}</h3>
                  {group.stage === 'learning' ? (
                    <span className="skill-group__stage">Exploring</span>
                  ) : null}
                </div>

                <ul className="skill-group__items">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                {group.note ? (
                  <p className="skill-group__note">{group.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
