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

    /* Simulate API call — replace with actual endpoint */
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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          gap: "var(--space-6)",
        }}
        role="alert"
        aria-live="polite"
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--color-accent-subtle)",
            border: "1px solid var(--color-accent-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-accent)",
          }}
        >
          <IconCheck size={28} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginBottom: "var(--space-3)",
            }}
          >
            Message sent
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", maxWidth: "300px" }}>
            We&rsquo;ll respond within one business day. Check your inbox — we&rsquo;ll reach out from hello@brandmeetscode.com.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 400,
          letterSpacing: "-0.015em",
          marginBottom: "var(--space-8)",
        }}
      >
        Tell us about your project
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        {/* Name + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="form-row">
          <div className="form-field">
            <label htmlFor="contact-name" className="form-label">
              Name <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>*</span>
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
              Email <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>*</span>
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

        {/* Company */}
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

        {/* Project type + Budget */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="form-row">
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
                <option key={opt} value={opt}>{opt}</option>
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
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="form-field">
          <label htmlFor="contact-message" className="form-label">
            Tell us about your project <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>*</span>
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

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formState === "loading"}
          style={{
            width: "100%",
            justifyContent: "center",
            opacity: formState === "loading" ? 0.7 : 1,
            transition: "opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)",
          }}
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
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-error)", textAlign: "center" }} role="alert">
            Something went wrong. Please try emailing us directly at hello@brandmeetscode.com
          </p>
        )}

        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textAlign: "center" }}>
          No commitment. We respond within one business day.
        </p>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path
        d="M12 2a10 10 0 1 0 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
