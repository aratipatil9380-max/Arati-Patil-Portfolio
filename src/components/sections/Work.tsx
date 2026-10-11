import { projects } from '../../content/projects';
import { ProjectField } from '../../experience/ProjectField';
import { gsap } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/** Each featured project reacts in a way that echoes its subject. */
const FIELD_VARIANT: Record<string, 'network' | 'lattice'> = {
  epivet: 'network',
  'rsa-cryptography': 'lattice',
};

/**
 * Selected Work. Two projects get a large, image-led feature treatment that
 * alternates sides; any remaining projects fall into a compact index row so the
 * section never becomes three identical cards.
 *
 * Motion: each feature wipes its image in, lifts its info column in sequence,
 * and drifts the image at a slower rate than the page for a sense of depth.
 * The drift animates a wrapper, leaving the CSS hover zoom on the image free.
 */
export function Work() {
  const numbered = projects.map((project, i) => ({
    project,
    number: String(i + 1).padStart(2, '0'),
  }));

  const featured = numbered.filter(({ project }) => project.featured);
  const rest = numbered.filter(({ project }) => !project.featured);

  const scope = useGsap(({ scope: root, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);

      q('.project').forEach((project) => {
        const body = project as HTMLElement;
        const frame = body.querySelector('.project__shot-wrap');
        const shot = body.querySelector('.project__shot');
        const info = body.querySelectorAll('.project__info > *');
        if (!frame || !shot) return;

        gsap.fromTo(
          frame,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'power4.out',
            scrollTrigger: { trigger: body, start: 'top 82%', once: true },
          },
        );

        gsap.fromTo(
          info,
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.12,
            scrollTrigger: { trigger: body, start: 'top 78%', once: true },
          },
        );

        gsap.fromTo(
          frame,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: body,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    });
  }, []);

  return (
    <section id="work" className="section" aria-labelledby="work-title" ref={scope}>
      <div className="container">
        <SectionHeading
          id="work-title"
          index="01"
          eyebrow="Work"
          title="Selected work"
          lede="Projects I built solo or as part of a team, each with a public link or a clearly labelled team context."
          variant="split"
        />
      </div>

      <div className="work-features">
        {featured.map(({ project, number }, i) => (
          <article
            key={project.id}
            className={`project container container--wide${
              i % 2 === 1 ? ' project--reverse' : ''
            }`}
            aria-labelledby={`${project.id}-title`}
          >
            <div className="project__media" data-cursor={project.name}>
              <span className="project__shot-wrap">
                <img
                  className="project__shot"
                  src={project.image}
                  alt={project.imageAlt ?? ''}
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              {project.image ? (
                <ProjectField variant={FIELD_VARIANT[project.id] ?? 'network'} />
              ) : null}
            </div>

            <div className="project__info">
              <p className="project__meta">
                <span className="project__index">{number}</span>
                <span>{project.category}</span>
                <span className="project__ownership">
                  {project.ownership === 'solo' ? 'Solo' : 'Team'}
                </span>
              </p>

              <h3 id={`${project.id}-title`} className="project__name">
                {project.name}
              </h3>

              <p className="project__summary measure">{project.summary}</p>

              {project.contribution ? (
                <p className="project__contribution">
                  <span className="project__label">Contribution</span>
                  {project.contribution}
                </p>
              ) : null}

              <ul className="project__tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <p className="project__links">
                {project.live ? (
                  <a
                    className="project__link"
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${project.name} — live site (opens in a new tab)`}
                  >
                    Live site <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {project.repo ? (
                  <a
                    className="project__link"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${project.name} — source repository (opens in a new tab)`}
                  >
                    Source <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </p>

              {project.unverified && project.note ? (
                <p className="flag">Unverified — {project.note}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {rest.length ? (
        <div className="container">
          <ul className="work-index">
            {rest.map(({ project, number }, i) => (
              <Reveal
                as="li"
                key={project.id}
                variant="scale"
                delay={i * 70}
                className="work-index__item"
              >
                <p className="work-index__meta">
                  <span className="project__index">{number}</span>
                  <span>{project.category}</span>
                </p>
                <h3 className="work-index__name">{project.name}</h3>
                <p className="work-index__summary measure">{project.summary}</p>
                <p className="work-index__ownership eyebrow">
                  {project.ownership === 'team' ? 'Team project' : 'Solo'}
                  {project.context ? ` · ${project.context}` : ''}
                </p>
                {project.unverified && project.note ? (
                  <p className="flag">Unverified — {project.note}</p>
                ) : null}
              </Reveal>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
