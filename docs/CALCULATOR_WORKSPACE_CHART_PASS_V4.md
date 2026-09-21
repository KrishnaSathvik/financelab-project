# Calculator Workspace & Chart Layout Pass v4

Financial engines, calculation conventions, guide copy, SEO, URLs, and the source registry are unchanged. This pass only changes calculator workspace layout, primary-chart placement, and chart annotation behavior.

## A. v3 regression diagnosis

v3 correctly identified that a ~500–600px right column made charts cramped. The fix went too far in the other direction: **primary charts were moved full-width below the entire form/result workspace**.

That produced:

```text
┌──────────── FORM ───────────┬──── SUMMARY ──────┐
│ long form                   │   HUGE EMPTY      │
│                             │      SPACE        │
└─────────────────────────────┴───────────────────┘
                   ↓
               CHART
```

Because the chart lived outside the two-column grid, it could not rise until the **entire left form ended**. Rent vs Buy made this obvious: users scrolled through a blank result column before reaching the actual visualization.

Annotation labels were also drawn inside the plot at raw x coordinates. On Rent vs Buy, **Selected horizon** and **Estimated crossover · Year 12** collided with each other and with the x-axis.

## B. Final workspace architecture

The correct strategy is **not** “everything full-width below.”

**Desktop:** form on the left, complete result experience on the right (headline → metrics → primary chart → compact preview). Only large transactional tables span the product width underneath.

```text
┌──────── INPUTS ───────┬──────────────── RESULT ──────────────┐
│ Form                  │ Headline + metrics                   │
│                       ├──────────────────────────────────────┤
│                       │ Primary chart                        │
│                       └──────────────────────────────────────┘
└───────────────────────┴──────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ Amortization / projection / schedule (when it needs the width)│
└──────────────────────────────────────────────────────────────┘
```

Columns are independent cards (`align-items: start`). The result column no longer stretches to match a tall form, so there is no inherited gray blank region.

Layout tokens:

- `--container-product: 1440px` (calculator shell, previously 1360px)
- `--calculator-form-width: 370px`
- Form: `clamp(330px, 26vw, 370px)` from 1280px
- Gap: 20px (1050–1279) / 24px (≥1280)
- Result: remaining width (~800–1050px on large desktop)
- Primary chart: `aspect-ratio: 2.4 / 1`, `min-height: 320px`, `max-height: 390px`

Measured at 1440×1100 on Mortgage after Calculate:

| Surface | Size |
| --- | --- |
| Product shell | 1325px (`92vw`) |
| Form | 370px |
| Result column | 931px |
| Chart canvas | 831 × 346px |
| Two-column | yes |
| Chart beside form | yes |

Rent vs Buy at the same viewport: form height 1460px, chart top at 372px — the visualization appears while the long form is still on screen.

## C. Annotation collision solution

Long annotation copy is no longer drawn inside the plot or on the x-axis.

Shared `ChartMarker` now supports `chip` and `style` (`solid` | `dashed`). `InteractiveChart` renders chips above the canvas. `ChartCanvas` draws **vertical marker lines only**.

Rent vs Buy header:

```text
[Selected horizon: 10 years]   [First crossover: Year 12]
```

Inside the plot: a solid selected-horizon line and a dashed crossover line. The x-axis stays temporal (`0y 5y 10y 15y 20y 25y 30y` on a 30-year desktop chart).

Collision rule: if two markers are closer than 80px, their labels still cannot overlap because labels live in the wrapping chip row, not at plot coordinates. `markersCollide()` and `temporalTickLimit()` / `temporalTickStep()` live in `lib/chart-data/ticks.ts`.

Tick policy by chart width:

| Chart width | Max temporal ticks |
| --- | --- |
| ≥900px | 7 (e.g. `0y 5y 10y 15y 20y 25y 30y` on a 30-year series) |
| 650–899px | 5 (e.g. `0y 10y 20y 30y`) |
| 430–649px | 4 |
| <430px | 3 |

At 1440×1100 the Mortgage/Rent vs Buy canvas is ~831px, so the 5-tick policy applies. Larger desktops (product shell 1440px, result ~1000px) reach the 7-tick band.

## D. Per-calculator layout

| Calculator | Right result column | Full-width below |
| --- | --- | --- |
| **Mortgage** | Payment summary + balance / principal-vs-interest chart | Amortization schedule |
| **Compound Interest** | Future-value summary + stacked growth chart | Growth by year table |
| **Retirement** | Retirement summary + growth/drawdown chart | Projection table |
| **Savings Goal** | `$849/month`, progress, balance-vs-goal chart | Savings timeline |
| **Budget** | Remaining cash flow, spending composition, income allocation | Expense breakdown |
| **Salary** | Take-home, pay-period cards, pay-breakdown bar | Pay & tax reconciliation |
| **Loan Payoff** | Debt-free result, current vs extra, balance chart | Payoff schedule |
| **Debt Snowball** | Debt-free result, stacked remaining-debt chart, payoff timeline | Monthly remaining balances |
| **Net Worth** | Net-worth summary, assets vs liabilities, composition, projection controls | Balance-sheet detail |
| **Rent vs Buy** | Horizon comparison, net-position chart, cost-comparison preview | Horizon notes |

Primary charts are no longer delayed until a long input list ends.

## E. Breakpoints

| Viewport | Workspace |
| --- | --- |
| ≥1280px | `clamp(330px, 26vw, 370px)` form + flexible result |
| 1050–1279px | 320px form + result (result stays ≥620px in this range) |
| <1050px | Stack: inputs → result summary → chart → details |
| <768px | Same stack; chart `min-height: 250px`, `max-height: 320px` |

1024px stacks. 1440px and above keep the two-column workspace with the chart in the result column.

## F. Chart chrome

Every chart:

```text
Title
One-line description
[Mode A] [Mode B]
[optional state chips]
CHART
wrapping legend
```

- Legends wrap (`flex-wrap`, `gap: 8px 16px`) and sit under the plot, not inside it.
- Metrics use `repeat(auto-fit, minmax(130px, 1fr))` so labels like **Total principal + interest** wrap instead of shrinking.
- Desktop tooltip max width 220px; pointer on the left opens it on the right and the reverse.
- Mobile (<768px) keeps the inspection strip above the canvas.
- Chart labels stay at 12px. Density is reduced by tick limits, not by shrinking type.
- “View chart data” remains removed.

## G. Tests

Updated:

- `tests/e2e/calculators.spec.ts` — two-column workspace at 1440; chart lives in `.calculator-summary`; tall forms (Rent vs Buy, Budget, Debt, Net Worth) show the chart before the form ends; 1024 stacks; Rent vs Buy chips; overflow at 1920 / 1600 / 1440 / 1280 / 1024 / 900 / 768 / 430 / 390 / 375 / 320
- `tests/e2e/calculator-visuals.spec.ts` — desktop chart height 300–400px for non-horizontal charts; width floor 700px at 1440 and 600px at 1280
- `tests/e2e/responsive-container.spec.ts` — product shell may reach 1440px
- `tests/container-tokens.test.ts` — 1440 product / 370 form / `align-items: start` / clamp columns
- `tests/chart-ticks.test.ts` — tick limits, 5-year steps, 80px collision helper
- `tests/chart-adapters.test.ts` — Rent vs Buy chips and marker indexes

Existing named-detail, adapter, and result-UX suites remain the contract for engines and headings.

## H. Screenshots

Calculated-state captures under `output/playwright/calculator-workspace-v4/`:

- `{slug}-{1440,1024,768,390}.png` for all 10 tools
- Playwright visual-pass captures remain in `output/playwright/calculator-visuals-v1/`

## I. Visual regression checks

Fail review if:

- [x] Right result column no longer waits for a long form before showing the chart (Rent vs Buy chart top ~372px vs form bottom ~1460px at 1440)
- [x] Annotation labels do not overlap the x-axis (chips above plot; vertical lines only)
- [x] Axis ticks do not include “Selected horizon” / “Estimated crossover”
- [x] Chart title/legend sit outside the plot
- [x] Primary desktop chart is ~340–380px tall, not a flat strip (Mortgage canvas 346px)
- [x] <1024 stacks; ≥1280 is two columns with a wide result pane

## J. Intentional exceptions

- Retirement’s form is shorter than its summary, so the chart can start slightly below the form card while remaining in the right column. That is independent-column flow, not the v3 dead-space bug.
- Budget’s two analysis panels can each be narrower than 700px; the result column as a whole is still wide.
- Salary pay-period equivalents stay compact cards, not a shared-magnitude chart.
- Debt payoff events are vertical lines plus the timeline cards; chips are only Start / Debt-free so the header is not a list of every account.
- “View chart data” stays removed from UX v2.

## K. Verification

Ran after this pass:

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npm test` | 341 passed |
| `npm run lint` | 0 errors (3 pre-existing `@next/next/no-img-element` warnings) |
| `npx next build --webpack` | compiled successfully, 74 pages |
| `npm run test:e2e` | 97 passed |

Browser-checked at 1440 after Calculate: Mortgage two-column workspace, canvas 831×346, amortization below. Rent vs Buy chart sits in the result column (chart top ~372px vs form bottom ~1460px) with chips `Selected horizon: 10 years` and `First crossover: Year 12`, and no annotation text on the x-axis.

Do not deploy.
