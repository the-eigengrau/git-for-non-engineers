import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import CommitGraph from '../components/git/CommitGraph';
import { rebaseNodes, rebaseEdges, rebaseRefs, rebaseSteps } from '../data/scenes';

function Rebase() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Advanced · rebase"
        title="Rebase replays your work"
        lead="Main moved on while you worked. Rebase lifts your commits off, slides your branch up to today's main, and replays them on top in a straight line."
      />
      <SlideCanvas>
        <CommitGraph nodes={rebaseNodes} edges={rebaseEdges} refs={rebaseRefs} steps={rebaseSteps} maxHeight={250} />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'rebase',
  title: 'Rebase',
  Component: Rebase,
  caption: 'Your commits, replayed onto the latest main.',
  replay: true,
};

export default slide;
