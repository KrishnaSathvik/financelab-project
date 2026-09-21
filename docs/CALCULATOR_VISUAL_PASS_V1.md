# Calculator Visualization & Interaction Pass v1

## A. Executive summary

All ten calculator result experiences now use a shared interactive chart system. Users can inspect points with a pointer, tap to pin a selection, select periods/categories with a keyboard, and open exact-value tables. Each calculator retains its own visual identity and explicit Calculate flow. No financial engine, validation rule, source data, dependency or deployment changed.

## B. Chart architecture

Validated calculator result → memoized display adapter → typed chart model → shared chart card → lazily loaded Chart.js canvas.

- `lib/chart-data/types.ts`: points, columns, chart modes and markers.
- `lib/chart-data/adapters.ts`: ten calculator adapters plus budget allocation and optional net-worth projection.
- `components/charts/interactive-chart.tsx`: summaries, view controls, accessible HTML tooltip, point selection, legends, markers and expandable semantic tables.
- `components/charts/interactive-canvas.tsx`: rendering and nearest-point interaction; no financial calculations.

Adapters select existing values, aggregate existing categories, subtract existing components for display, and calculate labeled display percentages. Savings deposits aggregate the engine's solved monthly deposit by elapsed months; growth is the residual of the returned balance. No adapter simulates interest, taxes, amortization, investing or drawdown.

Time coordinates retain the engine's actual month/year/age positions, including fractional endpoints. Axis labels are compact; table values retain cents. Rendering follows the installed Chart.js API and its official [interaction](https://www.chartjs.org/docs/latest/configuration/interactions.html) and [instance API](https://www.chartjs.org/docs/latest/developers/api.html) documentation.

## C. Dependency decision

Reused the installed Chart.js 4.5.1. No Recharts, animation library or other dependency was added. The old chart wrapper remains available but calculator result components no longer import it. The interactive canvas is dynamically imported only when a calculated chart is rendered.

## D. Shared components

`InteractiveChart` supplies line, area, stacked area, stacked bar, horizontal bar and donut modes through one typed model. Existing `HeroResult` now uses tabular primary numerals. Existing metric strips, result accordions, CSV export and share controls remain in place. Empty-state instructions are specific to each tool. Payoff details use a simple accessible timeline.

## E. Mortgage

Primary label now explicitly identifies monthly principal and interest. Supporting totals clarify principal plus interest rather than lifetime housing costs. Balance mode contains the initial loan and every returned monthly balance, with cumulative principal in inspection. Principal/interest mode stacks the returned annual principal and interest and exposes the exact annual payment. Start/payoff markers, monthly/yearly schedule and CSV remain available.

## F. Compound interest

Contributed capital and growth form an accumulation stack; inspection also shows total value. Negative-growth scenarios switch to unstacked signed series so losses cannot be disguised by positive stacking. Existing inflation-adjusted terminal output is retained. A real-dollar time-series toggle was intentionally not added: the engine returns only an inflation-adjusted terminal value, not a real-dollar schedule.

## G. Retirement

Growth and drawdown are separate modes. Drawdown begins at the exact returned retirement balance, uses returned drawdown rows and marks depletion or the selected horizon. Summaries describe a deterministic illustration and never promise lifelong funding.

**Unavailable display data:** returned rows do not include period contributions, growth breakdown or annual spending. Those tooltip fields were omitted; reproducing the retirement engine in a chart would violate the frozen financial contract. Existing headline contribution, spending and withdrawal results remain visible.

## H. Savings goal

Balance and dashed goal reference use the returned monthly series. Inspection separates existing savings, solved deposits and modeled growth. Markers show only milestones the engine reports as reached. Current savings, goal, growth and target date support the primary monthly deposit. Existing achieved-today/growth-funded states, progress bar and what-if behavior remain intact.

## I. Budget

Spending composition includes amount, percentage of spending and percentage of income, with undefined ratios labeled “Not applicable.” The donut includes a total; large category lists combine later categories to cap color density, while All categories exposes each original category. A separate compact allocation bar explains expenses and remaining cash. Deficits use signed values and explicit shortfall text.

## J. Salary

Replaced the pie with an annual gross/pretax/federal/FICA/net horizontal breakdown and a complete reconciliation summary. Removed the obsolete state-tax chart category. Supported pay-frequency behavior and tax-year input are unchanged; the five frequency buttons wrap to three columns on narrow screens. The chart explicitly states its annual basis while the primary answer follows the selected pay period.

## K. Loan payoff

Two distinct line styles compare every returned current-plan and extra-payment balance. Inspection includes the remaining-balance difference. Payoff markers are present only for plans with an actual returned payoff; horizon/non-amortizing results never gain a fake payoff marker or date. Existing payment comparisons and detailed schedules remain intact.

## L. Debt snowball / avalanche

A numbered payoff timeline exposes each debt's starting amount, APR, minimum and payoff month through keyboard/tap disclosure. A stacked monthly chart follows the engine's ordered debt balances, with returned totals and payoff markers. The existing method selector updates the result and visualization together. Large debt sets combine later debts for visual density; payoff disclosures retain individual debt identity.

## M. Net worth

The default snapshot uses assets/liabilities comparison bars, with asset-only composition as a second mode. Removed the duplicate current-net-worth supporting metric. Projection remains opt-in and separate.

**Unavailable display data:** projection rows contain only net worth. Future assets/liabilities were not reconstructed; the projection tooltip shows only returned net worth.

## N. Rent vs buy

Preserved the two named horizon outcomes and neutral signed comparison. The position chart uses both returned paths, the engine's first sampled crossover, and the exact selected horizon. Cash costs is a separate mode. Invested upfront resources and down payment are excluded from the cost plot and explained separately as investments/equity transfers. Mortgage cash payments are explicitly described as including principal transferred into equity. A crossover is not represented as permanent.

## O. Desktop / tablet / mobile

Existing workspace/form widths and stacking behavior were preserved. Charts use 320px desktop, 280px tablet and 240px mobile heights; category charts can use 260px on phones. One-, two- and three-row horizontal comparisons use shorter 120/160/180px canvases. Result content grows naturally, without an imposed empty-state height.

QA covers 1440, 1280, 1024, 900, 768, 430, 390 and 375px. Every calculator has desktop/mobile result and empty-state captures; Budget, Net Worth, Debt and Rent vs Buy also have intermediate-width result captures.

## P. Touch and keyboard

Hover inspects the nearest point. Taps pin selection, including taps in axis-label gutters; the next tap changes selection. Outside taps, Close and Escape dismiss it. Previous/next buttons and a labeled period/category selector offer keyboard equivalents. Donut legend buttons select categories. Markers select their corresponding existing point. Tooltip overlays do not shift chart layout.

## Q. Accessibility

Each chart is a named section with a concise summary. Canvas has an accessible alternative description; the HTML tooltip announces selection, and data tables use captions, column headers and row headers. Focus is visible; mode/category buttons expose `aria-pressed`. Line styles supplement color, values remain legible in dark mode, and labels name all categories. Motion is disabled entirely, so reduced-motion preference is respected without delayed updates.

## R. Performance

Display models are memoized on their existing results. Chart.js loads dynamically for calculated results; table bodies mount only when opened. Selection updates the existing chart instance rather than recreating it. Input/model updates replace the instance with no animation replay; cleanup destroys the prior canvas instance and listeners.

The initial workspace build contained 1,272,271 bytes of JavaScript chunks. A later workspace build contained 1,279,434 bytes (405,027 gzip). These are aggregate figures, not a clean attribution: other guide/trust-page work changed concurrently. No dependency increase occurred. The dedicated lazy canvas wrapper was approximately 3.5KB minified before the final formatting refinement, in addition to the already-installed Chart.js implementation.

## S. Tests added

`tests/chart-adapters.test.ts` adds 11 tests for full row preservation, first/final values, partial terms, terminal zeros, negative growth, retirement phase boundaries, reached milestones, loan horizon states, debt stack reconciliation, grouped spending, undefined ratios, salary reconciliation, net-worth components and exact rent/buy horizon/crossover mapping.

`tests/e2e/calculator-visuals.spec.ts` adds one comprehensive test per calculator: initial empty state, default calculation, exact first-point values, hover inspection, tooltip/table agreement, all required widths, touch pin/dismiss, live input updates, keyboard movement, alternate modes, optional net-worth projection, debt-method change, dark mode and screenshot capture. Browser assertions use visible values and structure rather than chart pixels as financial tests.

## T. Verification results

- Unit tests: **325 passed across 12 files**, including the financial fixtures and 11 new adapter tests.
- Lint, TypeScript and production build: **passed**.
- Final calculator browser suite: **10 passed**, covering all ten tools and refreshing 101 screenshots.
- Full browser suite: **74 passed, 3 failed**. The failures are dark-mode heading-color assertions on the concurrently edited `rent-vs-buy-costs`, `debt-snowball-vs-avalanche` and `four-percent-rule` guide pages: expected `rgb(248, 250, 252)`, received `rgb(59, 130, 246)`. All calculator tests passed. These guide failures remain unresolved in this calculator pass.

Saved logs: [unit tests](output/playwright/calculator-visuals-v1/verification/unit-tests.log), [lint](output/playwright/calculator-visuals-v1/verification/lint.log), [TypeScript](output/playwright/calculator-visuals-v1/verification/typescript.log), [build](output/playwright/calculator-visuals-v1/verification/build.log), [full browser suite](output/playwright/calculator-visuals-v1/verification/full-browser-suite.log), and [final calculator suite](output/playwright/calculator-visuals-v1/verification/calculator-browser-suite.log).

Browser verification used Chromium with touch emulation. Physical devices, WebKit and Firefox were not tested.

The live workspace changed during verification: guide/trust-page edits and production rebuilds arrived from other work. Initial shared-build tests were therefore not a stable regression result. Final verification uses a source snapshot at `/private/tmp/moneybasis-calculator-visuals-check` and a separate local server on port 3103. No production deployment was performed. One compile-only guide fix aliases a conflicting `GuideDefinition` type; it does not change guide behavior or prose.

## U. Screenshot paths

All 101 deliverable images are under `output/playwright/calculator-visuals-v1/`.

For each slug (`mortgage`, `compound-interest`, `retirement`, `savings-goal`, `budget`, `salary-hourly`, `loan-payoff`, `debt-snowball`, `net-worth`, `rent-vs-buy`):

- `{slug}-empty-desktop.png`, `{slug}-empty-mobile.png`
- `{slug}-result-desktop.png`, `{slug}-result-mobile.png`
- `{slug}-tooltip-desktop.png`, `{slug}-tooltip-mobile.png`
- `{slug}-dark.png`

Additional images:

- `{slug}-alternate-mobile.png` for multi-mode charts
- Complex-tool `{slug}-result-{1280,1024,900,768,430,375}.png`
- `net-worth-projection-mobile.png`
- `debt-snowball-avalanche-mobile.png`

Screenshot crops hide the sticky site header during capture so it cannot cover the selected result.

## V. Intentionally unchanged behavior

Financial engines, defaults, validation, calculation conventions, guides' calculations, source datasets, SEO metadata/URLs, browser-only computation, explicit first Calculate, later live valid updates, invalid-result suppression, sharing, device saving, mortgage CSV, education/FAQ/worked-example architecture and the approved directories. SHA-256 checks against the start-of-pass snapshot confirm no changes to the captured calculator library files, finance helpers, validation entry point or dependency lockfile. Missing financial display data is documented above, never recreated in the chart layer.
