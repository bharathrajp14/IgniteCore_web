"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackEvent } from "@/lib/tracking";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type NewsletterInput = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (values: NewsletterInput) => {
    setStatus("idle");
    setMessage("");

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Unable to subscribe" }));
      setStatus("error");
      setMessage(data.error || "Unable to subscribe");
      return;
    }

    setStatus("success");
    setMessage("Subscribed successfully. Check your inbox for weekly tips.");
    trackEvent("form_submit", { form: "newsletter" });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-[var(--color-border)] bg-white p-5 md:p-6">
      <label className="text-sm">
        <span className="mb-2 block font-medium text-[var(--color-deep-navy)]">Get weekly AI tips for Indian businesses</span>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@business.com"
            className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
            {...register("email")}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 rounded-md bg-[var(--color-orange)] px-4 font-semibold text-white hover:bg-[var(--color-ember)] sm:px-5"
          >
            {isSubmitting ? "Joining..." : "Subscribe"}
          </button>
        </div>
      </label>
      {errors.email ? <p className="mt-2 text-xs text-red-600">{errors.email.message}</p> : null}
      {status !== "idle" ? (
        <p className={`mt-2 text-sm ${status === "success" ? "text-[var(--color-teal)]" : "text-red-600"}`}>{message}</p>
      ) : null}
    </form>
  );
}
