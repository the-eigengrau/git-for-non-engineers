import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScenePlayback } from './playback';

type MergeConflictDiffProps = {
  /** The line as it reads on your branch. */
  ours: string;
  /** The line as it reads on the incoming branch. */
  theirs: string;
  /** The single line you decide to keep. */
  resolved: string;
  oursLabel?: string;
  theirsLabel?: string;
  /** Monogram shown in each author's round chip (1-2 letters). */
  oursInitials?: string;
  theirsInitials?: string;
  resolvedInitials?: string;
};

// A spare, on-brand author chip: a single muted circle with a monogram. Keeps
// the figure in the dots-and-lines language, no photographs.
function Monogram({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-very-dark text-sm font-medium text-gray-light"
    >
      {initials}
    </div>
  );
}

const Card = React.forwardRef<
  HTMLDivElement,
  { label: string; text: string; initials: string }
>(function Card({ label, text, initials }, ref) {
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 rounded-[var(--radius-card-sm)] bg-gray-very-dark/40 px-4 py-3"
    >
      <Monogram initials={initials} />
      <div className="min-w-0">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-medium">{label}</div>
        <div className="text-base text-ultralight">{text}</div>
      </div>
    </div>
  );
});

// Two people edited the same line. Git keeps both and waits for you to pick the
// one true version. Minimal, readable, non-engineer-friendly.
export default function MergeConflictDiff({
  ours,
  theirs,
  resolved,
  oursLabel = 'Your version',
  theirsLabel = 'Their version',
  oursInitials = 'A',
  theirsInitials = 'B',
  resolvedInitials = 'B',
}: MergeConflictDiffProps) {
  const { shouldPlay, playToken, reducedMotion } = useScenePlayback();
  const rootRef = useRef<HTMLDivElement>(null);
  const oursRef = useRef<HTMLDivElement>(null);
  const theirsRef = useRef<HTMLDivElement>(null);
  const resolvedRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resolvedEl = resolvedRef.current;
    const arrowEl = arrowRef.current;
    if (!resolvedEl || !arrowEl) return;

    if (reducedMotion) {
      gsap.set([resolvedEl, arrowEl], { opacity: 1, y: 0 });
      gsap.set([oursRef.current, theirsRef.current], { opacity: 0.45 });
      return;
    }
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.set([resolvedEl, arrowEl], { opacity: 0, y: 10 });
      gsap.set([oursRef.current, theirsRef.current], { opacity: 1 });
      if (!shouldPlay) return;

      const tl = gsap.timeline();
      tl.to({}, { duration: 0.9 }); // register the two versions first
      tl.to([oursRef.current, theirsRef.current], { opacity: 0.45, duration: 0.5, ease: 'power2.out' });
      tl.to(arrowEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '<0.1');
      tl.to(resolvedEl, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }, '<0.1');
    }, rootRef);

    return () => ctx.revert();
  }, [shouldPlay, playToken, reducedMotion]);

  return (
    <div ref={rootRef} className="mx-auto max-w-md">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card ref={oursRef} label={oursLabel} text={ours} initials={oursInitials} />
        <Card ref={theirsRef} label={theirsLabel} text={theirs} initials={theirsInitials} />
      </div>

      <div ref={arrowRef} className="my-3 text-center text-2xl leading-none text-gray-medium" aria-hidden="true">
        ↓
      </div>

      <Card ref={resolvedRef} label="You keep" text={resolved} initials={resolvedInitials} />
    </div>
  );
}
