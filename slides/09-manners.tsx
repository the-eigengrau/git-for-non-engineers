import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, StepList } from '../components/deck/SlideParts';

const manners = [
  <>Name branches for intent. <span className="text-gray-medium">fix/login-redirect</span> tells the team everything.</>,
  <>Keep each request small and about one thing. A reviewer can hold it in their head.</>,
  <>Write the message for the next human. Say why, not what. The diff shows what.</>,
  <>Catch up to the latest main before you ask for review. It spares everyone a tangle.</>,
  <>Match the patterns already in the codebase before inventing your own.</>,
];

function Manners() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Manners"
        title="A few habits keep trust"
        lead="Working alone, git forgives. On a real project with real users, small habits spare everyone. None of them are technical."
      />
      <StepList items={manners} />
    </div>
  );
}

const slide: SlideDef = {
  id: 'manners',
  title: 'Manners',
  Component: Manners,
  caption: 'A pull request is a piece of writing.',
};

export default slide;
