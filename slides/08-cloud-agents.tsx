import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import DeployPipeline from '../components/git/DeployPipeline';
import { ciStages } from '../data/scenes';

function CloudAgents() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Cloud agents"
        title="Agents open requests while you work"
        lead="An agent works in its own copy in the cloud, makes a branch, and opens a pull request. Waiting on the other side, checks guard the main branch."
      />
      <SlideCanvas>
        <DeployPipeline stages={ciStages} />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'cloud-agents',
  title: 'Cloud agents',
  Component: CloudAgents,
  caption: 'Checks must pass before anything merges.',
  replay: true,
};

export default slide;
