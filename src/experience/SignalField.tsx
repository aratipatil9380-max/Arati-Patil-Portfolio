import { useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDeviceTier } from '../hooks/useDeviceTier';
import { useCanvasScene } from './useCanvasScene';
import type { SceneFrame } from './useCanvasScene';
import { spawnField, stepField, drawParticles, drawLinks } from './field';
import type { Particle } from './field';
import { readToken, hexToRgba, makeAlphaScale } from './color';

type Palette = {
  accent: string;
  text: string;
  textScale: (alpha: number) => string;
  accentScale: (alpha: number) => string;
};

type Orbit = {
  rx: number;
  ry: number;
  spin: number;
  phase: number;
  dot: number;
  accent: boolean;
};

const ORBITS: Orbit[] = [
  { rx: 0.3, ry: 0.2, spin: 0.05, phase: 0, dot: 0.35, accent: true },
  { rx: 0.42, ry: 0.3, spin: -0.035, phase: 0.6, dot: -0.25, accent: false },
  { rx: 0.54, ry: 0.4, spin: 0.02, phase: 1.2, dot: 0.2, accent: false },
];

type SignalFieldProps = {
  /** Class applied to the canvas element (defaults to the hero layer). */
  className?: string;
  /** 0–1 dimmer for the whole field; the contact finale uses a quieter copy. */
  intensity?: number;
};

/**
 * The hero's living background: a slow field of drifting particles with three
 * rotating orbital rings, reacting to the pointer. Purely decorative — it is
 * `aria-hidden` and sits behind the real content. Under reduced motion it
 * renders a single settled frame instead of animating. Reused (dimmed) behind
 * the contact finale so the signal bookends the page.
 */
export function SignalField({ className = 'hero__signal', intensity = 1 }: SignalFieldProps = {}) {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const paletteRef = useRef<Palette | null>(null);
  const stateRef = useRef<{ w: number; h: number; particles: Particle[] }>({
    w: 0,
    h: 0,
    particles: [],
  });

  const canvasRef = useCanvasScene(
    (frame: SceneFrame) => {
      const { ctx, width, height, time, dt, pointer } = frame;

      if (!paletteRef.current) {
        const accent = readToken('--accent', '#c6ff4d');
        const text = readToken('--text', '#f2f3f5');
        paletteRef.current = {
          accent,
          text,
          textScale: makeAlphaScale(text),
          accentScale: makeAlphaScale(accent),
        };
      }
      const { accent, accentScale, textScale } = paletteRef.current;

      const state = stateRef.current;
      const resized =
        Math.abs(state.w - width) > 40 ||
        Math.abs(state.h - height) > 40 ||
        state.particles.length === 0;
      if (resized) {
        state.w = width;
        state.h = height;
        state.particles = spawnField(width, height, Math.round((tier === 'high' ? 90 : 40) * intensity));
      }
      const particles = state.particles;

      ctx.clearRect(0, 0, width, height);

      const base = Math.min(width, height);
      const parallaxX = pointer.active ? (pointer.x - width / 2) * 0.02 : 0;
      const parallaxY = pointer.active ? (pointer.y - height / 2) * 0.02 : 0;
      const cx = width * 0.74 + parallaxX;
      const cy = height * 0.42 + parallaxY;

      ctx.lineWidth = 1;
      for (const orbit of ORBITS) {
        const rot = time * orbit.spin + orbit.phase;
        ctx.beginPath();
        ctx.ellipse(cx, cy, base * orbit.rx, base * orbit.ry, rot, 0, Math.PI * 2);
        ctx.strokeStyle = orbit.accent ? accentScale(0.14 * intensity) : textScale(0.05 * intensity);
        ctx.stroke();

        const angle = time * orbit.dot + orbit.phase;
        const localX = base * orbit.rx * Math.cos(angle);
        const localY = base * orbit.ry * Math.sin(angle);
        const dotX = cx + localX * Math.cos(rot) - localY * Math.sin(rot);
        const dotY = cy + localX * Math.sin(rot) + localY * Math.cos(rot);
        ctx.beginPath();
        ctx.arc(dotX, dotY, orbit.accent ? 2.4 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = orbit.accent ? accentScale(0.9 * intensity) : textScale(0.5 * intensity);
        ctx.fill();
      }

      stepField(particles, dt, width, height, pointer, {
        repelRadius: 140,
        repelForce: 240,
      });
      drawParticles(ctx, particles, (alpha) => textScale(alpha * 0.75 * intensity));
      if (tier === 'high') {
        drawLinks(ctx, particles, 118, (alpha) => accentScale(alpha * intensity));
      }

      if (pointer.active) {
        const radius = Math.max(120, base * 0.28);
        const gradient = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          radius,
        );
        gradient.addColorStop(0, hexToRgba(accent, 0.06 * intensity));
        gradient.addColorStop(1, hexToRgba(accent, 0));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    { still: reduced },
  );

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
