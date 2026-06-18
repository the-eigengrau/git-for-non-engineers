// Shared types for the animated git visual library.

export type { ScenePlayback } from './playback';

// ---- Commit-graph engine ------------------------------------------------

/** A commit drawn as a node on a grid. `col` advances time →, `lane` stacks branches ↓. */
export type CommitNode = {
  id: string;
  col: number;
  lane: number;
  /** Short label rendered under the node, e.g. a fake SHA "a1b2c3". */
  label?: string;
  /** Branch key used for colouring; "main" reads as the accent branch. */
  branch?: string;
};

/** A parent→child link between two commits. */
export type CommitEdge = { from: string; to: string };

/** A movable label (branch / HEAD / tag) that points at a commit. */
export type BranchRef = {
  name: string;
  /** Commit id this ref currently points at. */
  at: string;
  kind?: 'branch' | 'head' | 'tag';
  /** Sit the label above or below its commit (default above). */
  place?: 'above' | 'below';
  /** Accent (indigo) or neutral (white) colouring. */
  tone?: 'accent' | 'neutral';
};

/** One beat in a scene's animation script. The engine plays these in order. */
export type GraphOp =
  | { type: 'show-node'; id: string }
  | { type: 'show-edge'; from: string; to: string }
  | { type: 'move-ref'; name: string; to: string }
  | { type: 'highlight'; ids: string[] }
  | { type: 'fade'; ids: string[]; to?: number }
  /** Recolour a ref's label + tick, e.g. a branch turning into the trunk on merge. */
  | { type: 'tint-ref'; name: string; tone: 'accent' | 'neutral' }
  | { type: 'pause'; ms?: number };
