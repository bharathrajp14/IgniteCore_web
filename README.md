# AI Business Enablement Studio - Investor Pitch Website

A modern, high-conversion pitch deck website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Designed to convert investors, partners, mentors, and clients.

---

## 🎯 Features

### Core Presentation
- **Hero Section** with compelling headline and CTA
- **Problem & Opportunity** visualization with stats
- **Solution Pillars** (Education, Done-for-You, Digital Products)
- **Business Model** with revenue streams and margins
- **Traction Highlights** (clients, ARR, retention)
- **12-Month Roadmap** with quarterly milestones
- **Financial Projections** with interactive charts

### User Experience
- ✅ Fully responsive (desktop, tablet, mobile)
- ✅ Sticky navigation with smooth scroll-to-section
- ✅ Smooth animations with Framer Motion
- ✅ Dark mode support
- ✅ Fast load times & optimized performance
- ✅ SEO-friendly metadata & Open Graph

### Conversion Tools
- 📧 Contact form with validation (React Hook Form + Zod)
- 📊 Interactive financial charts (Recharts)
- 🎨 Professional gradient design
- 🔗 Shareable URLs with proper metadata

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   # Optional: Email service integration
   RESEND_API_KEY=your_resend_api_key_here
   # Optional: Supabase for form storage
   NEXT_PUBLIC_SUPABASE_URL=https://zliztvrsxstpptrrpqer.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_key_here
   SUPABASE_SECRET_KEY=sb_secret_your_key_here
   SUPABASE_DB_URL=postgresql://postgres.<project_ref>:<password>@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
