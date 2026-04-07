"use client";

import { useState } from "react";

type FAQItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q} className="rounded-xl border border-[var(--color-border)] bg-white">
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-4 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
            >
              <span className="font-medium text-[var(--color-deep-navy)]">{item.q}</span>
              <span className="text-[var(--color-slate)]">{open ? "-" : "+"}</span>
            </button>
            {open ? <p className="px-4 pb-4 text-sm leading-7 text-[var(--color-slate)]">{item.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
