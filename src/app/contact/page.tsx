import type { Metadata } from "next";
import { CalendlyInline } from "@/components/CalendlyInline";
import { ContactLeadForm } from "@/components/ContactLeadForm";
import { BRAND } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Contact IgniteCore | Free AI Audit for SMB Workflows",
  description:
    "Contact IgniteCore Solutions for WhatsApp automation and AI workflow setup. Book a free 30-minute audit and get a response in 4 hours.",
};

export default function ContactPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto grid w-full max-w-[1100px] gap-8 px-4 md:grid-cols-2 md:px-6">
        <div>
          <h1 className="font-display text-4xl italic md:text-5xl">Let&apos;s talk about your workflow</h1>
          <p className="mt-4 text-[var(--color-slate)]">
            Share your current process and we will recommend what to automate first.
          </p>
          <p className="mt-3 text-sm font-medium text-[var(--color-teal)]">We reply within 4 hours on weekdays.</p>
          <div className="mt-5">
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-semibold hover:bg-white"
            >
              Chat directly on WhatsApp
            </a>
          </div>
          <div className="mt-6">
            <ContactLeadForm />
          </div>
        </div>

        <div>
          <h2 className="text-2xl">Book your free 30-minute audit</h2>
          <p className="mt-2 text-sm text-[var(--color-slate)]">Inline booking calendar for faster scheduling.</p>
          <div className="mt-4">
            <CalendlyInline url={BRAND.calendly} title="Book free AI audit on contact page" />
          </div>
        </div>
      </div>
    </section>
  );
}
