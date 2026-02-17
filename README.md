# ⚡ ItsMyScreen — Real-time Polling App

Create instant polls, share them with anyone, and watch votes roll in live. No sign-up required. Fast, fair, and futuristic.

**Public URL:** [itsmyscreen-by-sriram.vercel.app](https://itsmyscreen-by-sriram.vercel.app)  
**Repository:** [github.com/SriramDivi1/ItsMyScreen](https://github.com/SriramDivi1/ItsMyScreen)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Assignment Compliance

| Requirement | Implementation |
|-------------|----------------|
| **1. Poll creation** | Create poll with question + 2–10 options; shareable link generated after creation |
| **2. Join by link** | Anyone with `/poll/[id]` link can view and vote (single-choice) |
| **3. Real-time results** | Supabase Realtime + 5s polling fallback; all viewers see updates without refresh |
| **4. Fairness (2+ mechanisms)** | (1) Voter token, (2) Vote cooldown — see below |
| **5. Persistence** | PostgreSQL via Supabase; polls and votes persist; links work after refresh |
| **6. Deployment** | Public URL on Vercel |

---

## 📝 Submission Notes (for form)

### Two fairness / anti-abuse mechanisms

1. **Voter token (one vote per device)**  
   - **What it does:** Each browser gets a unique token (`crypto.randomUUID`) stored in `localStorage`. The database enforces `unique(poll_id, voter_token)` so each token can vote only once per poll.  
   - **What it prevents:** The same user voting multiple times from the same browser on the same poll.  
   - **Limitations:** Clearing `localStorage`, using incognito/private mode, or a different browser/device creates a new token and allows another vote. Acceptable for a no-sign-up product.

2. **Vote cooldown (2 seconds)**  
   - **What it does:** A 2-second cooldown between vote attempts (including changing one’s vote). If the user tries again within 2 seconds, the request is blocked and a toast is shown.  
   - **What it prevents:** Accidental double-clicks, rapid automated clicking, and bot-style abuse.  
   - **Limitations:** Determined attackers could space out votes; cooldown mainly improves UX and slows basic abuse.

**Additional integrity:** The `vote` and `change_vote` RPCs validate that the selected option belongs to the poll before counting, preventing cross-poll vote injection and malformed requests.

### Edge cases handled

- **Invalid poll ID** — "Poll not found" page with navigation to home
- **Duplicate options** — Client-side validation, form highlights duplicates
- **Option validation** — RPC rejects votes for options that don’t belong to the poll
- **Clipboard fallback** — Copy link uses `document.execCommand('copy')` if `navigator.clipboard` is unavailable
- **Voter token fallback** — Session-based token if `localStorage` fails (e.g. private mode)
- **Realtime fallback** — 5-second polling when Realtime events don’t arrive
- **Input limits** — Question (200), description (300), options (100) chars; sanitized before DB insert

### Known limitations / what could be improved next

- No poll closure/expiry — polls stay open indefinitely
- Voter token is device-based — multiple devices = multiple votes per person
- No authentication — no ownership of polls; anyone can create
- No rate limiting on API — relies on Supabase defaults
- Could add: poll expiry, CAPTCHA, email verification, or optional sign-in for stricter fairness

---

## ✨ Features

### Poll creation

- **Instant creation** — Create a poll in under 10 seconds with a question and 2–10 options
- **Optional description** — Add context or instructions for voters
- **Poll templates** — Start from 6 pre-built templates: Yes/No, 1–5 Scale, Simple Choice, Feedback, Meeting Time, Topic Vote
- **Live preview** — See your poll as you build it
- **Validation** — Character limits (question: 200, description: 300, options: 100 each), duplicate option detection

### Voting & results

- **Real-time updates** — Votes appear live for all viewers via Supabase Realtime and a 5-second polling fallback
- **One vote per device** — Voter tokens in `localStorage` prevent duplicate voting from the same browser
- **Change your vote** — Switch your choice before the poll closes
- **Animated results** — Progress bars and percentages update smoothly when votes change
- **Optimistic UI** — Instant feedback when you vote, no waiting for the server

### Sharing & export

- **Copy link** — One-click copy poll URL to clipboard
- **QR code** — Generate a scannable QR code for in-person voting
- **Export CSV** — Download results as a spreadsheet
- **Print** — Print-friendly layout for physical distribution

### Discovery

- **Browse polls** — Search and sort community polls (most recent or most votes)
- **Quick create from template** — On the Browse page, click a template to jump straight to Create with it pre-filled
- **Recent polls** — Home page shows the 6 most recent community polls

### UX & design

- **Confetti** — Celebration when you submit your first vote
- **Toast notifications** — Feedback for actions (vote submitted, link copied, errors)
- **Live badge** — Pulsing green indicator for real-time connection
- **Loading states** — Skeleton loaders and spinners across the app
- **Smooth animations** — Entrance animations, transitions, and micro-interactions
- **Responsive** — Works on mobile, tablet, and desktop with safe-area support
- **Error handling** — “Poll not found” and 404 pages with helpful navigation

---

## 🎨 Design

- **Light theme** — Warm off-white background with orange accents
- **Typography** — DM Sans
- **Animations** — Staggered fade-in, scale-in, skeleton pulse, smooth transitions

---

## 🛠️ Tech stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + Custom CSS animations |
| **Backend / DB** | [Supabase](https://supabase.com/) (PostgreSQL + Realtime) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **QR codes** | [qrcode.react](https://github.com/zpao/qrcode.react) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🔑 Concepts & implementation

- **Real-time sync** — Supabase Realtime subscriptions + payload-based state updates (no full refetch on each vote)
- **Optimistic updates** — Local state updates immediately; Realtime keeps everyone in sync
- **Row Level Security (RLS)** — Database-level access control on all tables
- **Anonymous voting** — Voter tokens in `localStorage`; no sign-up required
- **Input sanitization** — Trimming and length limits before DB insert
- **OpenGraph** — Dynamic OG images for poll pages when shared

---

## 📁 Project structure

```
ItsMyScreen/
├── app/
│   ├── components/
│   │   ├── Confetti.tsx        # Vote celebration
│   │   ├── Footer.tsx          # Branded footer
│   │   └── Navbar.tsx          # Minimal navbar (logo only)
│   ├── create/
│   │   └── page.tsx            # Poll creation form + live preview + templates
│   ├── poll/
│   │   └── [id]/
│   │       ├── layout.tsx
│   │       ├── loading.tsx     # Skeleton loading state
│   │       ├── opengraph-image.tsx  # Dynamic OG image
│   │       └── page.tsx        # Poll view, voting, results, share, QR, CSV, print
│   ├── polls/
│   │   └── page.tsx            # Browse polls + search + sort + quick-create templates
│   ├── globals.css             # Theme, components, keyframes, animations
│   ├── layout.tsx              # Root layout, viewport, SEO
│   ├── page.tsx                # Home: hero, features, how it works, recent polls
│   ├── not-found.tsx           # 404 page
│   └── error.tsx
├── utils/
│   ├── pollTemplates.ts        # Template definitions + getTemplateById
│   ├── sanitize.ts             # escapeHtml, sanitizeText
│   ├── supabase.ts             # Supabase client
│   └── timeAgo.ts              # Relative time strings
├── supabase/
│   ├── schema.sql              # Full schema
│   └── migrations/             # Incremental migrations
├── scripts/
│   └── apply-schema.js         # Apply schema to Supabase
└── .env.local                  # Env vars (not committed)
```

---

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Supabase](https://supabase.com/) account (free tier)

### 1. Clone

```bash
git clone https://github.com/SriramDivi1/ItsMyScreen.git
cd ItsMyScreen
```

### 2. Install

```bash
npm install
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com/)
2. Apply the schema:
   - **Option A (SQL Editor):** Run `npm run db:sql`, paste the output into **Supabase → SQL Editor**, and run it.
   - **Option B (Script):** Run `SUPABASE_DB_PASSWORD=your_password npm run db:apply`. For connection pooler: `SUPABASE_DB_USE_POOLER=1 SUPABASE_DB_PASSWORD=... npm run db:apply`
3. Copy your project URL and Anon Key from **Settings → API**

### 4. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Database

### Tables

| Table   | Purpose                                                  |
|---------|----------------------------------------------------------|
| `polls` | Questions, optional descriptions, timestamps, `created_by` |
| `options` | Poll options with `vote_count`, linked to `polls`      |
| `votes` | Individual votes with `voter_token`, unique per poll per token |

### RPC functions

- **`vote(p_poll_id, p_option_id, p_voter_token)`** — Insert a vote and increment the option’s `vote_count` (validates option belongs to poll)
- **`change_vote(p_poll_id, p_old_option_id, p_new_option_id, p_voter_token)`** — Remove old vote, add new vote, update both option counts

### Realtime

`polls`, `options`, and `votes` are in the `supabase_realtime` publication so clients receive live updates.

---

## 🛡️ Fairness (anti-abuse)

### Voter token

- Each browser gets a UUID in `localStorage`. The DB enforces `unique(poll_id, voter_token)`.
- **Limitation:** Clearing storage or using another device/browser allows another vote. This is acceptable for a no-sign-up product.

### Vote cooldown

- 2-second cooldown between vote attempts, including vote changes.
- Reduces double-clicks and rapid automated voting.

### RPC validation

- `vote` and `change_vote` verify that the chosen option belongs to the poll before updating.

---

## 📄 Routes

| Route         | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| `/`           | Home — hero, features, how it works, 6 most recent polls                    |
| `/create`     | Create poll — templates, form, live preview; supports `?template=id`        |
| `/polls`      | Browse — search, sort, quick-create templates, poll grid                    |
| `/poll/[id]`  | Poll — vote, results, share, QR, CSV, print                                 |

---

## 🌐 Deployment (Vercel)

1. Push the repo to GitHub
2. Import it in [vercel.com](https://vercel.com/)
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

```bash
npm run build   # Test production build
```

**Live app:** [itsmyscreen-by-sriram.vercel.app](https://itsmyscreen-by-sriram.vercel.app)

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License — see [LICENSE](LICENSE).

---

Built with ❤️ By Sriram using Next.js & Supabase
