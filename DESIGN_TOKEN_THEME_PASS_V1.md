# MoneyBasis Design Token & Theme Pass v1

This pass unifies MoneyBasis onto one light/dark token system. Layouts, calculator behavior, guide copy, financial models, SEO, URLs, and source data were left unchanged.

## A. Existing palette issues

Before this pass the product read as a blue-tinted fintech template rather than a black/white/gray interface with controlled color:

- Page canvas, cards, and header reused inverted names (`--surface` was the page, `--background` was white).
- Dark mode used navy (`#0b1220`, `#0f172a`, `#111827`) instead of near-black charcoal.
- Giant `bg-primary-soft` washes appeared on calculator headers, directory cards, guide cards, homepage CTAs, results columns, and trust callouts.
- Icon chips used Tailwind pastel utilities (`bg-blue-50`) that broke in dark mode.
- Charts hardcoded light/dark hex palettes, dashed every other series, and treated rent-vs-buy as blue vs orange.
- Body copy mixed slate, gray, and blue-gray values.
- Status banners used `emerald-50` / `amber-950`, which failed in dark mode.

## B. Token architecture

Semantic CSS variables live in `app/globals.css` (`:root` and `.dark`). Tailwind `@theme` maps them to utilities without inventing component-specific color names.

Compatibility aliases keep existing class names working:

| Utility / legacy var | Semantic token |
| --- | --- |
| `--background` / `bg-background` | `--bg` (page canvas) |
| `--card` / `bg-card` | `--surface` (cards) |
| `--color-surface` / `bg-surface` | `--surface-subtle` (muted inner) |
| `--foreground` / `text-foreground` | `--text` |
| `--muted` / `text-muted` | `--text-secondary` |
| `--primary` / `bg-primary` | `--brand` |
| `--primary-soft` | `--brand-soft` |
| `--positive` / `--negative` | `--success` / `--error` |

Theme switching uses `next-themes` `class="dark"` (not `[data-theme="dark"]`).

## C. Light palette

```
--bg: #F7F8FA
--surface / --surface-raised: #FFFFFF
--surface-subtle: #F2F4F7
--text: #111318
--text-secondary: #5F6B7A
--text-tertiary: #8A94A3
--text-inverse: #FFFFFF
--border: #E3E7ED
--border-strong: #CBD2DC
--brand: #2563EB
--brand-hover: #1D4ED8
--brand-soft: #EFF6FF
--focus: #2563EB
```

Page = soft gray. Cards = white. Type = black / gray. Brand blue is reserved for actions, selected pills, and focus.

## D. Dark palette

```
--bg: #090A0B
--surface: #111214
--surface-subtle: #17181B
--surface-raised: #141518
--text: #F5F7FA
--text-secondary: #A6AFBC
--text-tertiary: #747D89
--text-inverse: #0A0A0B
--border: #272A2F
--border-strong: #383C43
--brand: #4F83FF
--brand-hover: #75A0FF
--brand-soft: #14213D
--focus: #6B95FF
```

Dark mode is near-black / charcoal, not navy. Primary actions use `--text-inverse` so the brighter dark-mode blue still meets contrast.

## E. Category colors

Used for icon chips, small labels, chart series, and legend markers — not for page sections or primary buttons.

| Token | Light | Dark glyph | Dark soft |
| --- | --- | --- | --- |
| `--home` / `--salary` | `#2563EB` | `#4F83FF` | `#111C33` |
| `--growth` | `#16A36A` | `#34D399` | `#10241C` |
| `--retirement` / `--budget` | `#7C3AED` / `#8B5CF6` | `#A78BFA` | `#1C1630` |
| `--savings` / `--loan` | `#D97706` | `#FBBF24` | `#281D0E` / `#281B10` |
| `--debt` | `#EA580C` | `#FB923C` | `#2B1710` |
| `--net-worth` | `#0284C7` | `#38BDF8` | `#10222C` |
| `--comparison` | `#F97316` | `#FB923C` | `#281B10` |

Chip classes: `.tint-home`, `.tint-growth`, `.tint-retirement`, `.tint-savings`, `.tint-budget`, `.tint-salary`, `.tint-loan`, `.tint-debt`, `.tint-net-worth`, `.tint-comparison`.

## F. Chart palette

| Token | Role |
| --- | --- |
| `--chart-primary` | Mortgage balance/principal, contributions, buying, extra payment |
| `--chart-cost` | Interest / cash-cost series |
| `--chart-growth` | Investment growth, rent + investing |
| `--chart-retirement` | Retirement portfolio |
| `--chart-neutral` | Current loan plan, savings goal (dashed) |
| `--chart-net-worth` | Net-worth identity |
| `--chart-grid` | Subtle grid (`#E3E7ED` / `#272A2F`) |
| `--chart-axis` | Tick/legend labels |
| `--chart-tooltip-bg` / `--chart-tooltip-border` | Tooltip chrome |

Series are not dashed by index. Only columns marked `dashed: true` (savings goal) use a dashed stroke. Rent vs buy is blue vs green, not winner/loser red-green.

## G. Button / input tokens

**Primary:** `--brand` + `--text-inverse`  
**Secondary:** `--surface` + `--border` + `--text`  
**Ghost:** transparent + `--text-secondary`  
**Destructive:** `--error` + `--text-inverse`, only for clearing saved data

Inputs: `--surface` background, `--border`, `--text`, muted prefix/suffix, `--brand` focus ring. No calculator-colored field fills.

## H. Card / surface tokens

Four surfaces only:

1. Page (`--bg`)
2. Card (`--surface`)
3. Muted inner (`--surface-subtle`)
4. Raised (`--surface-raised` + `--shadow-md`)

Helper classes: `.card`, `.card-muted`, `.card-raised`. Calculator results, chart mode rails, table headers, and trust CTAs use muted surfaces instead of brand-soft washes.

## I. Accessibility

- Ordinary text uses `--text` / `--text-secondary` against `--bg` / `--surface`.
- Selected pills and primary actions use `--text-inverse` on `--brand` so dark-mode `#4F83FF` still contrasts.
- Focus rings use `--focus`.
- Status green/amber/red is reserved for success, warning, and error.
- Chart values remain available in the inspect control and data table; color is not the only carrier.
- Theme color transitions are 140ms on `body`/`header`/`footer` and respect `prefers-reduced-motion`. Chart.js animations stay off.

## J. Hardcoded-color cleanup

Removed page-level Tailwind pastels and hex chart palettes. Remaining hardcoded colors:

| Location | Reason |
| --- | --- |
| `lib/og.tsx` | Static Open Graph raster; no CSS variables |
| Calculator/guide `opengraph-image.tsx` | Same |
| `lib/site.ts` `THEME_COLOR`, `BRAND_BLUE` | Browser chrome / brand constant |
| `app/manifest.ts` `background_color` | PWA manifest |
| `lib/chart-theme.ts` fallbacks | SSR/read before CSS is available |

## K. Dark-mode fixes

- Canvas `#090A0B`, cards `#111214`, not navy.
- Dedicated dark category-soft chips (not faded light pastels).
- Chart grids `#272A2F`.
- Status banners use `--success-soft` / `--warning-soft`.
- Header/footer use card charcoal so they separate from the page without a contrast jump.

## L. Tests

- `tests/theme-tokens.test.ts` — token presence, light/dark values, no navy canvas, dedicated dark chip surfaces.
- `tests/chart-adapters.test.ts` — mortgage/investment/savings/loan/rent-vs-buy series tones.
- `tests/e2e/theme-pass.spec.ts` — token switch, primary contrast, icon chips, chart tooltip theming, trust/guide surfaces, screenshot matrix.
- `tests/e2e/guides.spec.ts` — dark prose/chart labels compared to CSS tokens instead of hardcoded RGB.

Existing unit, lint, typecheck, and e2e suites are preserved.

## M. Verification

Ran after this pass:

| Command | Result |
| --- | --- |
| `npm test` | 330 passed |
| `npm run lint` | clean |
| `npx tsc --noEmit` | clean |
| `npx next build --webpack` | compiled successfully, 74 pages |
| `npm run test:e2e` | 83 passed |

## N. Screenshot paths

All files under `output/playwright/theme-pass-v1/`:

- `home-light-desktop.png` / `home-dark-desktop.png` / `home-light-mobile.png` / `home-dark-mobile.png`
- `mortgage-light-desktop.png` / `mortgage-dark-desktop.png` / `mortgage-light-mobile.png` / `mortgage-dark-mobile.png`
- `budget-light-desktop.png` / `budget-dark-desktop.png`
- `rent-vs-buy-light-desktop.png` / `rent-vs-buy-dark-desktop.png`
- `guide-apr-apy-light-desktop.png` / `guide-apr-apy-dark-desktop.png`
- `how-it-works-light-desktop.png` / `how-it-works-dark-desktop.png`
- `privacy-light-desktop.png` / `privacy-dark-desktop.png`
- `sources-light-desktop.png` / `sources-dark-desktop.png`

## O. Remaining intentional exceptions

- Brand illustrations still use small `--brand-soft` fills inside SVGs; the large backdrop ellipses are `--surface-subtle`.
- Tiny chips (tax-year pill, checklist numbers, empty-state icon) may still use `--brand-soft`.
- Open Graph images keep a fixed brand-blue lockup.
- Retirement charts currently plot portfolio only (purple). Contributions/target series were not added because that would change calculator chart behavior.
- Savings deposits/growth remain unplotted; the visible series are balance (blue) and goal (neutral dashed).
