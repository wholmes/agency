import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, company, project, budget, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: "Name, email and message are required." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email address." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_YOUR_KEY_HERE") {
    console.error("RESEND_API_KEY is not configured.");
    return Response.json(
      { error: "Email delivery is not configured. Please try again later." },
      { status: 500 },
    );
  }

  // Load settings from DB, fall back to env vars
  let settings: {
    notifyEmail: string;
    fromName: string;
    fromAddress: string;
    autoReplyEnabled: boolean;
    autoReplySubject: string;
    autoReplyOpening: string;
  } | null = null;

  try {
    settings = await prisma.emailSettings.findUnique({ where: { id: 1 } });
  } catch {
    /* non-fatal — fall back */
  }

  const notifyEmail =
    settings?.notifyEmail ||
    process.env.CONTACT_TO_EMAIL ||
    "";

  const fromName = settings?.fromName || "BrandMeetsCode";
  const fromAddress =
    settings?.fromAddress ||
    process.env.CONTACT_FROM_DOMAIN ||
    "onboarding@resend.dev";
  const from = `${fromName} <${fromAddress}>`;

  if (!notifyEmail) {
    console.error("No notification email configured in DB or env.");
    return Response.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  // Notification to you
  const notifyResult = await resend.emails.send({
    from,
    to: notifyEmail,
    replyTo: email,
    subject: `New inquiry from ${name}${company ? ` · ${company}` : ""}`,
    html: buildNotifyHtml({ name, email, company, project, budget, message }),
  });

  if (notifyResult.error) {
    console.error("Resend notify error:", notifyResult.error);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  // Auto-reply to the submitter
  const autoReplyEnabled = settings?.autoReplyEnabled ?? true;
  if (autoReplyEnabled) {
    const subject =
      settings?.autoReplySubject || "Got your message — I'll be in touch shortly";
    const opening =
      settings?.autoReplyOpening ||
      "Thanks for reaching out — I've received your message and will get back to you within 1–2 business days.";

    await resend.emails.send({
      from,
      to: email,
      subject,
      html: buildAutoReplyHtml({ name, opening, notifyEmail }),
    });
  }

  // Server-side GA4 event — fire and forget
  void trackEvent("generate_lead", {
    form_name: "contact",
    ...(project ? { project_type: project } : {}),
    ...(budget ? { budget_range: budget } : {}),
  });

  return Response.json({ ok: true });
}

function buildNotifyHtml(d: {
  name: string; email: string; company: string;
  project: string; budget: string; message: string;
}) {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 0;font-size:13px;color:#eee">${value}</td></tr>`
      : "";

  return `<!DOCTYPE html><html><body style="background:#141413;font-family:system-ui,sans-serif;margin:0;padding:32px">
<div style="max-width:560px;margin:0 auto">
  <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9a55a;margin:0 0 20px">New Contact Form Submission</p>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
    ${row("Name", d.name)}
    ${row("Email", d.email)}
    ${row("Company", d.company)}
    ${row("Project type", d.project)}
    ${row("Budget", d.budget)}
  </table>
  <div style="background:#1b1b19;border:1px solid #222220;border-radius:8px;padding:20px;margin-bottom:24px">
    <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#888;margin:0 0 10px">Message</p>
    <p style="font-size:14px;line-height:1.7;color:#ddd;margin:0;white-space:pre-wrap">${d.message}</p>
  </div>
  <a href="mailto:${d.email}?subject=Re: your inquiry" style="display:inline-block;padding:10px 20px;background:#c9a55a;color:#141413;font-size:13px;font-weight:600;text-decoration:none;border-radius:4px">Reply to ${d.name}</a>
</div></body></html>`;
}

function buildAutoReplyHtml(d: { name: string; opening: string; notifyEmail: string }) {
  return `<!DOCTYPE html><html><body style="background:#141413;font-family:system-ui,sans-serif;margin:0;padding:32px">
<div style="max-width:560px;margin:0 auto">
  <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9a55a;margin:0 0 24px">BrandMeetsCode</p>
  <p style="font-size:16px;color:#eee;line-height:1.7;margin:0 0 16px">Hi ${d.name},</p>
  <p style="font-size:15px;color:#ccc;line-height:1.7;margin:0 0 16px">${d.opening}</p>
  <p style="font-size:15px;color:#ccc;line-height:1.7;margin:0 0 32px">In the meantime, feel free to reply to this email if there's anything else you'd like to share.</p>
  <p style="font-size:14px;color:#888;margin:0">— Whittfield<br><a href="https://brandmeetscode.com" style="color:#c9a55a;text-decoration:none">brandmeetscode.com</a></p>
</div></body></html>`;
}
