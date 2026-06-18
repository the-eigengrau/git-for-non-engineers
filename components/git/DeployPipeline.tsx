import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GitCommit, Upload, CheckCircle2, Eye, Rocket, type LucideIcon } from 'lucide-react';
import { useScenePlayback } from './playback';

export type Stage = { label: string; sub?: string; Icon: LucideIcon };

const DEFAULT_STAGES: Stage[] = [
  { label: 'Commit', sub: 'local', Icon: GitCommit },
  { label: 'Push', sub: 'to GitHub', Icon: Upload },
  { label: 'CI checks', sub: 'tests, lint', Icon: CheckCircle2 },
  { label: 'Preview', sub: 'per-branch URL', Icon: Eye },
  { label: 'Production', sub: 'merge to main', Icon: Rocket },
];

type DeployPipelineProps = {
  stages?: Stage[];
};

export default function DeployPipeline({ stages = DEFAULT_STAGES }: DeployPipelineProps) {
  const { shouldPlay, playToken, reducedMotion } = useScenePlayback();
  const rootRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const chips = chipRefs.current.filter(Boolean) as HTMLDivElement[];
    const fills = fillRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (reducedMotion) {
      chips.forEach((c) => c.classList.add('is-on'));
      fills.forEach((f) => gsap.set(f, { scaleX: 1, scaleY: 1 }));
      return;
    }
    if (typeof window === 'undefined') return;

    // Reset (classList changes aren't reverted by gsap.context).
    chips.forEach((c) => c.classList.remove('is-on'));

    const ctx = gsap.context(() => {
      fills.forEach((f) => gsap.set(f, { scaleX: 0, scaleY: 0, transformOrigin: '0% 0%' }));
      if (!shouldPlay) return;

      const tl = gsap.timeline();
      stages.forEach((_, i) => {
        tl.call(() => chips[i]?.classList.add('is-on'));
        // A quick settle as the deploy reaches the stage, so lighting up reads
        // as an arrival rather than a flat colour swap.
        tl.fromTo(chips[i], { scale: 0.96 }, { scale: 1, duration: 0.32, ease: 'back.out(2.4)' }, '<');
        if (i < fills.length) {
          // The indigo current flows out of the chip the moment it lights,
          // overlapping the settle so the pipeline feels continuous.
          tl.to(fills[i], { scaleX: 1, scaleY: 1, duration: 0.46, ease: 'power1.inOut' }, '<0.12');
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [shouldPlay, playToken, reducedMotion, stages]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-stretch gap-0 md:flex-row md:items-center md:justify-between"
    >
      {stages.map((s, i) => (
        <React.Fragment key={s.label}>
          <div
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className="git-pipe-chip flex items-center gap-3 rounded-[var(--radius-card-sm)] border border-gray-very-dark bg-ultradark/60 px-3.5 py-3 md:flex-1 md:flex-col md:gap-2 md:text-center"
          >
            <s.Icon className="git-pipe-icon h-5 w-5 shrink-0 text-gray-medium" strokeWidth={1.5} />
            <div className="md:mt-0.5">
              <div className="git-pipe-label text-sm font-medium text-gray-light">{s.label}</div>
              {s.sub && <div className="text-xs text-gray-medium">{s.sub}</div>}
            </div>
          </div>

          {i < stages.length - 1 && (
            <span className="relative mx-auto my-1 block h-6 w-[2px] overflow-hidden bg-gray-very-dark md:my-0 md:mx-1 md:h-[2px] md:w-auto md:flex-[0.5]">
              <span
                ref={(el) => {
                  fillRefs.current[i] = el;
                }}
                className="git-fill-pre absolute inset-0 block bg-interactive"
              />
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
