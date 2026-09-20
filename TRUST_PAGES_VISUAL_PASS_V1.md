# MoneyBasis Trust Pages Visual Pass v1

Completed locally: September 18, 2026. **No deployment, push or publication performed.** Calculator engines, source-registry records, privacy behavior and URLs are unchanged.

## A. Problems identified

The four footer pages still used the earlier nested-card pattern: a pale blue panel with a heading on the left and a large white card on the right. That made About, Privacy, Disclaimer and Sources feel like settings documentation rather than the rest of the product.

Specific issues:

- Repeated card-inside-card sections made short pages feel tall and heavy.
- Prose stretched or sat in unused left columns instead of a readable measure.
- About read as two legal blocks instead of a product story.
- Privacy repeated the same local-processing promise in nested cards.
- Disclaimer used three nearly identical containers for a simple message.
- Sources buried citable references in category panels that were hard to scan.

## B. Shared trust-page shell

All four pages now use `TrustPage`:

- max-width 1160px, centered
- desktop top spacing 80px; mobile side padding 20px
- compact header: optional eyebrow, H1, 1–2 sentence lede
- existing site header, footer, colors, radius and focus styles
- no decorative illustrations

Cards are used only when they group a real comparison, checklist or status panel.

## C. About redesign

About is a light brand/story page:

1. Editorial H1 with Explore calculators / See how MoneyBasis works
2. Three principle cards: Understand, Transparent, Private
3. Calculate → Visualize → Understand steps without an outer card
4. Two-column is / isn't comparison
5. Soft-blue CTA: Start with a money question, plus a privacy text link

## D. Privacy redesign

The main promise sits directly under the H1 as a four-point trust summary. Sections then explain specific cases:

- Your calculations: what stays local vs what is sent
- Saved data & sharing: local saves vs shared links, including the calculator-only / include-my-numbers distinction
- Website activity: analytics, advertising cookies and hosting logs with current status badges
- Data stored on this device: Budget, Net Worth and Debt Snowball, with confirm-then-clear

Clearing still uses `clearAllLocal()` and does not remove theme preference. Confirmation is required before the destructive action.

## E. Disclaimer redesign

A compact page with one Important callout, then three unboxed sections: educational estimates, what MoneyBasis does not provide, and before making an important decision. Footer links go to How it works and Sources. Lending and tax-filing claims were not added because they were not in the current disclaimer.

## F. Sources redesign

Sources is a reference library:

- sticky category navigation on desktop (220px + main column)
- labeled category select on smaller screens
- stacked source rows: organization, document title, what MoneyBasis uses it for, year badge when `effectiveYear` exists, optional Details
- every registry item is rendered; category membership is generated from `sourceCategories`
- “How MoneyBasis labels numbers” is a distinct 3-column callout, not another source list

External links still open in a new tab, keep organization names visible, and include an accessible “opens in a new tab” label.

## G. Shared components

- `components/layout/trust-page.tsx` — shell, section and CTA
- `components/sources/library.tsx` — category nav and source rows
- `components/privacy/clear-saved-data.tsx` — confirmation dialog
- `lib/sources.ts` — presentation categories only; records unchanged
- trust-page styles in `app/globals.css`

## H. Responsive behavior

| Width | About | Privacy | Disclaimer | Sources |
| --- | --- | --- | --- | --- |
| 1024px+ | 3 principle cards; 2-col is/isn't | 2-col splits | single column | sticky sidebar |
| 768px | 2+1 principles; 3 steps | splits stack toward one column | single column | category select |
| 390px and below | 1 column; 44px buttons | panels full width | readable 16px type | select + wrapping rows |

Overflow checks cover 1440, 1280, 1024, 768, 430, 390 and 375.

## I. Accessibility

- One H1 per page; H2/H3 follow section order
- Descriptive links (no raw URLs)
- Clear saved data uses an `alertdialog` with Cancel focused first
- Source links include destination titles and “opens in a new tab”
- Status and is/isn't lists do not rely on color alone
- Existing `:focus-visible` outline is unchanged
- Source nav is hash links, not a focus trap

## J. Dark mode

Trust chips, cards, source rows, badges, muted copy, buttons, confirmation and links use theme tokens (`background`, `card`, `border`, `primary-soft`, `muted`). Primary buttons keep white text on blue.

## K. Tests

Preserved and updated `tests/e2e/policy-layout.spec.ts` (section counts, footer, source hrefs, overflow, privacy clear through confirmation).

Added `tests/e2e/trust-pages.spec.ts` covering principles, is/isn't, CTAs, local-processing claims, share distinction, confirmation and recovery, disclaimer links, every source id, year badges, mobile category navigation and dark-mode captures.

Added a Vitest check that every registered source appears in exactly one generated category.

## L. Verification

- `npm test`: 323 tests passed across 12 files
- `npm run lint`: passed after escaping the About isn't heading
- `npx tsc --noEmit`: passed
- `npx next build --webpack`: passed
- Trust/footer e2e: `trust-pages.spec.ts`, `policy-layout.spec.ts` and page-hero checks for `/about`, `/privacy`, `/disclaimer` and `/sources` passed
- Full `npm run test:e2e`: 73 passed / 4 failed, all four in `tests/e2e/guides.spec.ts` (dark-mode prose color on concurrent guide-article work, plus a screenshot-gallery timeout). Those failures are outside this pass.

## M. Screenshot paths

Saved under `output/playwright/trust-pages-v1/`:

- `about-desktop.png`, `about-mobile.png`
- `privacy-desktop.png`, `privacy-mobile.png`
- `sources-desktop.png`, `sources-mobile.png`
- `disclaimer-desktop.png`, `disclaimer-mobile.png`
- `dark-mode-privacy.png`, `dark-mode-sources.png`

## N. Intentionally unchanged content

- Financial formulas, calculator behavior and inputs
- Source registry fields, URLs and supported claims
- Privacy storage behavior (`moneybasis:` localStorage keys, no upload, theme not cleared)
- Routes: `/about`, `/sources`, `/privacy`, `/disclaimer`
- Header/footer information architecture
- No invented certifications, user counts, testimonials or “zero tracking” claims
- No deployment
