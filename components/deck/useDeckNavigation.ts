import { useEffect, useRef } from 'react';

type NavActions = {
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  replay: () => void;
};

const isTypingTarget = (t: EventTarget | null) =>
  t instanceof HTMLElement && /^(input|textarea|select)$/i.test(t.tagName);

const isControl = (t: EventTarget | null) =>
  t instanceof Element && !!t.closest('button, a, input, textarea, select');

// All deck input in one place: keyboard at the window, plus pointer handlers for
// the stage (tap a side to step, swipe on touch). Pointer events unify mouse and
// touch so a tap and a click are the same path. Taps on a primitive's own
// controls (e.g. a CommandMap card) never trigger navigation.
export function useDeckNavigation(actions: NavActions) {
  const a = useRef(actions);
  a.current = actions;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          a.current.next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          a.current.prev();
          break;
        case 'Home':
          e.preventDefault();
          a.current.first();
          break;
        case 'End':
          e.preventDefault();
          a.current.last();
          break;
        case 'r':
        case 'R':
          a.current.replay();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const down = useRef<{ x: number; y: number; type: string } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY, type: e.pointerType };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = down.current;
    down.current = null;
    if (!d || isControl(e.target)) return;

    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;

    // Touch swipe.
    if (d.type === 'touch' && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) a.current.next();
      else a.current.prev();
      return;
    }

    // Click / tap: left quarter steps back, the rest advances.
    if (Math.hypot(dx, dy) < 10) {
      const { left, width } = e.currentTarget.getBoundingClientRect();
      if (e.clientX - left < width * 0.25) a.current.prev();
      else a.current.next();
    }
  };

  return { onPointerDown, onPointerUp };
}
