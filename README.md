# Metal Sport Gym

Premium fitness management platform with Supabase backend, AI coach, QR scanner, and full admin dashboard.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email + Google OAuth)
- **AI Coach**: Groq (llama-3.3-70b)
- **Styling**: Tailwind CSS + Framer Motion
- **State**: Zustand

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Access

- **Email**: hamada.laidi.14@gmail.com
- **Password**: ldldld

Use the "Admin Quick Access" button on the login page.

## Environment Variables (`.env.local`)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`

## Build

```bash
npm run build
npm start
```
