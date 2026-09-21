# MoneyBasis Guide Article Visual Pass v1

Completed locally: September 18–19, 2026. **No deployment, push or publication performed.** Financial models, source registry URLs, calculator semantics, SEO metadata and verified example numbers are unchanged. Presentation overlays sit on top of the existing guide copy.

The APR vs APY article is the reference implementation. The same article shell, typography and component system apply to all 14 guides; each topic keeps its own visuals, formulas, comparisons and worked-example metrics.

## A. Design problems identified

The previous article page treated verified content as a long technical document in a narrow column:

- Body type was too small and dense for sustained reading.
- Desktop width left a large unused gutter while paragraphs stayed cramped.
- H2/H3 spacing did not create scan rhythm.
- The key takeaway looked like ordinary muted copy.
- Topic visuals, especially APR vs APY, read as spreadsheets rather than teaching figures.
- Each factual claim was followed by a standalone “Reference:” line that interrupted prose.
- “Try it with your numbers” was a faint outlined box instead of an action.
- Sources rendered as raw bibliographic output with visible URLs.
- Related-guide cards were undersized and visually disconnected from the article.
- There was no desktop “On this page” navigation or reading-progress cue.
- The page was one undifferentiated vertical stream.

The Guides directory was left alone. Individual article pages were the scope of this pass.

## B. New article shell

Desktop (≥1100px) uses a centered 1220px shell:

```
width: min(100% - 48px, 1220px)
grid-template-columns: minmax(0, 760px) 240px
gap: 64px
```

Layout:

1. Editorial header (breadcrumb, category · read time · reviewed date, H1, deck, calculator chip).
2. Two-column body: readable article + sticky sidebar.
3. Keep learning spans the full shell below the article, with a stacking context so the sticky ToC cannot overlap related cards.
4. Site footer.

The article itself sits on the page background. White or tinted cards are reserved for takeaway, definition, formula, example, comparison, exhibit, CTA and callout surfaces.

Header structure:

- Breadcrumb: Home / Guides / current title
- Category accent · reading time · Reviewed Sep 2026
- H1 from the existing title
- Existing intro as the deck
- Optional related-calculator chip

Reviewed date lives in the header (and optionally the sidebar). It is not repeated as a closing stamp.

## C. Typography changes

| Element | Desktop | Mobile (≤767px) |
|---|---|---|
| H1 | clamp 32–46px, line-height 1.08 | 34px |
| Deck | 18–20.5px, line-height 1.55 | same scale |
| Body | 17.5px, line-height 1.75 | 16px, line-height 1.7 |
| H2 | 24–28px, margin-top 64px | margin-top 48px |
| H3 | 20px | 20px |
| Captions / sources / cites | 13–14px | 13–14px |
| Measure | ~55–75 characters (`max-width: 68ch`) | full column |

Paragraphs keep their verified sentences. Breathing room comes from spacing, kickers, cards and visuals rather than shortened copy. Article padding is 20px on small screens (`width: calc(100% - 40px)`).

## D. Article components

Reusable system in `components/guide/`:

| Component | Role |
|---|---|
| `GuideHeader` | Breadcrumb, metadata, H1, deck, calculator chip |
| `GuideProgress` | 2px brand-blue reading line under the navbar |
| `GuideTakeaway` | Left-accent editorial callout, once near the top |
| `GuideSection` | Anchored H2, optional kicker, year-specific treatment |
| `GuideDefinition` | Compact first-use term box |
| `GuideFormula` | Expression + symbol glossary |
| `GuideExample` | Worked-example setup and metric rows |
| `GuideComparison` | 2–4 concept cards |
| `GuideCallout` | info / example / caution |
| `GuideChecklist` | Numbered steps |
| `GuideCite` | End-of-section short source names |
| `GuideCalculatorCTA` | Exercise + primary calculator action |
| `GuideSources` | Compact bibliography rows |
| `GuideRelated` | Equal-height keep-learning cards |
| `GuideTocDesktop` / `GuideTocMobile` | IntersectionObserver section list |
| `GuideArticle` | Assembles the shell for every slug |

Presentation overlays live in `lib/guides/presentation.ts`. Every guide has an overlay; overlays may add an opening comparison section (APR vs APY) but never rewrite body copy, formulas, fixtures or source claims.

## E. ToC behavior

Desktop sidebar (`position: sticky; top: 96px`):

- “On this page” list of actual section titles, plus Try it / Sources
- Current section highlighted with `aria-current="location"` via IntersectionObserver
- Persistent “Open {Calculator}” action
- Optional reviewed-date line
- Sources stay in the article, not the sidebar

Below ~1100px the sticky sidebar is hidden. A collapsed `<details>` panel (“On this page”) sits under the header so the ToC does not occupy the first screen. Native disclosure; no extra animation library.

Section anchors use `scroll-margin-top: 110px` so hash jumps clear the sticky header.

## F. Callout system

Three restrained tones:

- **INFO** — useful distinction (brand-blue accent)
- **EXAMPLE** — illustrative numbers (teal/green)
- **CAUTION** — limitation or assumption (warning, used sparingly)

Ordinary explanatory prose is not labeled as a warning. Kickers appear only on longer or structurally important sections.

## G. Formula / example presentation

Formulas are no longer buried in paragraphs. A formula block shows:

- Title
- Monospace expression with horizontal scroll on small screens
- Symbol glossary (`r`, `k`, …)

Worked examples use a distinct card: setup bullets, then metric rows (label left, value right, tabular numerals). The original prose still follows so meaning is unchanged if the card is ignored.

APR vs APY exercise is presented as three numbered steps plus “What to notice,” matching the existing calculator walkthrough.

## H. Visual / table redesign

Topic exhibits remain fixture-backed HTML/SVG in `components/brand/guide-exhibit.tsx`. Tables now have:

- Stronger header fill
- More row padding
- Right-aligned numeric cells
- Rounded container, light borders
- Local `overflow-x: auto` on small viewports
- Full numeric tables always exposed (never collapsed into tiny cards)

APR vs APY specifically no longer treats 12.68% and 5% as competing products. The rate visual is three separately labeled illustrative groups, each with its own bar scale, plus the exact conversion table underneath.

Other guides keep their teaching visuals: amortization mix/timeline, contributed vs growth, salary waterfall, net-worth grouping, budget allocation, snowball vs avalanche, extra-payment path, 4% withdrawal timeline, rent-vs-buy resource flow, savings-goal composition, nominal vs real, gross vs net, savings-rate reconciliation.

## I. Source presentation

Inline: section-end short cites (`[CFPB]`, `[SEC]`, `[IRS]`) via `lib/guides/source-labels.ts`. Standalone “Reference:” lines are gone. Primary URLs remain on the short names and in the bibliography.

Bibliography rows:

- Organization
- Document title
- Optional year / tax year
- Supports line (first existing `supports` sentence)
- External-link icon
- No raw URLs, no registry IDs, no “methodology” wording

Intro copy: “Primary references supporting the factual claims in this guide. MoneyBasis independently calculates the illustrative examples.”

## J. Calculator CTA changes

“Try it with your numbers” is a tinted action section with one primary button: **Open {Calculator}**. Extra associated calculators remain as text links. How-it-works remains a secondary text link, not a second equally weighted button.

The same CTA is mirrored as a compact sidebar action on desktop.

## K. Related learning changes

Keep learning uses a 2- or 3-column editorial grid (`data-count` drives columns). Each card:

- Category · read time
- Title
- One-sentence summary
- Compact topic preview
- Read guide →

No “Pairs with calculator” line. Cards share equal height. The section is last before the footer.

## L. Responsive behavior

| Width | Behavior |
|---|---|
| ≥1100px | Article + sticky ToC; 3 related cards |
| ~900–1099px | Single column; mobile/collapsed ToC; 3-up comparisons and related cards where space allows |
| ~768px | Single column; 2-up comparisons/related; no sidebar |
| 375–430px | 16px body, 34px H1, full-width cards, 20px page inset, tables scroll locally |

E2E checks 1920, 1280, 1024, 768, 390 and 320 for overflow (`documentElement.scrollWidth ≤ innerWidth + 1`) on every guide.

## M. Accessibility

- Semantic article, headings and breadcrumbs
- ToC as `nav aria-label="On this page"`
- Active ToC item via `aria-current="location"`
- Reading progress as `role="progressbar"`
- Exhibit tables remain HTML with a region for local scroll
- Rate-comparison visual has an explicit `aria-label` stating the examples are separate
- Source links include a visually hidden “opens in a new context” note
- Dark-mode exhibit SVG labels use theme tokens (`rgb(148, 163, 184)` in tests), not light-only hardcoded fills
- Reduced-motion: global `prefers-reduced-motion` disables animation/transition; the progress bar is a width change with no animation library
- Print CSS hides progress and ToC; article remains linear HTML

## N. Performance impact

No animation library. Article HTML is server-rendered. Client JS is limited to:

- `GuideProgress` (scroll/resize listeners)
- `GuideTocDesktop` / `GuideTocMobile` (one IntersectionObserver)

Guide pages are not turned into heavily hydrated applications. `npx next build --webpack` produced 74 pages.

## O. Tests

Financial/content tests are preserved. Added/updated coverage:

- Every slug has a presentation overlay whose section ids exist on the guide
- Opening comparison ids do not collide with content section ids
- Exercise overlays have at least two steps
- Short cite names contain no URLs or registry ids
- Playwright per-guide: H1, canonical, OG, takeaway, reviewed date, desktop ToC visible / mobile ToC collapsed, no “References:” strings, bibliography without raw URLs, primary CTA href, related-guide grid count, heading anchors, exhibit table values, overflow, dark-mode body and SVG label colors
- Visual-pass screenshot capture test

Do not snapshot entire article HTML.

## P. Verification

Ran locally:

| Command | Result |
|---|---|
| `npm test` | 325 passed |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npx next build --webpack` | 74 pages |
| Playwright guide specs | 16/16 |
| Full `npm run test:e2e` against a standing production server on port 3101 | 77 passed |

Playwright’s managed `webServer` can drop mid-suite (`ERR_CONNECTION_REFUSED` on 3101). A standing `npm run start` on 3101 is the reliable way to run the full e2e pack. No financial-engine or source-data files were edited except UI rendering of existing sources.

Manual/browser checks: APR vs APY (desktop, mobile ToC expand, hash jump `#deposit-yield`, active ToC state), plus captured desktop/mobile representatives below.

## Q. Screenshot paths

All under `output/playwright/guide-visual-pass-v1/`:

| File | What it shows |
|---|---|
| `apr-apy-desktop.png` | Reference article: header, takeaway, 4-rate comparison, sticky ToC |
| `apr-apy-mobile.png` | Collapsed ToC, stacked comparison, mobile type |
| `mortgage-desktop.png` | Amortization article shell |
| `salary-desktop.png` | Salary article shell |
| `retirement-desktop.png` | 4% rule article shell |
| `rent-buy-desktop.png` | Rent vs buy article shell |
| `budget-mobile.png` | Monthly budget on a phone |
| `dark-mode-guide.png` | APR vs APY dark surfaces, type, ToC and cards |
| `toc-active.png` | Desktop ToC |
| `formula-block.png` | APY effective-yield formula |
| `worked-example.png` | 12% nominal monthly metric card |
| `source-section.png` | Compact source rows |
| `keep-learning.png` | Three equal related cards without ToC overlap |

## R. Intentionally unchanged content

- All 14 guide slugs and URLs
- SEO titles, descriptions, OG copy, JSON-LD citations
- Body copy, takeaways, intros, exercises (wording)
- Formulas, fixture numbers, exhibit row values
- Source registry, source URLs, `supports` claims
- Calculator models, inputs, outputs and conventions
- Guides directory card system (aside from consuming the shared compact preview inside article related cards)
- Site nav: Calculators, Guides, How it works (no Blog)

Allowed presentation-only moves: paragraph spacing, headings/kickers, moving existing statements into callouts/comparisons/metric rows, shortening UI labels, relocating cites to paragraph ends, and redesigning exhibits without changing the numbers they display.
