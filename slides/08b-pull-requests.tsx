import React from 'react';
import { GitBranch, GitPullRequest, CheckCircle2, GitMerge, Rocket } from 'lucide-react';
import type { SlideDef } from './types';
import { SlideHeading, SlideCanvas } from '../components/deck/SlideParts';
import DeployPipeline from '../components/git/DeployPipeline';

// The path every change takes. Same pipeline visual as the deploy and CI slides,
// here showing the human workflow end to end.
const stages = [
  { label: 'Branch', sub: 'your change', Icon: GitBranch },
  { label: 'Pull request', sub: 'propose it', Icon: GitPullRequest },
  { label: 'Review', sub: 'checks pass', Icon: CheckCircle2 },
  { label: 'Merge', sub: 'into main', Icon: GitMerge },
  { label: 'Production', sub: 'it is live', Icon: Rocket },
];

function PullRequests() {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeading
        eyebrow="Pull requests"
        title="How a change reaches production"
        lead="You never push straight to main. You propose your change as a pull request, it gets reviewed and checked, and merging it goes live. Some tools call it a merge request. Same thing."
      />
      <SlideCanvas>
        <DeployPipeline stages={stages} />
      </SlideCanvas>
    </div>
  );
}

const slide: SlideDef = {
  id: 'pull-requests',
  title: 'Pull requests',
  Component: PullRequests,
  caption: 'Propose, review, merge. Then it is live.',
  replay: true,
};

export default slide;
