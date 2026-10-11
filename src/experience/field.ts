import type { ScenePointer } from './useCanvasScene';

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

const MIN_SPEED = 10;
const MAX_SPEED = 70;

/** Scatter `count` particles across a `width × height` field with a slow drift. */
export function spawnField(
  width: number,
  height: number,
  count: number,
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = MIN_SPEED + Math.random() * (MIN_SPEED * 1.6);
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 0.7 + Math.random() * 1.5,
      a: 0.16 + Math.random() * 0.4,
    });
  }
  return particles;
}

type StepOptions = {
  repelRadius?: number;
  repelForce?: number;
  attract?: boolean;
};

/**
 * Integrate one step: pointer force (repel, or attract when `attract`), soft
 * damping back toward a calm base speed, then wrap at the edges. Frame-rate
 * independent via `dt`.
 */
export function stepField(
  particles: Particle[],
  dt: number,
  width: number,
  height: number,
  pointer: ScenePointer,
  options: StepOptions = {},
) {
  const { repelRadius = 150, repelForce = 280, attract = false } = options;
  const radius2 = repelRadius * repelRadius;

  for (const p of particles) {
    if (pointer.active) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < radius2 && dist2 > 0.0001) {
        const dist = Math.sqrt(dist2);
        const falloff = 1 - dist / repelRadius;
        const force = falloff * repelForce * dt * (attract ? 1 : -1);
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    }

    // Mild damping so pointer energy dissipates instead of accumulating.
    const damp = Math.pow(0.94, dt * 60);
    p.vx *= damp;
    p.vy *= damp;

    let speed = Math.hypot(p.vx, p.vy);
    if (speed > MAX_SPEED) {
      const scale = MAX_SPEED / speed;
      p.vx *= scale;
      p.vy *= scale;
      speed = MAX_SPEED;
    } else if (speed < MIN_SPEED) {
      if (speed > 0.001) {
        const scale = MIN_SPEED / speed;
        p.vx *= scale;
        p.vy *= scale;
      } else {
        const angle = Math.random() * Math.PI * 2;
        p.vx = Math.cos(angle) * MIN_SPEED;
        p.vy = Math.sin(angle) * MIN_SPEED;
      }
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.x < -12) p.x = width + 12;
    else if (p.x > width + 12) p.x = -12;
    if (p.y < -12) p.y = height + 12;
    else if (p.y > height + 12) p.y = -12;
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  color: (alpha: number) => string,
) {
  for (const p of particles) {
    ctx.fillStyle = color(p.a);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Connect nearby particles with faint lines. O(n²) — callers keep counts modest
 * and cap the pair distance so the number of strokes stays low.
 */
export function drawLinks(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  maxDist: number,
  color: (alpha: number) => string,
) {
  const maxDist2 = maxDist * maxDist;
  ctx.lineWidth = 1;
  for (let i = 0; i < particles.length; i += 1) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j += 1) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < maxDist2) {
        const alpha = (1 - dist2 / maxDist2) * 0.22;
        ctx.strokeStyle = color(alpha);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}
