import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import WorktreeVariants from '../components/git/WorktreeVariants';

function Worktrees() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Advanced · worktrees"
        title="Explore variants side by side"
        lead="A worktree checks a branch out into its own folder, all sharing one repo. Point an agent at each, with a different brief, and watch the variations take shape at once."
      />
      <SlideCanvas>
        <WorktreeVariants />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'worktrees',
  title: 'Worktrees',
  Component: Worktrees,
  caption: 'Each variant runs as its own preview.',
  replay: true,
};

export default slide;
