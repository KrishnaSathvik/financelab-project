# MoneyBasis Neutral Palette Pass v2

Theme pass v1 unified tokens, but the product still read cool/blue-gray. This pass replaces those neutrals with true black/white/gray and stops using brand-soft as a page surface. Layouts, calculators, guides, content, SEO, source data, and component architecture were not redesigned.

## A. Why it still felt blue

Cool slate neutrals were doing most of the work:

| Token | v1 | Cast |
| --- | --- | --- |
| `--bg` | `#F7F8FA` | cool gray |
| `--surface-subtle` | `#F2F4F7` | cool gray |
| `--border` | `#E3E7ED` | slate |
| `--border-strong` | `#CBD2DC` | slate |
| `--text-secondary` | `#5F6B7A` | blue-gray |
| `--text-tertiary` | `#8A94A3` | blue-gray |
| Dark canvas | `#090A0B` / `#111214` | slightly cool charcoal |
| Dark brand-soft | `#14213D` | navy |

Combined with `#2563EB` actions and leftover pale-blue illustration fills, the whole site picked up a blue cast even when large cards were already white.

## B. True-neutral tokens

### Light

```
--bg: #FAFAFA
--surface / --surface-raised: #FFFFFF
--surface-subtle: #F5F5F4
--text: #111111
--text-secondary: #666666
--text-tertiary: #8A8A8A
--text-inverse: #FFFFFF
--border: #E5E5E5
--border-strong: #D4D4D4
--brand: #2563EB
--brand-hover: #1D4ED8
--brand-soft: #F5F8FF
--brand-border: #C7D7FE
```

Page = warm off-white. Cards = white. Inner panels = stone gray. Type = black / gray.

### Dark

```
--bg: #0A0A0A
--surface: #121212
--surface-subtle: #181818
--surface-raised: #161616
--text: #FAFAFA
--text-secondary: #B3B3B3
--text-tertiary: #7A7A7A
--text-inverse: #FFFFFF
--border: #262626
--border-strong: #363636
--brand: #3D6AE8
--brand-hover: #5C86FF
--brand-soft: #151A25
--brand-border: #2D3D65
```

`--brand` is `#3D6AE8` rather than the requested `#4F7FFF` so white button/label text still meets 4.5:1. Category glyphs and charts keep the brighter `#4F7FFF` via `--home` / `--salary` / `--info`.

Shadows no longer use slate (`rgb(15 23 42)`); they use black. Chart grid/axis/neutral series use the same true grays as the UI chrome.

## C. Brand-soft is rare

Allowed:

- selection highlight
- tiny info chips (tax-year pill, source year badge, checklist numbers)
- small illustration details (door, pencil, calculator keys)
- active/selected control fills that are not page sections

Not allowed as a large surface:

- calculator headers
- guide cards
- trust sections
- homepage sections and bottom CTA
- result columns
- empty-state containers
- article cards

Those now use `--surface`, `--surface-subtle`, or `--bg`.

## D. Category color stays on chips

`.icon-chip` is 36×36 with 10px radius. `.tint-*` is applied there only — never to the parent card.

Cards remain white in light and charcoal in dark. Glyphs stay colored:

| Calculator | Chip |
| --- | --- |
| Mortgage / Salary | blue |
| Compound | green |
| Retirement / Budget | purple / violet |
| Savings / Loan | amber |
| Debt | orange |
| Net Worth | sky |
| Rent vs Buy | comparison tint |

Empty results use the calculator’s own tint chip instead of a brand-blue wash.

## E. Surface changes by page

**Home.** Neutral canvas. Tool cards white. “Built into every calculation” remains icon + text with no tinted containers. Mortgage demo stays white outer / stone inner. Learn cards white with stone preview. Bottom CTA is `--surface-subtle` (`#F5F5F4`), not brand-soft. Primary button stays blue.

**Calculators.** Page canvas `--bg`. Header, inputs, and empty state `--surface`. Result column `--surface-subtle` only for differentiation. Charts remain colorful.

**Guides.** Article on the canvas. Related cards white. Previews `--surface-subtle`. Category identity is a small colored label. Takeaway keeps a 4px brand-left accent on a white card.

**Trust / How it works.** No pale-blue section backgrounds. Detail panel white. Formula block stone. Selected calculator blue. Source year badges remain tiny brand-soft chips.

## F. Audit classification

| Use | Verdict |
| --- | --- |
| Cool neutrals `#F7F8FA` `#F2F4F7` `#E3E7ED` `#CBD2DC` `#5F6B7A` `#8A94A3` | CHANGE TO NEUTRAL |
| Dark navy canvas / `#14213D` brand-soft | CHANGE TO NEUTRAL |
| `--brand` on primary buttons, links, active tabs, focus, logo | KEEP |
| `--brand-soft` on large surfaces | CHANGE TO NEUTRAL |
| `--brand-soft` on tiny chips / selection / illustration details | KEEP |
| `.tint-*` on full cards | CHANGE TO NEUTRAL (already card-white; chips only) |
| `.tint-*` on 36px icon chips | CATEGORY-SEMANTIC |
| Chart series, legend markers, donut slices | KEEP (do not desaturate data) |
| `--chart-neutral` / `--chart-grid` slate | CHANGE TO NEUTRAL |
| Status green / amber / red | STATUS-SEMANTIC |
| Guide example callout `--growth-soft` | STATUS-SEMANTIC |
| Hero notebook fill `--primary` | CHANGE TO NEUTRAL |
| Large illustration `--primary-soft` fills | CHANGE TO NEUTRAL |
| OG raster lockup `#2563EB` / `#EFF6FF` | KEEP (SEO/social exception) |
| `lib/site.ts` `BRAND_BLUE` | KEEP |

## G. Hide-icons-and-charts test

If icons and charts are ignored, remaining color is:

1. primary actions
2. selected tabs / nav underline
3. text links
4. illustration line work
5. tiny semantic chips

Page backgrounds, cards, headers, result columns, trust sections, and CTAs are black / white / gray. That is the intended “neutral UI + colorful data” split.

## H. Tests

- `tests/theme-tokens.test.ts` — true-neutral light/dark values, no cool-slate leftovers, brand-soft is not navy, `.icon-chip` is 36px.
- `tests/e2e/theme-pass.spec.ts` — token switch, 4.5:1 primary contrast in both themes, homepage CTA uses `--surface-subtle`, calculator header/empty state use `--surface`, icon chips are 36px, guide previews use `--surface-subtle`, screenshot matrix writes to `output/playwright/neutral-palette-v2/`.

## I. Verification

| Command | Result |
| --- | --- |
| `npm test` | 330 passed |
| `npm run lint` | clean |
| `npx tsc --noEmit` | clean |
| `npx next build --webpack` | compiled successfully, 74 pages |
| `npm run test:e2e` | 83 passed |

Did not deploy.

## J. Screenshot paths

All files under `output/playwright/neutral-palette-v2/`:

- `home-light-desktop.png` / `home-dark-desktop.png` / `home-light-mobile.png` / `home-dark-mobile.png`
- `calculators-light-desktop.png` / `calculators-dark-desktop.png`
- `mortgage-light-desktop.png` / `mortgage-dark-desktop.png` / `mortgage-light-mobile.png` / `mortgage-dark-mobile.png`
- `budget-light-desktop.png` / `budget-dark-desktop.png`
- `guide-apr-apy-light-desktop.png` / `guide-apr-apy-dark-desktop.png`
- `how-it-works-light-desktop.png` / `how-it-works-dark-desktop.png`
- `privacy-light-desktop.png` / `privacy-dark-desktop.png`
- `sources-light-desktop.png` / `sources-dark-desktop.png`

Compared against `output/playwright/theme-pass-v1/`. The v1 home canvas still reads cool/blue-gray; v2 reads warm off-white with color concentrated on the button, logo, chips, and illustration strokes.

## K. Remaining intentional exceptions

- Open Graph images keep a fixed brand-blue lockup (`lib/og.tsx`).
- Tiny brand-soft chips: tax-year pill, source year badge, checklist numbers, selection.
- Illustration outlines stay brand-colored; large fills do not.
- Category-soft chip backgrounds remain tinted, but only inside 36px chips.
- Retirement charts still plot portfolio only; chart behavior was not changed.
