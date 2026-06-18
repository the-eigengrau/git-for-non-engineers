import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, StepList } from '../components/deck/SlideParts';

const steps = [
  <>Clone this repo and run it on your machine.</>,
  <>Make a branch named for your change.</>,
  <>Edit a slide, or make your own slide yours on the next screen.</>,
  <>Push, open a pull request, and watch the checks and the preview link.</>,
  <>Get it reviewed, merge to main, and pull main back down.</>,
];

function GettingStarted() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Your turn"
        title="Start here"
        lead="You do not need all of this today. Get the loop into your hands and the rest follows."
      />
      <StepList items={steps} />
    </div>
  );
}

const slide: SlideDef = {
  id: 'getting-started',
  title: 'Getting started',
  Component: GettingStarted,
  layout: 'closing',
  caption: 'Run status until it is automatic.',
};

export default slide;
