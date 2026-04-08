"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/components/I18nProvider";
import { BRAND, PAYMENT_DETAILS } from "@/lib/siteContent";
import { trackEvent } from "@/lib/tracking";

const schema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  whatsapp: z.string().min(10).max(20).regex(/^[+]?[0-9][0-9\s-]{7,16}$/, "Enter a valid WhatsApp number"),
  amount: z.number().int().positive().max(5_000_000),
  paymentMethod: z.enum(["bank_transfer", "upi"]),
  transactionRef: z.string().min(6).max(40).regex(/^[A-Za-z0-9-]{6,40}$/, "Use letters, numbers, and dashes only"),
  notes: z.string().max(500).optional(),
  consent: z.boolean().refine((value) => value, { message: "Consent is required" }),
  honeypot: z.string().max(0).optional(),
});

type FormInput = z.infer<typeof schema>;

const paymentMethods = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "upi", label: "UPI" },
] as const;

export function PaymentMethodForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [clientStartedAt] = useState(() => Date.now());
  const paymentHandles = PAYMENT_DETAILS.upiHandles;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      amount: 10000,
      paymentMethod: "bank_transfer",
      transactionRef: "",
      notes: "",
      consent: false,
      honeypot: "",
    },
  });

  const onSubmit = async (values: FormInput) => {
    setStatus("idle");
    setServerMessage("");

    const response = await fetch("/api/payments/direct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        whatsapp: values.whatsapp.trim(),
        transactionRef: values.transactionRef.trim(),
        notes: values.notes?.trim() || "",
        clientStartedAt,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Unable to create payment" }));
      setStatus("error");
      setServerMessage(data.error || "Unable to create payment");
      trackEvent("payment_proof_error", { source: "contact_page" });
      return;
    }

    const data = await response.json();
    setStatus("success");
    setServerMessage(data.message || "Payment proof submitted. We will verify it shortly.");
    trackEvent("payment_proof_submit", {
      source: "contact_page",
      payment_method: values.paymentMethod,
      amount: values.amount,
    });
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="surface-card space-y-4 p-5">
      <h3 className="text-xl font-semibold">{t("payment.title")}</h3>
      <p className="text-sm text-[var(--color-slate)]">{t("payment.subtitle")}</p>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-slate)]">{t("payment.accountDetails")}</p>
        <div className="mt-3 space-y-2 text-sm text-[var(--color-deep-navy)]">
          <p><strong>Name:</strong> {PAYMENT_DETAILS.accountName}</p>
          <div className="flex flex-wrap items-center gap-2">
            <p><strong>Account:</strong> {PAYMENT_DETAILS.accountNumber}</p>
            <button type="button" className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs" onClick={() => copyText(PAYMENT_DETAILS.accountNumber)}>
              Copy
            </button>
          </div>
          <p><strong>IFSC:</strong> {PAYMENT_DETAILS.ifscCode}</p>
          <p><strong>Alternate IFSC:</strong> {PAYMENT_DETAILS.alternateIfsc}</p>
          <p><strong>Branch:</strong> {PAYMENT_DETAILS.branch}</p>
          <div>
            <p><strong>UPI:</strong></p>
            <div className="mt-2 flex flex-wrap gap-2">
              {paymentHandles.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold hover:bg-white"
                  onClick={() => copyText(handle)}
                >
                  {handle}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-[var(--color-slate)]">{PAYMENT_DETAILS.note}</p>
          <p className="text-xs text-[var(--color-slate)]">{copyStatus === "copied" ? "Copied to clipboard." : null}</p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {t("payment.future")}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Full name</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            {...register("fullName")}
          />
          {errors.fullName ? <span className="mt-1 block text-xs text-red-600">{errors.fullName.message}</span> : null}
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Email</span>
          <input
            type="email"
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            {...register("email")}
          />
          {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span> : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">WhatsApp</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            placeholder="+91XXXXXXXXXX"
            {...register("whatsapp")}
          />
          {errors.whatsapp ? <span className="mt-1 block text-xs text-red-600">{errors.whatsapp.message}</span> : null}
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("payment.amount")}</span>
          <input
            type="number"
            min={1}
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            {...register("amount", { valueAsNumber: true })}
          />
          <span className="mt-1 block text-xs text-[var(--color-slate)]">Amount in rupees. Example: 10000 = ₹10,000.</span>
          {errors.amount ? <span className="mt-1 block text-xs text-red-600">{errors.amount.message}</span> : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("payment.paymentMethod")}</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            {...register("paymentMethod")}
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {errors.paymentMethod ? <span className="mt-1 block text-xs text-red-600">{errors.paymentMethod.message}</span> : null}
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("payment.reference")}</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            placeholder="UTR / UPI reference / transfer id"
            {...register("transactionRef")}
          />
          {errors.transactionRef ? <span className="mt-1 block text-xs text-red-600">{errors.transactionRef.message}</span> : null}
        </label>
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Notes</span>
        <textarea
          rows={3}
          className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 outline-none focus:border-[var(--color-orange)]"
          placeholder="Add invoice, project, or timing notes"
          {...register("notes")}
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-[var(--color-slate)]">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I confirm this payment proof is accurate and I understand it will be reviewed manually before confirmation.
        </span>
      </label>
      {errors.consent ? <p className="text-xs text-red-600">{errors.consent.message}</p> : null}

      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("honeypot")} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 text-sm text-[var(--color-slate)]">
        <p className="font-semibold text-[var(--color-deep-navy)]">Verification process</p>
        <ul className="mt-2 space-y-1 list-disc pl-5">
          <li>We store your submission as pending review.</li>
          <li>We match your transaction reference against the bank or UPI statement manually.</li>
          <li>You get a confirmation message only after verification.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-slate)]">
        <p className="font-semibold text-[var(--color-deep-navy)]">Security controls</p>
        <ul className="mt-2 space-y-1 list-disc pl-5">
          <li>Origin allowlist, request throttling, and honeypot filtering</li>
          <li>Minimum fill-time check to reduce bot submissions</li>
          <li>Transaction reference uniqueness enforced in Supabase</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Manual support</span>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]"
          >
            WhatsApp if you need help
          </a>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Future providers</span>
          <div className="rounded-md border border-[var(--color-border)] px-4 py-3 text-xs text-[var(--color-slate)]">
            Razorpay and Stripe can be re-enabled later without changing the manual verification flow.
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 w-full rounded-md bg-[var(--color-orange)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-ember)] disabled:opacity-70"
      >
        {isSubmitting ? "Processing..." : t("payment.start")}
      </button>

      {status !== "idle" ? (
        <p className={`text-sm ${status === "success" ? "text-[var(--color-teal)]" : "text-red-600"}`}>{serverMessage}</p>
      ) : null}
    </form>
  );
}
