# ⚡ ItsMyScreen — Real-time Polling App

Create instant polls, share them with anyone, and watch votes roll in live. No sign-up required. Fast, fair, and futuristic.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **Instant Poll Creation** — Create a poll in under 10 seconds with a question and up to 10 options
- **Real-time Voting** — Votes update live for all viewers using Supabase Realtime subscriptions
- **Simple sign-in** — Enter first name, last name, and email to continue; no OTP (can be added later)
- **One Vote Per Person** — Uses browser tokens or user ID when signed in to prevent duplicate voting
- **Live Results** — Animated progress bars, percentages, and vote counts update in real-time
- **Share Instantly** — One-click copy poll link to clipboard
- **Recent Polls Discovery** — Browse and vote on community polls from the home page
- **Error Handling** — Clean "Poll not found" page for invalid URLs
- **My Polls** — Signed-in users can view polls they created

## 🎨 Design Highlights

- **Dark Futuristic Theme** — Sleek dark UI with indigo accents and glassmorphism effects
- **Entrance Animations** — Staggered fade-in animations across all pages
- **Confetti Celebration** — CSS confetti burst when you submit a vote
- **Toast Notifications** — Non-intrusive feedback for actions (vote submitted, link copied)
- **Live Voter Badge** — Pulsing green dot indicates active real-time connection
- **Floating Particles** — Animated background elements on the home page
- **Responsive Design** — Optimized for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS Animations |
| **Backend / DB** | [Supabase](https://supabase.com/) (PostgreSQL + Realtime) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## � Key Concepts & Skills Implemented

This project demonstrates proficiency in modern full-stack development, including:

- **Real-time Data Synchronization**: Leveraging Supabase Realtime subscriptions to push updates to clients instantly.
- **Optimistic UI Updates**: Providing immediate feedback to users while background requests process, enhancing perceived performance.
- **Database Row Level Security (RLS)**: Securing user data at the database layer to prevent unauthorized access.
- **Responsive & Adaptive Design**: Building a complex UI that works seamlessly across all device sizes using Tailwind CSS.
- **Authentication Flow**: Hybrid authentication system supporting both anonymous users (for voting) and authenticated sessions (for poll management) via Supabase Auth (OTP).
- **Modern React Patterns**: Extensive use of React Hooks (`useReducer`, `useOptimistic`), Context API, and Server Components.

---

## �📁 Project Structure

```
ItsMyScreen/
├── app/
│   ├── auth/
│   │   ├── page.tsx            # Sign in with email OTP
│   │   └── complete/page.tsx   # First-time: first name + last name
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation with auth menu
│   │   └── Footer.tsx          # Minimalist branded footer
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth state and session
│   ├── create/
│   │   └── page.tsx            # Poll creation form with live preview
│   ├── poll/
│   │   └── [id]/
│   │       ├── page.tsx        # Poll view with voting & results
│   │       └── loading.tsx     # Loading skeleton for poll page
│   ├── globals.css             # Global styles, animations, keyframes
│   ├── layout.tsx              # Root layout with SEO metadata
│   └── page.tsx                # Home page with hero & recent polls
├── utils/
│   └── supabase.ts             # Supabase client initialization
├── supabase/
│   └── schema.sql              # Database schema (tables + RPC)
├── scripts/
│   └── apply-schema.js         # Script to apply schema to Supabase
└── .env.local                  # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Supabase](https://supabase.com/) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/SriramDivi1/ItsMyScreen.git
cd ItsMyScreen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Apply the database schema:
   - **Option A (SQL Editor, recommended):** Run `npm run db:sql` to print the SQL, then paste it into **Supabase → SQL Editor** and run.
   - **Option B (Script):** Run `SUPABASE_DB_PASSWORD=your_password npm run db:apply`. For pooler: `SUPABASE_DB_USE_POOLER=1 SUPABASE_DB_PASSWORD=... npm run db:apply`
3. Copy your project URL and Anon Key from **Settings → API**
4. Enable Anonymous sign-in: In **Authentication → Providers**, enable **Anonymous** sign-ins. (OTP/Email auth can be added later.)

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

The app uses three tables and one RPC function in Supabase:

### Tables

| Table | Purpose |
|---|---|
| `polls` | Stores poll questions with auto-generated UUIDs and timestamps |
| `options` | Poll options with a `vote_count` counter, linked to polls via foreign key |
| `votes` | Individual vote records with voter tokens (or `user:uuid` for signed-in users), ensuring one vote per person per poll |
| `profiles` | First name, last name for authenticated users (linked to `auth.users`) |

### RPC Function

- **`vote(p_poll_id, p_option_id, p_voter_token)`** — Atomic function that inserts a vote record and increments the option's vote count in a single transaction

### Realtime

All three tables are added to the `supabase_realtime` publication, enabling live updates across all connected clients.

---

## 🛡️ Fairness Controls (Anti-Abuse)

The app includes two mechanisms to reduce repeat and abusive voting:

### 1. One Vote Per Person (Voter Token)

- **What it does:** Anonymous users get a unique token (`crypto.randomUUID`) in `localStorage`. Signed-in users use `user:{uuid}`. The database enforces `unique(poll_id, voter_token)` so only one vote per token per poll is allowed.
- **What it prevents:** The same user voting multiple times from the same browser on the same poll.
- **Limitations:** Clearing `localStorage`, using incognito/private mode, or a different browser/device yields a new token and thus another vote. This is acceptable for a no-sign-up product.

### 2. Vote Cooldown

- **What it does:** A 2-second cooldown is enforced between vote attempts (including vote changes). If a user tries to vote again within 2 seconds, the request is blocked and a toast message is shown.
- **What it prevents:** Accidental double-clicks, rapid automated clicking, and bot-style hammering of the vote endpoint.
- **Limitations:** Determined attackers can still space out votes, but the cooldown slows abuse and improves UX for normal users.

### Additional Integrity

- **Option validation (RPC):** The `vote` and `change_vote` RPCs validate that the selected option belongs to the poll before counting. This prevents cross-poll vote injection and malformed requests.

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Home page — Hero section, "How It Works" steps, recent polls grid |
| `/create` | Create Poll — Form with character counter, live preview, option management |
| `/poll/[id]` | Poll View — Vote, see results with animated bars, share link, confetti on vote |
| `/auth` | Get started — First name, last name, email → dashboard |
| `/polls/mine` | My polls — Polls created by the signed-in user |

---

## 🌐 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) and import your repository
3. Add your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy — Vercel will auto-detect Next.js and configure the build

```bash
npm run build   # Test production build locally
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js & Supabase
