import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import DeployPipeline from '../components/git/DeployPipeline';
import { deployStages } from '../data/scenes';

function Shipping() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Shipping"
        title="Deploying stops being a task"
        lead="Connect the repo to Vercel once. Every push builds, and every branch gets a private preview link you can send before anything is live."
      />
      <SlideCanvas>
        <DeployPipeline stages={deployStages} />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'shipping',
  title: 'Easy shipping',
  Component: Shipping,
  caption: 'Every push builds; merging ships to production.',
  replay: true,
};

export default slide;
