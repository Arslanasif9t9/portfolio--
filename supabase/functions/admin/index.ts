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

  return json({ error: "unknown_action" }, 400, headers);
});
