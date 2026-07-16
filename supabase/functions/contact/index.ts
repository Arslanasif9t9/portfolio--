// Contact form handler: validates, saves to contact_messages, and emails the
// owner via Resend (RESEND_API_KEY secret). Email failure never loses the
// message — it's already in the DB by then.

import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://arslanasif9t9.github.io",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

const NOTIFY_EMAIL = "arslanahmadt58@gmail.com";
const FROM = "Portfolio Contact <onboarding@resend.dev>";

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers });
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendEmail(name: string, email: string, message: string): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_EMAIL],
      reply_to: email,
      subject: `📬 New portfolio message from ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#6C3DE8">New contact form message</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background:#f4f4f8;border-radius:8px;padding:16px;white-space:pre-wrap">${esc(message)}</div>
          <p style="color:#888;font-size:12px;margin-top:24px">
            Sent from your portfolio contact form · reply directly to answer ${esc(name)}.
          </p>
        </div>`,
    }),
  });
  return res.ok;
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, headers);

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400, headers);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  if (
    name.length < 2 || name.length > 100 ||
    !/^\S+@\S+\.\S+$/.test(email) || email.length > 255 ||
    message.length < 10 || message.length > 5000
  ) {
    return json({ error: "validation_failed" }, 400, headers);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { error } = await admin.from("contact_messages").insert({ name, email, message });
  if (error) return json({ error: "save_failed" }, 500, headers);

  let emailed = false;
  try {
    emailed = await sendEmail(name, email, message);
  } catch {
    /* message is saved; email is best-effort */
  }

  return json({ ok: true, emailed }, 200, headers);
});
