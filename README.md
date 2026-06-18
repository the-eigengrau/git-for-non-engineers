# Git for non-engineers

An interactive deck that teaches git to designers, and a shared repo to practise
it on. The deck is the lesson. Editing the deck is the exercise.

It is built from the animations in the *Git for non-engineers* essay: commit
graphs, the everyday command loop, merge conflicts, deploy pipelines, and
worktrees, turned into slides you drive with the keyboard.

## Run it on your computer

New to this? You only need to do the one-time setup once. After that, getting the
deck running is three commands.

### One-time setup

Install these once. If you already have them, skip ahead.

1. **Node.js** (this runs the project). Download the **LTS** version from
   [nodejs.org](https://nodejs.org) and install it. It comes with `npm`.
2. **git** (this is the tool the whole workshop is about). On a Mac you likely
   have it already. Check with `git -v`. If not, install
   [git](https://git-scm.com/downloads), or on a Mac run `xcode-select --install`.
3. **A code editor**, if you do not have one. [VS Code](https://code.visualstudio.com)
   or [Cursor](https://cursor.com) both work well.

To confirm the first two are ready, open your terminal (Terminal on Mac, or the
terminal inside your editor) and run:

```bash
node -v   # should print v18 or higher
git -v    # should print a version
```

### Get the deck running

```bash
# 1. Download the project
git clone https://github.com/the-eigengrau/git-for-non-engineers.git

# 2. Go into the folder
cd git-for-non-engineers

# 3. Install the dependencies (one time, takes about a minute)
npm install

# 4. Start it
npm run dev
```

Then open the address it prints, usually **http://localhost:3000**. Use the arrow
keys to move through the deck. To stop the server, press `Ctrl+C` in the terminal.

### If something goes wrong

- **`command not found: node` or `npm`** — Node is not installed yet, or the
  terminal needs to be closed and reopened after installing it.
- **A message about the port being in use** — that is fine. The deck just starts
  on the next free port. Open the exact address the terminal printed.
- **An error mentioning the Node version** — you need Node 18 or higher. Install
  the LTS version from [nodejs.org](https://nodejs.org).
- **Still stuck?** Open the folder in Cursor or VS Code and ask the AI: "install
  the dependencies and run this Next.js app." It can do the whole thing for you.

## Present it

| Key | Action |
| --- | --- |
| `→` `Space` `↓` | Next slide |
| `←` `↑` | Previous slide |
| `Home` `End` | First / last slide |
| `R` | Replay the current animation |

You can also click the sides of the screen, swipe on a touchpad or phone, or use
the controls in the bottom corner. Each slide links to a URL, so `#worktrees`
jumps straight there.

## The workshop

The whole point is to use git on something real. This repo is that something.
Every concept in the deck maps to a move you make here.

1. **Clone and run.** `git clone` this repo, `npm install`, `npm run dev`.
2. **Branch.** `git switch -c your-name/your-change`. Name it for intent.
3. **Change something.** Fix a typo, tune a slide, or make your own slide yours (below).
4. **Commit and push.** Small commits, messages that say why.
5. **Open a pull request.** CI runs on its own, and Vercel posts a preview link.
6. **Get it green, get it reviewed, merge.** Main is protected, so a pull request
   and a passing check are the only way in.
7. **Pull main back down.** `git switch main && git pull`. Everyone else's work
   arrives.

### Make your slide yours

Everyone has a slide at the end of the deck. Yours is a small file in
`slides/students/` named after you. Edit it on a branch and open a pull request:

```ts
import { makeStudentSlide } from './_template';

export default makeStudentSlide({
  name: 'Aditi',
  role: 'Product Designer',     // change this
  avatar: '🦊',                 // any emoji, or leave it blank for your initial
  bio: 'I design payments at a fintech and I am here to stop fearing git.',
});
```

Push, and the preview link shows your slide live before it is merged.

#### The merge conflict, on purpose

Once everyone has branched and started editing, the instructor refreshes `main`
(see `scripts/refresh-bios.mjs`), which rewrites the same `bio` line you changed.
When you pull main into your branch, git finds the line changed on both sides and
stops with a conflict:

```ts
<<<<<<< HEAD
  bio: 'We are refreshing the class. Add your line back in.',
=======
  bio: 'I design payments at a fintech and I am here to stop fearing git.',
>>>>>>> your-name/profile
```

That is the lesson, not a mistake. Git is showing you both versions and waiting.
Delete the markers and the line you do not want, keep yours, save, and commit. You
chose what stays.

### Try worktrees

A worktree checks a branch out into its own folder while sharing one repo, so you
can run several ideas at once.

```bash
git worktree add ../gfne-variant-a -b your-name/variant-a
cd ../gfne-variant-a && npm install && npm run dev -- -p 3001
```

Now you have two folders off the same history, each on its own branch and its own
port. Point an AI agent at each with a different brief and watch the variations
side by side. Remove one with `git worktree remove ../gfne-variant-a`.

### Let an agent drive

You do not have to type any of this. Claude Code or Cursor can run git for you.
Describe the outcome in plain English, for example "save this as a checkpoint and
open a pull request called Tune the rebase slide," and review what comes back the
way you would review a junior's work, by looking.

## Deploys

The repo is connected to Vercel. Every branch gets a private preview deployment,
and merging to main ships production. See [`docs/DEPLOY.md`](docs/DEPLOY.md) for
the one-time setup if you are wiring up your own fork.

## Add a slide

See [`CONTRIBUTING.md`](CONTRIBUTING.md). In short: copy a slide file, edit the
copy, and add one line to `slides/index.ts`.

## How it is built

- **Next.js** (Pages Router) and **TypeScript**.
- **Tailwind v4**, with the design tokens in `styles/global.css`.
- **GSAP** for the animations. Each visual primitive lives in `components/git/`
  and plays when its slide becomes active.
- The deck framework is in `components/deck/`. Slides are in `slides/`, one file
  each, registered in `slides/index.ts`.
