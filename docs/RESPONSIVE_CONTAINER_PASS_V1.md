# MoneyBasis Responsive Container Pass v1

This pass widens product layouts on large desktops without stretching reading surfaces. Typography, colors, illustrations, card chrome, calculator math, guide copy, SEO, and URLs were left unchanged.

## A. Root cause

The layout was already responsive, but every major product surface shared one narrow cap. After about `1248px`, extra viewport width became empty margin instead of usable layout.

That is why a ~1792px desktop looked like a 1200px tablet site centered on a large monitor.

## B. Previous width constraints

| Wrapper | Previous limit | Used by |
| --- | --- | --- |
| `.site-container` | `min(100% - 48px, 1200px)` | Homepage, header/footer alignment, calculator directory, guide directory, calculator pages, How it works |
| `header` inner | `max-w-[1248px]` plus `px-4` / `px-6` | Global navigation |
| `.calculator-workspace` | `max-width: 1180px` | Calculator form/result split |
| `.guide-page` | `min(100% - 48px, 1220px)` | Individual guides |
| `.trust-page` | `min(100% - 48px, 1160px)` | About, Privacy, Sources, Disclaimer |

Secondary reading caps (guide prose `68ch`, guide header `780px`, trust lede `720px`) were already correct and were kept.

## C. New container system

Tokens in `app/globals.css`:

```css
--container-wide: 1480px;
--container-product: 1360px;
--container-reference: 1180px;
--container-article: 1120px;
--container-reading: 760px;
```

Fluid shells:

| Class | Width |
| --- | --- |
| `.header-inner`, `.site-container` | `min(94vw, 1480px)` |
| `.site-container-product` | `min(92vw, 1360px)` |
| `.site-container-reference` | `min(92vw, 1180px)` |
| `.guide-page` | `min(92vw, 1120px)` |
| `.trust-page` | `min(92vw, 1180px)` |

Mobile (`≤767px`) product/header shells keep `calc(100% - 32px)`. Guide and trust pages keep their existing `calc(100% - 40px)` mobile inset.

Content is never `100vw`. Growth stops at `1480px`.

## D. Page-type mappings

| Surface | Shell | Max |
| --- | --- | --- |
| Header / footer | Wide | 1480px |
| Homepage | Wide | 1480px |
| Calculator directory | Wide | 1480px |
| Guide directory | Wide | 1480px |
| Calculator pages | Product | 1360px |
| How it works | Reference | 1180px |
| About / Privacy / Sources / Disclaimer | Reference | 1180px |
| Guide articles | Article | 1120px |
| Guide body copy | Reading | ~740–780px |

## E. Homepage fixes

At 1792px:

- Content shell is **1480px** (82.6% of the viewport), with **156px** side margins.
- Header, homepage, trust strip, tool cards, and footer share that same 1480px edge.
- Hero becomes a true 2-column grid from 1280px: `minmax(0, 0.95fr) minmax(440px, 0.8fr)` with `gap: clamp(48px, 6vw, 112px)`.
- H1 stays the approved type size and is capped at **650px**.
- Hero illustration grows with `clamp(420px, 34vw, 590px)` instead of staying a fixed ~512px from 1280 through 1920.
- Trust strip is `repeat(4, minmax(0, 1fr))` across the wide shell.
- Tool cards are `repeat(3, minmax(0, 1fr))` with `min-width: 0`, so they expand with the container.
- Interactive mortgage demo uses a 44% / 56% split at `≥960px` and fills the wide homepage shell.

## F. Header / footer alignment

Header inner is `.header-inner` with the same wide formula as `.site-container`. Footer still uses `.site-container`. At 1792px both measure 1480px and share the same left edge as homepage content.

## G. Calculator page behavior

Calculator routes now use `.site-container-product`. The old 1180px workspace cap is gone, so the form/result card fills the product shell.

Measured at 1792px on Mortgage:

- Product shell: **1360px**
- Workspace: **1360px**
- Form / results: **516 / 842** (~38% / 62%)

Complex calculators keep `.workspace-wide` at ~44% / 56%. Directory cards fill the wide shell; the preview panel absorbs extra width (577px text / 797px preview at 1792px), while card copy stays at `max-w-lg`.

## H. Guide behavior

Guide directory uses the wide 1480px shell. Wide editorial cards use a 42/58 split so the numerical preview grows.

Individual guides stay an article shell:

- Whole page: **1120px** at large desktop
- Header block: **780px**
- Body prose: **~751px** (`68ch`, still ≤780px)

Extra desktop width becomes margin, not paragraph width.

## I. Large desktop behavior

| Viewport | Homepage shell | Notes |
| --- | --- | --- |
| 1280 | ~1203px | Similar to the old 1200px cap |
| 1440 | ~1354px | Starts using the extra space |
| 1600 | 1480px | Hits the wide max |
| 1792 | 1480px | ~83% of the viewport |
| 1920 | 1480px | Stops growing |

How it works stays 1180px with a 230px side nav and a compact 320px hero visual. Trust pages stay 1180px. They do not inherit the homepage width.

## J. Breakpoints

Designed and checked at:

375, 390, 430, 768, 900, 1024, 1280, 1440, 1600, 1792, 1920

Key layout switches:

- 768: homepage hero 2-column; tool/directory cards 2-column
- 960: mortgage demo side-by-side
- 1024: trust strip 4-up; homepage tools 3-up; How it works side nav
- 1280: homepage hero uses the wide column ratio and illustration clamp
- 1600: hero columns keep breathing inside the 1480px shell
- 1920+: width remains 1480px

## K. Tests

- `tests/container-tokens.test.ts` — token values and fluid shell classes; asserts the old 1200/1180 shared caps are gone.
- `tests/e2e/responsive-container.spec.ts` — homepage shell/header/footer alignment, 4-up trust, 3-up tools, 80–85% usage at 1792, ultrawide stop, and page-type width checks.

Existing unit, lint, typecheck, and e2e suites are preserved.

## Verification

Ran after this pass:

| Command | Result |
| --- | --- |
| `npm test` | 336 passed |
| `npm run lint` | 1 pre-existing error in `components/charts/interactive-chart.tsx` (`react-hooks/set-state-in-effect`). No new lint issues from this pass. |
| `npx tsc --noEmit` | clean |
| `npx next build --webpack` | compiled successfully, 74 pages |
| `npm run test:e2e` | 97 passed |

Browser-checked at 1792px: homepage 1480px / 82.6% width; mortgage 1360px with a 38/62 workspace; guide article 1120px with ~751px prose; How it works 1180px; calculator directory 1480px. Mobile 375px keeps 16px inset and stacked layout.

## L. Screenshots

All files under `output/playwright/responsive-container-v1/`:

Homepage: `home-375.png`, `home-390.png`, `home-768.png`, `home-1024.png`, `home-1280.png`, `home-1440.png`, `home-1600.png`, `home-1792.png`, `home-1920.png`

Homepage details at 1792: `home-hero-1792.png`, `home-trust-1792.png`, `home-tools-1792.png`, `home-demo-1792.png`

Other pages at 1440 and 1792: `calculators-*.png`, `mortgage-*.png`, `guides-*.png`, `guide-article-*.png`, `how-it-works-*.png`

Browser verification captures: `browser-home-1792.png`, `browser-mortgage-1792.png`, `browser-guide-article-1792.png`, `browser-how-it-works-1792.png`, `browser-calculators-1792.png`, `browser-home-375.png`

## M. Intentional max-width exceptions

- Guide paragraphs stay ~740–780px on purpose.
- Trust page heroes/ledes stay 720–760px.
- How it works text panel stays inside 1180px; details remain capped at 800px.
- Search dialog stays `max-w-lg`.
- 404 stays `max-w-xl`.
- Calculator input descriptions and directory card copy keep `max-w-lg` / `max-w-xl` so wide cards do not create unreadably long lines.
- Header remains 1480px even on reference/article pages so chrome stays aligned with the product shell.
