"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatTranslation } from "@/lib/i18n";
import { useI18n } from "@/components/I18nProvider";
import { BRAND } from "@/lib/siteContent";
import { trackEvent } from "@/lib/tracking";

const qualifierSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  whatsapp: z
    .string()
    .min(10, "Valid WhatsApp number is required")
    .regex(/^[+]?\d[\d\s-]{8,16}$/, "Enter a valid WhatsApp number"),
  businessType: z.string().min(2, "Select your business type"),
  biggestProblem: z.string().min(2, "Select your biggest problem"),
  teamSize: z.string().min(2, "Select your team size"),
  consent: z.boolean().refine((value) => value, {
    message: "Please confirm consent to continue",
  }),
});

type QualifierInput = z.infer<typeof qualifierSchema>;

const businessTypeOptions = [
  "Clinic / Healthcare",
  "Coaching Institute",
  "Real Estate Team",
  "Service Business",
  "Other",
];

const biggestProblemOptions = [
  "Leads come in but follow-up is inconsistent",
  "Slow first response on WhatsApp / calls",
  "Website traffic is not converting",
  "No clear lead tracking pipeline",
  "Manual tasks consume team time",
];

const teamSizeOptions = ["Solo", "2-5", "6-15", "16-30", "30+"];

type QualifierStep = 1 | 2;

export function QualifierBookingForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<QualifierStep>(1);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isSubmitted) {
        trackEvent("qualifier_abandoned", { source: "homepage" });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QualifierInput>({
    resolver: zodResolver(qualifierSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      businessType: "",
      biggestProblem: "",
      teamSize: "",
      consent: false,
    },
  });

  const handleNextStep = async () => {
    setStatus("idle");
    setMessage("");

    const isStepOneValid = await trigger(["name", "email", "businessType"]);
    if (!isStepOneValid) {
      return;
    }

    setCurrentStep(2);
    trackEvent("qualifier_step_advance", { source: "homepage", step: 1 });
  };

  const handleBackToStepOne = () => {
    setCurrentStep(1);
    trackEvent("qualifier_step_back", { source: "homepage", step: 2 });
  };

  const onSubmit = async (values: QualifierInput) => {
    setStatus("idle");
    setMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        businessName: values.businessType,
        email: values.email,
        whatsapp: values.whatsapp,
        projectType: "Free AI Audit",
        message: `Biggest problem: ${values.biggestProblem}. Team size: ${values.teamSize}.`,
        businessType: values.businessType,
        biggestProblem: values.biggestProblem,
        teamSize: values.teamSize,
        consent: values.consent,
        source: "homepage_qualifier",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: t("qualifier.error") }));
      setStatus("error");
      setMessage(data.error || t("qualifier.error"));
      trackEvent("qualifier_error", { source: "homepage" });
      return;
    }

    setStatus("success");
    setMessage(t("qualifier.success"));
    setIsSubmitted(true);
    trackEvent("qualifier_submitted", {
      source: "homepage",
      business_type: values.businessType,
      team_size: values.teamSize,
    });

    reset();
    setCurrentStep(1);

    setTimeout(() => {
      trackEvent("calendar_opened", { source: "homepage_qualifier" });
      window.location.href = BRAND.bookingUrl;
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={() => {
        if (!hasStarted) {
          setHasStarted(true);
          trackEvent("qualifier_started", { source: "homepage" });
        }
      }}
      className="surface-card mt-8 space-y-4 p-5 md:p-6"
    >
      <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] px-3 py-2 text-xs">
        <span className="font-mono uppercase tracking-[0.14em] text-[var(--color-slate)]">
          {formatTranslation(t("qualifier.step"), { step: String(currentStep) })}
        </span>
        <span className="text-[var(--color-slate)]">
          {currentStep === 1 ? t("qualifier.context.basic") : t("qualifier.context.project")}
        </span>
      </div>

      <p className="text-sm text-[var(--color-slate)]">
        {currentStep === 1
          ? t("qualifier.intro.step1")
          : t("qualifier.intro.step2")}
      </p>

      {currentStep === 1 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("qualifier.name")}</span>
              <input
                className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
                placeholder={t("qualifier.name")}
                {...register("name")}
              />
              {errors.name ? <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span> : null}
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("qualifier.email")}</span>
              <input
                type="email"
                className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
                placeholder={t("qualifier.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span> : null}
            </label>
          </div>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("qualifier.businessType")}</span>
            <select
              className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
              {...register("businessType")}
            >
              <option value="">{t("qualifier.selectOne")}</option>
              {businessTypeOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.businessType ? <span className="mt-1 block text-xs text-red-600">{errors.businessType.message}</span> : null}
          </label>

          <button
            type="button"
            onClick={() => void handleNextStep()}
            className="min-h-11 w-full rounded-md bg-[var(--color-orange)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-ember)]"
          >
            {t("qualifier.next")}
          </button>
        </>
      ) : (
        <>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("qualifier.whatsapp")}</span>
            <input
              className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
              placeholder={t("qualifier.whatsappPlaceholder")}
              {...register("whatsapp")}
            />
            {errors.whatsapp ? <span className="mt-1 block text-xs text-red-600">{errors.whatsapp.message}</span> : null}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("qualifier.biggestProblem")}</span>
              <select
                className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
                {...register("biggestProblem")}
              >
                <option value="">{t("qualifier.selectOne")}</option>
                {biggestProblemOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.biggestProblem ? <span className="mt-1 block text-xs text-red-600">{errors.biggestProblem.message}</span> : null}
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-[var(--color-deep-navy)]">{t("qualifier.teamSize")}</span>
              <select
                className="h-11 w-full rounded-md border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-orange)]"
                {...register("teamSize")}
              >
                <option value="">{t("qualifier.selectOne")}</option>
                {teamSizeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.teamSize ? <span className="mt-1 block text-xs text-red-600">{errors.teamSize.message}</span> : null}
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-[var(--color-slate)]">
            <input type="checkbox" className="mt-1" {...register("consent")} />
            <span>
              {t("qualifier.consent")}
            </span>
          </label>
          {errors.consent ? <p className="text-xs text-red-600">{errors.consent.message}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBackToStepOne}
              className="min-h-11 w-full rounded-md border border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-deep-navy)] hover:bg-[var(--color-cream)] sm:w-1/2"
            >
              {t("qualifier.back")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 w-full rounded-md bg-[var(--color-orange)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-ember)] disabled:opacity-70 sm:w-1/2"
            >
              {isSubmitting ? t("qualifier.submitting") : t("qualifier.submit")}
            </button>
          </div>
        </>
      )}

      {status !== "idle" ? (
        <p className={`text-sm ${status === "success" ? "text-[var(--color-teal)]" : "text-red-600"}`}>{message}</p>
      ) : null}
    </form>
  );
}
