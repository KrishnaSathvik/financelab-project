# MoneyBasis Correctness Pass v1

Implementation record for the 2026-09-18 audit. Scope: correctness and the supporting UI/source contract. Full guide rewrites, four new guides, deployment, search-engine setup and production acceptance are separate milestones.

| Ticket | Acceptance criteria | Implementation |
|---|---|---|
| MB-C01 Shared validation | One result contract across typed inputs, engines, URL restoration and saved records; bad data cannot render success | `lib/validation/`, `lib/calculation-result.ts`, strict decimal parser, validated persistence/hooks |
| MB-C02 Time and conventions | Whole-month horizons including fractional years; clamped calendar dates; explicit rates, contributions, rounding and dollar basis | `lib/calendar.ts`, `lib/finance.ts`, `MONEYBASIS_CALCULATION_CONVENTIONS.md` |
| MB-C03 Debt conservation | Minimum-budget rejection, capped payments, same-month rollover, independent IDs, exact horizon boundary | Debt monthly allocation ledger; regression cases D1–D10 and conservation tests |
| MB-C04 Housing comparison | Equal starting resources and monthly resource budget, investments on either side, correct time-zero equity, no post-payoff mortgage spending | Rent/buy monthly ledger and selected-horizon reconciliation |
| MB-C05 Retirement semantics | Today-dollar spending inflated to retirement and annually thereafter; nominal charts; losses retained; depletion distinguished from horizon | Unified monthly drawdown, explicit status and purchasing-power display |
| MB-C06 Savings semantics | Achieved today and growth-funded distinguished; losses and uncapped growth retained; fractional deadlines honored | Monthly savings series, independent state flags, calendar-month target dates |
| MB-C07 Salary scope | Additional Medicare included; unsupported state estimates removed; annual liability versus withholding explicit | Federal/FICA-only UI/engine, filing-status thresholds, supported-year source links |
| MB-C08 Loan schedule | No false horizon payoff; negative amortization retained; delayed extra payment handled; chart/table from same ledger | Complete monthly schedules and structured status |
| MB-C09 Remaining models | Partial mortgage/investment/net-worth horizons; no-loan mortgage state; budget null ratios/remaining-income terminology; full home value label | Engine and UI changes, signed growth, detailed table cents |
| MB-C10 Reference fixtures | Preserve all 160 independent audit cases with explicit contract migrations, not production-generated expectations | `tests/fixtures/financial/`, `tests/financial-fixtures.test.ts` |
| MB-C11 Output and browser checks | Ledger conservation, chart endpoints, CSV output, typed errors, URL input rejection and storage recovery | Integration, convention, validation and Playwright tests |
| MB-C12 Sources | Structured registry with support claims, verification date, jurisdiction and applicable year; remove generic homepages | `lib/sources.ts`, calculator catalog, sources page and tax data |

## Fixture policy decisions

All 160 reference cases originate in `TEST_MATRIX.md`; that audit document is preserved unchanged. M5 and L8 have explicit `auditExpected` and `policyDecision` fields in their fixture JSON. All-cash mortgage output is now a valid no-loan result. The 1,201-month loan fixture is intentionally bounded at 1,200 months and reports its $1 residual and `horizon-exceeded`. No claim is made that these model-policy changes received separate human signoff.

## Reproduction

- `npm test`: independent fixtures, conventions, validation, source metadata and output reconciliation.
- `npm run lint` and `npx tsc --noEmit`.
- `npm run build`: normal Turbopack production build. If the execution sandbox prevents Turbopack's worker port binding, `npx next build --webpack` verifies a production build with the supported alternative bundler.
- After a production build, `npm run test:e2e` starts the built application on localhost port 3101 and uses installed Chrome. To use an already-running test server, set `MONEYBASIS_TEST_URL`. Browser artifacts go under `output/playwright/test-results/`.

## Remaining milestones

Content Pass v1: rewrite the existing ten guides against these conventions, then add Nominal vs Real Return; Gross Pay vs Net Pay; APR vs APY vs Investment Return; and Savings Rate vs Remaining Cash Flow. Existing copy received only correctness-related edits in this pass.

Production Verification: deploy the reviewed source, record source/deployment parity, run live browser acceptance, verify Search Console/Bing/SEO configuration. Local test success is not a production launch signoff.

## Verification results — 2026-09-18

- 216 unit/reference/integration tests passed, including all 160 audit fixtures with the two documented contract migrations.
- 16 Playwright acceptance tests passed against the fresh local production build: all ten calculators, invalid typed input/recovery, rejected shared URL, fractional shared goal/calendar deadline, corrupted storage/save/reload, retirement inflation, and mortgage monthly CSV reconciliation.
- TypeScript, ESLint and `git diff --check` passed.
- `npx next build --webpack` passed and generated all 56 pages. The default Turbopack build was blocked by this environment's worker-port permission restriction, including after an escalation attempt; no code error was reported by the successful Webpack build.
- Browser acceptance found and fixed a formatted-number focus/selection race. The save/reload test now verifies that replacing 5,000 with 6,000 saves exactly 6,000.
- No production deployment or production/source-parity verification was performed.
