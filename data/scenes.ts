// Compiler-checked scene data for the commit-graph engine and pipelines.
// Kept as plain exports (no JSX) so slides compose the bare primitives, and so
// "tweak the graph" stays a small, readable diff for a workshop exercise.
import {
  GitPullRequest,
  PlayCircle,
  Eye,
  GitMerge,
  Rocket,
  Upload,
} from 'lucide-react';
import type { CommitEdge, CommitNode, BranchRef, GraphOp } from '../components/git/types';
import type { Stage } from '../components/git/DeployPipeline';

// ---------------------------------------------------------------- DAG intro
export const dagNodes: CommitNode[] = [
  { id: 'c1', col: 0, lane: 0, branch: 'main' },
  { id: 'c2', col: 1, lane: 0, branch: 'main' },
  { id: 'c3', col: 2, lane: 0, branch: 'main' },
  { id: 'c4', col: 3, lane: 0, branch: 'main' },
  { id: 'f1', col: 2, lane: 1, branch: 'feature' },
  { id: 'f2', col: 3, lane: 1, branch: 'feature' },
];
export const dagEdges: CommitEdge[] = [
  { from: 'c1', to: 'c2' },
  { from: 'c2', to: 'c3' },
  { from: 'c3', to: 'c4' },
  { from: 'c2', to: 'f1' },
  { from: 'f1', to: 'f2' },
];
export const dagRefs: BranchRef[] = [
  { name: 'main', at: 'c1', place: 'above', tone: 'accent' },
  { name: 'feature', at: 'f1', place: 'below', tone: 'neutral' },
];
export const dagSteps: GraphOp[] = [
  { type: 'show-node', id: 'c1' },
  { type: 'show-edge', from: 'c1', to: 'c2' },
  { type: 'show-node', id: 'c2' },
  { type: 'move-ref', name: 'main', to: 'c2' },
  { type: 'show-edge', from: 'c2', to: 'c3' },
  { type: 'show-node', id: 'c3' },
  { type: 'move-ref', name: 'main', to: 'c3' },
  { type: 'pause' },
  { type: 'show-edge', from: 'c2', to: 'f1' },
  { type: 'show-node', id: 'f1' },
  { type: 'show-edge', from: 'f1', to: 'f2' },
  { type: 'show-node', id: 'f2' },
  { type: 'move-ref', name: 'feature', to: 'f2' },
  { type: 'show-edge', from: 'c3', to: 'c4' },
  { type: 'show-node', id: 'c4' },
  { type: 'move-ref', name: 'main', to: 'c4' },
];

// -------------------------------------------------------------------- Merge
export const mergeNodes: CommitNode[] = [
  { id: 'm1', col: 0, lane: 0, branch: 'main' },
  { id: 'm2', col: 1, lane: 0, branch: 'main' },
  { id: 'f1', col: 1, lane: 1, branch: 'feature' },
  { id: 'f2', col: 2, lane: 1, branch: 'feature' },
  { id: 'mg', col: 3, lane: 0, branch: 'main' },
];
export const mergeEdges: CommitEdge[] = [
  { from: 'm1', to: 'm2' },
  { from: 'm1', to: 'f1' },
  { from: 'f1', to: 'f2' },
  { from: 'm2', to: 'mg' },
  { from: 'f2', to: 'mg' },
];
export const mergeRefs: BranchRef[] = [
  { name: 'main', at: 'm1', place: 'above', tone: 'accent' },
  { name: 'feature', at: 'f1', place: 'below', tone: 'neutral' },
];
export const mergeSteps: GraphOp[] = [
  { type: 'show-node', id: 'm1' },
  { type: 'show-edge', from: 'm1', to: 'm2' },
  { type: 'show-node', id: 'm2' },
  { type: 'move-ref', name: 'main', to: 'm2' },
  { type: 'show-edge', from: 'm1', to: 'f1' },
  { type: 'show-node', id: 'f1' },
  { type: 'show-edge', from: 'f1', to: 'f2' },
  { type: 'show-node', id: 'f2' },
  { type: 'move-ref', name: 'feature', to: 'f2' },
  { type: 'pause' },
  { type: 'show-edge', from: 'm2', to: 'mg' },
  { type: 'show-edge', from: 'f2', to: 'mg' },
  { type: 'show-node', id: 'mg' },
  { type: 'move-ref', name: 'main', to: 'mg' },
  // The branch folds into the trunk: its label slides under the merge commit and
  // turns from white to the accent indigo.
  { type: 'move-ref', name: 'feature', to: 'mg' },
  { type: 'tint-ref', name: 'feature', tone: 'accent' },
  { type: 'highlight', ids: ['mg'] },
];

// ------------------------------------------------------------------- Rebase
export const rebaseNodes: CommitNode[] = [
  { id: 'a', col: 0, lane: 0, branch: 'main' },
  { id: 'b', col: 1, lane: 0, branch: 'main' },
  { id: 'c', col: 2, lane: 0, branch: 'main' },
  { id: 'x', col: 2, lane: 1, branch: 'feature', label: 'x' },
  { id: 'y', col: 3, lane: 1, branch: 'feature', label: 'y' },
  { id: 'x2', col: 3, lane: 0, branch: 'feature', label: 'x′' },
  { id: 'y2', col: 4, lane: 0, branch: 'feature', label: 'y′' },
];
export const rebaseEdges: CommitEdge[] = [
  { from: 'a', to: 'b' },
  { from: 'b', to: 'c' },
  { from: 'b', to: 'x' },
  { from: 'x', to: 'y' },
  { from: 'c', to: 'x2' },
  { from: 'x2', to: 'y2' },
];
// Only `main` is labelled here; the x → x′ copies carry the rebase story and a
// second label below would collide with the node labels.
export const rebaseRefs: BranchRef[] = [{ name: 'main', at: 'a', place: 'above', tone: 'accent' }];
export const rebaseSteps: GraphOp[] = [
  { type: 'show-node', id: 'a' },
  { type: 'show-edge', from: 'a', to: 'b' },
  { type: 'show-node', id: 'b' },
  { type: 'show-edge', from: 'b', to: 'c' },
  { type: 'show-node', id: 'c' },
  { type: 'move-ref', name: 'main', to: 'c' },
  { type: 'show-edge', from: 'b', to: 'x' },
  { type: 'show-node', id: 'x' },
  { type: 'show-edge', from: 'x', to: 'y' },
  { type: 'show-node', id: 'y' },
  { type: 'pause' },
  { type: 'show-edge', from: 'c', to: 'x2' },
  { type: 'show-node', id: 'x2' },
  { type: 'show-edge', from: 'x2', to: 'y2' },
  { type: 'show-node', id: 'y2' },
  { type: 'fade', ids: ['x', 'y'], to: 0.16 },
  { type: 'highlight', ids: ['x2', 'y2'] },
];

// ----------------------------------------------------------------- Deploy
export const deployStages: Stage[] = [
  { label: 'Push', sub: 'your branch', Icon: Upload },
  { label: 'Build', sub: 'automatic', Icon: PlayCircle },
  { label: 'Preview', sub: 'a live URL', Icon: Eye },
  { label: 'Production', sub: 'after merge', Icon: Rocket },
];

// ----------------------------------------------------------------- CI / CD
export const ciStages: Stage[] = [
  { label: 'Open PR', sub: 'a branch', Icon: GitPullRequest },
  { label: 'Checks', sub: 'run on their own', Icon: PlayCircle },
  { label: 'Review', sub: 'on the preview', Icon: Eye },
  { label: 'Merge', sub: 'when green', Icon: GitMerge },
];
