import { profile } from '../../content/profile';
import { links } from '../../data/links';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SignalField } from '../../experience/SignalField';

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          id="contact-title"
          index="07"
          eyebrow="Contact"
          title="Let's build something"
          lede={`Reach ${profile.name} by email, or through GitHub and LinkedIn.`}
          variant="split"
        />

        <div className="contact">
          {/* Finale: the signal from the hero resolves here, behind the email. */}
          <div className="contact__field" aria-hidden="true">
            <SignalField className="contact__signal" intensity={0.6} />
          </div>

          <Reveal
            as="a"
            variant="mask"
            className="contact__email"
            magnetic
            href={links.email}
            aria-label={`Email ${profile.name} at ${links.emailAddress}`}
          >
            {links.emailAddress}
          </Reveal>

          <Reveal as="ul" variant="fade" className="contact__links" delay={110}>
            <li>
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${profile.name} on GitHub (opens in a new tab)`}
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${profile.name} on LinkedIn (opens in a new tab)`}
              >
                LinkedIn
              </a>
            </li>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
