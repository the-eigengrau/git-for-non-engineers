# Contributing

This repo is a teaching deck and a git playground. Changes are welcome, and the
act of making one is the point of the workshop. Branch, edit, open a pull
request, and let the checks run.

## Add a slide

Each slide is one file in `slides/`, and the order lives in `slides/index.ts`.
Adding a slide is two steps:

1. Create `slides/14-your-slide.tsx`. The quickest start is to copy an existing
   slide, for example `slides/02-snapshots.tsx`, and change the content.

   ```tsx
   import React from 'react';
   import type { SlideDef } from './types';
   import { SlideHeading } from '../components/deck/SlideParts';

   function YourSlide() {
     return (
       <SlideHeading eyebrow="Section" title="Your title" lead="One clear line." />
     );
   }

   const slide: SlideDef = {
     id: 'your-slide',
     title: 'Your slide',
     Component: YourSlide,
   };

   export default slide;
   ```

2. Register it in `slides/index.ts`: add the import and add one line to the
   `slides` array where you want it to appear.

## Your student slide

The class slides at the end come from `slides/students/`, one file per person,
sorted alphabetically. Yours holds your name, role, bio, and avatar. Editing it
is the main workshop exercise; see the README for the flow and the conflict that
gets set up on purpose. To add a new person, copy a file in that folder and add
one import line to `slides/students/index.ts`.

## Building blocks

Compose slides from the shared parts in `components/deck/SlideParts.tsx`:

- `SlideHeading` for the eyebrow, title, and one-line lead.
- `SlideCanvas` for the raised surface an animation sits on.
- `PullQuote` for a single compressed line.
- `StepList` for short numbered habits or steps.

The animated primitives live in `components/git/` (`CommitGraph`, `CommandMap`,
`DeployPipeline`, `MergeConflictDiff`, `WorktreeVariants`). They play when their
slide becomes active, so you do not wire up any animation yourself. Set
`replay: true` on the `SlideDef` to show the replay control.

## Style

The deck follows two house rules, and so should anything you add.

**Copy.** Plain, confident, second person. Short declarative sentences. No em
dashes, no exclamation marks, no filler adverbs. Lead with the reader's problem,
then name the answer. Captions are a few words on the takeaway, not a narration.

**Illustration.** Spare and dark, in the spirit of a quiet 3Blue1Brown. One idea
per figure. A single indigo accent (`#7376F7`), white for the other element,
muted grays for everything secondary. Motion is gentle and plays once. Every
scene must read correctly as a static frame under reduced motion.

## Before you open a pull request

```bash
npm run typecheck
npm run build
```

CI runs the same two commands. Keep the change small and about one thing, and
write the message for the next person: say why, not what.
