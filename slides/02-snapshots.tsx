import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import CommitGraph from '../components/git/CommitGraph';
import { dagNodes, dagEdges, dagRefs, dagSteps } from '../data/scenes';

function Snapshots() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Snapshots"
        title="Git saves snapshots"
        lead="Every commit stores a full picture of your files and links it to the one before. A branch is just a pointer at one of them."
      />
      <SlideCanvas>
        <CommitGraph nodes={dagNodes} edges={dagEdges} refs={dagRefs} steps={dagSteps} maxHeight={240} />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'snapshots',
  title: 'Git saves snapshots',
  Component: Snapshots,
  caption: 'Commits link back; a branch points at one.',
  replay: true,
};

export default slide;
