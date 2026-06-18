import { createContext, useContext } from 'react';

// The whole visual library is driven by a tiny "playback" contract provided by
// React context. Children render a complete static end-state on the server, then
// play their GSAP timeline once their slide becomes active. Reduced-motion users
// skip straight to the end-state.
//
// In the blog this context was supplied by a scroll-triggered GitScene; in the
// deck it is supplied per-slide by SlideStage. The consumers do not change.

export type ScenePlayback = {
  /** True once this slide is the active stage, or immediately under reduced motion. */
  shouldPlay: boolean;
  /** Increments each time the slide is (re)entered; children restart their timeline off it. */
  playToken: number;
  /** User prefers reduced motion → render the final static frame, run no tweens. */
  reducedMotion: boolean;
};

export const PlaybackContext = createContext<ScenePlayback>({
  shouldPlay: false,
  playToken: 0,
  reducedMotion: false,
});

/** Visual primitives read their play signal from here. */
export const useScenePlayback = (): ScenePlayback => useContext(PlaybackContext);
