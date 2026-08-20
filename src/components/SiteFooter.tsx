import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/siteContent";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[var(--color-dark)] text-white">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/mark.svg" alt="IgniteCore mark" width={40} height={40} className="h-10 w-10" />
            <span className="leading-none">
              <span className="block font-display text-3xl italic sm:text-[34px]">
                <span className="text-[var(--color-orange)]">Ignite</span>
                <span className="text-white">Core</span>
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-teal)] sm:text-[11px]">
                Solutions
              </span>
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-300">{BRAND.tagline}</p>
          <p className="mt-4 text-sm text-slate-400">{BRAND.mission}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[var(--color-ember)]">Home</Link></li>
            <li><Link href="/about" className="hover:text-[var(--color-ember)]">About</Link></li>
            <li><Link href="/services" className="hover:text-[var(--color-ember)]">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-[var(--color-ember)]">Portfolio</Link></li>
            <li><Link href="/courses" className="hover:text-[var(--color-ember)]">Courses</Link></li>
            <li><Link href="/results" className="hover:text-[var(--color-ember)]">Case Studies</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--color-ember)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">NAP</h3>
          <Image src="/brand/mark.svg" alt="IgniteCore mark" width={36} height={36} className="mt-3 h-9 w-9" />
          <p className="mt-4 text-sm text-slate-300">Name: {BRAND.company}</p>
          <p className="text-sm text-slate-300">Domain: {BRAND.domain}</p>
          <p className="text-sm text-slate-300">Address: {BRAND.location}</p>
          <p className="text-sm text-slate-300">Phone / WhatsApp: +91 {BRAND.phone}</p>
          <p className="text-sm text-slate-300">Email: {BRAND.email}</p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-4 py-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
          <p>Copyright {year} {BRAND.company}. All rights reserved.</p>
          <p>Built for practical automation outcomes and measurable growth.</p>
        </div>
      </div>
    </footer>
  );
}
