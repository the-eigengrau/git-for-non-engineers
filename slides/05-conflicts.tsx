import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import MergeConflictDiff from '../components/git/MergeConflictDiff';

function Conflicts() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Merge conflicts"
        title="A conflict is just a choice"
        lead="It happens when two people change the same line. Git keeps both versions and waits for you to pick the one that is right."
      />
      <SlideCanvas>
        <MergeConflictDiff
          ours="Welcome back."
          theirs="Hello, friend."
          resolved="Welcome back, friend."
          oursLabel="Your version"
          theirsLabel="Their version"
          oursInitials="A"
          theirsInitials="B"
          resolvedInitials="A"
        />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'conflicts',
  title: 'Merge conflicts',
  Component: Conflicts,
  caption: 'Two edits, one line. You decide.',
  replay: true,
};

export default slide;
