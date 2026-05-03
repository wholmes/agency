"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowUpRight, IconCheck } from "./icons";
import type { ContactFormConfigParsed } from "@/lib/cms/contact-form-types";
import {
  pushGenerateLeadDataLayer,
  stashContactConversionForThankYouPage,
} from "@/lib/analytics-data-layer";

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  company: string;
  project: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function interpolateEmail(template: string, email: string): string {
  return template.replace(/\{\{email\}\}/g, email);
}

export default function ContactForm({
  config,
  contactEmail,
  variant = "default",
  thankYouPath = "/contact/thank-you",
}: {
  config: ContactFormConfigParsed;
  contactEmail: string;
  /** `"v2"` — dark glass styling for the public marketing contact page */
  variant?: "default" | "v2";
  /** After a successful v2 submit, go here (stable URL for GA4 / ad conversion goals). */
  thankYouPath?: string;
}) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    project: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const v = config.validation;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = v.nameRequired;
    if (!formData.email.trim()) {
      newErrors.email = v.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = v.emailInvalid;
    }
    if (!formData.message.trim()) newErrors.message = v.messageRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("loading");

    try {
      const sp =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utmSource: sp?.get("utm_source") ?? "",
          utmMedium: sp?.get("utm_medium") ?? "",
          utmCampaign: sp?.get("utm_campaign") ?? "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        leadId?: string;
      };
      if (!res.ok) {
        console.error("Contact form error:", data.error);
        setFormState("error");
      } else {
        const leadId = typeof data.leadId === "string" ? data.leadId : undefined;
        const conv = { email: formData.email, ...(leadId ? { leadId } : {}) };
        if (variant === "v2") {
          stashContactConversionForThankYouPage(conv);
          router.push(thankYouPath);
        } else {
          pushGenerateLeadDataLayer(conv);
          setFormState("success");
        }
      }
    } catch {
      setFormState("error");
    }
  };

  const { labels, placeholders, budgetOptions, projectOptions, submit, success, error, footerNote } = config;

  if (formState === "success") {
    return (
      <div
        className={`flex min-h-[400px] flex-col items-center justify-center gap-6 text-center ${variant === "v2" ? "text-white" : ""}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex size-16 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle text-accent">
          <IconCheck size={28} />
        </div>
        <div>
          <h2
            className={`font-display mb-3 text-2xl font-light tracking-tight ${variant === "v2" ? "text-white" : ""}`}
          >
            {success.title}
          </h2>
          <p className={`max-w-[300px] text-sm ${variant === "v2" ? "text-white/55" : "text-text-secondary"}`}>
            {interpolateEmail(success.body, contactEmail)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="contact-form-heading"
      className={variant === "v2" ? "contact-form-v2" : undefined}
    >
      {/* v2: hero already carries the headline — keep CMS heading for screen readers only */}
      <h2
        id="contact-form-heading"
        className={
          variant === "v2"
            ? "sr-only"
            : "font-display mb-8 text-xl font-normal tracking-tight"
        }
      >
        {config.heading}
      </h2>

      <div className="flex flex-col gap-5">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contact-name" className="form-label">
              {labels.name} <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className={`form-input${errors.name ? " error" : ""}`}
              placeholder={placeholders.name}
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="form-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contact-email" className="form-label">
              {labels.email} <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className={`form-input${errors.email ? " error" : ""}`}
              placeholder={placeholders.email}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="form-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="contact-company" className="form-label">
            {labels.company}
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            className="form-input"
            placeholder={placeholders.company}
            value={formData.company}
            onChange={handleChange}
            autoComplete="organization"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contact-project" className="form-label">
              {labels.projectType}
            </label>
            <select
              id="contact-project"
              name="project"
              className="form-input"
              value={formData.project}
              onChange={handleChange}
            >
              <option value="">{config.selectPlaceholder}</option>
              {projectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="contact-budget" className="form-label">
              {labels.budgetRange}
            </label>
            <select
              id="contact-budget"
              name="budget"
              className="form-input"
              value={formData.budget}
              onChange={handleChange}
            >
              <option value="">{config.selectPlaceholder}</option>
              {budgetOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="contact-message" className="form-label">
            {labels.message} <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            className={`form-input${errors.message ? " error" : ""}`}
            placeholder={placeholders.message}
            value={formData.message}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="form-error" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full justify-center transition-[opacity,transform] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] disabled:opacity-70"
          disabled={formState === "loading"}
          aria-busy={formState === "loading"}
        >
          {formState === "loading" ? (
            <>
              <LoadingSpinner />
              {submit.sending}
            </>
          ) : (
            <>
              {submit.send}
              <IconArrowUpRight size={16} />
            </>
          )}
        </button>

        {formState === "error" && (
          <p className="text-center text-sm text-error" role="alert">
            {interpolateEmail(error.generic, contactEmail)}
          </p>
        )}

        <p className={`text-center text-xs ${variant === "v2" ? "text-white/35" : "text-text-tertiary"}`}>{footerNote}</p>
      </div>
    </form>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
