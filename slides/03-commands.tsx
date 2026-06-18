import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import CommandMap from '../components/git/CommandMap';

function Commands() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="The daily loop"
        title="A few commands move your work"
        lead="Your work lives in four places. A small set of commands moves it between them, then pushes it up to GitHub for everyone else."
      />
      <SlideCanvas>
        <CommandMap />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'commands',
  title: 'The everyday commands',
  Component: Commands,
  caption: 'Tap any step to see what it means.',
  replay: true,
};

export default slide;
