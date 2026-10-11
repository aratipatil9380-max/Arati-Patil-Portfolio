import { useRef } from 'react';
import { useDeviceTier } from '../hooks/useDeviceTier';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { makeAlphaScale, readToken } from './color';
import { drawLinks, drawParticles, spawnField, stepField, type Particle } from './field';
import { useCanvasScene } from './useCanvasScene';

type Variant = 'network' | 'lattice';

type Palette = {
  accent: (alpha: number) => string;
  text: (alpha: number) => string;
};

/**
 * A decorative, pointer-reactive canvas layered over a project screenshot so
 * each featured project gets its own interaction without altering the real
 * image: `network` draws a living graph (disease surveillance) and `lattice`
 * draws cipher-like blocks that ignite under the pointer.
 *
 * Purely decorative — `aria-hidden`, pointer-events: none, and a single settled
 * frame under reduced motion.
 */
export function ProjectField({ variant }: { variant: Variant }) {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();

  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const paletteRef = useRef<Palette | null>(null);

  const canvasRef = useCanvasScene(
    (frame) => {
      const { ctx, width, height, time, dt, pointer } = frame;
      if (!paletteRef.current) {
        paletteRef.current = {
          accent: makeAlphaScale(readToken('--accent', '#c6ff4d')),
          text: makeAlphaScale(readToken('--text', '#f2f3f5')),
        };
      }
      const palette = paletteRef.current;
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      if (variant === 'lattice') {
        drawLattice(
          ctx,
          width,
          height,
          time,
          pointer.x,
          pointer.y,
          pointer.active,
          palette,
        );
        return;
      }

      if (sizeRef.current.width !== width || sizeRef.current.height !== height) {
        sizeRef.current = { width, height };
        particlesRef.current = spawnField(width, height, tier === 'high' ? 48 : 26);
      }
      const particles = particlesRef.current;
      stepField(particles, dt, width, height, pointer, {
        repelRadius: 140,
        repelForce: 240,
        attract: true,
      });
      drawLinks(ctx, particles, 92, palette.accent);
      drawParticles(ctx, particles, palette.text);
    },
    { still: reduced },
  );

  return <canvas ref={canvasRef} className="project__field" aria-hidden="true" />;
}

function drawLattice(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  px: number,
  py: number,
  active: boolean,
  palette: Palette,
) {
  const step = 24;
  const base = 2;
  for (let x = step / 2; x < width; x += step) {
    for (let y = step / 2; y < height; y += step) {
      let near = 0;
      if (active) {
        const dist = Math.hypot(x - px, y - py);
        near = Math.max(0, 1 - dist / 170);
      }
      const pulse = 0.5 + 0.5 * Math.sin((x + y) * 0.04 + time * 1.6);
      const size = base + near * 4;
      const alpha = (0.1 + near * 0.6) * (0.45 + 0.55 * pulse);
      ctx.fillStyle = palette.accent(alpha);
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
}
