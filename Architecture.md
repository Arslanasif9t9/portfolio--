# Architecture.md — App Flow, Architecture & Tech Stack

## 1. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Build tool | **Vite 5** + `@vitejs/plugin-react-swc` | Dev server on port **8080**, `base: "/portfolio--/"` |
| Framework | **React 18** + **TypeScript 5.8** | SPA, `strict` TS config split (app/node) |
| Styling | **Tailwind CSS 3.4** + CSS variables (HSL) | Design tokens in `src/index.css`, extended in `tailwind.config.ts` |
| UI Kit | **shadcn/ui** (Radix primitives) | Full set pre-generated in `src/components/ui/` |
| Animation | **Framer Motion 12** + custom CSS keyframes | Scroll-reveal (`whileInView`), modal transitions |
| Routing | **react-router-dom 6** | `BrowserRouter` with `basename="/portfolio--"` |
| Data | **@tanstack/react-query 5** | Provider mounted; no server data yet (static site) |
| Forms | react-hook-form + zod | Available; contact form currently uses plain useState |
| Icons | lucide-react + react-icons + inline SVGs | Brand icons hand-drawn as SVG components in SkillsSection |
| PDF/Print | **react-to-print 3** | CV print-to-PDF via hidden ref |
| Notifications | sonner + shadcn toaster | Both mounted in App |
| Testing | **Vitest 3** + Testing Library + jsdom | `src/test/setup.ts`, `vitest.config.ts` |
| Lint | ESLint 9 (flat config) + typescript-eslint | `npm run lint` |
| Deploy | **gh-pages 6** | `npm run deploy` → builds & pushes `dist/` |
| Origin | Lovable scaffold | `lovable-tagger` runs in dev mode only |

## 2. App Flow

```
index.html
  └─ src/main.tsx                 → mounts <App />
      └─ src/App.tsx              → Providers + Router
          ├─ QueryClientProvider
          ├─ TooltipProvider
          ├─ <Toaster /> + <Sonner />
          └─ BrowserRouter (basename="/portfolio--")
              ├─ "/"    → pages/Index.tsx      (the whole portfolio)
              ├─ "/CV"  → components/Resume.tsx (standalone CV page)
              └─ "*"    → pages/NotFound.tsx
```

### Index page composition (top → bottom)

```
<Index>
 ├─ <ParticleBackground />        fixed canvas, z-0
 ├─ scanline overlay              fixed, z-50, pointer-events-none
 ├─ <Navbar onViewCv onDownloadCv />
 ├─ <main> (z-10)
 │   ├─ <HeroSection onViewCv />  #home  — typewriter, orbs, CTAs
 │   ├─ <AboutSection />          #about
 │   ├─ <SkillsSection />         #skills
 │   ├─ <ProjectsSection />       #projects — maps projects[] → <ProjectCard />
 │   ├─ <BlogSection />           #blog     — maps blogs[]    → <BlogCard />
 │   └─ <ContactSection />        #contact  — form + social links
 ├─ CV Modal (AnimatePresence)    z-100 — <Resume /> + download link
 ├─ hidden <Resume ref /> for react-to-print
 └─ <Footer />
```

**State model:** Local `useState` only. The single piece of shared state is `isCvOpen`
(lifted to `Index`, passed down to `Navbar` and `HeroSection` as `onViewCv`). No global
store; navigation between sections is anchor scrolling (`#projects`, `#contact`, …).

**Data model:** All content (projects, blogs, skills, taglines, social links) is
hard-coded as `const` arrays inside the respective section components.

## 3. Folder & File Architecture

```
portfolio--/
├── public/                     # static assets (served at base path)
│   ├── Arslan_Ahmad_CV.pdf     # downloadable CV
│   ├── blog.pdf                # blog article PDF
│   ├── pro.jpeg                # profile photo (fallback)
│   ├── placeholder.svg / robots.txt / video.mp4
├── src/
│   ├── main.tsx                # entry point
│   ├── App.tsx                 # providers + routes
│   ├── index.css               # ⭐ design system: tokens, neon utilities, keyframes
│   ├── App.css                 # (legacy, mostly unused)
│   ├── pages/
│   │   ├── Index.tsx           # main portfolio page + CV modal state
│   │   └── NotFound.tsx        # 404
│   ├── components/
│   │   ├── Navbar.tsx          # sticky nav, section links, CV buttons
│   │   ├── NavLink.tsx
│   │   ├── HeroSection.tsx     # hero + typewriter + CTAs
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx   # inline SVG brand icons + <SkillBadge />
│   │   ├── SkillBadge.tsx
│   │   ├── ProjectsSection.tsx # projects[] data + grid
│   │   ├── ProjectCard.tsx
│   │   ├── BlogSection.tsx     # blogs[] data + grid
│   │   ├── BlogCard.tsx
│   │   ├── ContactSection.tsx  # form + contact info + socials
│   │   ├── Footer.tsx
│   │   ├── Resume.tsx          # printable CV component (also route /CV)
│   │   ├── ParticleBackground.tsx  # canvas particle animation
│   │   ├── Typewriter.tsx      # reusable typewriter effect
│   │   └── ui/                 # shadcn/ui components (generated — don't hand-edit)
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│   └── test/
│       ├── setup.ts
│       └── example.test.ts
├── index.html
├── vite.config.ts              # base path, @ alias, port 8080
├── vitest.config.ts
├── tailwind.config.ts          # fonts, neon colors, keyframes
├── tsconfig*.json
├── eslint.config.js
├── components.json             # shadcn config
└── package.json
```

## 4. Key Conventions

- **Path alias:** `@/` → `src/` (e.g. `@/components/ui/button`) — some older files still use relative imports.
- **Section pattern:** each section = one component with `id="<anchor>"`, its own `motion.div` scroll-reveal (`whileInView` + `viewport={{ once: true }}`), heading with `gradient-text`, and a gradient underline bar.
- **Design tokens:** never hard-code colors; use Tailwind semantic classes (`bg-background`, `text-primary`, `neon-*`) backed by HSL CSS variables.
- **Base path coupling:** `vite.config.ts` `base`, `App.tsx` `basename`, and `package.json` `homepage` must all match the GitHub repo name (`portfolio--`).

## 5. Build & Deploy Pipeline

```
npm run dev        # Vite dev server @ localhost:8080
npm run test       # Vitest run
npm run lint       # ESLint
npm run build      # vite build → dist/
npm run deploy     # predeploy (build) + gh-pages -d dist
```

Deployment target is the `gh-pages` branch of the same repo; GitHub Pages serves it at `/portfolio--/`.
