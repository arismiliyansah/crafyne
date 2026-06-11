# Deploying to Hostinger (Cloud/Business · Node.js app) via GitHub Actions

This app is a **Next.js 16 server app** (SSR, Server Actions, Supabase auth) — it needs a
running **Node.js ≥ 20.9** process. It is **not** a static site and cannot run on plain
shared/PHP hosting.

**Strategy:** GitHub Actions builds the app (Hostinger Cloud can run out of memory building
Next.js), produces a lean self-contained bundle (`output: 'standalone'`), ships it over SSH, and
restarts the Node app. Every push to `main` deploys automatically.

---

## 1. One-time Hostinger setup (hPanel)

1. **Create the Node.js app** — hPanel → *Advanced → Node.js* (or *Website → Node.js app*):
   - **Node version:** 20 (or the highest ≥ 20.9 offered).
   - **Application root:** e.g. `domains/yourdomain.com/app` (note this path — it is `HOSTINGER_DEPLOY_PATH`).
   - **Application URL:** your domain.
   - **Startup file:** `server.js` (the standalone bundle puts this at the app root).
2. **Set runtime environment variables** on that Node app (hPanel Node.js app → *Environment variables*):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `RESEND_API_KEY` — for inquiry email notifications
   - `ADMIN_EMAIL` — where inquiry emails go
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — optional analytics
   - `NODE_ENV=production` (usually set automatically)
3. **Enable SSH** — hPanel → *Advanced → SSH Access*. Note the **host**, **port** (Hostinger is
   often `65002`), and **username**.
4. **Add a deploy key:** create an SSH keypair for CI and authorize the public key:
   ```bash
   ssh-keygen -t ed25519 -f hostinger_deploy -N ""
   # paste hostinger_deploy.pub into the server's ~/.ssh/authorized_keys (via hPanel SSH or terminal)
   ```
   Keep the **private** key (`hostinger_deploy`) for the GitHub secret below.

## 2. GitHub repository secrets

Repo → *Settings → Secrets and variables → Actions → New repository secret*:

| Secret | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | optional (set empty if unused) |
| `HOSTINGER_SSH_HOST` | SSH host / server IP |
| `HOSTINGER_SSH_PORT` | SSH port (e.g. `65002`) |
| `HOSTINGER_SSH_USER` | SSH username |
| `HOSTINGER_SSH_KEY` | **private** deploy key (full contents of `hostinger_deploy`) |
| `HOSTINGER_DEPLOY_PATH` | the Node app application root, e.g. `domains/yourdomain.com/app` |

> The `NEXT_PUBLIC_*` keys appear in **both** places: in GitHub (baked into the client bundle at
> build time) **and** in the Hostinger Node app (read by the server at runtime).

## 3. How it deploys

`.github/workflows/deploy.yml` runs on every push to `main` (and via *Run workflow*):

1. `npm ci` → `npm run build` (standalone) in CI.
2. Copies `.next/static` and `public/` into `.next/standalone/` (Next omits these by default).
3. `rsync` the standalone bundle to `HOSTINGER_DEPLOY_PATH` over SSH.
4. Restarts the app: `touch tmp/restart.txt` (Phusion Passenger graceful restart).

## 4. First deploy

1. Add all secrets (section 2) and finish the hPanel setup (section 1) **first**.
2. Merge this PR to `main` (or run the workflow manually). The Actions tab shows progress.
3. Visit your domain. Check the homepage, `/work`, `/blog`, `/contact`, `/admin/login`.

## 5. Database migrations

Migrations are **not** part of CI. Apply new files in `supabase/migrations/` manually in the
Supabase **SQL Editor** (as with `009`/`010`). The app tolerates missing tables (sections hide),
so a deploy never hard-fails on a pending migration — but run them to populate new content.

## 6. Notes & troubleshooting

- **Restart mechanism:** the workflow assumes Passenger (`tmp/restart.txt`). If your panel restarts
  differently, replace the *Restart Node app* step (e.g. an hPanel-provided command, or
  `passenger-config restart-app <path>`), or just restart from hPanel after a deploy.
- **Port binding:** the standalone `server.js` listens on `process.env.PORT`. Passenger provides
  this. If the app doesn't come up, confirm the **Startup file** is `server.js` and the app root
  matches `HOSTINGER_DEPLOY_PATH`.
- **`sharp`/images:** `next/image` optimization needs `sharp`; it ships with the standalone bundle.
  Remote images are already allow-listed (`*.supabase.co`, `images.unsplash.com`) in `next.config.ts`.
- **Stale files:** the rsync intentionally does not use `--delete` (to avoid clobbering
  Passenger's own files). Hashed assets make leftovers harmless; clear the app root manually if
  you ever want a clean slate.

## Alternative: Hostinger built-in GIT auto-deploy

If you prefer no GitHub Actions: hPanel → *Advanced → GIT* can auto-pull `main` on push. You then
need the Node app to run `npm install` + `npm run build` + restart on each pull. This builds **on
the server**, which may exceed Cloud memory limits for Next.js — the CI approach above avoids that.
