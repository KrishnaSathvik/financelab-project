# MoneyBasis presentation redesign

## Shared system

- Content: 1200px usable desktop width; articles up to 740px; 68px navigation.
- Colors: primary #2563EB, text #0F172A, secondary #64748B, border #E2E8F0, surface #F7F9FC, cards #FFFFFF. Existing dark-theme tokens remain supported.
- Type: existing Inter family; 44px page headings, 60px desktop home heading, 28px section headings, 16px body and 48px inputs.
- CalculatorFrame owns the header, privacy indicators, and unified workspace. Desktop input/results split is 38/62, with 45/55 for ledger-heavy calculators. Mobile stacks the panels.
- Reuse NumberField, SegmentedControl, HeroResult, ChartCard, EmptyResults, ResultTabs, CalculatorSeoArticle, CalculatorCard, and GuideCard.
- Show estimates before explanations; keep formulas, assumptions, sources, FAQs, and schedules accessible through native disclosures.
- Preserve existing calculation engines, storage, sharing, exports, and source material.

## Navigation and content

- `/how-it-works` replaces `/methodology`; the old page permanently redirects.
- Canonicals, sitemap, machine-readable discovery, and navigation use the new route.
- Home features six tools and a live mortgage demonstration.
- The directory groups all ten tools without search or filters.
- All ten guides include a takeaway, worked numerical example, calculator exercise, source links, and related reading. Desktop articles have a contents sidebar.

## Browser verification

Checked 1440, 1280, 1024, 768, 430, and 375px viewports:

- Home, directory, About, How it works, Guides index, and calculator workspace pages.
- Calculated result states and charts for all ten calculators.
- All ten guide articles and their numerical tables.
- No document-level horizontal overflow in 186 viewport checks.

Interaction checks passed for Budget category editing and live result updates; Net Worth add/remove/custom account names; How it works calculator switching; the legacy route redirect; light/dark theme switching; collapsed schedule expansion.

Screenshots reviewed for desktop home, desktop mortgage, mobile Net Worth, and dark-mode Budget. Browser console reported no errors during the smoke checks.

## Automated verification

- All 19 Vitest tests pass (14 calculation tests, 5 SEO tests).
- ESLint and TypeScript checks pass.
- Production build passes with `npm run build -- --webpack`.
- Default Turbopack build encountered an environment restriction on opening its CSS worker's local port; no production build configuration was changed.
- Loan payoff calendar display checked separately, including its assumption that monthly payments begin next month.
