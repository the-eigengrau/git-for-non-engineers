import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, StepList } from '../components/deck/SlideParts';

const steps = [
  <>Branch: <span className="text-gray-medium">git switch -c your-name/profile</span></>,
  <>Open your slide in <span className="text-gray-medium">slides/students/</span> and replace the name, bio, and avatar.</>,
  <>Push and open a pull request. The preview link shows your slide live.</>,
  <>When main has moved on, pull and resolve the conflict on your bio. You choose what stays.</>,
];

function TheClass() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="The class"
        title="Make your slide yours"
        lead="Everyone has a slide in the pages that follow. Find yours, and replace the placeholder with a line about who you are and an avatar."
      />
      <StepList items={steps} />
    </div>
  );
}

const slide: SlideDef = {
  id: 'the-class',
  title: 'The class',
  Component: TheClass,
  layout: 'closing',
  caption: 'Edit yours on a branch, then open a pull request.',
};

export default slide;
