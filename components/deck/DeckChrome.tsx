import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

type DeckChromeProps = {
  active: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReplay: () => void;
  showReplay: boolean;
  reducedMotion: boolean;
};

const pad = (n: number) => String(n).padStart(2, '0');

// Quiet, secondary presentation chrome: a counter, a hairline progress rule, and
// minimal controls. It rests at reduced opacity and lifts on hover so it never
// competes with the slide.
export default function DeckChrome({
  active,
  total,
  onPrev,
  onNext,
  onReplay,
  showReplay,
  reducedMotion,
}: DeckChromeProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const fraction = (active + 1) / total;

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    if (reducedMotion) {
      gsap.set(el, { scaleX: fraction });
      return;
    }
    gsap.to(el, { scaleX: fraction, duration: 0.5, ease: 'power2.out' });
  }, [fraction, reducedMotion]);

  const atStart = active === 0;
  const atEnd = active === total - 1;

  const btn =
    'flex h-9 w-9 items-center justify-center rounded-full text-gray-medium transition-colors hover:text-ultralight disabled:pointer-events-none disabled:opacity-30';

  return (
    <>
      {/* Progress hairline pinned to the very bottom edge. */}
      <div className="deck-progress-track pointer-events-none fixed inset-x-0 bottom-0 z-20 h-px">
        <div
          ref={fillRef}
          className="deck-progress-fill h-full w-full"
          style={{ transform: `scaleX(${fraction})` }}
        />
      </div>

      {/* Bottom bar: counter left, controls right. */}
      <div className="deck-chrome-quiet pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-center justify-between px-[8vw] pb-5 max-md:px-[7vw]">
        <span className="font-geist-mono text-xs tracking-wide text-gray-medium">
          {pad(active + 1)} <span className="text-gray-dark">/</span> {pad(total)}
        </span>

        <div className="pointer-events-auto flex items-center gap-1">
          {showReplay && (
            <button type="button" onClick={onReplay} aria-label="Replay animation" className={btn}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
          <button
            type="button"
            onClick={onPrev}
            disabled={atStart}
            aria-label="Previous slide"
            className={btn}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={atEnd}
            aria-label="Next slide"
            className={btn}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </>
  );
}
