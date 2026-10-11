import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../motion/gsap';
import { OPEN_PALETTE_EVENT } from '../../experience/CommandPalette';
import type { NavItem } from '../../data/nav';

const PANEL_ID = 'mobile-menu';

/**
 * Mobile menu: a labelled toggle plus a panel with clear open/closed states.
 * - Escape closes and returns focus to the toggle.
 * - Focus moves into the menu when it opens.
 * - Selecting a link closes the menu.
 * - Background scroll is locked while open.
 */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
  }, [open]);

  // Entrance transition for the panel and its links (skipped under reduced
  // motion, where the panel simply appears).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const links = panel.querySelectorAll('.mobile-menu__list a');
    const tl = gsap.timeline();
    tl.fromTo(
      panel,
      { autoAlpha: 0, y: -14 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
    ).fromTo(
      links,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.045, ease: 'power2.out' },
      '-=0.12',
    );

    return () => {
      tl.revert();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        ref={buttonRef}
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nav-toggle__bars" aria-hidden="true" />
      </button>

      <div id={PANEL_ID} ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="mobile-menu__search"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
                }}
              >
                Search
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
