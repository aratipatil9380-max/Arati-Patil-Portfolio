import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { profile } from '../content/profile';
import { skills } from '../content/skills';
import { gsap } from '../motion/gsap';
import { useGsap } from '../motion/useGsap';

type Stage = 'using' | 'learning';

type HubNode = { kind: 'hub'; id: string; label: string; x: number; y: number };
type CategoryNode = {
  kind: 'category';
  id: string;
  label: string;
  stage: Stage;
  note?: string;
  x: number;
  y: number;
};
type SkillNode = {
  kind: 'skill';
  id: string;
  label: string;
  full: string;
  groupId: string;
  groupLabel: string;
  stage: Stage;
  note?: string;
  x: number;
  y: number;
};
type ConstellationNode = HubNode | CategoryNode | SkillNode;
type Link = { from: string; to: string };

const CAT_R = 20;
const SKILL_R = 36;

// Only the longest label needs shortening for the chip; the panel shows the full name.
const SHORT_LABEL: Record<string, string> = {
  'AI-assisted development': 'AI-assisted dev',
};

function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
}

// Built once from real content — no invented skills, no percentages.
function buildGraph(): { nodes: ConstellationNode[]; links: Link[] } {
  const nodes: ConstellationNode[] = [
    { kind: 'hub', id: 'hub', label: 'Arati', x: 50, y: 50 },
  ];
  const links: Link[] = [];
  const count = skills.length;

  skills.forEach((group, i) => {
    const angle = -90 + (360 / count) * i;
    const c = polar(CAT_R, angle);
    nodes.push({
      kind: 'category',
      id: group.id,
      label: group.label,
      stage: group.stage,
      note: group.note,
      x: c.x,
      y: c.y,
    });
    links.push({ from: 'hub', to: group.id });

    const m = group.items.length;
    const spread = Math.min(56, 18 * m);
    group.items.forEach((item, j) => {
      const at = m > 1 ? angle - spread / 2 + (spread / (m - 1)) * j : angle;
      const p = polar(SKILL_R, at);
      nodes.push({
        kind: 'skill',
        id: `${group.id}:${item}`,
        label: SHORT_LABEL[item] ?? item,
        full: item,
        groupId: group.id,
        groupLabel: group.label,
        stage: group.stage,
        note: group.note,
        x: p.x,
        y: p.y,
      });
      links.push({ from: group.id, to: `${group.id}:${item}` });
    });
  });

  return { nodes, links };
}

const GRAPH = buildGraph();
const NODE_BY_ID = new Map(GRAPH.nodes.map((n) => [n.id, n]));

/**
 * Skill constellation — an explorable node graph built entirely from the real
 * skill groups. Only rendered where a fine pointer and enough width exist
 * (see Skills.tsx); every other device keeps the accessible list. Selecting a
 * node reveals the same information the list shows — category, stage, note.
 */
export function SkillConstellation() {
  const [activeId, setActiveId] = useState('hub');
  const active = useMemo(
    () => NODE_BY_ID.get(activeId) ?? GRAPH.nodes[0],
    [activeId],
  );

  const ref = useGsap<HTMLDivElement>(({ scope, mm }) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(scope);
      gsap.fromTo(
        q('.constellation__links line'),
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: { trigger: scope, start: 'top 82%', once: true },
        },
      );
      gsap.fromTo(
        q('.constellation__node'),
        { autoAlpha: 0, scale: 0.7 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.03,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: scope, start: 'top 82%', once: true },
        },
      );
    });
  });

  return (
    <div className="constellation" ref={ref}>
      <div className="constellation__stage">
        <svg
          className="constellation__links"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {GRAPH.links.map((link) => {
            const a = NODE_BY_ID.get(link.from);
            const b = NODE_BY_ID.get(link.to);
            if (!a || !b) return null;
            const isActive = link.from === activeId || link.to === activeId;
            return (
              <line
                key={`${link.from}__${link.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={isActive ? 'is-active' : undefined}
              />
            );
          })}
        </svg>

        <div className="constellation__hub" aria-hidden="true">
          <span className="constellation__hub-mark">AP</span>
          <span className="constellation__hub-label">signal</span>
        </div>

        <ul className="constellation__nodes">
          {GRAPH.nodes.map((node) => (
            <li
              key={node.id}
              className={[
                'constellation__node',
                `constellation__node--${node.kind}`,
                node.kind !== 'hub' && node.stage === 'learning'
                  ? 'constellation__node--learning'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                {
                  '--nx': `${node.x}%`,
                  '--ny': `${node.y}%`,
                } as CSSProperties
              }
            >
              <button
                type="button"
                className="constellation__node-btn"
                aria-pressed={activeId === node.id}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
              >
                <span className="constellation__node-dot" aria-hidden="true" />
                <span className="constellation__node-label">{node.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="constellation__panel" aria-live="polite">
        {active.kind === 'hub' ? (
          <>
            <p className="constellation__panel-kind">Signal core</p>
            <p className="constellation__panel-title">{profile.name}</p>
            <p className="constellation__panel-meta">{profile.role}</p>
            <p className="constellation__panel-hint">
              Select a node to explore the tools behind the work.
            </p>
          </>
        ) : (
          <>
            <p className="constellation__panel-kind">
              {active.kind === 'category' ? 'Skill group' : active.groupLabel}
              {' · '}
              {active.stage === 'learning' ? 'Exploring' : 'In use'}
            </p>
            <p className="constellation__panel-title">
              {active.kind === 'skill' ? active.full : active.label}
            </p>
            {active.kind === 'skill' ? (
              <p className="constellation__panel-meta">In {active.groupLabel}</p>
            ) : null}
            {active.note ? (
              <p className="constellation__panel-note">{active.note}</p>
            ) : null}
            {active.kind === 'category' ? (
              <ul className="constellation__panel-items">
                {skills
                  .find((g) => g.id === active.id)
                  ?.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
