import type { SlideDef } from './types';
import title from './01-title';
import snapshots from './02-snapshots';
import commands from './03-commands';
import branching from './04-branching';
import conflicts from './05-conflicts';
import shipping from './06-shipping';
import letTheAiDrive from './07-ai';
import cloudAgents from './08-cloud-agents';
import pullRequests from './08b-pull-requests';
import manners from './09-manners';
import rebase from './10-rebase';
import worktrees from './11-worktrees';
import gettingStarted from './12-getting-started';
import theClass from './13-class';
import { studentSlides } from './students';

// The deck, in order. Adding an instructional slide means creating its file and
// adding one line here. The class slides come last, one per student, sorted
// alphabetically in slides/students.
export const slides: SlideDef[] = [
  title,
  snapshots,
  commands,
  branching,
  conflicts,
  shipping,
  letTheAiDrive,
  cloudAgents,
  pullRequests,
  manners,
  rebase,
  worktrees,
  gettingStarted,
  theClass,
  ...studentSlides,
];
