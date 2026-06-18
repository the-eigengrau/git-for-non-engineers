// Instructor tool. Run this on main once students have branched and started
// editing their own slide. It rewrites every student's `bio` line to a fresh
// placeholder, so that when a student pulls main into their branch, git sees
// the same line changed on both sides and raises a merge conflict for them to
// resolve. That is the lesson.
//
//   node scripts/refresh-bios.mjs
//   git commit -am "Refresh the class bios"
//   git push            # main allows admins to push directly
//
// Run it again with a different marker any time you want a fresh conflict.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const studentsDir = join(here, '..', 'slides', 'students');

// Change this line to create a new conflict in a later round.
const MARKER = 'We are refreshing the class. Add your line back in.';

const bioPattern = /bio:\s*'(?:[^'\\]|\\.)*'/;

let changed = 0;
for (const file of readdirSync(studentsDir)) {
  if (!file.endsWith('.tsx') || file.startsWith('_') || file === 'index.ts') continue;
  const path = join(studentsDir, file);
  const src = readFileSync(path, 'utf8');
  if (!bioPattern.test(src)) continue;
  const next = src.replace(bioPattern, `bio: '${MARKER}'`);
  if (next !== src) {
    writeFileSync(path, next);
    changed += 1;
  }
}

console.log(`Refreshed ${changed} student bios. Commit and push to main to arm the conflict.`);
