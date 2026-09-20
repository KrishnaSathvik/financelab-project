# Calculator Layout & Chart Responsive Pass v3

Financial engines, calculation conventions, guide copy, SEO, URLs, and the source registry are unchanged. This pass only changes how calculated results are laid out and visualized.

## A. Root layout problem

The previous calculator workspace kept form, headline answer, chart, and table inside one permanent two-column card:

```text
FORM | SUMMARY + CHART + TABLE
```

On desktop that forced every primary chart into roughly a 500–600px right panel. Axis labels shrank, legends crowded the plot, tooltips covered data, tables needed tiny type, and tablet layouts inherited the same squeeze.

## B. New calculator architecture

`CalculatorFrame` now renders a layered product:

1. **Header** — title, description, share
2. **Workspace** — inputs + primary answer only
3. **Analysis canvas** — charts, inspection, named detail/schedule
4. **Educational content** — unchanged below the product

```text
HEADER
FORM + PRIMARY ANSWER
FULL-WIDTH VISUAL ANALYSIS
FULL-WIDTH DETAIL / SCHEDULE
UNDERSTAND YOUR RESULT / HOW IT WORKS / FAQ / RELATED
```

The `#results` region still wraps workspace and analysis so existing e2e selectors keep working. Charts and large tables are no longer children of the right-hand summary column.

Layout tokens:

- `--calculator-form-width: 380px`
- `--calculator-analysis-max: 1440px`
- `--chart-height-lg: 380px` (400px at 1440+)
- `--chart-height-md: 320px`
- `--chart-height-sm: 250px`

## C. Shared chart system

All ten tools still consume `lib/chart-data` adapters through one `InteractiveChart` + `ChartCanvas` pair. No per-calculator chart library was added.

Shared behavior:

- Responsive chart heights instead of a single 280px stage
- Compact segmented mode toggles (`width: fit-content` on desktop, full-width on small screens)
- Smart tooltip side: cursor on the left opens the tooltip on the right, and the reverse
- Mobile inspection strip above the canvas; floating tooltip is hidden below 768px
- Keyboard arrows, Home/End, Escape, and a text summary
- Charts read memoized adapter output only; engines do not rerun inside visualization components

## D. Responsive rules

| Viewport | Form / summary | Visualization |
| --- | --- | --- |
| 1440px+ | 360–380px form + flexible summary | full product width, 400px chart |
| 1200–1439px | 360–380px form + flexible summary | full width, 380px chart |
| 960–1199px | 40/60 split | full width, 380px until 1023px then 320px |
| 768–959px | stacked | full width, 320px chart |
| <768px | stacked | 250px chart |
| ≤639px horizontal charts | stacked | 260px chart |

Rule used in tests: at 1024px and above, a primary (non-split) chart canvas is wider than 700px. Budget is the exception because its analysis grid is two panels by design.

## E. Each calculator redesign

| Calculator | Visualization |
| --- | --- |
| **Mortgage** | Full-width balance area; Principal vs interest stacked annual bars with no in-bar labels; amortization schedule below |
| **Compound Interest** | Full-width stacked contributed / growth areas; Growth by year table below |
| **Retirement** | Growth to retirement and Drawdown as separate age-based modes; projection table below. Chart title is **Portfolio over time** so it does not collide with the **Retirement projection** detail heading |
| **Savings Goal** | Default Balance vs goal line; Contribution mix secondary; savings timeline below |
| **Budget** | Desktop 2-column Spending composition + Income allocation; stacks below 900px; expense table below |
| **Salary** | Pay breakdown is the chart. Pay-period equivalents are metric cards, not a shared-magnitude bar chart |
| **Loan Payoff** | Full-width current vs extra-payment lines, including post-payoff zeros and payoff markers; schedule below |
| **Debt Snowball** | Full-width stacked remaining balances; payoff-event cards; optional year-paged monthly balances |
| **Net Worth** | Default Assets vs liabilities bars; Composition donut secondary; optional projection is its own chart; balance sheet below |
| **Rent vs Buy** | Default buyer/renter net position lines with crossover marker; Cash costs secondary; cost comparison table below |

## F. Tooltip behavior

Desktop: pointer side chooses `data-side="left"` or `data-side="right"` so the panel sits opposite the cursor. Click pins; Escape / outside pointer clears.

Mobile (<768px): `.money-tooltip` is hidden. A fixed `.chart-inspection` strip lists the selected label and every series value above the canvas so the plot stays visible.

Tooltips never contain values that are unavailable in the table or headline result.

## G. Axis / legend behavior

Tick density is viewport-aware in `interactive-canvas.tsx`:

- X ticks: 8 desktop, 6 tablet, 4 compact
- Y ticks: 5 desktop, 3 compact
- Long monthly series plot in year units (`0`, `10y`, `30y`) while keeping every underlying point
- Currency axes use compact `$100K` / `$1M` notation; tooltips keep exact money

Legends sit under the plot, wrap, and use short human labels. They are not drawn inside the Chart.js plot area.

## H. Tables

Named detail sections use the full analysis width. Numbers are tabular and right-aligned. `.result-table-scroll` is the only horizontal scroller; body/document overflow is clipped. Mobile does not shrink table type to fit a right column.

## I. Accessibility

- Chart stage is keyboard-focusable with arrow inspection
- Inspection uses `role="status"`
- Tables remain semantic
- Empty chart states keep the headline estimate as the source of truth
- “View chart data” remains removed (content regression still forbids that string)

## J. Performance

Adapters are memoized from the already-validated result. Chart.js animation is off. Canvas is dynamically imported only after Calculate. Visualization components do not call calculator engines.

## K. Tests

Updated:

- `tests/e2e/calculators.spec.ts` — analysis sits below the workspace; non-budget desktop charts > 700px; overflow at 1440 / 768 / 390 / 320
- `tests/e2e/calculator-visuals.spec.ts` — chart height caps match the new tokens; desktop width floor for primary charts
- Existing adapter, container-token, and result-UX suites remain the contract for engines and named detail headings

## L. Screenshots

Calculated-state captures:

- `output/playwright/calculator-responsive-v3/{slug}-{1440,768,390}.png` for all 10 tools
- `output/playwright/calculator-visuals-v1/{slug}-result-desktop.png` and `-result-mobile.png`
- Tooltip / alternate mode still captured by `calculator-visuals.spec.ts` for every tool, including Mortgage, Retirement, Budget, Debt, Net Worth, and Rent vs Buy

## M. Intentional exceptions

- **Budget** desktop analysis is a 2-column dashboard, so each panel can be narrower than 700px while the analysis section itself is full width.
- **Retirement** chart title is “Portfolio over time”, not “Retirement projection”, to keep a single visible h3 for the e2e named-detail contract.
- **Salary** pay-frequency control stays in the summary because it changes the headline unit; the period cards live in analysis. The pay-breakdown chart is a single stacked bar, so keyboard next-point is a no-op.
- Shared shell files stay in `CalculatorFrame` rather than seven one-line wrappers. Chart reuse is through `InteractiveChart` / `lib/chart-data`.
- “View chart data” was already removed in UX v2 and is not restored.
