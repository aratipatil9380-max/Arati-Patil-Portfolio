import { useEffect, useRef, useState } from 'react';

import { gsap } from '../motion/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * A single, tasteful easter egg: a quiet dot in the footer that reveals a short,
 * factual note. It never intercepts typing or browser shortcuts, and the note is
 * dismissible (button, Escape) and auto-hides.
 */
export function EasterEgg() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Entrance animation (skipped under reduced motion — the note just appears).
  useEffect(() => {
    if (!open || reduced || !boxRef.current) return;
    gsap.fromTo(
      boxRef.current,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' },
    );
  }, [open, reduced]);

  // Escape dismisses.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Auto-hide.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 9000);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="signal-dot"
        aria-label="Reveal a hidden note"
        title="?"
        onClick={() => setOpen(true)}
      />

      {open ? (
        <div className="egg" role="status" ref={boxRef}>
          <p className="egg__eyebrow">Signal found</p>
          <p className="egg__text">
            Hand-built with React, hand-written canvas and SVG, and GSAP. No 3D
            libraries on this page.
          </p>
          <button
            type="button"
            className="egg__close"
            aria-label="Dismiss note"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
