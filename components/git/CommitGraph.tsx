import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useScenePlayback } from './playback';
import type { BranchRef, CommitEdge, CommitNode, GraphOp } from './types';

type CommitGraphProps = {
  nodes: CommitNode[];
  edges: CommitEdge[];
  refs?: BranchRef[];
  steps: GraphOp[];
  /** Caps the rendered height so tall graphs stay inside the reading column. */
  maxHeight?: number;
};

// --- grid → SVG geometry -------------------------------------------------
const PAD_X = 60;
const PAD_Y = 54;
const COL_GAP = 118;
const LANE_GAP = 90;
const NODE_R = 11;

const BRANCH_COLORS: Record<string, string> = {
  main: '#7376F7', // interactive indigo, the trunk
  master: '#7376F7',
  feature: '#FFFBFA', // white, the other lane
  topic: '#A5A8FF',
};
const colorFor = (branch?: string) => (branch && BRANCH_COLORS[branch]) || '#A5A8FF';

// Ref (branch / HEAD label) colours: accent indigo or neutral white.
const REF_ACCENT = '#A5A8FF';
const REF_NEUTRAL = '#FFFBFA';

const edgeKey = (from: string, to: string) => `${from}->${to}`;

export default function CommitGraph({ nodes, edges, refs = [], steps, maxHeight }: CommitGraphProps) {
  const { shouldPlay, playToken, reducedMotion } = useScenePlayback();
  const rootRef = useRef<SVGSVGElement>(null);
  const nodeEls = useRef(new Map<string, SVGGElement>());
  const edgeEls = useRef(new Map<string, SVGLineElement>());
  const refEls = useRef(new Map<string, SVGGElement>());

  const layout = useMemo(() => {
    const pos = new Map<string, { x: number; y: number }>();
    let maxCol = 0;
    let maxLane = 0;
    for (const n of nodes) {
      pos.set(n.id, { x: PAD_X + n.col * COL_GAP, y: PAD_Y + n.lane * LANE_GAP });
      maxCol = Math.max(maxCol, n.col);
      maxLane = Math.max(maxLane, n.lane);
    }
    const width = PAD_X * 2 + maxCol * COL_GAP;
    const height = PAD_Y * 2 + maxLane * LANE_GAP;
    return { pos, width, height };
  }, [nodes]);

  // Length of each edge (analytic, no DOM measurement, SSR-safe).
  const edgeLen = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of edges) {
      const a = layout.pos.get(e.from);
      const b = layout.pos.get(e.to);
      if (a && b) m.set(edgeKey(e.from, e.to), Math.hypot(b.x - a.x, b.y - a.y));
    }
    return m;
  }, [edges, layout]);

  // Final resting position of each ref (last move-ref target, else initial `at`).
  const finalRefAt = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of refs) m.set(r.name, r.at);
    for (const s of steps) if (s.type === 'move-ref') m.set(s.name, s.to);
    return m;
  }, [refs, steps]);

  // Final opacity per node: shown → 1, unless a later `fade` op dims it.
  const finalNodeOpacity = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of steps) {
      if (s.type === 'show-node') m.set(s.id, 1);
      else if (s.type === 'fade') s.ids.forEach((id) => m.set(id, s.to ?? 0.18));
    }
    return m;
  }, [steps]);

  // Final colour per ref: its initial tone, unless a later `tint-ref` recolours it.
  const finalRefColor = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of refs) {
      const neutral = r.tone === 'neutral' || r.kind === 'head';
      m.set(r.name, neutral ? REF_NEUTRAL : REF_ACCENT);
    }
    for (const s of steps) if (s.type === 'tint-ref') m.set(s.name, s.tone === 'accent' ? REF_ACCENT : REF_NEUTRAL);
    return m;
  }, [refs, steps]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;

    const nodeMap = nodeEls.current;
    const edgeMap = edgeEls.current;
    const refMap = refEls.current;

    const placeRefAt = (name: string, nodeId: string) => {
      const el = refMap.get(name);
      const p = layout.pos.get(nodeId);
      if (el && p) gsap.set(el, { x: p.x, y: p.y });
    };

    const setRefColor = (name: string, color: string) => {
      const el = refMap.get(name);
      if (!el) return;
      const txt = el.querySelector('text');
      const ln = el.querySelector('line');
      if (txt) gsap.set(txt, { fill: color });
      if (ln) gsap.set(ln, { stroke: color });
    };

    // The complete static frame, shared by reduced-motion and the timeline end.
    const applyFinalState = () => {
      nodes.forEach((n) => {
        const el = nodeMap.get(n.id);
        if (el) gsap.set(el, { opacity: finalNodeOpacity.get(n.id) ?? 1, scale: 1 });
      });
      edges.forEach((e) => {
        const el = edgeMap.get(edgeKey(e.from, e.to));
        if (el) gsap.set(el, { opacity: 1, strokeDashoffset: 0 });
      });
      refs.forEach((r) => {
        placeRefAt(r.name, finalRefAt.get(r.name) || r.at);
        const el = refMap.get(r.name);
        if (el) gsap.set(el, { opacity: 1 });
        const color = finalRefColor.get(r.name);
        if (color) setRefColor(r.name, color);
      });
    };

    if (reducedMotion) {
      applyFinalState();
      return;
    }

    const ctx = gsap.context(() => {
      // Hidden starting frame (matches the inline SSR styles, so revert won't flash).
      nodes.forEach((n) => {
        const el = nodeMap.get(n.id);
        const p = layout.pos.get(n.id);
        if (el && p) gsap.set(el, { opacity: 0, scale: 0.5, svgOrigin: `${p.x} ${p.y}` });
      });
      edges.forEach((e) => {
        const el = edgeMap.get(edgeKey(e.from, e.to));
        const len = edgeLen.get(edgeKey(e.from, e.to)) || 0;
        if (el) gsap.set(el, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
      });
      refs.forEach((r) => {
        placeRefAt(r.name, r.at);
        const el = refMap.get(r.name);
        if (el) gsap.set(el, { opacity: 0 });
      });

      const tl = gsap.timeline({ paused: true });
      const refShown = new Set<string>();
      const refCurrent = new Map<string, string>();
      refs.forEach((r) => refCurrent.set(r.name, r.at));

      const revealRefsOn = (nodeId: string) => {
        refs.forEach((r) => {
          if (!refShown.has(r.name) && refCurrent.get(r.name) === nodeId) {
            refShown.add(r.name);
            const el = refMap.get(r.name);
            if (el) tl.to(el, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<0.1');
          }
        });
      };

      for (const op of steps) {
        switch (op.type) {
          case 'show-node': {
            const el = nodeMap.get(op.id);
            if (el) tl.to(el, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' });
            revealRefsOn(op.id);
            break;
          }
          case 'show-edge': {
            const el = edgeMap.get(edgeKey(op.from, op.to));
            if (el) tl.to(el, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, '<0.05');
            break;
          }
          case 'move-ref': {
            const el = refMap.get(op.name);
            const p = layout.pos.get(op.to);
            refCurrent.set(op.name, op.to);
            if (el && p) {
              if (!refShown.has(op.name)) {
                refShown.add(op.name);
                tl.to(el, { opacity: 1, duration: 0.3, ease: 'power2.out' });
              }
              tl.to(el, { x: p.x, y: p.y, duration: 0.55, ease: 'power2.inOut' });
            }
            break;
          }
          case 'highlight': {
            op.ids.forEach((id, i) => {
              const el = nodeMap.get(id);
              if (el)
                tl.to(
                  el,
                  { scale: 1.18, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.inOut' },
                  i === 0 ? '>' : '<',
                );
            });
            break;
          }
          case 'fade': {
            op.ids.forEach((id, i) => {
              const el = nodeMap.get(id);
              if (el)
                tl.to(el, { opacity: op.to ?? 0.18, duration: 0.4, ease: 'power2.out' }, i === 0 ? '>' : '<');
            });
            break;
          }
          case 'tint-ref': {
            const el = refMap.get(op.name);
            if (el) {
              const color = op.tone === 'accent' ? REF_ACCENT : REF_NEUTRAL;
              const txt = el.querySelector('text');
              const ln = el.querySelector('line');
              if (txt) tl.to(txt, { fill: color, duration: 0.4, ease: 'power2.out' }, '<');
              if (ln) tl.to(ln, { stroke: color, duration: 0.4, ease: 'power2.out' }, '<');
            }
            break;
          }
          case 'pause':
            tl.to({}, { duration: (op.ms ?? 350) / 1000 });
            break;
        }
      }

      if (shouldPlay) tl.play(0);
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay, playToken, reducedMotion, nodes, edges, refs, steps]);

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: 'auto', maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: 'visible' }}
      role="img"
    >
      {/* Edges first so nodes sit on top. */}
      {edges.map((e) => {
        const a = layout.pos.get(e.from);
        const b = layout.pos.get(e.to);
        if (!a || !b) return null;
        return (
          <line
            key={edgeKey(e.from, e.to)}
            className="git-anim-pre"
            ref={(el) => {
              if (el) edgeEls.current.set(edgeKey(e.from, e.to), el);
            }}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#4A4A4A"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}

      {nodes.map((n) => {
        const p = layout.pos.get(n.id)!;
        const color = colorFor(n.branch);
        return (
          <g
            key={n.id}
            className="git-anim-pre"
            ref={(el) => {
              if (el) nodeEls.current.set(n.id, el);
            }}
          >
            <circle cx={p.x} cy={p.y} r={NODE_R} fill={color} />
            {n.label && (
              <text
                x={p.x}
                y={p.y + NODE_R + 20}
                textAnchor="middle"
                fill="#8A8888"
                fontSize={15}
                fontFamily="Satoshi, system-ui, sans-serif"
              >
                {n.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Movable branch / HEAD labels, spare: a word and a thin tick, no chrome. */}
      {refs.map((r) => {
        const below = r.place === 'below';
        const neutral = r.tone === 'neutral' || r.kind === 'head';
        const color = neutral ? '#FFFBFA' : '#A5A8FF';
        const tickFar = below ? NODE_R + 22 : -(NODE_R + 22);
        const tickNear = below ? NODE_R + 4 : -(NODE_R + 4);
        const textY = below ? NODE_R + 39 : -(NODE_R + 30);
        return (
          <g
            key={r.name}
            className="git-anim-pre"
            ref={(el) => {
              if (el) refEls.current.set(r.name, el);
            }}
          >
            <line x1={0} y1={tickNear} x2={0} y2={tickFar} stroke={color} strokeWidth={1.25} />
            <text
              x={0}
              y={textY}
              textAnchor="middle"
              fill={color}
              fontSize={15}
              fontFamily="Satoshi, system-ui, sans-serif"
            >
              {r.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
