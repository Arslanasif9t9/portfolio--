# phases.md — Development Phases

> This portfolio is a static SPA (no login/auth). Phases 1–6 describe the build
> that already exists in the cloned repo (marked ✅ done). Phases 7+ are the
> improvement roadmap going forward. Work on ONE phase at a time; update
> `memory.md` when a phase (or sub-task) is completed.

---

## Phase 1 — Foundation ✅ (done)
- [x] Vite + React 18 + TypeScript scaffold (Lovable base)
- [x] Tailwind CSS + shadcn/ui setup (`components.json`, `src/components/ui/`)
- [x] Design tokens: neon cyberpunk theme in `src/index.css`
- [x] Fonts: Orbitron / Rajdhani / JetBrains Mono
- [x] Routing skeleton: `/`, `/CV`, `*` NotFound
- [x] GitHub Pages deploy pipeline (`gh-pages`, base `/portfolio--/`)

## Phase 2 — Global Shell ✅ (done)
- [x] Navbar with anchor links + CV buttons
- [x] ParticleBackground canvas + scanline overlay
- [x] Footer
- [x] Toasters (shadcn + sonner) mounted

## Phase 3 — Hero & About ✅ (done)
- [x] Hero: profile image w/ neon ring, typewriter taglines, CTAs, floating icons, orbs
- [x] About section with scroll-reveal

## Phase 4 — Skills & Projects ✅ (done)
- [x] SkillsSection with inline SVG brand icons + SkillBadge
- [x] ProjectsSection with 6 real projects (cards: image, tech, category, GitHub/live links)

## Phase 5 — Blog & Contact ✅ (done)
- [x] BlogSection with 4 article cards (PDF links)
- [x] ContactSection: info block, social links, form UI (front-end only)

## Phase 6 — CV System ✅ (done)
- [x] Resume component (printable, also served at `/CV`)
- [x] CV modal on Index (view + download PDF)
- [x] react-to-print integration

---

## Phase 7 — Polish & Bug Fixes 🔜 (next)
- [ ] Fix ContactSection `zIndex: -1` (form may be unclickable)
- [ ] Type all component props (HeroSection, Navbar, etc. currently untyped)
- [ ] Fix typos: `overflowhidden` class in HeroSection, `shadowlg` in Index
- [ ] `rel="noopener noreferrer"` audit on all external links
- [ ] Clean unused assets in `public/` (video.mp4, duplicate images)
- [ ] `prefers-reduced-motion` support for particles/animations
- [ ] Lighthouse pass: performance + accessibility ≥ 90

## Phase 8 — Working Contact Form ✅ (done 2026-07-16, code-side)
- [x] Provider chosen: **Supabase** (`contact_messages` table, anon INSERT-only RLS)
- [x] react-hook-form + zod validation
- [x] Sonner toast success/error feedback
- [x] Spam protection (honeypot + 60s localStorage cooldown)
- [ ] Owner: paste anon key in `.env` + run migration SQL in Supabase dashboard

## Phase 8.5 — AI Assistant Integration (approved plan: plan.html)
- [ ] Replicate needed schema in new Supabase project (api_providers, chat_sessions, messages, admin_profile subset)
- [ ] Edge Function `chat` (provider fallback: gemini → openai-compatible → lovable gateway)
- [ ] ChatWidget (desktop floating bottom-right) + ChatPanel + useChat hook
- [ ] MobileBottomNav (Home · Projects · AI center · Blog · Contact) + full-screen chat sheet
- [ ] Deploy edge function + smoke test

## Phase 9 — Real Blog
- [ ] Convert blog PDFs to in-app pages (route per article or MDX)
- [ ] Blog list → detail navigation
- [ ] Reading time + dates

## Phase 10 — SEO & Launch Hardening
- [ ] Meta/OG tags, favicon set, social share image
- [ ] Sitemap + robots review
- [ ] 404 page styled to match theme
- [ ] Final deploy + smoke test on GitHub Pages

---

### Working rule
Before starting a phase: read `memory.md` → confirm current status.
After finishing: check the boxes here + log it in `memory.md`.
