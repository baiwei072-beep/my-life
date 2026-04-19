# Vercel Deployment Guide

## What you need first

1. A `Vercel` account
2. A `GitHub` account
3. This project pushed to a GitHub repository
4. Optional: your own domain, for example `mylife.com`

## What the final URL can look like

- Default Vercel URL:
  - `https://mylife.vercel.app/login`
- Custom domain URL:
  - `https://mylife.com/login`
  - `https://www.mylife.com/login`

## Step 1: put this project on GitHub

From the project directory:

```bash
cd "/Users/mikeee/Desktop/CodeX/Mike Spce/blog"
git init
git add .
git commit -m "Prepare blog for Vercel deployment"
```

Then create a new GitHub repository and push:

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

## Step 2: import into Vercel

1. Sign in to Vercel
2. Click `Add New...` -> `Project`
3. Import your GitHub repository
4. Keep the root directory as this blog folder
5. Deploy

Because this is a static HTML/CSS/JS site and `vercel.json` is already included, Vercel can deploy it directly.

## Step 3: set the project name

In Vercel:

1. Open the project
2. Go to `Settings`
3. Rename the project to `mylife` if available

If `mylife` is already taken, use one of:

- `mylife-space`
- `mylife-app`
- `mylife-room`

## Step 4: verify the public URL

After deploy, the default URL should be:

```text
https://<project-name>.vercel.app/login
```

Because `vercel.json` rewrites `/login` to `login.html`, you can use the cleaner route.

## Step 5: connect your own domain

Official Vercel domain setup docs:

- https://vercel.com/docs/domains/set-up-custom-domain
- https://vercel.com/docs/domains/working-with-domains/add-a-domain

In Vercel:

1. Open the project
2. Go to `Settings` -> `Domains`
3. Add your domain, for example `mylife.com`
4. Vercel will show the exact DNS records required

Typical DNS setup:

- For `www.mylife.com`:
  - `CNAME` -> `cname.vercel-dns.com`
- For apex `mylife.com`:
  - either Vercel nameservers
  - or the exact `A`/`ALIAS` records Vercel gives you

Do not guess the DNS values. Use exactly what Vercel shows in the domain settings page.

## Step 6: wait for DNS + SSL

After DNS is updated:

1. Wait for propagation
2. Vercel will automatically provision HTTPS
3. Test:

```text
https://mylife.com/login
```

## What I can help with next

I can continue with any of these:

1. Convert this static site to `Next.js + Supabase`
2. Prepare a `GitHub` repo structure for direct Vercel import
3. Add real authentication so different users can log in from different browsers and share one real backend
