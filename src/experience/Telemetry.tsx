import { useEffect, useRef } from 'react';
import { navItems } from '../data/nav';

/**
 * A small, decorative readout of real state: the section currently in view and
 * the true scroll position. Values are written straight to the DOM on a
 * rAF-throttled scroll listener — no re-renders, no invented data.
 *
 * Desktop-only and `aria-hidden`: it mirrors information the navigation already
 * exposes, so assistive tech is not made to announce a live-changing number.
 */
export function Telemetry() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sectionEl = el.querySelector('[data-telemetry-section]');
    const pctEl = el.querySelector('[data-telemetry-pct]');
    let ticking = false;

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      if (pctEl) pctEl.textContent = `${String(pct).padStart(2, '0')}%`;

      const mid = window.scrollY + window.innerHeight * 0.45;
      let label = navItems[0]?.label ?? '';
      for (const item of navItems) {
        const target = document.getElementById(item.id);
        if (target && target.offsetTop <= mid) label = item.label;
      }
      if (sectionEl) sectionEl.textContent = label;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="telemetry" aria-hidden="true" ref={ref}>
      <span className="telemetry__row">
        <span className="telemetry__key">§</span>
        <span className="telemetry__value" data-telemetry-section>
          Work
        </span>
      </span>
      <span className="telemetry__row">
        <span className="telemetry__key">scroll</span>
        <span className="telemetry__value" data-telemetry-pct>
          00%
        </span>
      </span>
    </div>
  );
}
