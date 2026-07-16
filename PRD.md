# PRD.md — Product Requirements Document

## Project: Arslan Ahmad — Personal Portfolio Website

**Repo:** https://github.com/Arslanasif9t9/portfolio--
**Live target:** GitHub Pages → `https://arslanasif9t9.github.io/portfolio--`

---

## 1. What to Build

A single-page, futuristic/cyberpunk-themed personal portfolio website for **Arslan Ahmad**, a Full-Stack Web Developer (React + Laravel + MySQL) based in Lahore, Pakistan. The site showcases his skills, projects, blog articles, and CV, and gives potential clients/employers an easy way to contact him.

The site is a **static SPA** (no backend, no database) deployed on GitHub Pages.

## 2. Targeted Users

| User | Goal on the site |
|------|------------------|
| **Recruiters / Hiring Managers** | Quickly assess skills, view/download CV, check project quality |
| **Potential Freelance Clients** | See past work (e-commerce, CMS, IoT), contact via WhatsApp/email |
| **Fellow Developers** | Browse GitHub repos, read blog posts, network via LinkedIn |

## 3. Core Features

### 3.1 Hero Section
- Profile photo with animated neon ring
- Animated typewriter taglines ("Full-Stack Web Developer", "Powered by React & Laravel", …)
- Tech badge chip: `React • Laravel • MySQL`
- CTA buttons: **Explore My Work** (scroll to projects) and **View CV** (opens modal)
- Floating icons, glowing orbs, animated grid background

### 3.2 CV / Resume
- **View CV**: modal with rendered `<Resume />` component
- **Download PDF**: direct download of `public/Arslan_Ahmad_CV.pdf`
- Print-to-PDF via `react-to-print` (hidden ref)
- Standalone route `/CV`

### 3.3 About Section
- Bio, experience highlights, personal intro

### 3.4 Skills Section
- Skill badges with inline SVG brand icons (React, TypeScript, JavaScript, Tailwind, Node, Laravel, MySQL, Docker, Git, AWS, HTML/CSS, etc.)

### 3.5 Projects Section
Real project cards with image, tech stack, category, GitHub + live links:
1. **Multi-vendor E-Commerce Platform** (Laravel/MySQL) — 3 dashboards: Admin, Vendor, Customer
2. **Al-Kuwait E-Commerce** (Laravel/MySQL)
3. **BlogSphere** — CMS/blogging platform (Laravel)
4. **IoT Automatic Car Parking** (Embedded C++ / PHP / IoT)
5. **React TextUtils** — text utility app (React)
6. **iCoder Bootstrap Portal** — blog template (Bootstrap 5)

### 3.6 Blog Section
Blog cards (currently linking to PDFs / placeholders):
- Architecting Multi-Vendor Systems in Laravel
- Bridging Software and Hardware: IoT Parking Systems
- Mastering the Laravel Admin Dashboard
- Text Manipulation in React: Beyond basic Hooks

### 3.7 Contact Section
- Contact form (name, email, message) — currently front-end only (console.log)
- Direct contact info: `arslanahmadt58@gmail.com`, `+92 345 0776252`, Lahore, Punjab, Pakistan
- Social links: WhatsApp, Facebook, LinkedIn, GitHub

### 3.8 Global UI
- Sticky Navbar with section anchors + CV actions
- Particle background (canvas) + scanline overlay across whole page
- Footer
- 404 NotFound page (catch-all route)

## 4. Non-Functional Requirements

- **Performance:** static build, lazy/optimized assets; animations must not jank on mid-range phones
- **Responsive:** mobile-first, works from 360px to 1400px+ (container capped at 1400px)
- **Deployment:** `npm run deploy` → `gh-pages` branch; `base: "/portfolio--/"` must stay in sync with repo name
- **SEO basics:** meta tags in `index.html`, `robots.txt` present
- **Accessibility:** semantic sections, alt text on images, keyboard-reachable nav

## 5. Out of Scope (current version)

- User authentication / login
- Backend API or database
- CMS-driven blog (posts are hard-coded / PDF links)
- Working contact-form submission (needs EmailJS/Formspree — future enhancement)
- i18n / multiple languages

## 6. Known Gaps / Future Enhancements

- [ ] Wire contact form to a real service (EmailJS, Formspree, or WhatsApp deep-link fallback)
- [ ] Blog posts as real pages/MDX instead of PDF links
- [ ] Remove large unused assets in `public/` (video.mp4, duplicate images)
- [ ] Fix `zIndex: -1` on ContactSection (can make form unclickable in some stacking contexts)
- [ ] Add TypeScript types to component props (several components use untyped props, e.g. `HeroSection ({ onViewCv })`)
