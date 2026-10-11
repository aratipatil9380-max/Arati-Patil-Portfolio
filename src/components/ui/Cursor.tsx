import { gsap } from '../../motion/gsap';
import { useGsap } from '../../motion/useGsap';

/**
 * Desktop refinement layer: a small custom cursor that grows into a contextual
 * label over project media, plus a light magnetic pull on the primary CTA
 * buttons only.
 *
 * Everything is gated behind `(pointer: fine)` AND `prefers-reduced-motion:
 * no-preference`, so touch devices, reduced-motion users, and no-JS/errored-JS
 * visitors keep the untouched native experience. The cursor is
 * `pointer-events: none` and never intercepts clicks, selection, or focus.
 */
export function Cursor() {
  const ref = useGsap<HTMLDivElement>(({ scope, mm }) => {
    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const root = document.documentElement;
      root.classList.add('has-cursor');

      const dot = scope;
      const label = scope.querySelector<HTMLElement>('.cursor__label');
      const cleanups: Array<() => void> = [];

      gsap.set(dot, { xPercent: -50, yPercent: -50 });

      const setX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
      const setY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
      const onMove = (event: PointerEvent) => {
        setX(event.clientX);
        setY(event.clientY);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      cleanups.push(() => window.removeEventListener('pointermove', onMove));

      // Contextual label over [data-cursor] targets (project media).
      const targets = gsap.utils.toArray<HTMLElement>('[data-cursor]');
      const onEnter = (event: Event) => {
        const el = event.currentTarget as HTMLElement;
        if (label) label.textContent = el.dataset.cursor ?? '';
        dot.classList.add('is-active');
      };
      const onLeave = () => dot.classList.remove('is-active');
      targets.forEach((el) => {
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointerleave', onLeave);
        });
      });

      // Magnetic pull on the primary CTA buttons (and the contact email, more
      // gently — a single quiet action, travel capped so nothing drifts away).
      const magnets = gsap.utils.toArray<HTMLElement>('.button, [data-magnetic]');
      magnets.forEach((el) => {
        const gentle = el.hasAttribute('data-magnetic') && !el.classList.contains('button');
        const strength = gentle ? 0.1 : 0.28;
        const limit = gentle ? 18 : 60;
        const moveX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
        const moveY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
        const onPointerMove = (event: PointerEvent) => {
          const r = el.getBoundingClientRect();
          moveX(gsap.utils.clamp(-limit, limit, (event.clientX - (r.left + r.width / 2)) * strength));
          moveY(gsap.utils.clamp(-limit, limit, (event.clientY - (r.top + r.height / 2)) * strength));
        };
        const reset = () => {
          moveX(0);
          moveY(0);
        };
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerleave', reset);
        el.addEventListener('blur', reset);
        cleanups.push(() => {
          el.removeEventListener('pointermove', onPointerMove);
          el.removeEventListener('pointerleave', reset);
          el.removeEventListener('blur', reset);
        });
      });

      return () => {
        root.classList.remove('has-cursor');
        cleanups.forEach((fn) => fn());
      };
    });
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__label" />
    </div>
  );
}
