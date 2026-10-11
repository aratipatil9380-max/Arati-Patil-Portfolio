/**
 * Tiny colour helpers for the canvas scenes. They read the design tokens so the
 * artwork stays in lockstep with the CSS palette instead of hard-coding a second
 * copy of the accent.
 */

/** Read a CSS custom property from :root, with a fallback for SSR/edge cases. */
export function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * Pre-build a lookup of `rgba()` strings across `steps` alpha levels. Canvas
 * fill/stroke styles are assigned every frame; reusing cached strings avoids
 * allocating thousands of throwaway strings per second.
 */
export function makeAlphaScale(hex: string, steps = 32): (alpha: number) => string {
  const cache = Array.from({ length: steps + 1 }, (_, index) =>
    hexToRgba(hex, index / steps),
  );
  return (alpha: number) => {
    const clamped = alpha <= 0 ? 0 : alpha >= 1 ? 1 : alpha;
    return cache[Math.round(clamped * steps)];
  };
}

/** `#rrggbb` (or `#rgb`) → `rgba(r, g, b, a)`. Returns the input if unparseable. */
export function hexToRgba(hex: string, alpha: number): string {
  let value = hex.trim();
  if (value.startsWith('#')) value = value.slice(1);
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (value.length !== 6) return hex;
  const int = Number.parseInt(value, 16);
  if (Number.isNaN(int)) return hex;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
