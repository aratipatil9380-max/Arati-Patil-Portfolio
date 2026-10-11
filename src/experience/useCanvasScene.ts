import { useEffect, useRef } from 'react';

export type ScenePointer = { x: number; y: number; active: boolean };

export type SceneFrame = {
  ctx: CanvasRenderingContext2D;
  /** Layout size in CSS pixels. */
  width: number;
  height: number;
  dpr: number;
  /** Seconds since the loop started. */
  time: number;
  /** Seconds since the previous frame (clamped). */
  dt: number;
  /** Pointer position in canvas-local CSS pixels. */
  pointer: ScenePointer;
};

type Options = {
  /** When false the scene never starts. */
  enabled?: boolean;
  /** Draw a single settled frame and skip the loop (reduced motion / poster). */
  still?: boolean;
  /** Keep animating even when scrolled out of view (rarely wanted). */
  alwaysOn?: boolean;
};

/**
 * Owns a responsive, well-behaved `<canvas>` 2D animation loop:
 * - device-pixel-ratio capped at 2, resized via ResizeObserver,
 * - the rAF loop only runs while the canvas is on screen *and* the tab is
 *   visible, so off-screen scenes cost nothing,
 * - pointer coordinates are tracked only on fine pointers,
 * - `still` renders one frame and stops (used under reduced motion).
 *
 * The `draw` callback is held in a ref, so passing a new closure each render
 * never restarts the loop.
 */
export function useCanvasScene(
  draw: (frame: SceneFrame) => void,
  options: Options = {},
) {
  const { enabled = true, still = false, alwaysOn = false } = options;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer: ScenePointer = { x: -1e4, y: -1e4, active: false };

    let width = 1;
    let height = 1;
    let rafId = 0;
    let running = false;
    let startedAt = 0;
    let lastAt = 0;
    let onScreen = true; // assume visible unless an observer says otherwise

    const render = (time: number) => {
      const dt = lastAt ? Math.min(0.05, (time - lastAt) / 1000) : 0;
      lastAt = time;
      drawRef.current({
        ctx,
        width,
        height,
        dpr,
        time: startedAt ? (time - startedAt) / 1000 : 0,
        dt,
        pointer,
      });
    };

    const loop = (time: number) => {
      render(time);
      rafId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || still) return;
      running = true;
      startedAt = performance.now();
      lastAt = 0;
      rafId = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      window.cancelAnimationFrame(rafId);
    };

    const sync = () => {
      const visible = document.visibilityState !== 'hidden';
      if (onScreen && visible) start();
      else stop();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) {
        startedAt = 0;
        lastAt = 0;
        render(performance.now());
      }
    };

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    let intersectionObserver: IntersectionObserver | undefined;
    if (!alwaysOn && typeof IntersectionObserver !== 'undefined') {
      onScreen = false;
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { rootMargin: '160px' },
      );
      intersectionObserver.observe(canvas);
    }

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    const fine =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches;
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    if (fine) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
    }

    if (!still) sync();

    return () => {
      stop();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (fine) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
      }
    };
  }, [enabled, still, alwaysOn]);

  return canvasRef;
}
