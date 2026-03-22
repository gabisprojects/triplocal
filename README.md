# TripLocal 🌍

**AI-powered local experience plans for slow travelers.**

Live like a local, not a tourist. TripLocal generates personalised, day-by-day local guides based on your destination, how long you're staying, your vibe, and who you're traveling with.

→ **[Live demo](https://your-domain.com)**

---

## What it does

- **Duration-aware planning** — a 3-day visitor and a 3-week resident get fundamentally different plans
- **Vibe-first discovery** — match recommendations to how you want to feel, not just what you want to do
- **Local Gems section** — curated hidden spots that don't appear in any guidebook
- **Plan refinement** — tweak your plan up to 3 times without re-doing onboarding
- **Secure API** — Claude API key lives server-side, never exposed in the browser

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS — zero dependencies |
| Backend | Node.js serverless function (Vercel) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Hosting | Vercel (free tier) |
| Domain | Custom domain via Vercel |

---

## Deploy to Vercel in 5 minutes

### Prerequisites
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free)
- An [Anthropic API key](https://console.anthropic.com)

---

### Step 1 — Push to GitHub

```bash
# Clone or download this repo, then:
git init
git add .
git commit -m "Initial TripLocal commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/triplocal.git
git push -u origin main
```

---

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your `triplocal` repo
5. Leave all build settings as default
6. Click **"Deploy"**

Vercel will detect the `vercel.json` config automatically.

---

### Step 3 — Add your API key

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (starts with `sk-ant-...`)
   - **Environment:** Production, Preview, Development
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** to apply the key

---

### Step 4 — Add your custom domain

1. In Vercel project settings, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g. `triplocal.app`)
4. Follow the DNS instructions Vercel provides
5. DNS propagation takes 5–60 minutes

**Domain suggestions:** `triplocal.app` · `triplocal.co` · `golocal.travel` · `likelocal.app`

---

### Step 5 — Done ✦

Your live URL will be:
- Vercel default: `https://triplocal.vercel.app`
- Custom domain: `https://triplocal.app` (or whatever you chose)

---

## Project structure

```
triplocal/
├── api/
│   └── generate.js        # Serverless function — Claude API proxy
├── public/
│   └── index.html         # Full frontend (single file)
├── vercel.json            # Vercel routing config
└── README.md
```

---

## How the API works

All AI calls go through `/api/generate` — a Vercel serverless function that:

1. Receives `{ destination, duration, vibes, travelerType, tweak?, previousPlan? }` from the frontend
2. Validates inputs
3. Builds the appropriate prompt (fresh plan or tweak)
4. Calls the Anthropic API with the key from environment variables
5. Returns `{ plan: string }` to the frontend

The API key is **never exposed** in client-side code.

---

## Local development

```bash
# Install Vercel CLI
npm i -g vercel

# Add your API key to a local env file
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local

# Run locally
vercel dev

# Open http://localhost:3000
```

---

## Product context

TripLocal was built as a PM portfolio project — from problem statement to working MVP — in 4 weeks. The full portfolio includes:

- Problem statement & user persona (Maya)
- Competitive analysis
- PRD with success metrics
- User stories + acceptance criteria
- User flows & wireframes
- This working app
- Launch checklist
- Metrics framework & retrospective

---

## What's next (v2 roadmap)

- [ ] User accounts & saved plans
- [ ] Places API validation to reduce hallucination risk
- [ ] Destination autocomplete
- [ ] Multi-language support (French, Spanish)
- [ ] Community-contributed local gems

---

## Built by

Gabi — Senior PM transitioning to AI Product Management.  
[LinkedIn](https://linkedin.com/in/your-profile) · [Portfolio](https://your-portfolio.com)

---

*TripLocal is a portfolio project. Plans are AI-generated and should be verified locally before your trip.*
