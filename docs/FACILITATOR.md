# Running the workshop (facilitator notes)

This is for you, the instructor. Students never need this file.

## What the facilitator does

`scripts/facilitate.mjs` does one pass over the open pull requests:

1. **Arms the conflict.** When a student opens a pull request on their own slide
   in `slides/students/`, and it has not been armed yet, the script rewrites that
   same student's `bio` line on `main` (a one-line commit marked `[skip ci]`).
   GitHub then sees the same line changed on both sides and flags the PR as
   conflicting. The script labels the PR `gfne-armed` and comments with how to
   resolve it.
2. **Merges the resolved ones.** Once an armed PR is mergeable again (the student
   fixed the conflict) and the `build` check is green, it approves and squash
   merges, and says thanks.

Auto-merge is limited to PRs that touch **only** a student's own slide. Anything
that touches the deck framework or other slides is left for you, and listed as
`for you` in the output.

## Run it

```bash
node scripts/facilitate.mjs            # one pass
node scripts/facilitate.mjs --dry-run  # show what it would do, change nothing
```

Loop it during the session, once every minute or two:

```bash
while true; do node scripts/facilitate.mjs; sleep 90; done
```

Press `Ctrl+C` to stop. It is safe to run repeatedly: a PR is only armed once
(tracked by the `gfne-armed` label), and only merged once it is resolved and
green.

Requirements: the `gh` CLI authenticated as a repo admin (you). The script talks
to GitHub over the API, so it does not depend on your local checkout.

## The intended student flow

1. Student branches, edits their slide's `bio`, pushes, and opens a PR.
2. The facilitator arms the conflict on their next pass.
3. The student pulls `main` into their branch, sees the conflict in their slide,
   keeps their line, and pushes the resolution.
4. The facilitator merges the resolved, green PR.

## Resetting between runs

To re-arm everyone at once (a different round, or a fresh cohort), use
`scripts/refresh-bios.mjs` on `main`, then remove the `gfne-armed` label from any
PRs you want armed again. To start a brand new cohort, edit the names and roles
in `slides/students/` and commit.
