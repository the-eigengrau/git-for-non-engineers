# Deploys

This deck is a standard Next.js app, so it deploys to Vercel with no
configuration. Connecting it once turns deploying into something that just
happens: every branch gets a preview, and merging to main ships production.

## One-time setup

1. Sign in at [vercel.com](https://vercel.com) and choose **Add New → Project**.
2. Import the `git-for-non-engineers` repository.
3. Accept the defaults. Vercel detects Next.js, so the build command is
   `next build` and no environment variables are needed.
4. Deploy.

From the command line instead:

```bash
npm i -g vercel
vercel login
vercel link      # connect this folder to a Vercel project
vercel           # deploy a preview
vercel --prod    # deploy production
```

## What you get

- **Preview deployments.** Every push to a branch and every pull request gets its
  own URL. Send it to a reviewer before anything is live.
- **Production.** Merging to `main` deploys the production site.
- **Checks.** The preview link and the GitHub Actions CI check both appear on the
  pull request, so review happens against a real, working version.
