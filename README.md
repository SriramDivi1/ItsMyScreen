<div align="center">

# ⚡ ItsMyScreen

### Real-time polling. Zero friction.

**Create a poll in seconds → Share the link → Watch votes roll in live**

No sign-up. No forms. Just instant feedback.

<p>
  <a href="https://itsmyscreen-by-sriram.vercel.app"><img src="https://img.shields.io/badge/▶_Live_Demo-itsmyscreen.vercel.app-ff6b35?style=for-the-badge" alt="Live Demo" /></a>
  <a href="https://github.com/SriramDivi1/ItsMyScreen"><img src="https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

</div>

---

## 📖 Overview

**ItsMyScreen** is a full-stack real-time polling application. Users create polls with questions and options, share a link, and anyone with the link can vote. Results update live for all viewers—no refresh needed.

Built as a modern, production-ready demo of **Next.js 16**, **Supabase**, and **Tailwind CSS**.

| Create | Share | Vote | Results |
|--------|-------|------|---------|
| Question + 2–10 options in under 10 seconds | One-click copy link or QR code | Anyone with the link can vote (single-choice) | Live updates for everyone via Realtime + polling |

---

## ✨ Features (Detailed)

### 📝 Poll Creation

| Feature | Details |
|---------|---------|
| **Question & options** | Question (max 200 chars), optional description (300 chars), 2–10 options (100 chars each) |
| **6 templates** | Yes/No, 1–5 Scale, Simple Choice, Feedback, Meeting Time, Topic Vote |
| **Live preview** | See your poll as you type, with sticky sidebar on desktop |
| **Validation** | Duplicate option detection, character counters, required fields |
| **URL templates** | `/create?template=yes-no` pre-fills the form |

### 🗳️ Voting & Results

| Feature | Details |
|---------|---------|
| **Single-choice** | One vote per person per poll |
| **Change vote** | Switch your choice before the poll ends |
| **Real-time sync** | Supabase Realtime subscriptions + payload-based updates (no full refetch) |
| **Polling fallback** | 5-second polling when Realtime doesn’t deliver |
| **Optimistic UI** | Instant feedback when you vote; state updates before server response |
| **Animated bars** | Progress bars and percentages animate when votes change |

### 🔗 Sharing & Export

| Feature | Details |
|---------|---------|
| **Copy link** | One-click copy with clipboard API + `execCommand` fallback |
| **QR code** | Generate scannable QR for in-person voting |
| **CSV export** | Download results (Option, Votes, Percentage) |
| **Print** | Print-friendly layout; hides nav, footer, non-essential UI |

### 🔍 Discovery

| Feature | Details |
|---------|---------|
| **Browse** | Search by question, sort by most recent or most votes |
| **Quick-create** | Template buttons on Browse page → jump to Create with form pre-filled |
| **Recent polls** | Home page shows 6 most recent community polls |

### 🎨 UX & Design

| Feature | Details |
|---------|---------|
| **Theme** | Light, warm off-white with orange accent (#c2410c) |
| **Typography** | DM Sans |
| **Confetti** | CSS confetti on first vote |
| **Toasts** | Non-intrusive feedback for actions (vote, copy, errors) |
| **Live badge** | Pulsing green dot for real-time connection |
| **Loading** | Skeleton loaders (home, browse, poll), spinners |
| **Animations** | Staggered fade-in, scale-in, smooth transitions |
| **Responsive** | Mobile-first; safe-area support for notched devices |
| **Error states** | Poll not found, 404, error boundary with retry |

---

## 🛠️ Tech Stack (Detailed)

| Layer | Technology | Notes |
|-------|------------|-------|
| **Framework** | Next.js 16.1.6 | App Router, Turbopack, React 19 |
| **Language** | TypeScript 5 | Strict mode |
| **Styling** | Tailwind CSS 4 | Custom theme, animations |
| **Backend** | Supabase | PostgreSQL, Realtime, RLS |
| **Icons** | Lucide React | |
| **QR** | qrcode.react | |
| **Deployment** | Vercel | Edge, serverless |

---

## 🗄️ Database

### Tables

| Table | Purpose |
|-------|---------|
| `polls` | `id` (UUID), `question`, `description`, `created_at`, `created_by` |
| `options` | `id`, `poll_id` (FK), `text`, `vote_count` |
| `votes` | `id`, `poll_id`, `option_id`, `voter_token`, `created_at`; unique on `(poll_id, voter_token)` |

### RPC Functions

- **`vote(p_poll_id, p_option_id, p_voter_token)`** — Inserts vote, increments option `vote_count`. Validates option belongs to poll.
- **`change_vote(p_poll_id, p_old_option_id, p_new_option_id, p_voter_token)`** — Deletes old vote, inserts new one; updates both option counts.

### Realtime

Tables `polls`, `options`, `votes` are in `supabase_realtime` publication.

### Row Level Security (RLS)

All tables have RLS enabled. Policies allow anonymous `select`/`insert`; `delete` on polls restricted to `created_by`.

---

## 📁 Project Structure

```
ItsMyScreen/
├── app/
│   ├── components/
│   │   ├── Confetti.tsx       # CSS confetti on vote
│   │   ├── Footer.tsx         # Branded footer
│   │   └── Navbar.tsx         # Minimal navbar (logo)
│   ├── create/
│   │   └── page.tsx           # Poll creation + templates + live preview
│   ├── poll/
│   │   └── [id]/
│   │       ├── layout.tsx     # Metadata
│   │       ├── loading.tsx    # Skeleton loading
│   │       ├── opengraph-image.tsx  # Dynamic OG image for sharing
│   │       └── page.tsx       # Vote, results, share, QR, CSV, print
│   ├── polls/
│   │   └── page.tsx           # Browse, search, sort, quick-create
│   ├── globals.css            # Theme, components, keyframes
│   ├── layout.tsx             # Root layout, viewport, metadata
│   ├── page.tsx               # Home: hero, features, how it works, recent polls
│   ├── not-found.tsx          # 404 page
│   ├── error.tsx              # Error boundary
│   └── global-error.tsx       # Root error boundary
├── utils/
│   ├── pollTemplates.ts       # 6 templates + getTemplateById
│   ├── sanitize.ts            # sanitizeText (trim + length limit)
│   ├── supabase.ts            # Supabase client
│   └── timeAgo.ts             # Relative time ("5m ago")
├── supabase/
│   ├── schema.sql             # Base schema
│   └── migrations/            # Incremental migrations
├── scripts/
│   └── apply-schema.js        # Apply schema to Supabase (optional)
└── .env.local                 # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 🔄 User Flow

1. **Create** — User goes to `/create`, picks a template or writes from scratch, adds options, clicks Create.
2. **Redirect** — App creates poll + options in DB, redirects to `/poll/[id]`.
3. **Share** — User copies link or shows QR code.
4. **Vote** — Visitors open link, vote (single choice), can change vote.
5. **Results** — All viewers see live updates via Realtime; 5s polling as fallback.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier)

### 1. Clone & install

```bash
git clone https://github.com/SriramDivi1/ItsMyScreen.git
cd ItsMyScreen
npm install
```

### 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply schema:
   - **Option A:** Run `npm run db:sql`, copy output, paste into **Supabase → SQL Editor**, run.
   - **Option B:** `SUPABASE_PROJECT_REF=xxx SUPABASE_DB_PASSWORD=xxx npm run db:apply`
3. Copy **Project URL** and **Anon Key** from **Settings → API**.

### 3. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📄 Routes

| Route | Description |
|-------|-------------|
| `/` | Home — hero, features, how it works, 6 recent polls |
| `/create` | Create poll; `?template=id` pre-fills form |
| `/polls` | Browse — search, sort, quick-create templates |
| `/poll/[id]` | Poll view — vote, results, share, QR, CSV, print |

---

## 🌐 Deployment (Vercel)

1. Push to GitHub.
2. Import repo at [vercel.com](https://vercel.com).
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

```bash
npm run build   # Test locally
```

---

## 📋 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:sql` | Print schema + migrations for SQL Editor |
| `npm run db:apply` | Apply schema via `pg` (needs DB credentials) |

---

# 📝 Notes / README (Submission)

> For the Google Form — copy below or use **[NOTES.md](NOTES.md)**.

---

## Two fairness / anti-abuse mechanisms

### 1. Voter token (one vote per device)

- **What it does:** Each browser gets a unique token (`crypto.randomUUID`) in `localStorage`. DB enforces `unique(poll_id, voter_token)`.
- **What it prevents:** Same user voting multiple times from the same browser on the same poll.
- **Limitations:** Clearing storage, incognito, or another device/browser = new token = another vote. Acceptable for no-sign-up.

### 2. Vote cooldown (2 seconds)

- **What it does:** 2s cooldown between vote attempts (including vote changes). Blocked attempts show a toast.
- **What it prevents:** Double-clicks, rapid automated clicking, simple bot abuse.
- **Limitations:** Determined attackers can space out votes; cooldown improves UX and slows basic abuse.

**Additional:** RPCs `vote` and `change_vote` validate that the option belongs to the poll before counting.

---

## Edge cases handled

- Invalid poll ID → "Poll not found" + link home  
- Duplicate options → Client validation + highlight  
- Option validation → RPC rejects invalid options  
- Clipboard fallback → `execCommand('copy')` if `navigator.clipboard` unavailable  
- Voter token fallback → Session token if `localStorage` fails  
- Realtime fallback → 5s polling  
- Input limits → 200 / 300 / 100 chars; sanitized before DB  
- Invalid dates → `timeAgo` returns empty string  
- Empty options → Fallback message  
- Orphan voted option → "You voted for" only when option exists  

---

## Known limitations / improvements

- No poll expiry or closure  
- Device-based token (multiple devices = multiple votes)  
- No auth → no poll ownership  
- No API rate limiting  
- **Future:** Poll expiry, CAPTCHA, optional sign-in, email verification  

---

<div align="center">

**[▶ Live Demo](https://itsmyscreen-by-sriram.vercel.app)** · **[📦 GitHub](https://github.com/SriramDivi1/ItsMyScreen)**

Built with Next.js & Supabase

</div>
