<div align="center">

# ⚡ ItsMyScreen
### The Future of Real-Time Polling

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Create instant polls. Share with anyone. Watch votes roll in live.**  
*Fast, fair, and futuristic. No sign-up required.*

[**🚀 Live Demo**](https://itsmyscreen-by-sriram.vercel.app) · [**📂 Repository**](https://github.com/SriramDivi1/ItsMyScreen)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSriramDivi1%2FItsMyScreen)

</div>

---

## ✨ Features That Wow

| Feature | Description |
| :--- | :--- |
| **🚀 Instant Creation** | Create a poll in **< 10 seconds**. Pre-built templates included. |
| **⚡ Real-Time Sync** | Votes appear **instantly** for everyone via Supabase Realtime. |
| **📱 Responsive Design** | Beautifully crafted for **mobile, tablet, and desktop**. |
| **🔒 Fairness First** | **One vote per device** checks + **anti-spam cooldowns**. |
| **🎨 Modern UI** | Glassmorphism, smooth animations, and **interactive visuals**. |
| **🔗 Easy Sharing** | One-click copy, **QR code generation**, and print support. |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/SriramDivi1/ItsMyScreen.git
cd ItsMyScreen
npm install
```

### 2. Configure Supabase
1. Create a free project at [supabase.com](https://supabase.com/).
2. Get your **Project URL** and **Anon Key**.
3. Apply the database schema:
   - **Video Guide:** Run `npm run db:sql`, copy output, run in Supabase SQL Editor.
   - **CLI:** `SUPABASE_PROJECT_REF=your_ref SUPABASE_DB_PASSWORD=your_pass npm run db:apply`.

### 3. Run Locally
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Start the engines:
```bash
npm run dev
```
Visit `http://localhost:3000` to see it in action! 🚀

---

## 🛠️ Tech Stack & Architecture

Inside the engine room of ItsMyScreen:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + Custom Animations
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL + RLS Security)
- **Real-Time:** Supabase Realtime Channels
- **Icons:** [Lucide React](https://lucide.dev/)

### � Project Structure
```
ItsMyScreen/
├── 📂 app/              # Next.js App Router
│   ├── 📂 create/       # Poll creation wizard
│   ├── 📂 poll/[id]/    # Dynamic poll voting page
│   ├── 📂 polls/        # Community poll feed
│   └── 📄 global.css    # Tailwind & Animation definitions
├── 📂 utils/            # Helper functions (Sanitization, TimeAgo)
└── 📂 supabase/         # Database schema & migrations
```

---

<details>
<summary><h2>📋 Technical submission details (Click to expand)</h2></summary>

### Assignment Compliance Checklist
- [x] **Poll Creation:** Create polls with 2-10 options.
- [x] **Join by Link:** Public `/poll/[id]` sharable links.
- [x] **Real-Time Results:** Live updates using Supabase subscriptions.
- [x] **Fairness:** Voter tokens (localStorage) + rate-limiting cooldowns.
- [x] **Persistence:** PostgreSQL storage with RLS policies.
- [x] **Deployment:** Hosted on Vercel.

### Fairness Mechanisms
1.  **Voter Token:** Unique UUID stored in `localStorage`. The DB prevents duplicate votes for the same poll/token pair.
2.  **Cooldowns:** 2-second block between actions to prevent bot spamming.
3.  **RPC Validation:** Server-side checks ensure votes only count for valid options.

### Edge Case Handling
- **404 Handling:** Custom "Poll Not Found" UI.
- **Offline Support:** UI functions optimistically.
- **Data Integrity:** Input sanitization and max-length enforcement.

</details>

---

## 💡 Key Concepts & Skills Implemented

This project demonstrates proficiency in modern full-stack development, including:

- **Real-time Data Synchronization**: Leveraging Supabase Realtime subscriptions to push updates to clients instantly.
- **Optimistic UI Updates**: Providing immediate feedback to users while background requests process, enhancing perceived performance.
- **Database Row Level Security (RLS)**: Securing user data at the database layer to prevent unauthorized access.
- **Responsive & Adaptive Design**: Building a complex UI that works seamlessly across all device sizes using Tailwind CSS.
- **Anonymous Voting**: Voter tokens stored in `localStorage` for fair, one-vote-per-device without sign-up.
- **Modern React Patterns**: Extensive use of React Suspense, Hooks (`useReducer`, `useOptimistic`), and Server Components.

---

## 🤝 Contributing

Got a better idea? We'd love to see it!
1. Fork the repo 🍴
2. Create your feature branch (`git checkout -b feature/cool-new-thing`)
3. Commit your changes (`git commit -m 'Add some coolness'`)
4. Push to the branch (`git push origin feature/cool-new-thing`)
5. Open a Pull Request 📩

---

<div align="center">

**Built with ❤️ by Sriram**  
*Next.js 16 · Supabase · Tailwind*

</div>
