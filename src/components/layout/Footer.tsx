import { profile } from '../../content/profile';
import { links } from '../../data/links';
import { EasterEgg } from '../../experience/EasterEgg';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__concept">{profile.concept.join(' ')}</p>

        <ul className="site-footer__links">
          <li>
            <a href={links.email}>{links.emailAddress}</a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
          </li>
          <li>
            <a href={links.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
          </li>
        </ul>

        <p className="site-footer__meta eyebrow">
          © {year} {profile.name} · {profile.location}
          <EasterEgg />
        </p>
      </div>
    </footer>
  );
}
