import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../git/useReducedMotion';
import { useDeckNavigation } from './useDeckNavigation';
import SlideStage from './SlideStage';
import SlideLayout from './SlideLayout';
import DeckChrome from './DeckChrome';
import type { SlideDef } from '../../slides/types';

type DeckProps = {
  slides: SlideDef[];
  initial?: number;
};

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n));

// Reads a starting slide from the URL hash (#snapshots), so a deployed deck is
// deep-linkable and a presenter can jump straight in.
const initialFromHash = (slides: SlideDef[], fallback: number) => {
  if (typeof window === 'undefined') return fallback;
  const id = window.location.hash.replace('#', '');
  const idx = slides.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : fallback;
};

export default function Deck({ slides, initial = 0 }: DeckProps) {
  const total = slides.length;
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState(() => initialFromHash(slides, initial));
  // Per-slide entry counter → the active slide's value is the playToken. Bumping
  // it on each entry (and on replay) restarts that slide's animation.
  const entryCount = useRef<number[]>(slides.map(() => 0));
  const [activeToken, setActiveToken] = useState(0);

  const slideEls = useRef<(HTMLDivElement | null)[]>([]);
  const prevActive = useRef(active);

  const go = useCallback(
    (next: number) => {
      const target = clamp(next, total - 1);
      setActive((cur) => {
        if (target === cur) return cur;
        entryCount.current[target] += 1;
        setActiveToken(entryCount.current[target]);
        return target;
      });
    },
    [total],
  );

  const replayActive = useCallback(() => {
    setActive((cur) => {
      entryCount.current[cur] += 1;
      setActiveToken(entryCount.current[cur]);
      return cur;
    });
  }, []);

  const nav = useDeckNavigation({
    next: () => go(active + 1),
    prev: () => go(active - 1),
    first: () => go(0),
    last: () => go(total - 1),
    replay: replayActive,
  });

  // First paint: show only the active slide. Inline styles on the wrappers keep
  // this correct from frame one; this syncs gsap's view of autoAlpha.
  useLayoutEffect(() => {
    slideEls.current.forEach((el, i) => {
      if (el) gsap.set(el, { autoAlpha: i === active ? 1 : 0 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Crossfade between the outgoing and incoming slide. The primitives animate
  // their own contents; this only moves the wrappers, so the two never fight.
  useEffect(() => {
    const from = prevActive.current;
    const to = active;
    prevActive.current = to;
    if (from === to) return;

    const dir = to > from ? 1 : -1;
    const outEl = slideEls.current[from];
    const inEl = slideEls.current[to];

    if (reducedMotion) {
      if (outEl) gsap.set(outEl, { autoAlpha: 0, x: 0 });
      if (inEl) gsap.set(inEl, { autoAlpha: 1, x: 0 });
      return;
    }

    if (outEl) gsap.to(outEl, { autoAlpha: 0, x: -8 * dir, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    if (inEl) {
      gsap.fromTo(
        inEl,
        { autoAlpha: 0, x: 12 * dir },
        { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' },
      );
    }
  }, [active, reducedMotion]);

  // Keep the URL hash in sync for deep-linking, without scrolling.
  useEffect(() => {
    const id = slides[active]?.id;
    if (id && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, [active, slides]);

  // Focus the deck so arrow keys work immediately.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  const activeSlide = slides[active];
  const showReplay = !!activeSlide?.replay && !reducedMotion;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className="relative h-full w-full outline-none"
      aria-roledescription="carousel"
      aria-label="Git for non-engineers, slide deck"
    >
      <div
        className="deck-stage"
        onPointerDown={nav.onPointerDown}
        onPointerUp={nav.onPointerUp}
      >
        {slides.map((slide, i) => {
          const isActive = i === active;
          const token = isActive ? activeToken : entryCount.current[i];
          return (
            <div
              key={slide.id}
              ref={(el) => {
                slideEls.current[i] = el;
              }}
              className="deck-slide"
              style={{ opacity: isActive ? 1 : 0, visibility: isActive ? 'visible' : 'hidden' }}
              aria-hidden={!isActive}
            >
              <SlideStage active={isActive} playToken={token} reducedMotion={reducedMotion}>
                <SlideLayout slide={slide}>
                  <slide.Component />
                </SlideLayout>
              </SlideStage>
            </div>
          );
        })}
      </div>

      <DeckChrome
        active={active}
        total={total}
        onPrev={() => go(active - 1)}
        onNext={() => go(active + 1)}
        onReplay={replayActive}
        showReplay={showReplay}
        reducedMotion={reducedMotion}
      />

      {/* Screen-reader announcement of the current slide. */}
      <div className="sr-only" aria-live="polite" role="status">
        {`Slide ${active + 1} of ${total}: ${activeSlide?.title ?? ''}`}
      </div>
    </div>
  );
}
