# MoneyBasis

Understand the numbers behind your money.

MoneyBasis is a collection of free, privacy-first financial calculators for mortgages, investing, retirement, budgeting, debt, savings and everyday money decisions.

Each calculator is designed to show not only the result, but also the assumptions, methodology and visual breakdown behind it.

Free · Private · No account required · Transparent calculations

## Calculators

| Category | Tools |
| --- | --- |
| Plan a home | [Mortgage](/calculators/mortgage), [Rent vs Buy](/calculators/rent-vs-buy) |
| Grow your money | [Compound Interest](/calculators/compound-interest), [Retirement](/calculators/retirement), [Savings Goal](/calculators/savings-goal), [Net Worth](/calculators/net-worth) |
| Manage your money | [Budget](/calculators/budget), [Salary ↔ Hourly](/calculators/salary-hourly), [Loan Payoff](/calculators/loan-payoff), [Debt Snowball](/calculators/debt-snowball) |

## Tech stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Inter + Geist Mono
- Lucide icons
- Chart.js (bundled, not a CDN)
- Vitest for calculator engines

## Development

```bash
npm install
npm test
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` to `https://moneybasis.app` so sitemap, robots, Open Graph and JSON-LD URLs match production.

Set `NEXT_PUBLIC_GA_ID` to the Google Analytics 4 measurement ID (`G-5S6MBPSWG6` by default). Leave it empty to disable the tag.

## Privacy

Standard calculator inputs are processed locally in the browser. No account is required. Optional on-device saves stay in `localStorage` until you clear them. Google Analytics 4 records page views; calculator numbers are not sent with those requests.

## License

MIT
