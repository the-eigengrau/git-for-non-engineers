import React, { useMemo } from 'react';
import { PlaybackContext, type ScenePlayback } from '../git/playback';

type SlideStageProps = {
  /** True when this slide is the current stage. */
  active: boolean;
  /** Bumped on each (re)entry so the slide's animation replays. */
  playToken: number;
  reducedMotion: boolean;
  children: React.ReactNode;
};

// Provides the per-slide playback contract the visual primitives consume. This
// is the deck's stand-in for the blog's scroll-triggered GitScene: a primitive
// plays when its slide is active (or immediately under reduced motion).
export default function SlideStage({ active, playToken, reducedMotion, children }: SlideStageProps) {
  const shouldPlay = active || reducedMotion;
  const value = useMemo<ScenePlayback>(
    () => ({ shouldPlay, playToken, reducedMotion }),
    [shouldPlay, playToken, reducedMotion],
  );
  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}
