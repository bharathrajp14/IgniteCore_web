"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackEvent } from "@/lib/tracking";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  businessType: z.string().min(2, "Business type is required"),
  whatsapp: z.string().min(10, "Valid WhatsApp number is required"),
  helpType: z.string().min(2, "Select what you need help with"),
  message: z.string().min(10, "Please share more details"),
});

type ContactLeadInput = z.infer<typeof contactSchema>;

const helpOptions = [
  "WhatsApp automation",
  "Lead management workflow",
  "Dashboard and reporting",
  "AI training for team",
  "End-to-end setup",
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
      businessType: "",
      whatsapp: "",
      helpType: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactLeadInput) => {
    setStatus("idle");
    setServerMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Something went wrong" }));
      setStatus("error");
      setServerMessage(data.error || "Unable to submit. Please try again.");
      return;
    }

    const data = await response.json();
    setStatus("success");
    setServerMessage(data.message || "Thanks. We will reply soon.");
    trackEvent("form_submit", { form: "contact", help_type: values.helpType });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-5 md:p-6">
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
          <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Business type</span>
          <input
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            placeholder="Clinic, coaching, CA firm, real estate..."
            {...register("businessType")}
          />
          {errors.businessType ? <span className="mt-1 block text-xs text-red-600">{errors.businessType.message}</span> : null}
        </label>
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">WhatsApp number</span>
        <input
          className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
          placeholder="+91XXXXXXXXXX"
          {...register("whatsapp")}
        />
        {errors.whatsapp ? <span className="mt-1 block text-xs text-red-600">{errors.whatsapp.message}</span> : null}
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">What do you need help with?</span>
        <select
          className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
          {...register("helpType")}
        >
          <option value="">Select one</option>
          {helpOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.helpType ? <span className="mt-1 block text-xs text-red-600">{errors.helpType.message}</span> : null}
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">Message</span>
        <textarea
          rows={4}
          className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 outline-none focus:border-[var(--color-orange)]"
          placeholder="Share your current workflow and what you want to improve."
          {...register("message")}
        />
        {errors.message ? <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 w-full rounded-md bg-[var(--color-orange)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-ember)] disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Send message"}
      </button>

      {status !== "idle" ? (
        <p className={`text-sm ${status === "success" ? "text-[var(--color-teal)]" : "text-red-600"}`}>{serverMessage}</p>
      ) : null}
    </form>
  );
}
