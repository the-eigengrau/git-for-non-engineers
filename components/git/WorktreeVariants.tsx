import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useScenePlayback } from './playback';

// One repo (left) fans into three live preview windows (right), each rendering a
// different minimal layout. The point a plain branch graph misses: a worktree
// gives every branch its own folder, so several design variations run side by
// side at once. Spare and muted on purpose; the repo is the only indigo accent.

const REPO_X = 66;
const REPO_Y = 170;
const NODE_R = 11;
const CARD_X = 300;
const CARD_W = 132;
const CARD_H = 66;
const BAR_H = 15;
const VB_W = 540;
const VB_H = 330;

const innerX = CARD_X + 12;
const innerY = (cy: number) => cy - CARD_H / 2 + BAR_H + 8;

type Block = { x: number; y: number; w: number; h: number; key?: boolean };
type Variant = { id: string; label: string; cy: number; blocks: Block[] };

// Each variant draws a recognisably different layout: a stacked article, a
// sidebar split, and a centred hero. The differences are the whole message.
const VARIANTS: Variant[] = [
  {
    id: 'a',
    label: 'variant a',
    cy: 72,
    blocks: [
      { x: 0, y: 0, w: 108, h: 8, key: true },
      { x: 0, y: 14, w: 108, h: 4 },
      { x: 0, y: 22, w: 74, h: 4 },
    ],
  },
  {
    id: 'b',
    label: 'variant b',
    cy: 170,
    blocks: [
      { x: 0, y: 0, w: 28, h: 34, key: true },
      { x: 40, y: 0, w: 68, h: 7 },
      { x: 40, y: 13, w: 68, h: 4 },
      { x: 40, y: 21, w: 48, h: 4 },
    ],
  },
  {
    id: 'c',
    label: 'variant c',
    cy: 268,
    blocks: [
      { x: 20, y: 2, w: 68, h: 18, key: true },
      { x: 30, y: 26, w: 48, h: 4 },
    ],
  },
];

export default function WorktreeVariants() {
  const { shouldPlay, playToken, reducedMotion } = useScenePlayback();
  const rootRef = useRef<SVGSVGElement>(null);
  const repoRef = useRef<SVGGElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const frameRefs = useRef<(SVGGElement | null)[]>([]);
  const blockRefs = useRef<(SVGGElement | null)[]>([]);

  const lineLens = useMemo(
    () => VARIANTS.map((v) => Math.hypot(CARD_X - REPO_X, v.cy - REPO_Y)),
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!rootRef.current) return;

    const repo = repoRef.current;
    const lines = lineRefs.current;
    const frames = frameRefs.current;
    const blocks = blockRefs.current;

    const applyFinal = () => {
      if (repo) gsap.set(repo, { opacity: 1, scale: 1 });
      lines.forEach((l) => l && gsap.set(l, { opacity: 1, strokeDashoffset: 0 }));
      frames.forEach((f) => f && gsap.set(f, { opacity: 1, scale: 1 }));
      blocks.forEach((g) => g && gsap.set(g.children, { opacity: 1, y: 0 }));
    };

    if (reducedMotion) {
      applyFinal();
      return;
    }

    const ctx = gsap.context(() => {
      // Hidden starting frame (mirrors the .git-anim-pre SSR styles).
      if (repo) gsap.set(repo, { opacity: 0, scale: 0.5, svgOrigin: `${REPO_X} ${REPO_Y}` });
      lines.forEach((l, i) => {
        if (l) gsap.set(l, { opacity: 1, strokeDasharray: lineLens[i], strokeDashoffset: lineLens[i] });
      });
      frames.forEach((f, i) => {
        if (f)
          gsap.set(f, {
            opacity: 0,
            scale: 0.6,
            svgOrigin: `${CARD_X + CARD_W / 2} ${VARIANTS[i].cy}`,
          });
      });
      blocks.forEach((g) => g && gsap.set(g.children, { opacity: 0, y: 5 }));

      const tl = gsap.timeline({ paused: true });
      if (repo) tl.to(repo, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' });
      tl.to({}, { duration: 0.15 });
      VARIANTS.forEach((v, i) => {
        const l = lines[i];
        const f = frames[i];
        const g = blocks[i];
        if (l) tl.to(l, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, i === 0 ? '>' : '>-0.18');
        if (f) tl.to(f, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '<0.12');
        if (g)
          tl.to(g.children, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, '<0.14');
      });

      if (shouldPlay) tl.play(0);
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay, playToken, reducedMotion]);

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: 'auto', maxHeight: 320, overflow: 'visible' }}
      role="img"
      aria-label="One repository fanning into three live preview windows, each a different layout."
    >
      {/* Connectors sit behind the windows. */}
      {VARIANTS.map((v, i) => (
        <line
          key={`l-${v.id}`}
          className="git-anim-pre"
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          x1={REPO_X}
          y1={REPO_Y}
          x2={CARD_X}
          y2={v.cy}
          stroke="#4A4A4A"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}

      {/* The one repo. */}
      <g className="git-anim-pre" ref={repoRef}>
        <line
          x1={REPO_X}
          y1={REPO_Y - NODE_R - 4}
          x2={REPO_X}
          y2={REPO_Y - NODE_R - 12}
          stroke="#A5A8FF"
          strokeWidth={1.25}
        />
        <text
          x={REPO_X}
          y={REPO_Y - NODE_R - 18}
          textAnchor="middle"
          fill="#A5A8FF"
          fontSize={15}
          fontFamily="Satoshi, system-ui, sans-serif"
        >
          main
        </text>
        <circle cx={REPO_X} cy={REPO_Y} r={NODE_R} fill="#7376F7" />
      </g>

      {/* Three preview windows, each a different layout. */}
      {VARIANTS.map((v, i) => {
        const top = v.cy - CARD_H / 2;
        const ix = innerX;
        const iy = innerY(v.cy);
        return (
          <React.Fragment key={`c-${v.id}`}>
            <g
              className="git-anim-pre"
              ref={(el) => {
                frameRefs.current[i] = el;
              }}
            >
              <rect
                x={CARD_X}
                y={top}
                width={CARD_W}
                height={CARD_H}
                rx={8}
                fill="rgba(255,255,255,0.02)"
                stroke="#3F3F3F"
                strokeWidth={1.25}
              />
              <line x1={CARD_X} y1={top + BAR_H} x2={CARD_X + CARD_W} y2={top + BAR_H} stroke="#2E2E2E" strokeWidth={1} />
              {[0, 1, 2].map((d) => (
                <circle key={d} cx={CARD_X + 12 + d * 8} cy={top + BAR_H / 2} r={2.2} fill="#6A6A6A" />
              ))}
              <text
                x={CARD_X + CARD_W + 14}
                y={v.cy + 5}
                textAnchor="start"
                fill="#8A8888"
                fontSize={15}
                fontFamily="Satoshi, system-ui, sans-serif"
              >
                {v.label}
              </text>
            </g>
            <g
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
            >
              {v.blocks.map((b, bi) => (
                <rect
                  key={bi}
                  className="git-anim-pre"
                  x={ix + b.x}
                  y={iy + b.y}
                  width={b.w}
                  height={b.h}
                  rx={2}
                  fill={b.key ? '#6E6E6E' : '#454545'}
                />
              ))}
            </g>
          </React.Fragment>
        );
      })}
    </svg>
  );
}
