import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { projects } from '../content/projects';
import { roles } from '../content/roles';
import { gsap } from '../motion/gsap';
import { useGsap } from '../motion/useGsap';

type SculptureNode = {
  id: string;
  /** Compact label shown on the orbit / chips. */
  short: string;
  label: string;
  kind: 'build' | 'lead';
  org?: string;
  meta?: string;
  detail?: string;
  href?: string;
  ring: 0 | 1;
  x: number;
  y: number;
};

const SHORT_LABELS: Record<string, string> = {
  epivet: 'EPIVET',
  'rsa-cryptography': 'RSA',
  'gdg-on-campus': 'GDG Lead',
  'quantum-club': 'Quantum Club',
  'national-quantum-summit': 'Quantum Summit',
  'sih-2025-committee': 'SIH 2025',
};

const RING_RADIUS: Record<0 | 1, number> = { 0: 27, 1: 41 };

/** Place each ring's nodes evenly around a circle, offset so rings don't align. */
function placeOnRing(
  nodes: Omit<SculptureNode, 'x' | 'y' | 'ring'>[],
  ring: 0 | 1,
): SculptureNode[] {
  const count = nodes.length;
  const radius = RING_RADIUS[ring];
  const startDeg = ring === 0 ? -90 : -90 + 180 / Math.max(count, 1);
  return nodes.map((node, index) => {
    const angle = ((startDeg + (360 / Math.max(count, 1)) * index) * Math.PI) / 180;
    return {
      ...node,
      ring,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
}

/**
 * The signature interactive sculpture: a small orbital map of the work Arati
 * builds and the communities she leads. The orbit rings rotate slowly and the
 * whole stage tilts toward the pointer. Selecting a node shows its real detail
 * in a live region. Every node maps to confirmed content — nothing is invented.
 *
 * The rings are `aria-hidden` decoration; the nodes are real buttons, so the
 * sculpture's information is fully available to keyboard and screen readers,
 * and it collapses to a plain chip list on small screens.
 */
export function OrbitalSculpture() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const nodes = useMemo<SculptureNode[]>(() => {
    const build = projects
      .filter((project) => project.featured)
      .map<Omit<SculptureNode, 'x' | 'y' | 'ring'>>((project) => ({
        id: project.id,
        short: SHORT_LABELS[project.id] ?? project.name,
        label: project.name,
        kind: 'build',
        meta: project.ownership === 'solo' ? 'Solo project' : 'Team project',
        detail: project.summary,
        href: project.live,
      }));

    const lead = roles.map<Omit<SculptureNode, 'x' | 'y' | 'ring'>>((role) => ({
      id: role.id,
      short: SHORT_LABELS[role.id] ?? role.role,
      label: role.role,
      kind: 'lead',
      org: role.org,
      meta: role.period,
      detail: role.detail,
    }));

    return [...placeOnRing(build, 0), ...placeOnRing(lead, 1)];
  }, []);

  const active = nodes.find((node) => node.id === activeId) ?? null;

  const scope = useGsap<HTMLDivElement>(({ scope: root, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);
      gsap.to(q('.sculpture__orbit--a'), {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
      gsap.to(q('.sculpture__orbit--b'), {
        rotation: -360,
        duration: 140,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
      gsap.from(q('.sculpture__node, .sculpture__core'), {
        autoAlpha: 0,
        scale: 0.85,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      });
    });
  });

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const stage = root.querySelector<HTMLElement>('.sculpture__stage');
    const inner = root.querySelector<HTMLElement>('.sculpture__stage-inner');
    if (!stage || !inner) return;

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3' });

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * 20);
      yTo(ny * 20);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(inner);
    };
  }, [scope]);

  return (
    <div className="sculpture" ref={scope}>
      <div className="sculpture__canvas">
        <div className="sculpture__stage" aria-hidden="true">
          <div className="sculpture__stage-inner">
            <svg
              className="sculpture__orbits"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <g className="sculpture__orbit sculpture__orbit--a">
                <ellipse cx="50" cy="50" rx="27" ry="27" />
              </g>
              <g className="sculpture__orbit sculpture__orbit--b">
                <ellipse cx="50" cy="50" rx="41" ry="41" />
              </g>
              <g className="sculpture__links">
                {nodes.map((node) => (
                  <line
                    key={node.id}
                    className={
                      node.kind === 'build'
                        ? 'sculpture__link sculpture__link--build'
                        : 'sculpture__link sculpture__link--lead'
                    }
                    data-active={activeId === node.id ? 'true' : 'false'}
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                  />
                ))}
              </g>
            </svg>
            <span className="sculpture__core">
              <span className="sculpture__core-mark">AP</span>
              <span className="sculpture__core-label">signal</span>
            </span>
          </div>
        </div>

        <ul className="sculpture__nodes">
          {nodes.map((node) => (
            <li
              key={node.id}
              className={`sculpture__node sculpture__node--${node.kind}${
                activeId === node.id ? ' is-active' : ''
              }`}
              style={
                {
                  '--nx': `${node.x}%`,
                  '--ny': `${node.y}%`,
                } as CSSProperties
              }
            >
              <button
                type="button"
                className="sculpture__node-btn"
                aria-pressed={activeId === node.id}
                aria-controls="sculpture-panel"
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
              >
                <span className="sculpture__node-dot" aria-hidden="true" />
                <span className="sculpture__node-label">{node.short}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sculpture__panel" id="sculpture-panel" aria-live="polite">
        {active ? (
          <>
            <p className="sculpture__panel-kind">
              {active.kind === 'build' ? 'Build' : 'Lead'}
            </p>
            <h3 className="sculpture__panel-title">{active.label}</h3>
            {active.org ? (
              <p className="sculpture__panel-org">{active.org}</p>
            ) : null}
            {active.meta ? (
              <p className="sculpture__panel-meta">{active.meta}</p>
            ) : null}
            {active.detail ? (
              <p className="sculpture__panel-detail measure">{active.detail}</p>
            ) : null}
            {active.href ? (
              <a
                className="sculpture__panel-link"
                href={active.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open live site <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </>
        ) : (
          <p className="sculpture__panel-hint measure">
            Move across a node to see how the work Arati builds connects to the
            communities she leads.
          </p>
        )}
      </div>
    </div>
  );
}
