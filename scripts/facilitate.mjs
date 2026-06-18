// Workshop facilitator. Runs one pass over the open pull requests and does two
// jobs, the way a patient instructor would:
//
//   1. Arm the conflict. When someone opens a PR on their own student slide and
//      it has not been armed yet, rewrite that same person's `bio` line on main
//      (via the GitHub Contents API, with [skip ci]). GitHub then sees the same
//      line changed on both sides and marks the PR as conflicting. We tag the PR
//      `gfne-armed` and leave a friendly note on how to resolve it.
//
//   2. Merge the resolved ones. When an armed PR is mergeable again (the student
//      fixed the conflict) and the `build` check is green, approve and squash it.
//
// Auto-merge is restricted to PRs that only touch a student's own slide, so core
// changes always go through you. Run it on a loop during the workshop:
//
//   node scripts/facilitate.mjs            # do a pass
//   node scripts/facilitate.mjs --dry-run  # show what it would do, change nothing
//
// Requires the `gh` CLI, authenticated as a repo admin.

import { execFileSync } from 'node:child_process';

const REPO = 'the-eigengrau/git-for-non-engineers';
const ARMED_LABEL = 'gfne-armed';
const MARKER = 'We just refreshed the class roster. Add your line back in.';
const DRY = process.argv.includes('--dry-run');

const isStudentSlide = (p) => /^slides\/students\/[a-z0-9][a-z0-9-]*\.tsx$/.test(p);

function gh(args, { allowFail = false } = {}) {
  try {
    return execFileSync('gh', args, { encoding: 'utf8' });
  } catch (err) {
    if (allowFail) return null;
    throw new Error(`gh ${args.join(' ')}\n${err.stderr || err.message}`);
  }
}

const log = (...a) => console.log(...a);

function ensureLabel() {
  if (DRY) return;
  gh(
    ['label', 'create', ARMED_LABEL, '--repo', REPO, '--color', '7376F7',
     '--description', 'Conflict armed by the workshop facilitator'],
    { allowFail: true },
  );
}

// True when the `build` check has finished successfully and nothing else failed.
function ciGreen(pr) {
  const rollup = pr.statusCheckRollup || [];
  if (rollup.length === 0) return false;
  const ok = (c) => {
    const s = (c.conclusion || c.state || '').toUpperCase();
    return ['SUCCESS', 'NEUTRAL', 'SKIPPED'].includes(s);
  };
  const build = rollup.find((c) => (c.name || c.context) === 'build');
  return !!build && ok(build) && rollup.every(ok);
}

function armBio(path, prNumber, author) {
  // Read the current file on main, swap the bio line, write it back as one commit.
  const meta = JSON.parse(gh(['api', `repos/${REPO}/contents/${path}?ref=main`]));
  const current = Buffer.from(meta.content, 'base64').toString('utf8');
  if (current.includes(`bio: '${MARKER}'`)) return false; // already refreshed on main
  const next = current.replace(/bio:\s*'(?:[^'\\]|\\.)*'/, `bio: '${MARKER}'`);
  if (next === current) return false;

  if (DRY) {
    log(`  would rewrite ${path} on main to arm PR #${prNumber}`);
    return true;
  }

  gh([
    'api', '-X', 'PUT', `repos/${REPO}/contents/${path}`,
    '-f', `message=Refresh the class bio [skip ci]`,
    '-f', `content=${Buffer.from(next).toString('base64')}`,
    '-f', `sha=${meta.sha}`,
    '-f', 'branch=main',
  ]);
  return true;
}

function comment(prNumber, body) {
  if (DRY) return;
  gh(['pr', 'comment', String(prNumber), '--repo', REPO, '--body', body]);
}

function main() {
  ensureLabel();

  const prs = JSON.parse(
    gh([
      'pr', 'list', '--repo', REPO, '--state', 'open', '--limit', '100',
      '--json', 'number,title,author,labels,files,mergeable,statusCheckRollup,headRefName',
    ]),
  );

  if (prs.length === 0) {
    log('No open pull requests. Nothing to do.');
    return;
  }

  let armed = 0;
  let merged = 0;
  let waiting = 0;
  let manual = 0;

  for (const pr of prs) {
    const author = pr.author?.login || 'there';
    const changed = pr.files.map((f) => f.path);
    const studentFiles = changed.filter(isStudentSlide);
    const onlyStudent = changed.length > 0 && changed.every(isStudentSlide);
    const isArmed = (pr.labels || []).some((l) => l.name === ARMED_LABEL);

    // A profile PR that has not been armed yet -> create the conflict.
    if (studentFiles.length > 0 && !isArmed) {
      let didArm = false;
      for (const f of studentFiles) didArm = armBio(f, pr.number, author) || didArm;
      if (didArm) {
        if (!DRY) gh(['pr', 'edit', String(pr.number), '--repo', REPO, '--add-label', ARMED_LABEL]);
        comment(
          pr.number,
          `Heads up @${author} — main just moved, and it touched the same line you did, so this PR now has a merge conflict. That is on purpose.\n\n` +
            'To resolve it, from your branch:\n\n' +
            '```bash\ngit fetch origin\ngit merge origin/main\n```\n\n' +
            'Git will mark the clash in your slide. Keep your line, delete the conflict markers and the other version, then commit and push. The PR will go green and I will merge it.',
        );
        log(`armed  PR #${pr.number} (${author})`);
        armed += 1;
      }
      continue;
    }

    // An armed profile PR that is resolved and green -> merge it.
    if (isArmed && pr.mergeable === 'MERGEABLE' && ciGreen(pr)) {
      if (!onlyStudent) {
        log(`manual PR #${pr.number} (${author}) armed + green but touches non-student files`);
        manual += 1;
        continue;
      }
      if (DRY) {
        log(`  would approve and merge PR #${pr.number} (${author})`);
        merged += 1;
        continue;
      }
      gh(['pr', 'review', String(pr.number), '--repo', REPO, '--approve', '--body', 'Resolved and green. Welcome to the class.']);
      gh(['pr', 'merge', String(pr.number), '--repo', REPO, '--squash', '--delete-branch']);
      comment(pr.number, `Merged to main. Nice work, @${author}.`);
      log(`merged PR #${pr.number} (${author})`);
      merged += 1;
      continue;
    }

    // Everything else: report, do not touch.
    if (studentFiles.length === 0) {
      log(`manual PR #${pr.number} (${author}) is not a profile change`);
      manual += 1;
    } else {
      log(`wait   PR #${pr.number} (${author}) armed, awaiting resolve or green CI`);
      waiting += 1;
    }
  }

  log(`\nPass complete${DRY ? ' (dry run)' : ''}: ${armed} armed, ${merged} merged, ${waiting} waiting, ${manual} for you.`);
}

main();
