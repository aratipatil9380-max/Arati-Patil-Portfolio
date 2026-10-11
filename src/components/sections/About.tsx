import { profile } from '../../content/profile';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * About — an editorial, typography-led introduction. The prose is a two-column
 * layout pairing a lead paragraph with a hairline-ruled fact list. The academic
 * figures shown here (CGPA, pre-university percentage) were confirmed accurate
 * by Arati.
 */
export function About() {
  const { education, interests, about } = profile;

  return (
    <section id="about" className="section section--alt" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          id="about-title"
          index="04"
          eyebrow="About"
          title="Background"
          lede="Where I study, what I build, and what I'm curious about."
          variant="split"
        />

        <div className="about-grid">
          <div className="about__prose">
            {about.map((paragraph, i) => (
              <Reveal
                as="p"
                key={paragraph}
                delay={i * 90}
                className={i === 0 ? 'about__lead' : undefined}
              >
                {paragraph}
              </Reveal>
            ))}
          </div>

          <dl className="about__facts">
            <Reveal as="div" className="about__fact">
              <dt>Education</dt>
              <dd>{education.degree}</dd>
            </Reveal>
            <Reveal as="div" delay={70} className="about__fact">
              <dt>Institution</dt>
              <dd>{education.institution}</dd>
            </Reveal>
            {education.cgpa ? (
              <Reveal as="div" delay={105} className="about__fact">
                <dt>CGPA</dt>
                <dd>{education.cgpa}</dd>
              </Reveal>
            ) : null}
            {education.puPercentage ? (
              <Reveal as="div" delay={140} className="about__fact">
                <dt>Pre-university</dt>
                <dd>{education.puPercentage}</dd>
              </Reveal>
            ) : null}
            <Reveal as="div" delay={175} className="about__fact">
              <dt>Interests</dt>
              <dd>{interests.join(' · ')}</dd>
            </Reveal>
          </dl>
        </div>
      </div>
    </section>
  );
}
