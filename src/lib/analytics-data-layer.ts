/**
 * Browser dataLayer pushes for the **web** GTM container.
 *
 * Your **server** TikTok Events API tag (Event Name = `{{Event Name}}`) should fire on
 * the same hits your GA4 Client receives — e.g. GA4 Event tag `generate_lead` with
 * **transport URL** pointing at server GTM. Map DL variables to that GA4 tag’s
 * event parameters / user data as needed for the TikTok template.
 *
 * @see https://developers.google.com/tag-platform/tag-manager/server-side
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Session bridge: v2 contact flow redirects before the browser can push. */
export const CONTACT_CONVERSION_DL_KEY = "bmc_contact_conversion_dl";

export type ContactConversionDlPayload = {
  email: string;
  /** `ContactLead.id` from `/api/contact` — use in GTM/TikTok for deduplication if supported */
  leadId?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function ensureDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

/**
 * Pushes GA4-recommended `generate_lead` plus `user_data.email_address` for templates
 * that hash advanced-matching fields server-side (e.g. TikTok official server tag).
 */
export function pushGenerateLeadDataLayer(payload: ContactConversionDlPayload): void {
  const email = normalizeEmail(payload.email);
  if (!email) return;

  const dl = ensureDataLayer();
  dl.push({
    event: "generate_lead",
    form_id: "contact",
    currency: "USD",
    value: 1,
    ...(payload.leadId
      ? {
          event_id: payload.leadId,
          lead_id: payload.leadId,
          transaction_id: payload.leadId,
        }
      : {}),
    user_data: {
      email_address: email,
    },
  });
}

export function stashContactConversionForThankYouPage(payload: ContactConversionDlPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CONTACT_CONVERSION_DL_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota */
  }
}

export function consumeStashedContactConversion(): ContactConversionDlPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CONTACT_CONVERSION_DL_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(CONTACT_CONVERSION_DL_KEY);
    const parsed = JSON.parse(raw) as Partial<ContactConversionDlPayload>;
    if (!parsed.email || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      ...(typeof parsed.leadId === "string" && parsed.leadId ? { leadId: parsed.leadId } : {}),
    };
  } catch {
    return null;
  }
}
