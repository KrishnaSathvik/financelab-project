# FinanceLab

A comprehensive, all-in-one personal finance calculator suite — built as a single static HTML file with zero backend dependencies.

![Dark Theme](https://img.shields.io/badge/theme-dark-0a0a0f?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/backend-none-c8f55a?style=flat-square)
![Single File](https://img.shields.io/badge/architecture-single%20file-5af0c8?style=flat-square)
![Chart.js](https://img.shields.io/badge/charts-Chart.js%204.4-ff8f5a?style=flat-square)

---

## Overview

FinanceLab packs **10 financial calculators** into one lightweight, privacy-first page. Everything runs client-side — no data leaves your browser, no accounts, no tracking. Just open and calculate.

## Calculators

| # | Calculator | What It Does |
|---|-----------|-------------|
| 1 | **Mortgage** | Monthly P+I payment, total interest, yearly amortization table & chart |
| 2 | **Investment Growth** | Compound interest with monthly contributions, portfolio vs. contributed comparison |
| 3 | **Salary ↔ Hourly** | Two-way converter with 2025 IRS progressive tax brackets, FICA breakdown, pay period table |
| 4 | **Loan Payoff** | Standard vs. extra payment comparison — see time and interest saved |
| 5 | **Net Worth Tracker** | 30-year projection with separate asset growth and debt paydown modeling |
| 6 | **Budget Planner** | Dynamic expense categories, savings rate, doughnut breakdown |
| 7 | **Retirement** | Nest egg accumulation + drawdown simulation using the 4% Rule (Trinity Study) |
| 8 | **Savings Goal** | Reverse PMT calculation — how much to save monthly to hit any target |
| 9 | **Debt Snowball** | Multi-debt payoff with dynamic minimums, freed payment rollover, per-debt progress chart |
| 10 | **Rent vs Buy** | Side-by-side net worth comparison with rent inflation, appreciation, and investment returns |

## Financial Formulas & Sources

All calculations use standard, well-documented financial formulas:

- **Mortgage / Loan Amortization** — `M = P·r·(1+r)^n / ((1+r)^n − 1)` — [Wikipedia](https://en.wikipedia.org/wiki/Mortgage_calculator), Bankrate
- **Future Value (Investment/Savings)** — `FV = PV·(1+r)^n + PMT·((1+r)^n − 1)/r` — CalculatorSoup, Excel FV()
- **PMT (Savings Goal)** — `PMT = FV·r / ((1+r)^n − 1)` — Excel PMT function
- **Federal Income Tax** — 2025 IRS progressive brackets (Revenue Procedure 2024-40) with standard deductions
- **FICA** — Social Security 6.2% (wage base $176,100) + Medicare 1.45% — IRS 2025
- **4% Rule** — Trinity Study (1998) safe withdrawal rate
- **Debt Snowball** — Smallest-balance-first method — Ramsey Solutions, NerdWallet

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | Semantic HTML5 |
| Styling | CSS3 with custom properties (dark theme) |
| Typography | [Syne](https://fonts.google.com/specimen/Syne) (display) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body) |
| Charts | [Chart.js 4.4.1](https://www.chartjs.org/) via CDN |
| Logic | Vanilla JavaScript (no frameworks) |
| Backend | None — fully client-side |

## Design

- **Dark-first** theme with a lime/teal/gold accent palette
- **Responsive** — horizontal scrollable pill tabs on mobile, full tab bar on desktop
- **Consistent design system** — hero cards, stat rows, chart wraps, and data tables reused across all calculators
- **Smooth transitions** — panel fade-in animations, scroll-snap tab navigation

## Getting Started

### Run locally

Just open the file in any browser:

```bash
open index.html
# or
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Deploy to Vercel

**Option A — CLI**

```bash
npm i -g vercel
mkdir financelab && cp financelab.html financelab/index.html
cd financelab
vercel
```

**Option B — GitHub**

1. Push `index.html` to a GitHub repo
2. Import at [vercel.com/new](https://vercel.com/new)
3. Framework: **Other** · Build command: *blank* · Output: `.`
4. Deploy

**Option C — Drag & drop**

Drag your folder (containing `index.html`) into [vercel.com/new](https://vercel.com/new).

### Deploy to Netlify

Drag the folder into [app.netlify.com/drop](https://app.netlify.com/drop). Done.

### Deploy to GitHub Pages

1. Push `index.html` to a repo
2. Settings → Pages → Source: `main` branch, root folder
3. Your site is live at `https://<username>.github.io/<repo>`

## Project Structure

```
financelab/
└── index.html    ← everything lives here (~1,750 lines)
```

That's it. One file. CSS, JavaScript, HTML — all bundled together. The only external dependency is Chart.js loaded from a CDN.

## Privacy

FinanceLab stores **nothing**. No cookies, no localStorage, no analytics, no API calls. All calculations happen in your browser's memory and disappear when you close the tab.

## Browser Support

Works in all modern browsers:

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- Mobile Safari & Chrome (responsive)

## License

MIT

---

<p align="center">
  <strong>FinanceLab</strong> — For educational purposes only. Not financial advice.
</p>
