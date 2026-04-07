"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackEvent } from "@/lib/tracking";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormInput = z.infer<typeof schema>;

export function LeadMagnetForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormInput) => {
    setStatus("idle");
    setMessage("");

    const response = await fetch("/api/lead-magnet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Unable to process request" }));
      setStatus("error");
      setMessage(data.error || "Unable to process request");
      return;
    }

    const data = await response.json();
    setStatus("success");
    setMessage(data.message || "Download ready");
    trackEvent("lead_magnet_download", { asset: "ai_starter_kit" });

    if (data.fileUrl) {
      window.open(data.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="you@business.com"
          className="h-11 w-full rounded-md border border-[var(--color-border)] px-3"
          {...register("email")}
        />
        <button type="submit" disabled={isSubmitting} className="min-h-11 rounded-md bg-[var(--color-orange)] px-5 font-semibold text-white hover:bg-[var(--color-ember)]">
          {isSubmitting ? "Please wait..." : "Get starter kit PDF"}
        </button>
      </div>
      {errors.email ? <p className="mt-2 text-xs text-red-600">{errors.email.message}</p> : null}
      {status !== "idle" ? <p className={`mt-2 text-sm ${status === "success" ? "text-[var(--color-teal)]" : "text-red-600"}`}>{message}</p> : null}
    </form>
  );
}
