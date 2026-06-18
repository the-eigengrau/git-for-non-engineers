import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import CommitGraph from '../components/git/CommitGraph';
import { mergeNodes, mergeEdges, mergeRefs, mergeSteps } from '../data/scenes';

function Branching() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Branching"
        title="Two ideas at once, then merged"
        lead="A branch lets a second idea move forward without touching the first. When it is ready, a merge weaves it back into the trunk."
      />
      <SlideCanvas>
        <CommitGraph nodes={mergeNodes} edges={mergeEdges} refs={mergeRefs} steps={mergeSteps} maxHeight={240} />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'branching',
  title: 'Branching and merging',
  Component: Branching,
  caption: 'A merge commit ties two branches together.',
  replay: true,
};

export default slide;
