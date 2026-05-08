---
title: 'OneFlow Design System — Revenue Meeting Dashboard'
slug: 'oneflow'
source-type: spec
source-url: '../DESIGN_SYSTEM.md'
package: null
integration: spec
status: completed
created: 2026-05-06
updated: 2026-05-08
completed: 2026-05-08
current_step: 4
total_steps: 4
scope:
  apps: [mv-revenue-meeting]
  categories: [colors, typography, spacing, radius, motion]
---

# Design Analysis: OneFlow DS → Revenue Meeting Dashboard

## Extracted Tokens (from DESIGN_SYSTEM.md)

### Brand
- `--mv-brand: #7a12d4` — primary CTA, nav active, progress fills
- `--mv-brand-bright: #9b37f2` — hover, focus ring
- `--mv-brand-content: #680fb4` — text on brand-light backgrounds
- `--mv-brand-dark: #4f0c8a` — pressed states
- `--mv-brand-light: #f8efff` — selected rows, active chips
- `--mv-brand-border: #eed8fe` — borders on brand-light

### Semantic backgrounds
| Token | Light | Dark |
|---|---|---|
| `--mv-bg` | white | `#0f131a` |
| `--mv-bg-muted` | `#f9f9f9` | `#181d26` |
| `--mv-bg-subtle` | `#f3f4f6` | `#292d38` |
| `--mv-surface` | white | `#181d26` |
| `--mv-surface-elevated` | white | `#292d38` |

### Semantic text
| Token | Light | Dark |
|---|---|---|
| `--mv-text` | `#0f131a` | white |
| `--mv-text-muted` | `#595e67` | `#b3b8c1` |
| `--mv-text-subtle` | `#71767f` | `#979ca5` |
| `--mv-text-disabled` | `#b3b8c1` | `#595e67` |
| `--mv-text-inverse` | white | `#0f131a` |

### Semantic borders
| Token | Light | Dark |
|---|---|---|
| `--mv-border` | `#dfe1e5` | `#41464f` |
| `--mv-border-strong` | `#ced1d7` | `#595e67` |
| `--mv-border-muted` | `#f3f4f6` | `#292d38` |

### Typography
- `--mv-font-display: "Google Sans", "Plus Jakarta Sans", ui-sans-serif, system-ui`
- `--mv-font-body:    "Google Sans", "Plus Jakarta Sans", ui-sans-serif, system-ui`
- `--mv-font-mono:   ui-monospace, "SF Mono", "Roboto Mono", Menlo, Consolas, monospace`
- Weights: 400, 500, 700 only

### Radius
| Token | Value | Use |
|---|---|---|
| `--mv-radius-xs` | 4px | Mono-chip, ID pill |
| `--mv-radius-sm` | 8px | Inputs, small cards, dropdowns |
| `--mv-radius-md` | 16px | Cards, metric cards, side panels |
| `--mv-radius-lg` | 24px | Modals, hero surfaces |
| `--mv-radius-full` | 128px | Pills — buttons, chips, badges |

### Motion
- `--mv-dur-fast: 120ms` — hover, focus, press
- `--mv-dur-base: 200ms` — state changes
- `--mv-dur-slow: 320ms` — modal rise, panel slide
- `--mv-ease-standard: cubic-bezier(0.2, 0, 0, 1)`
- `--mv-ease-enter: cubic-bezier(0, 0, 0, 1)`
- `--mv-ease-exit: cubic-bezier(0.4, 0, 1, 1)`

## Comparison

### Colors

| Slot | Current (dark) | Current (light) | DS Source | Action |
|---|---|---|---|---|
| Primary brand | `--purple: #7B5FF5` | `--purple: #6B45F0` | `#7a12d4` | **decide** — different hue |
| Brand hover/bright | `--purple2: #9B7FFF` | `--purple2: #7B55F5` | `#9b37f2` | **decide** |
| Background | `--bg: #07050F` | `--bg: #F5F3FF` | dark `#0f131a` / light `white` | **decide** — DS uses neutral, dash uses purple-tint |
| Surface | `--surface: #0F0C1D` | `--surface: #FFFFFF` | dark `#181d26` / light `white` | **decide** |
| Card | `--card: #171230` | `--card: #FFFFFF` | — maps to surface | **decide** |
| Card2 | `--card2: #1F1940` | `--card2: #EDE9FB` | `--mv-surface-elevated` | **decide** |
| Primary text | `--text: #F0EDFC` | `--text: #1C1535` | dark `white` / light `#0f131a` | **close** |
| Muted text | `--muted: rgba(...)0.52` | `--muted: rgba(...)0.62` | dark `#b3b8c1` / light `#595e67` | **decide** |
| Border | `--border: rgba(255,255,255,0.08)` | `--border: rgba(26,18,64,0.1)` | dark `#41464f` / light `#dfe1e5` | **decide** |
| Gold accent | `--gold: #E8B84B` | `--gold: #B8820A` | **no equivalent in DS** | **decide** — revenue-meeting specific |
| Red | `--red: #FF4D6A` | `--red: #D42C45` | `--mv-red` pattern | **close** |
| Amber | `--amber: #FF9B3C` | `--amber: #C47800` | `--mv-orange/amber` pattern | **close** |
| Green | `--green: #2ECC71` | `--green: #1A9950` | `--mv-green` pattern | **close** |

### Typography

| Property | Current | DS Source | Action |
|---|---|---|---|
| Body font | `Sora, system-ui` | `"Google Sans", "Plus Jakarta Sans", system-ui` | **decide** |
| Display font | `Fraunces, serif` (section headers via `font-display`) | `"Google Sans", "Plus Jakarta Sans"` | **decide** |
| Mono font | `JetBrains Mono, monospace` | `ui-monospace, "SF Mono", "Roboto Mono"` | **decide** |
| Weights | 400, 500, 600, 700 | 400, 500, 700 only | minor |

### Radius

| Use | Current | DS Source | Action |
|---|---|---|---|
| Cards | `14px` | `--mv-radius-md: 16px` | close, **decide** |
| Inputs | `8px` | `--mv-radius-sm: 8px` | ✅ match |
| Buttons (sm) | `6px` | `--mv-radius-full: 128px` (pill) | **major change** |
| Buttons (md) | `8px` | `--mv-radius-full: 128px` (pill) | **major change** |
| Buttons (lg) | `10px` | `--mv-radius-full: 128px` (pill) | **major change** |
| Badges/chips | `20px` | `--mv-radius-full: 128px` | close |

### Motion

| Property | Current | DS Source | Action |
|---|---|---|---|
| Hover transitions | `0.15s–0.18s` | `120ms fast` | close |
| State changes | implicit | `200ms base` | could adopt |
| Modal/overlay | not specified | `320ms slow` | could adopt |

## Decisions

Locked 2026-05-08. Single canonical face = Plus Jakarta Sans (Google Sans dropped due to licensing). Gold accent → `--mv-amber-content`. New amber palette values added to `DESIGN_SYSTEM.md` §2.2.1.

### Colors

| Token (kept name for inline-style compat) | Light | Dark | Decision |
|---|---|---|---|
| `--bg` | `#ffffff` | `#0f131a` | change — drop purple tint |
| `--surface` | `#ffffff` | `#181d26` | change |
| `--card` | `#ffffff` | `#181d26` | change |
| `--card2` | `#f9f9f9` | `#292d38` | change (was elevated) |
| `--border` | `#dfe1e5` | `#41464f` | change |
| `--purple` (= `--mv-brand`) | `#7a12d4` | `#7a12d4` | change |
| `--purple2` (= `--mv-brand-bright`) | `#9b37f2` | `#9b37f2` | change |
| `--text` | `#0f131a` | `#ffffff` | change |
| `--muted` | `#595e67` | `#b3b8c1` | change to concrete |
| `--faint` | `#71767f` | `#979ca5` | change to concrete |
| `--red` | `#c13030` | `#ff8b8b` | change (DS red-content) |
| `--amber` | `#d4a016` | `#f0a93a` | change (DS amber base) |
| `--green` | `#1a9950` | `#5ad17d` | change (DS green) |
| `--gold` (legacy alias) | `#8a5a00` | `#f0c66a` | **alias to `--mv-amber-content`** |
| `--mv-amber-*` | (see DS §2.2.1) | (see DS §2.2.1) | **add** |
| `--mv-brand-*` | (see DS §2.1) | (matched in dark) | **add** |

### Typography

| Property | Decision |
|---|---|
| Body face | `'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif` |
| Display face | **Same as body** — `.font-display` repointed (Fraunces dropped) |
| Mono | `ui-monospace, 'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace` (system stack — no JetBrains Mono web font) |
| Weights loaded | 400, 500, 700 (italic 400, 500) — dropped 300 and 600 |

### Spacing & Radius

| Use | Decision |
|---|---|
| Card radius | 14 → **16px** (across 14 inline references in Dashboard.jsx) |
| Button radius | 6/8/10px → **999px (pill)** for all sizes |
| Pill/badge radius | 20 → **999px** |
| Spacing | snap to 4/8/12/16/20/24/32/48/64 (opportunistic, not full sweep) |

### Components

| Component | Change |
|---|---|
| `Btn` atom | All sizes use pill radius. Gold variant uses amber-light bg + amber-content text. Danger variant border uses `--red-bg`. |
| `Pill` atom | Full pill radius (999px). Brand & gold variants use centralized `--mv-brand-*` / `--mv-amber-*` tokens. |
| Sidebar nav active | brand-light fill + brand-border + 3px `::before` accent bar via `.nav-pill` class + `aria-current="page"` |
| Sidebar step indicators | Old hardcoded `rgba(232,184,75,0.15)` replaced with `var(--mv-amber-light)`/`var(--mv-amber-bright)` |
| Modals | `role="dialog" aria-modal="true" aria-labelledby` on HistoryPanel + DateSelectScreen, Escape key dismisses HistoryPanel |
| Empty states | New `.empty-state` recipe (gradient art + title + sub + CTA) per DS §7.9 |
| Loading | `.skel` shimmer class added per DS §7.10 |
| Save toast | `.save-toast` class + visible flash (existing) wrapped with `role="status" aria-live="polite"` |
| Error page | `app/error.tsx` rewritten with friendly copy, brand gradient art tile, pill Retry button, role=alert |
| Active section gradient | Removed gold mid-color from purple gradient (DS §13: no gradients on chrome) |

## Implementation Plan

Land as 4 logical commits.

1. **Commit 1 — Token swap.** Update `:root` and `[data-theme="light"]` in `STYLES` template literal (lines 17–39). Add `--mv-amber-*` and `--mv-brand-*` tokens in both modes. Replace Google Fonts URL — drop Fraunces, drop JetBrains Mono, drop weights 300/600. Update `body`, `.font-display`, `.font-mono` font-family declarations. Replace 13 inline `'JetBrains Mono'` and 5 inline `'Fraunces'` references with new stacks. Bump 14 inline `borderRadius:"14px"` → `"16px"`.
2. **Commit 2 — Atoms + nav + colors.** Update `Btn` atom (pill radius all sizes, gold→amber). Update `Pill` atom (pill radius, brand/gold tokenized). Sweep 16 inline `rgba(123,95,245,...)` → `rgba(122,18,212,...)`. Replace hardcoded sidebar step amber rgba and active-bg purple rgba with new `--mv-*` tokens. Add `.nav-pill` class with `::before` accent bar. Remove gold mid-color from active section gradient.
3. **Commit 3 — A11y + states.** Add focus-visible, prefers-reduced-motion, sr-only, save-toast, skel, empty-state, eyebrow CSS classes to `STYLES`. Add `aria-label="Sections"` to both `<nav>`s. Add `aria-current="page"` + `className="nav-pill"` to sidebar buttons. Add `aria-label` to icon-only buttons (5 trash, 1 close-menu, 1 dismiss-flag, 2 lightbox-close, 1 remove-attachment). Wrap HistoryPanel + DateSelectScreen with `role="dialog" aria-modal="true" aria-labelledby`. HistoryPanel honors Escape key. Wrap save flash in `role="status" aria-live="polite"` sr-only span (visible inline span gets `aria-hidden`).
4. **Commit 4 — Governance.** Update `DESIGN_SYSTEM.md` §2.2 with concrete amber palette hex values (§2.2.1 section). Update this analysis file with Decisions, Implementation Plan, Progress. Rewrite `app/error.tsx` with OneFlow palette + friendly copy + `role="alert"`.

## Progress

- [x] Step 1: Token swap (colors, fonts, radius) — Dashboard.jsx STYLES + inline references
- [x] Step 2: Atoms + nav active state + hardcoded color cleanup
- [x] Step 3: A11y landmarks + ARIA labels + focus-visible + skeleton/empty/save-toast classes
- [x] Step 4: DESIGN_SYSTEM.md amber palette + this analysis file + error.tsx rewrite

## Open follow-ups (not blockers)

- Other support palettes (blue, orange, pink, red) in DS §2.2 still need concrete values — define when first adopted.
- Typography scale tokens (`--t-display-xl/l/m/s`, `--t-body-l/body/caption/micro/eyebrow`) not added as classes — adopt opportunistically per section.
- Sidebar mobile drawer doesn't trap focus — would require a focus-trap library or explicit `tabindex` management; out of scope for surface polish.
- Many inline styles still hardcode old red rgba (`rgba(212,44,69,...)` etc.) for borders. They render acceptably (alpha blending against new bg) but should be migrated to `var(--red-bg)` opportunistically.
- "Submit snapshot" / single primary button per screen audit (DS §7.1) — not enforced; some sections may have multiple primary buttons.
- Tabular-nums audit on column-aligned numbers — `.font-mono` now uses system mono with `tabular-nums`, but inline non-mono numerics aren't wrapped.
