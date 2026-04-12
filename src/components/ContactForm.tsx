"use client";

import { useState } from "react";
import { IconArrowUpRight, IconCheck } from "./icons";

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

const budgetOptions = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000 – $60,000",
  "$60,000+",
  "Not sure yet",
];

const projectOptions = [
  "New website",
  "Site redesign",
  "Brand strategy",
  "Analytics setup",
  "Multiple services",
];

export default function ContactForm() {
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Tell us about your project";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="flex size-16 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle text-accent">
          <IconCheck size={28} />
        </div>
        <div>
          <h2 className="font-display mb-3 text-2xl font-light tracking-tight">Message sent</h2>
          <p className="max-w-[300px] text-sm text-text-secondary">
            We&rsquo;ll respond within one business day. Check your inbox — we&rsquo;ll reach out from
            hello@brandmeetscode.com.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <h2 className="font-display mb-8 text-xl font-normal tracking-tight">Tell us about your project</h2>

      <div className="flex flex-col gap-5">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contact-name" className="form-label">
              Name <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className={`form-input${errors.name ? " error" : ""}`}
              placeholder="Alex Chen"
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
              Email <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className={`form-input${errors.email ? " error" : ""}`}
              placeholder="alex@company.com"
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
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            className="form-input"
            placeholder="Acme Inc."
            value={formData.company}
            onChange={handleChange}
            autoComplete="organization"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contact-project" className="form-label">
              Project Type
            </label>
            <select
              id="contact-project"
              name="project"
              className="form-input"
              value={formData.project}
              onChange={handleChange}
            >
              <option value="">Select one</option>
              {projectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="contact-budget" className="form-label">
              Budget Range
            </label>
            <select
              id="contact-budget"
              name="budget"
              className="form-input"
              value={formData.budget}
              onChange={handleChange}
            >
              <option value="">Select one</option>
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
            Tell us about your project <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            className={`form-input${errors.message ? " error" : ""}`}
            placeholder="What are you building? What problem are you solving? What have you tried before?"
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
              Sending…
            </>
          ) : (
            <>
              Send Message
              <IconArrowUpRight size={16} />
            </>
          )}
        </button>

        {formState === "error" && (
          <p className="text-center text-sm text-error" role="alert">
            Something went wrong. Please try emailing us directly at hello@brandmeetscode.com
          </p>
        )}

        <p className="text-center text-xs text-text-tertiary">No commitment. We respond within one business day.</p>
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
