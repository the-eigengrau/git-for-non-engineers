import type { ComponentType, ReactNode } from 'react';

// One slide in the deck. Each lives in its own file (see slides/index.ts), so
// "add a slide" is a clean git exercise: create a file, add one line to the
// registry. Two people doing that at once produces a small, teachable conflict.
export type SlideDef = {
  /** Stable id, used as the React key and the deep-link hash. */
  id: string;
  /** Short title announced to screen readers on slide change. */
  title: string;
  /** The slide body. */
  Component: ComponentType;
  /** Chrome variant. Controls framing only, not content. Defaults to 'content'. */
  layout?: 'title' | 'content' | 'closing';
  /** Quiet caption shown under the slide, describing the takeaway in a few words. */
  caption?: ReactNode;
  /** Show the replay affordance (animated slides). Auto-hidden under reduced motion. */
  replay?: boolean;
};
