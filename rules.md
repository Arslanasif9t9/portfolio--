# rules.md — What to Use, What to Avoid, AI Boundaries

## 1. Libraries — USE these (already installed)

| Need | Use | Do NOT add |
|------|-----|-----------|
| Styling | Tailwind classes + tokens from `src/index.css` | styled-components, emotion, plain .css files, inline hex colors |
| UI components | shadcn/ui from `src/components/ui/` | MUI, Ant Design, Chakra, Bootstrap |
| Animation | framer-motion; custom keyframes already in `tailwind.config.ts` / `index.css` | GSAP, animate.css, new animation libs |
| Icons | lucide-react first; react-icons (Fa*) only for brand/social icons | new icon packages |
| Routing | react-router-dom v6 (`BrowserRouter`, `basename="/portfolio--"`) | Next.js router patterns, hash router |
| Forms | react-hook-form + zod when a form needs validation | formik, yup |
| Toasts | sonner (`toast(...)`) — already mounted | react-toastify |
| Class merging | `cn()` from `@/lib/utils` | manual string concat of conditional classes |
| Server state | @tanstack/react-query (if remote data is ever added) | axios+useEffect patterns, SWR |
| Testing | Vitest + @testing-library/react | Jest configs |

**Adding any new dependency requires explicit approval from the owner.**

## 2. Code Conventions — DO

- TypeScript for all new files (`.tsx`/`.ts`); type component props with interfaces.
- Import via the `@/` alias (`@/components/...`), not deep relative paths.
- One component per file, PascalCase filenames, default export (matches existing code).
- Follow the **section pattern**: `id` anchor, framer-motion `whileInView` reveal with `viewport={{ once: true }}`, `gradient-text` heading, gradient underline.
- Use semantic color tokens (`bg-background`, `text-primary`, `border-primary/20`, `neon-cyan`) — never raw hex/rgb values.
- Keep content data (projects, blogs, skills) as typed `const` arrays; if a section's data grows, extract it to `src/data/`.
- Static assets go in `public/`; reference them respecting the `/portfolio--/` base path.
- Keep the site fully static — it must build and run on GitHub Pages with zero server.
- Run `npm run lint` and `npm run test` before considering a task done.
- Mobile-first: verify every change at ~375px and ~1400px widths.

## 3. Code Conventions — AVOID

- **Never hand-edit files in `src/components/ui/`** — they are generated shadcn components. Wrap or compose them instead.
- Don't change `base` in `vite.config.ts`, `basename` in `App.tsx`, or `homepage` in `package.json` unless the repo name changes — and then change **all three together**.
- No backend calls, env secrets, or API keys — this is a public static site.
- No global state libraries (Redux, Zustand) — local state + prop lifting is sufficient.
- No new fonts — stick to Orbitron (display), Rajdhani (body), JetBrains Mono (mono).
- Don't remove the CV modal/print flow (`react-to-print` hidden ref in `Index.tsx`) without a replacement.
- Avoid negative z-index hacks (existing `zIndex: -1` on ContactSection is a known bug, not a pattern to copy).
- Don't commit large binaries to `public/` (the existing `video.mp4` is already flagged for cleanup).
- Don't delete the commented-out data blocks in `ProjectsSection`/`BlogSection` without the owner's OK — they are the owner's reference material.

## 4. Error Handling

- **Images:** always provide `onError` fallback (pattern exists in HeroSection profile image) and meaningful `alt` text.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` on every outbound link.
- **Routes:** unknown paths must keep resolving to `NotFound.tsx` — never remove the `*` catch-all; add custom routes *above* it.
- **Forms:** validate with zod before any future submission wiring; show user feedback via sonner toast, never `alert()` or silent `console.log`.
- **Animations:** guard expensive canvas/particle work — pause or reduce on `prefers-reduced-motion` where feasible.
- **Build safety:** any change must pass `npm run build` (GitHub Pages deploy consumes `dist/`).

## 5. Boundaries for AI (Claude / any AI agent)

**AI may freely:**
- Edit section components, styles, animations, and content structure
- Fix bugs, improve types, refactor within existing patterns
- Add tests in `src/test/`
- Update these `.md` planning docs (especially `memory.md` after each task)

**AI must ASK before:**
- Adding/removing/upgrading any dependency
- Changing personal content: name, bio text, contact details (email `arslanahmadt58@gmail.com`, phone, socials), CV PDF, profile photos
- Deleting any file in `public/`
- Changing deploy config (gh-pages, base path, homepage)
- Rewriting whole sections from scratch instead of editing

**AI must NEVER:**
- Run `npm run deploy` or push to `gh-pages`/`main` without explicit instruction
- Invent fake projects, testimonials, or credentials for the portfolio
- Introduce trackers/analytics without approval
- Commit secrets or personal data beyond what's already publicly on the site
- Force-push, rewrite git history, or delete branches

**Workflow contract:** after completing any task, the AI updates `memory.md`
(what was done, which files touched, completion date) before ending the session.
