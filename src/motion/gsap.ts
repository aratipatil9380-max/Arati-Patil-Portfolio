import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Single motion engine for the site. Imported once (module singleton), so the
// plugin registration and global config below run exactly once.
gsap.registerPlugin(ScrollTrigger);

// Don't recompute scroll positions when mobile browser chrome shows/hides —
// that resize would otherwise cause scrubbed animations to jump.
ScrollTrigger.config({ ignoreMobileResize: true });

// Scroll start/end positions depend on final text layout. Recalculate once the
// webfonts have settled so reveals use correct trigger points.
if (typeof document !== 'undefined' && document.fonts) {
  document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
}

export { gsap, ScrollTrigger };
