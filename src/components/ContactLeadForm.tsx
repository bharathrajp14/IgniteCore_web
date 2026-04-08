"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackEvent } from "@/lib/tracking";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email"),
  whatsapp: z
    .string()
    .min(10, "Valid phone / WhatsApp is required")
    .regex(/^[+]?\d[\d\s-]{8,16}$/, "Enter a valid phone / WhatsApp number"),
  projectType: z.string().min(2, "Select a project type"),
  message: z.string().min(10, "Please share more details"),
  consent: z.boolean().refine((value) => value, {
    message: "Please confirm consent before submitting",
  }),
});

type ContactLeadInput = z.infer<typeof contactSchema>;

const projectOptions = [
  "AI automation",
  "Business website",
  "Web app development",
  "Lead capture system",
  "WhatsApp automation",
  "Dashboard / internal tool",
  "Landing page",
  "Maintenance and support",
];

export function ContactLeadForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactLeadInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      whatsapp: "",
      projectType: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (values: ContactLeadInput) => {
    setStatus("idle");
    setServerMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, source: "contact_page" }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Something went wrong" }));
      setStatus("error");
      setServerMessage(data.error || "Unable to submit. Please try again.");
      return;
    }

    const data = await response.json();
    setStatus("success");
    setServerMessage(data.message || "Thank you. We received your request and will get back within 24 working hours.");
    trackEvent("form_submit", { form: "contact", project_type: values.projectType });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="surface-card space-y-4 p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Name</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            {...register("name")}
          />
          {errors.name ? <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span> : null}
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Business name</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            placeholder="Your company or brand"
            {...register("businessName")}
          />
          {errors.businessName ? <span className="mt-1 block text-xs text-red-600">{errors.businessName.message}</span> : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Email</span>
          <input
            type="email"
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            placeholder="you@business.com"
            {...register("email")}
          />
          {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span> : null}
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Phone / WhatsApp</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            placeholder="+91XXXXXXXXXX"
            {...register("whatsapp")}
          />
          {errors.whatsapp ? <span className="mt-1 block text-xs text-red-600">{errors.whatsapp.message}</span> : null}
        </label>
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Project type</span>
        <select
          className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
          {...register("projectType")}
        >
          <option value="">Select one</option>
          {projectOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.projectType ? <span className="mt-1 block text-xs text-red-600">{errors.projectType.message}</span> : null}
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Message</span>
        <textarea
          rows={4}
          className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 outline-none focus:border-[var(--color-orange)]"
          placeholder="Share your current challenge, timeline, and the outcome you want."
          {...register("message")}
        />
        {errors.message ? <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span> : null}
      </label>

      <label className="flex items-start gap-2 text-sm text-[var(--color-slate)]">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I consent to IgniteCore using these details to contact me about recommendations and project follow-up.
        </span>
      </label>
      {errors.consent ? <p className="text-xs text-red-600">{errors.consent.message}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 w-full rounded-md bg-[var(--color-orange)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-ember)] disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Send Request"}
      </button>

      {status !== "idle" ? (
        <p className={`text-sm ${status === "success" ? "text-[var(--color-teal)]" : "text-red-600"}`}>{serverMessage}</p>
      ) : null}
    </form>
  );
}
