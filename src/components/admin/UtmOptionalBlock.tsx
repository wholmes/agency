import type { ReactNode } from "react";

function UtmInput({
  id,
  label,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  defaultValue: string | null;
  placeholder: string;
}) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="form-input"
        autoComplete="off"
      />
    </div>
  );
}

export type UtmFiveValues = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
};

export type UtmFiveFieldNames = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
};

/** GA4 UTM fields — optional; appended to the related href at render time. */
export function UtmOptionalBlock({
  title,
  description,
  fieldNames,
  values,
  children,
}: {
  title: string;
  description?: ReactNode;
  fieldNames: UtmFiveFieldNames;
  values: UtmFiveValues;
  children?: ReactNode;
}) {
  return (
    <div className="border-border mt-2 border-t pt-6">
      <h2 className="font-display mb-1 text-lg font-light tracking-tight">{title}</h2>
      {description ? (
        <div className="text-text-secondary mb-5 text-sm leading-relaxed">{description}</div>
      ) : null}
      {children}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UtmInput id={fieldNames.source} label="utm_source" defaultValue={values.source} placeholder="e.g. homepage" />
        <UtmInput id={fieldNames.medium} label="utm_medium" defaultValue={values.medium} placeholder="e.g. referral" />
        <UtmInput
          id={fieldNames.campaign}
          label="utm_campaign"
          defaultValue={values.campaign}
          placeholder="e.g. services_strip"
        />
        <UtmInput id={fieldNames.content} label="utm_content" defaultValue={values.content} placeholder="optional" />
        <UtmInput id={fieldNames.term} label="utm_term" defaultValue={values.term} placeholder="optional" />
      </div>
    </div>
  );
}
