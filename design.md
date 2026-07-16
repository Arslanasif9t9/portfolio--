# design.md — Colors, Theme, Fonts & Typography

## 1. Theme Concept

**Futuristic / Cyberpunk dark theme.** Deep navy-black background, neon cyan +
magenta + purple accents, glassmorphism cards, glow effects, animated grid and
scanline overlays. Single theme (dark only) — `darkMode: ["class"]` is configured
but no light theme is defined.

## 2. Color System

All colors are **HSL CSS variables** in `src/index.css`, consumed via Tailwind
semantic classes. Never hard-code hex values.

### Core tokens

| Token | HSL | Approx | Usage |
|-------|-----|--------|-------|
| `--background` | 230 25% 5% | #0A0B10 deep navy-black | page background |
| `--foreground` | 180 100% 95% | near-white cyan tint | body text |
| `--card` | 230 30% 8% | #0D0F1A | cards, popovers |
| `--primary` | 180 100% 50% | **#00FFFF neon cyan** | headings, links, glows, ring |
| `--secondary` | 300 100% 60% | **#FF33FF neon magenta** | gradients, accents |
| `--accent` | 270 100% 65% | **#A64DFF neon purple** | tertiary accent |
| `--muted` | 230 20% 15% | dark slate | muted surfaces |
| `--muted-foreground` | 180 20% 60% | grey-cyan | secondary text |
| `--destructive` | 0 100% 60% | red | errors |
| `--border` | 180 50% 20% | dark cyan | borders |
| `--input` | 230 30% 12% | | form fields |
| `--radius` | 0.75rem | | border radius base |

### Extended neon palette (`neon-*` Tailwind classes)

| Class | HSL |
|-------|-----|
| `neon-cyan` | 180 100% 50% |
| `neon-magenta` | 300 100% 60% |
| `neon-purple` | 270 100% 65% |
| `neon-blue` | 220 100% 60% |
| `neon-green` | 150 100% 50% |
| `neon-orange` | 30 100% 55% |
| `neon-yellow` | 50 100% 55% |

### Gradients (CSS vars)

- `--gradient-primary`: cyan → purple (135deg) — main headings (`gradient-text`), primary CTA
- `--gradient-secondary`: magenta → cyan (135deg) — `gradient-text-secondary`
- `--gradient-accent`: purple → magenta (135deg)
- `--gradient-hero`: vertical dark navy fade for hero backdrop

### Neon shadows

- `--shadow-neon-cyan / -magenta / -purple`: double-layer glow (20px @ 0.5 + 40px @ 0.3)

## 3. Fonts & Typography

Loaded via Google Fonts `@import` in `src/index.css`:

| Role | Font | Tailwind class | Weights | Usage |
|------|------|---------------|---------|-------|
| Display | **Orbitron** | `font-display` | 400–900 | all headings h1–h6 (set globally), logo, hero name |
| Body | **Rajdhani** | `font-body` | 300–700 | body text (set on `<body>`) |
| Mono | **JetBrains Mono** | `font-mono` | 400–600 | tech chips, code-ish labels |

### Type scale in practice

- Hero H1: `text-5xl md:text-7xl font-display font-bold` (name in `gradient-text`)
- Section H2: `text-4xl md:text-5xl font-display font-bold` + `gradient-text` span
- Section sub-copy: `text-muted-foreground`, centered, `max-w-2xl`
- Taglines/typewriter: `text-xl md:text-2xl text-muted-foreground`
- Small labels/chips: `text-sm font-mono text-muted-foreground`

### Section heading pattern (reuse everywhere)

```tsx
<h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
  <span className="gradient-text">Section Title</span>
</h2>
<p className="text-muted-foreground max-w-2xl mx-auto">Subtitle…</p>
<div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4" />
```

## 4. Signature Component Classes (`src/index.css` @layer components)

| Class | Effect |
|-------|--------|
| `.neon-text` / `-magenta` / `-purple` | 4-layer text-shadow glow |
| `.neon-border` / `-magenta` | glowing box-shadow border |
| `.glass-card` | translucent card: `bg-card/30 backdrop-blur-xl border-primary/20` + soft glow |
| `.gradient-text` / `-secondary` | gradient-clipped text |
| `.floating-input` | glowing focus form input |
| `.grid-overlay` | 50px cyan grid lines background |
| `.scanline` | CRT scanline overlay (used fixed at z-50, opacity-30) |

## 5. Motion Language

- **Entrances:** framer-motion `initial={{opacity:0, y:30}}` → `whileInView` with `viewport={{once:true}}`, 0.6s ease-out; staggered `delay` for children
- **Hover:** `whileHover={{scale:1.05}}`, `whileTap={{scale:0.95}}` on CTAs; glow intensifies via shadow transitions
- **Ambient:** floating icons (y ± 20px, 3–4s loops), pulsing orbs (`blur-3xl` circles, 5s scale/opacity loops), slow-rotate, shimmer
- **Custom keyframes:** `fade-in`, `slide-in-left/right`, `scale-in`, `flip-in`, `border-glow`, `float`, `pulse-neon`, `glow`, `typing`, `blink-caret`
- **Typewriter:** custom `Typewriter` component — 80ms type / 40ms delete / 2.5s pause

## 6. Layout Rules

- Container: centered, `2rem` padding, max `1400px`
- Sections: `py-20 px-4`, inner `max-w-6xl mx-auto` (hero `max-w-4xl`)
- Grids: `md:grid-cols-2` (contact) / `md:grid-cols-2 lg:grid-cols-3` (cards)
- Rounded: cards `rounded-2xl`, pills/CTAs `rounded-full`, base `--radius: 0.75rem`
- Scrollbar: custom 8px, cyan thumb on dark track
