import { useEffect } from 'react';

import { navItems } from '../../data/nav';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';
import { OPEN_PALETTE_EVENT } from '../../experience/CommandPalette';
import { MobileNav } from './MobileNav';

export function SiteNav() {
  // Scroll-progress bar (motion-only enhancement).
  const scope = useGsap<HTMLElement>(({ scope: root, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const bar = root.querySelector('.site-nav__progress');
      if (!bar) return;
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        },
      );
    });
  }, []);

  // Active-section indicator. This is state (not motion), so it runs for
  // everyone, including reduced-motion users.
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        '.site-nav__list a, .mobile-menu__list a',
      ),
    );
    const ctx = gsap.context(() => {
      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            links
              .filter((a) => a.getAttribute('href') === `#${item.id}`)
              .forEach((a) => a.toggleAttribute('data-active', self.isActive));
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header id="top" className="site-nav" ref={scope}>
      <div className="container site-nav__inner">
        <a className="site-nav__brand" href="#top">
          <span className="site-nav__monogram" aria-hidden="true">
            AP
          </span>
          <span className="site-nav__brand-text">Arati Patil</span>
        </a>

        <nav className="site-nav__desktop" aria-label="Primary">
          <ul className="site-nav__list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="site-nav__search"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
          aria-label="Open command palette"
        >
          <span className="site-nav__search-label">Search</span>
          <kbd className="site-nav__kbd" aria-hidden="true">
            ⌘K
          </kbd>
        </button>

        <MobileNav items={navItems} />
      </div>

      <span className="site-nav__progress" aria-hidden="true" />
    </header>
  );
}
