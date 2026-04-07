import type { Metadata } from "next";
import { ContactLeadForm } from "@/components/ContactLeadForm";
import { BRAND } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Contact IgniteCore Solutions | Get a Free AI Audit",
  description:
    "Tell us what you need. IgniteCore replies within 24 hours on working days for AI automation and web solution enquiries.",
};

export default function ContactPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 md:grid-cols-[1.2fr_1fr] md:px-6">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Tell us what you need. We reply within 24 hours on working days.</h1>
          <p className="mt-4 text-[var(--color-slate)]">
            Share your business context and project goals. We will suggest the fastest practical path to implementation.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={`mailto:${BRAND.email}`} className="surface-card p-4 text-sm font-medium hover:bg-white">
              Email: {BRAND.email}
            </a>
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="surface-card p-4 text-sm font-medium hover:bg-white">
              WhatsApp: +91 {BRAND.phone}
            </a>
          </div>

          <div className="mt-6">
            <ContactLeadForm />
          </div>
        </div>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-2xl">Direct contact</h2>
          <p className="mt-2 text-sm text-[var(--color-slate)]">Use whichever channel is fastest for your team.</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-deep-navy)]">
            <li><strong>Company:</strong> {BRAND.company}</li>
            <li><strong>Domain:</strong> {BRAND.domain}</li>
            <li><strong>Email:</strong> {BRAND.email}</li>
            <li><strong>Phone:</strong> +91 {BRAND.phone}</li>
          </ul>

          <div className="mt-6 space-y-3">
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="block rounded-md bg-[var(--color-teal)] px-4 py-3 text-center text-sm font-semibold text-white">
              Start WhatsApp Chat
            </a>
            <a href={`mailto:${BRAND.email}`} className="block rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]">
              Send Email
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
