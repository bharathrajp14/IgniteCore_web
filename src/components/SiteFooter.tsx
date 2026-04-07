import Link from "next/link";
import { BRAND } from "@/lib/siteContent";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[var(--color-dark)] text-white">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <img src="/brand/logo-light-text.svg" alt="IgniteCore Solutions logo" className="h-10 w-auto" />
          <p className="mt-3 text-sm text-slate-300">{BRAND.tagline}</p>
          <p className="mt-4 text-sm text-slate-400">Serving: {BRAND.serving}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-[var(--color-ember)]">Services</Link></li>
            <li><Link href="/learn" className="hover:text-[var(--color-ember)]">Learning Hub</Link></li>
            <li><Link href="/results" className="hover:text-[var(--color-ember)]">Case Studies</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--color-ember)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">NAP</h3>
          <img src="/brand/mark.svg" alt="IgniteCore mark" className="mt-3 h-8 w-8" />
          <p className="mt-4 text-sm text-slate-300">Name: {BRAND.company}</p>
          <p className="text-sm text-slate-300">Address: {BRAND.location}</p>
          <p className="text-sm text-slate-300">Phone: {BRAND.phone}</p>
          <p className="text-sm text-slate-300">Email: {BRAND.email}</p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-4 py-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
          <p>Copyright {year} {BRAND.company}. All rights reserved.</p>
          <p>Built for Indian SMB growth and practical automation outcomes.</p>
        </div>
      </div>
    </footer>
  );
}
