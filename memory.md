# memory.md — Project Memory / Work Log

> Single source of truth for "where are we". Every AI session MUST read this
> first and update it after completing (or abandoning) work.

## Current Status

- **Project state:** Existing portfolio cloned from `Arslanasif9t9/portfolio--` and fully studied. Planning docs created. No code changes made yet.
- **Second repo studied:** `Arslanasif9t9/arslanai9t9` cloned to `F:\Work\React\arslanai9t9` (sibling folder). It's a separate app: "Arslan9t9 AI Assistant" — a PWA chat app (TanStack Start + React 19 + Tailwind 4 + Supabase via Lovable Cloud) with multi-provider AI fallback, voice (ElevenLabs/transcription), and a full admin panel at `/admin9t9/*` (dashboard, users, messages, feedback, api-keys, notifications, settings, profile). DB tables: user_roles, admin_profile, api_providers, chat_sessions, messages, app_notifications, user_profiles, admin_gallery, message_feedback. Note: `.env` is committed to that repo (not read; flag for owner).
- **Approved plan (2026-07-16):** Integrate arslanai9t9 AI assistant into the portfolio — desktop: floating chat bottom-right; mobile: new bottom navbar with center AI button. Full plan in `plan.html`. Order: (A) Supabase backend + contact form → (B) AI chat via Supabase Edge Function → (C) polish/deploy.
- **Supabase:** Owner created a NEW project for this: `xwsuiumhdncjbnudsmfw` (https://xwsuiumhdncjbnudsmfw.supabase.co). arslanai9t9's own project stays untouched (it must remain live on its separate hosting). Portfolio stays on GitHub Pages — hence all server logic goes into Supabase Edge Functions.
- **Phase A COMPLETE (verified):** anon key in `.env`; `contact_messages` table + RLS live (tested: anon INSERT 201, SELECT blocked). Migrations run via Management API with owner's access token (owner does nothing manually — see memory).
- **Phase B code COMPLETE:** chat schema live (admin_profile seeded, api_providers, chat_sessions, messages — RLS deny-all for anon), Edge Function `chat` DEPLOYED and tested (session+message flow works, history works; returns `unavailable` until providers added). Frontend built: ChatWidget/ChatPanel/ChatMessage/useChat + MobileBottomNav, mounted in Index. Build+lint pass.
- **Phase B COMPLETE & VERIFIED (2026-07-16):** Gemini key inserted into `api_providers` (model `gemini-flash-latest` — NB: `gemini-2.5-flash` is retired for new users, use the `-latest` alias). End-to-end test passed: edge function returned a real AI reply about Arslan's skills. Owner will add Groq/other providers himself later (wants admin-style control).
- **Next:** owner tests on localhost:8080 → then Phase C: deploy to GitHub Pages (`npm run deploy`). Also remind owner to revoke the Supabase access token when done.

## File Currently Being Worked On

- _none (no source files in progress)_

## Completed Work Log

| Date | Task | Files | Status |
|------|------|-------|--------|
| 2026-07-15 | Cloned `portfolio--` repo into `F:\Work\React\portfolio-code-with-ai` | — | ✅ done |
| 2026-07-15 | Full codebase study (structure, stack, design system, all sections) | — | ✅ done |
| 2026-07-15 | Created planning docs | PRD.md, Architecture.md, rules.md, phases.md, design.md, memory.md | ✅ done |
| 2026-07-16 | AI-integration plan created & approved by owner | plan.html | ✅ done |
| 2026-07-16 | Supabase client setup (lazy, null-safe when env missing) | src/lib/supabase.ts, .env, .env.example, .gitignore | ✅ done |
| 2026-07-16 | contact_messages migration (anon INSERT-only RLS) | supabase/migrations/20260716120000_contact_messages.sql | ✅ done (SQL not yet run in dashboard) |
| 2026-07-16 | Contact form rebuilt: RHF+zod, sonner toasts, honeypot, 60s cooldown, loading state, removed `zIndex:-1` bug | src/components/ContactSection.tsx | ✅ done (build+lint pass) |

## Known Issues Backlog (discovered during study)

1. `ContactSection.tsx` — section has inline `style={{zIndex: -1}}`; risks unclickable form. (Phase 7)
2. Untyped props: `HeroSection({ onViewCv })`, others — add TS interfaces. (Phase 7)
3. Typos: `overflowhidden` (HeroSection), `shadowlg` (Index). (Phase 7)
4. Contact form only `console.log`s — no real submission. (Phase 8)
5. Blog cards link to PDFs/`#` — no real blog pages. (Phase 9)
6. Large unused `public/video.mp4`; duplicate profile images (`pro.jpeg`, `simple.jpeg`, `simple (1).jpg`). (Phase 7)
7. Hero image `src="/profile.jpg"` doesn't respect base path — relies on `onError` fallback to `pro.jpeg` every load. (Phase 7)

## Decisions Made

- 2026-07-15: Keep static-SPA + GitHub Pages architecture; no backend.
- 2026-07-15: Phases 1–6 marked done (already implemented in cloned repo); roadmap starts at Phase 7.

## How to Update This File

After each task: add a row to **Completed Work Log** (date, task, files, status),
update **Current Status** and **File Currently Being Worked On**, and tick the
matching checkbox in `phases.md`.
