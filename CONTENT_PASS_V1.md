# MoneyBasis Content Pass v1

Completed locally: September 18, 2026. **No deployment, push or publication performed.** Calculator semantics remain frozen under [MONEYBASIS_CALCULATION_CONVENTIONS.md](MONEYBASIS_CALCULATION_CONVENTIONS.md). The four audit/report documents were read before editing content. No new financial-model defect was found.

## A. Implementation summary

Rebuilt the education library as fourteen substantive, typed guides: ten rewritten evergreen URLs and four new foundations. The library contains approximately 13,644 words of article copy and exercises, excluding bibliography and table cells. Reading times use actual article text at 200 words/minute, with no artificial word padding.

Every article has a specific introduction and takeaway, subject-driven sections, independently derived examples, a relevant visual with accessible data, model boundaries, nearby references, an exercise, calculator links, methodology and two or three curated related guides. No CMS or new dependency was added.

Implementation locations:

- [Typed schema](lib/guides/types.ts), [catalog](lib/guides/catalog.ts) and [content modules](lib/guides/content).
- [Independent fixture generator](scripts/generate-guide-fixtures.py), [committed fixtures](lib/guides/fixtures.json) and [shared numerical formatting](lib/guides/numbers.ts).
- [Article page](app/guides/[slug]/page.tsx), [visual renderer](components/brand/guide-exhibit.tsx), [guide cards](components/brand/guide-card.tsx) and [library](app/guides/page.tsx).

The old, unused `lib/guides/examples.ts` was removed. The old calculator educational-excerpt export now derives from reviewed guide content, eliminating its stale savings and housing descriptions without changing calculator behavior.

## B. Guides rewritten

All ten original slugs are preserved. Counts below include introductory text, takeaway, section headings/body and exercise; they exclude sources and visual/table labels.

| Guide / evergreen slug | Words | Main teaching elements |
|---|---:|---|
| How Mortgage Amortization Works — `mortgage-amortization` | 972 | Note rate versus APR; monthly timing; first payment; year 1/5/10/20/30 composition; escrow, PMI, zero rate, extra principal, recast and refinance |
| Compound Interest: Growth, Contributions and Inflation — `compound-interest` | 994 | Lump sum, monthly deposits, zero-return control, negative growth, frequency conversion, contributed/growth/total series, real value and fees |
| Salary to Hourly: Gross Pay, Paid Weeks and Tax Estimates — `salary-vs-hourly` | 999 | Gross conversion and pay-period table; 2026 bracket arithmetic, FICA waterfall, deductions and Additional Medicare; one-worker scope |
| How to Calculate Your Net Worth — `net-worth` | 970 | Dated asset/liability inventory; full property and separate mortgage; ownership scope, liquidity, negative values and separate aggregate projection |
| How to Build a Monthly Budget — `monthly-budget` | 970 | Take-home basis, irregular costs, sinking funds, debt/transfer double-counting, cash timing, deficits and undefined zero-income ratios |
| Debt Snowball vs Debt Avalanche — `debt-snowball-vs-avalanche` | 960 | Corrected three-debt example; minimum reservation and same-month rollover; priority versus payoff sequence; IDs and feasibility |
| Extra Loan Payments: How Principal, Interest and Payoff Change — `loan-prepayments` | 863 | $300/$400 comparison; first two payments and final partial payment; two balance paths; one-time extras and non-amortization |
| The 4% Rule: Origins, Inflation and Retirement Risk — `four-percent-rule` | 1,585 | Bengen/Trinity distinction; two withdrawal policies; inflation timeline; independently calculated sequence risk; historical versus deterministic analysis |
| Rent vs Buy: Compare Cash Costs, Equity and Opportunity Cost — `rent-vs-buy-costs` | 1,096 | Equal starting/monthly resources; two-path diagram; both portfolios; post-payoff investing; liquidity, omitted costs and reversible crossing |
| How Much to Save Each Month for a Specific Goal — `how-much-to-save` | 898 | Zero-return control, solved deposits, existing/deposits/growth components, achieved-today versus growth-funded, negative returns and nominal targets |

## C. New guides added

| Guide / slug | Words | Connections |
|---|---:|---|
| Nominal vs Real Return: What Future Dollars Can Buy — `nominal-vs-real-return` | 812 | Compound Interest, Retirement, Savings Goal |
| Gross Pay vs Net Pay: Taxes, Benefits and Deductions — `gross-vs-net-pay` | 902 | Salary, Budget, Retirement |
| APR vs APY vs Investment Return — `apr-vs-apy` | 825 | Compound Interest, Mortgage, Loan Payoff |
| Savings Rate vs Remaining Cash Flow — `savings-rate-vs-cash-flow` | 798 | Budget, Savings Goal, Retirement |

Six explicit categories replace category inference from calculator names: Home & Mortgage, Saving & Investing, Retirement, Income & Budgeting, Debt and Financial Basics.

## D. Numerical examples and verification

The independent generator uses Python Decimal with 50-digit precision and **does not import or invoke production calculators**. It determines expected values first. Vitest then compares the frozen engines against those expectations. Every one of the 30 calculator-linked cases passes, with money tolerance of one cent and exact month counts/boolean states. Separate arithmetic checks cover withdrawal policies, sequence risk and cash-allocation reconciliation.

Each case records exact input arguments, expected values, calculation basis, tolerance, source keys and the source/calculator relationship. All 23 exhibits additionally record inputs, basis, case associations and relationship. Their underlying values remain unrounded. Prose uses fixture-backed currency/rate substitutions for calculated results; charts and tables use the same exhibit rows. Browser checks verify rendered cells against those rows. Additional tests reconcile every displayed mortgage, investment, debt-allocation, loan-balance and rent/buy point with engine data.

| Example | Independently derived result / basis |
|---|---|
| Mortgage: $320,000, 6.5% note rate, 360 payments | $2,022.617675 monthly P&I; first interest $1,733.333333, principal $289.284342; total interest $408,142.363064. Payment derived from discounted unit-payment sum, then checked against a Decimal ledger. |
| Compound: $10,000 + $500/month, nominal 7% monthly, 20 years | $300,850.718403 final; $130,000 contributed; $170,850.718403 growth. At constant 3% inflation, $166,573.748409 in today’s dollars. Independent geometric sums. |
| Lump sum / zero / negative-return controls | $10,000 at annual 5% for 10 years: $16,288.946268. $1,000 + $100/month at zero for one year: $2,200. $1,000 at nominal −12% monthly for one year: $886.384872. |
| 2026 single-worker $75,000, no deductions | Taxable income $58,900; federal tax $7,670; Social Security $4,650; Medicare $1,087.50; modeled net $61,592.50. Independently transcribed IRS bracket slices and FICA rules. |
| Same worker, $10,000 traditional 401(k), $2,000 qualifying health | Taxable income $46,900; federal tax $5,380; Social Security $4,526; Medicare $1,058.50; modeled net $52,035.50. FICA wages are $73,000, not $63,000. |
| Additional Medicare illustration | At $300,000 single-worker Medicare wages: $4,350 regular plus $900 additional = $5,250. |
| Gross conversion | $30 × 40 hours × 52 paid weeks = $62,400; annual/12 = $5,200; annual/26 = $2,400; annual/24 = $2,600 (manual semimonthly illustration). |
| Net worth | $12,000 cash + $45,000 investments + $300,000 property − $240,000 mortgage = $117,000. |
| Budget | $5,000 − $3,700 = $1,300 (26% remaining); after $500 savings transfer, $800 (16% remaining), with a distinct 10% transfer rate. |
| Three debts, $800 budget | Both priorities: 26 months. Snowball interest $2,075.229517; avalanche $1,883.839620. Independent minimum-reservation and same-month rollover ledger. |
| Loan: $10,000 at 12%, $300 versus $400 | 41 versus 29 months; interest $2,224.952582 versus $1,564.883703; 12 months and $660.068879 saved. Full ledgers and capped final payments. |
| Retirement policy | $750,000 × 4% = $30,000 initially; 3% inflation produces $30,900 and $31,827 in years 2 and 3. The timeline does not imply survival. |
| Sequence illustration | $100,000, $10,000 withdrawn after each annual return: +20%/−20% ends $78,000; reverse ends $74,000. Without withdrawals both end $96,000. Invented paths, separate from the engine and historical studies. |
| Retirement engine comparison | Age 30→65, $25,000 + $800/month, nominal 7%, 3% inflation: nest egg $1,728,497.477022; 4% monthly equivalent $5,761.658257; $4,000 today-dollar monthly need becomes $11,255.449817. |
| Rent/buy zero-rate control | $120,000 home, 20% down, ten-year loan, $800 rent, all other costs/returns zero: year 1 buyer $33,600/renter $24,000; year 11 buyer $129,600, including $9,600 owner investments. Separate $400/$1,000 rent cases check symmetry. |
| Savings target | $12,000 goal less $3,000 saved: $750/$375/$250 monthly over 12/24/36 months at zero return. $50,000 goal, $5,000 saved, nominal 4%, 48 months: $849.390792 monthly, $4,229.241974 growth. |
| Growth-funded state | $9,000 at nominal 12% monthly for one year projects $10,141.425271: no deposits required for $10,000, but not achieved today. High return is explicitly a teaching input. |
| Real return | Effective 7% versus 3% inflation: 1.07/1.03 − 1 = 3.883495%. $10,000 after 10 years: nominal $19,671.513573, real $14,637.453546. |
| APY conversion | Nominal 12% monthly yields 12.682503% effective annually. A 5% APY corresponds to 4.888948540% nominal annual with monthly compounding. |
| Broader savings definitions | $900 employee savings / $8,000 gross = 11.25%; including $200 employer contribution in both sides gives $1,100 / $8,200 ≈ 13.4146%. Definitions explicitly named. |

Regeneration is byte-identical:

```sh
python3 scripts/generate-guide-fixtures.py
npx vitest run tests/guide-fixtures.test.ts tests/guides.test.ts
```

No model issue required stopping an article. SHA-256 comparison of the 21 engine and validation files captured before this pass found **zero changes**. The authoritative conventions document and tax tables were not edited.

## E. Sources used

The fourteen guides use 22 claim-specific records from [the structured source registry](lib/sources.ts). Sources are linked near the relevant discussion and again with organization, date/year when known, and supported claims in the bibliography. Primary sources were opened and checked on September 18, 2026. Source access is a point-in-time verification, not a permanent link guarantee.

| Registry keys | Claims supported |
|---|---|
| `mortgage`, `housing`, `apr`, `pmi` | CFPB payment mechanics, housing terminology, note rate versus APR and lender-protecting PMI |
| `recast` | Fannie Mae principal curtailment/re-amortization procedures; scope limited to its specified loans |
| `compound`, `apy` | Investor.gov compounding definition; CFPB Regulation DD deposit-yield definition |
| `fees` | SEC Investor Bulletin: costs reduce invested capital and future compounding |
| `inflation` | BLS purchasing-power and constant-dollar conversion |
| `irs2026`, `ssa`, `medicare` | IRS RP 2025-32 brackets/deduction; SSA 2026 wage base; IRS Additional Medicare liability/withholding distinction |
| `retirementTax`, `cafeteria` | IRS retirement contribution treatment and 2026 Publication 15-B qualifying benefit exclusions |
| `netWorth`, `budget`, `savings`, `debt` | Investor.gov balance sheets and CFPB cash-flow, savings-plan and debt-priority worksheets |
| `bengen`, `bengenText`, `trinity` | Original 1994 Bengen and 1998 Trinity research, with historical/portfolio/horizon limitations |
| `socialSecurityPlanning` | SSA personal benefit planning; benefits separate from portfolio withdrawals |

Bengen’s original publisher page requires sign-in for the paper. The bibliography also identifies an accessible scan of the original paper hosted by freefincal; this is labeled as a hosted reprint, not an agency source or a secondary summary. Publication dates with only month precision remain month precision. No specific historical success percentage is claimed.

All hypothetical inputs and MoneyBasis timing/model choices are identified as internal educational arithmetic. Government and research citations are not represented as endorsement or validation of the application.

## F. UI/content component changes

- Approximately 740px desktop article column with a bounded, sticky table of contents. Smaller screens use one column and native collapsible contents.
- Descriptive H1, explicit category, actual reading-time estimate, reviewed date, introductory copy and key takeaway.
- Marked 2026 boxes isolate dated salary assumptions and examples.
- Twenty-three reusable exhibits: amortization composition, three-series accumulation, gross-to-net waterfall, asset/liability bars, budget allocation, debt priority/payoff sequences, two loan paths, withdrawal timeline, sequence illustration, two housing paths, savings components, real/nominal paths and yield comparisons.
- Server-rendered SVG/HTML visuals; no chart hydration requirement or new chart package. Line series use patterns as well as color, and axis labels follow the light/dark theme. Every visual includes exact accessible table data and a specific assumption caption.
- Focusable, horizontally scrollable table regions; narrow charts keep readable labels and scroll inside their container. Mobile hints explain the continuation. Page itself remains within the viewport at 320px and 390px.

Review images are in [output/playwright/content-v1](output/playwright/content-v1). Representative desktop, mobile, figure and OG captures are saved for mortgage, compound interest, salary, retirement and rent/buy. Automated checks cover all fourteen guides; manual image inspection sampled those layouts and representative visuals, rather than claiming a full human accessibility audit.

## G. Internal linking changes

Each guide has an explicit primary calculator, additional meaningful calculator associations, two or three curated related guides and a `/how-it-works` methodology link. Every guide has an incoming related-guide link. All ten calculators now expose appropriate guide backlinks through their educational article component.

Calculator buttons open the normal calculator route. The adjacent exercise states all relevant inputs and explicitly explains that the tool may open defaults or saved inputs; it does **not** pretend an example has been preloaded. The net-worth exercise matches its ledger/optional-projection interface.

The guide index uses all six explicit categories. The existing homepage guide cards consume the rebuilt catalog. The machine-readable `llms.txt` content now includes all fourteen guides with evergreen URLs.

## H. SEO metadata

Every guide specifies slug, SEO title, unique description, H1 title, category, reading time, calculator associations, reviewed date, source keys, related guide slugs, OG headline and OG subheadline.

Article pages emit canonical URLs, Article and BreadcrumbList JSON-LD, article Open Graph metadata, reviewed modification dates and Twitter summary-large-image metadata. Each guide has a statically generated 1200×630 PNG social preview using its own headline/subheadline. The sitemap uses each guide’s reviewed date. No old guide URL was removed or redirected.

## I. Tests added

- [guide-fixtures.test.ts](tests/guide-fixtures.test.ts): 32 tests, including 30 independent engine comparisons, standalone policy/cash reconciliation and full displayed-point reconciliation.
- [guides.test.ts](tests/guides.test.ts): 59 checks for evergreen/unique slugs, six categories, meaningful references, fixture/exhibit associations, incoming and outgoing links, calculator coverage, anchors, reading time, basic editorial regressions, metadata and sitemap dates.
- [guides.spec.ts](tests/e2e/guides.spec.ts): 15 browser tests covering all fourteen pages plus the library/backlinks/review captures. Verify real rendered cells, headings, canonical/OG metadata, working 1200×630 images, desktop width, mobile contents navigation bounded overflow at 390px and 320px, and dark-theme axis-label contrast.

Financial correctness tests compare numeric values with tolerances, not snapshots of long prose. Browser table checks provide a separate formatting/rendering layer.

## J. Verification results

| Check | Result |
|---|---|
| `npm test` | **307 passed**, 10 files: original 216 plus 91 content checks |
| Original independent calculator audit fixtures | **160 passed**, retaining the two previously documented contract migrations |
| `npm run lint` | Passed |
| `npx tsc --noEmit` | Passed |
| `npx next build --webpack` | Passed; 74 generated static pages, including all 14 guide pages and 14 guide OG routes |
| `npm run test:e2e` | **31 passed**: original 16 calculator tests plus 15 guide tests |
| Fixture regeneration | Byte-identical to committed JSON |
| Engine/validation hash comparison | All 21 captured files unchanged |
| Browser console errors in guide checks | None |
| Deployment | Not performed |

Webpack was used for local production verification because the prior correctness pass documented an environment-specific Turbopack worker/port restriction. This is not a claim that the default Turbopack build was newly verified. Browser tests used the local production server on port 3101, not a deployed site.

## K. Remaining editorial risks

1. Tax examples deliberately describe supported ordinary wages and the base standard deduction. They need a coordinated review when adding another tax year; no state/local, spouse-income or full-return model was introduced.
2. The retirement material teaches policy and sequence risk; it does not reproduce the papers’ full historical datasets or estimate future success probabilities. The Bengen publisher access restriction and hosted original scan are disclosed.
3. Constant returns, inflation and cost escalators remain scenario assumptions. The rent/buy zero-rate example deliberately omits realistic costs to expose bookkeeping, and says so prominently.
4. External pages can move or change. IRS Publication 15-B uses a rolling PDF URL; the registry records the 2026 effective year and verification date.
5. Broad mobile/browser checks and representative image inspection passed; these do not replace an eventual human editorial review, assistive-technology audit or deployed-site verification. No production indexing or Search Console/Bing action was taken.
6. Some figures require horizontal scrolling on narrow screens. They retain readable labels, captions, focusable regions and accessible table values; the page itself does not overflow.

For the later production-verification phase, the session reports Vercel CLI 56.4.1 as outdated. Upgrade with `npm i -g vercel@latest` or `pnpm add -g vercel@latest` before using it then. No CLI installation, upgrade or deployment was performed in this pass.

## L. Recommended next content batch

First review these fourteen guides visually and editorially. After that review, a small connected batch would be more useful than expanding immediately to all planned topics:

- Emergency funds and sinking funds: distinguish uncertainty reserves from known irregular bills, linked to Budget and Savings Goal.
- Reading a loan statement and payoff quote: explain contractual timing and fees beyond the monthly planning model.
- Investment fees and after-cost assumptions: deepen cost treatment without inventing expected returns.
- Retirement spending gaps: connect separately estimated benefits, account withdrawals and today-dollar spending without implying a tax or benefits engine exists.

Each new topic needs the same independent-example, source-claim and model-boundary checks. Production verification and launch remain separate subsequent milestones.
