<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Realtime-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<h1 align="center">⚡ ItsMyScreen</h1>
<h3 align="center">Real-time polling. Zero friction.</h3>

<p align="center">
  Create a poll in seconds. Share the link. Watch votes roll in live. No sign-up required.
</p>

<p align="center">
  <a href="https://itsmyscreen-by-sriram.vercel.app"><strong>▶ Live Demo</strong></a>
  ·
  <a href="https://github.com/SriramDivi1/ItsMyScreen"><strong>📦 Source Code</strong></a>
</p>

---

## Why ItsMyScreen?

| Create | Share | Vote | Results |
|--------|-------|------|---------|
| Question + 2–10 options in under 10 seconds | One-click copy link or QR code | Anyone with the link can vote | Updates in real time for everyone |

No accounts. No forms. No waiting. Just instant polls and live results.

---

## ✨ Features

**Poll creation** — Templates (Yes/No, 1–5 Scale, Feedback, Meeting Time…), optional description, live preview, duplicate detection

**Real-time voting** — Supabase Realtime + 5s polling fallback. All viewers see updates without refresh.

**Fairness** — Voter tokens (one vote per device) + 2s cooldown. RPC validates options belong to the poll.

**Sharing** — Copy link, QR code, CSV export, print-friendly layout

**Discovery** — Browse, search, sort. Quick-create from templates on the Browse page.

**UX** — Confetti on first vote, skeletons, smooth animations, responsive (mobile → desktop)

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL + Realtime) |
| Deployment | Vercel |

---

## 🚀 Quick Start

```bash
git clone https://github.com/SriramDivi1/ItsMyScreen.git
cd ItsMyScreen
npm install
```

Add `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Apply schema via Supabase SQL Editor (`npm run db:sql` → paste & run) or:

```bash
SUPABASE_PROJECT_REF=xxx SUPABASE_DB_PASSWORD=xxx npm run db:apply
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
app/
├── create/          # Poll creation + templates + live preview
├── poll/[id]/       # Vote, results, share, QR, CSV, print
├── polls/           # Browse, search, sort, quick-create
├── components/      # Navbar, Footer, Confetti
└── page.tsx         # Home: hero, features, recent polls
utils/               # pollTemplates, sanitize, timeAgo, supabase
supabase/            # schema.sql, migrations
```

---

## 🗄️ Database

**Tables:** `polls`, `options`, `votes`  
**RPCs:** `vote(...)`, `change_vote(...)` — atomic, validate option belongs to poll  
**Realtime:** All tables in `supabase_realtime` publication

---

## 📄 Routes

| Route | Description |
|-------|-------------|
| `/` | Home, hero, recent polls |
| `/create` | Create poll (`?template=id` supported) |
| `/polls` | Browse, search, sort, templates |
| `/poll/[id]` | Vote, results, share, QR, CSV, print |

---

## 📋 Assignment Checklist

| Requirement | ✓ |
|-------------|---|
| Poll creation (question + 2+ options, shareable link) | ✓ |
| Join by link, single-choice vote | ✓ |
| Real-time results (no manual refresh) | ✓ |
| Two fairness/anti-abuse mechanisms | ✓ |
| Persistence (polls + votes survive refresh) | ✓ |
| Deployed, publicly accessible | ✓ |

---

# Notes / README (Submission)

> For the Google Form — copy this section into "Notes / README", or use the standalone **[NOTES.md](NOTES.md)** file.

---

## Your two fairness / anti-abuse mechanisms

### 1. Voter token (one vote per device)

- **What it does:** Each browser gets a unique token (`crypto.randomUUID`) stored in `localStorage`. The database enforces `unique(poll_id, voter_token)` so each token can vote only once per poll.
- **What it prevents:** The same user voting multiple times from the same browser on the same poll.
- **Limitations:** Clearing `localStorage`, using incognito/private mode, or a different browser/device creates a new token and allows another vote. This is acceptable for a no-sign-up product.

### 2. Vote cooldown (2 seconds)

- **What it does:** A 2-second cooldown between vote attempts, including changing one’s vote. If the user tries again within 2 seconds, the request is blocked and a toast is shown.
- **What it prevents:** Accidental double-clicks, rapid automated clicking, and bot-style abuse.
- **Limitations:** Determined attackers could space out votes; the cooldown mainly improves UX and slows basic abuse.

**Additional integrity:** The `vote` and `change_vote` RPCs validate that the selected option belongs to the poll before counting, preventing cross-poll vote injection and malformed requests.

---

## Edge cases handled

- **Invalid poll ID** — "Poll not found" page with navigation to home
- **Duplicate options** — Client-side validation, form highlights duplicates
- **Option validation** — RPC rejects votes for options that don’t belong to the poll
- **Clipboard fallback** — Copy link uses `document.execCommand('copy')` if `navigator.clipboard` is unavailable
- **Voter token fallback** — Session-based token if `localStorage` fails (e.g. private mode)
- **Realtime fallback** — 5-second polling when Realtime events don’t arrive
- **Input limits** — Question (200), description (300), options (100) chars; sanitized before DB insert
- **Invalid dates** — `timeAgo` returns empty string for invalid date strings
- **Empty options** — Polls with no options show a fallback message
- **Orphan voted option** — "You voted for" only shown when the voted option still exists

---

## Known limitations / what could be improved next

- No poll closure or expiry — polls stay open indefinitely
- Voter token is device-based — multiple devices allow multiple votes per person
- No authentication — no ownership of polls; anyone can create
- No rate limiting on API — relies on Supabase defaults
- **Improvements:** Poll expiry, CAPTCHA, email verification, or optional sign-in for stricter fairness

---

<p align="center">
  <a href="https://itsmyscreen-by-sriram.vercel.app">Live Demo</a> · 
  <a href="https://github.com/SriramDivi1/ItsMyScreen">GitHub</a>
</p>
<p align="center">Built with Next.js & Supabase</p>
