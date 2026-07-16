// Admin edge function — only the operations that genuinely need the service role:
//  - check_exists: is there any admin yet? (drives the login page's setup mode)
//  - bootstrap:    create the FIRST admin auth user (self-guarded: refuses if one exists)
//  - test_provider: live-test an AI provider using its raw api_key (never sent to browser)
// Everything else the admin UI does directly via supabase-js under RLS.

import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://arslanasif9t9.github.io",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

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

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// deno-lint-ignore no-explicit-any
async function getAdminUser(admin: any): Promise<{ id: string; email: string } | null> {
  const { data: role } = await admin
    .from("user_roles").select("user_id").eq("role", "admin").limit(1).maybeSingle();
  if (!role) return null;
  const { data } = await admin.auth.admin.getUserById(role.user_id);
  if (!data?.user?.email) return null;
  return { id: data.user.id, email: data.user.email };
}

async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "Portfolio Admin <onboarding@resend.dev>",
      to: [to],
      subject: `🔐 Your password reset code: ${code}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;text-align:center">
          <h2 style="color:#6C3DE8">Password Reset</h2>
          <p>Use this code to reset your admin password. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size:36px;letter-spacing:10px;font-weight:bold;background:#f4f4f8;border-radius:12px;padding:20px;margin:20px 0">${code}</div>
          <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
        </div>`,
    }),
  });
  return res.ok;
}

// deno-lint-ignore no-explicit-any
async function requireAdmin(req: Request, admin: any): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token || token.split(".").length !== 3) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return null;
  const { data: role } = await admin
    .from("user_roles").select("id")
    .eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
  return role ? data.user.id : null;
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, headers);

  let body: { action?: string; email?: string; password?: string; id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400, headers);
  }

  const admin = serviceClient();

  if (body.action === "check_exists") {
    const { count } = await admin
      .from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
    return json({ adminExists: (count ?? 0) > 0 }, 200, headers);
  }

  if (body.action === "bootstrap") {
    const email = (body.email ?? "").trim();
    const password = body.password ?? "";
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return json({ error: "invalid_credentials_format" }, 400, headers);
    }
    const { count } = await admin
      .from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) > 0) return json({ error: "admin_already_exists" }, 403, headers);

    const { data: created, error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
    });
    if (error || !created?.user) {
      return json({ error: error?.message ?? "create_failed" }, 500, headers);
    }
    const { error: roleErr } = await admin
      .from("user_roles").insert({ user_id: created.user.id, role: "admin" });
    if (roleErr) return json({ error: roleErr.message }, 500, headers);
    return json({ ok: true }, 200, headers);
  }

  if (body.action === "test_provider") {
    const userId = await requireAdmin(req, admin);
    if (!userId) return json({ error: "forbidden" }, 403, headers);
    if (!body.id) return json({ error: "missing_id" }, 400, headers);

    const { data: p } = await admin.from("api_providers").select("*").eq("id", body.id).single();
    if (!p) return json({ error: "not_found" }, 404, headers);

    const messages = [{ role: "user", content: "Hello! Reply with one short sentence." }];
    try {
      let text: string;
      if (p.provider_type === "gemini") {
        const base = p.endpoint_url.replace("{model}", p.model_name);
        const url = base.includes("?") ? `${base}&key=${p.api_key}` : `${base}?key=${p.api_key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: messages[0].content }] }] }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      } else {
        const res = await fetch(p.endpoint_url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.api_key}` },
          body: JSON.stringify({ model: p.model_name, messages, temperature: 0.2 }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        text = j.choices?.[0]?.message?.content ?? "";
      }
      if (!text) throw new Error("Empty response");
      await admin.from("api_providers")
        .update({ last_status: "ok", last_used_at: new Date().toISOString() }).eq("id", p.id);
      return json({ ok: true, sample: text.slice(0, 120) }, 200, headers);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      await admin.from("api_providers")
        .update({ last_status: `fail: ${msg.slice(0, 80)}` }).eq("id", p.id);
      return json({ ok: false, error: msg }, 200, headers);
    }
  }

  if (body.action === "forgot_password") {
    const user = await getAdminUser(admin);
    if (!user) return json({ error: "no_admin" }, 404, headers);

    // Rate limit: max 3 codes per 15 minutes
    const recent = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("password_reset_codes").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).gte("created_at", recent);
    if ((count ?? 0) >= 3) return json({ error: "rate_limited" }, 429, headers);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await admin.from("password_reset_codes")
      .update({ used: true }).eq("user_id", user.id).eq("used", false);
    await admin.from("password_reset_codes").insert({
      user_id: user.id,
      code_hash: await sha256(code),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    const sent = await sendOtpEmail(user.email, code);
    if (!sent) return json({ error: "email_not_configured" }, 503, headers);
    const masked = user.email.replace(/^(..).*(@.*)$/, "$1•••$2");
    return json({ ok: true, maskedEmail: masked }, 200, headers);
  }

  if (body.action === "reset_password") {
    const code = String((body as { code?: string }).code ?? "").trim();
    const newPassword = String((body as { newPassword?: string }).newPassword ?? "");
    if (!/^\d{6}$/.test(code) || newPassword.length < 8) {
      return json({ error: "invalid_input" }, 400, headers);
    }
    const user = await getAdminUser(admin);
    if (!user) return json({ error: "no_admin" }, 404, headers);

    const { data: row } = await admin
      .from("password_reset_codes").select("*")
      .eq("user_id", user.id).eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!row) return json({ error: "no_valid_code" }, 400, headers);
    if (row.attempts >= 5) return json({ error: "too_many_attempts" }, 429, headers);

    if (row.code_hash !== (await sha256(code))) {
      await admin.from("password_reset_codes")
        .update({ attempts: row.attempts + 1 }).eq("id", row.id);
      return json({ error: "wrong_code" }, 400, headers);
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    if (updErr) return json({ error: "update_failed" }, 500, headers);
    await admin.from("password_reset_codes").update({ used: true }).eq("id", row.id);
    return json({ ok: true }, 200, headers);
  }

  return json({ error: "unknown_action" }, 400, headers);
});
