# MoneyBasis final UI polish

## A. Homepage changes

Scoped changes to the learning section and mortgage demo split. Hero, trust strip, tool cards, feature section and final CTA retain their existing designs. The mortgage demo uses 48% / 52% columns from 960px and stacks below that width. Existing tabular numerals, controls and result calculations remain intact.

## B. Learning-card component

`components/brand/learning-card.tsx` supplies one editorial skeleton: category/read time, title, summary, CTA, and numerical preview. All previews use the same markup, with CSS Grid selecting two or three equal metric columns from the existing data. Outer heights, preview heights, padding and CTA positions match. Values and text come directly from the reviewed guide preview catalog; no financial examples were recreated.

## C. How-it-works responsive layout

The existing illustration and heading now occupy a compact desktop hero, with 64px top / 56px bottom padding and a 400px illustration cap. The 1200px container holds a 230px sticky navigation column and the detail panel, separated by 32px. Details begin directly after the hero and have a maximum internal width of 800px. At 768–1023px, a smaller two-column hero keeps the explanation navigation close to the introduction. Existing explanation sections, human-facing input labels, sources and calculator links are retained.

## D. Breakpoint behavior

| Width | Learning cards | Explanation navigation | Mortgage demo |
| --- | --- | --- | --- |
| 1024px and above | Three columns | Sticky sidebar | 48% / 52% split |
| 960–1023px | Three columns | Scrolling buttons | 48% / 52% split |
| 768–959px | Two columns | Scrolling buttons | Stacked |
| 640–767px | Two columns | Full-width select | Stacked |
| Below 640px | One column | Full-width select | Stacked |

Included / not modeled retains two equal columns from 640px and stacks below. Formula text and long source links can wrap within the panel.

## E. Shared component cleanup

Added semantic aliases for existing palette/surface tokens and a card radius token. New styles are scoped to learning cards, the mortgage demo grid and the explanation page. Shared PageHero, CalculatorCard, GuideCard, GuidePreview, footer and navigation components were not modified.

## F. Accessibility

Native navigation buttons support Tab and Enter/Space, expose selection through `aria-pressed`, and identify the controlled panel. Focus remains on the selected button. The updated heading announces the calculator name politely and labels the article. Mobile select retains its visible label. Existing visible focus styles apply; categories also have text labels, and preview values use foreground text color.

## G. Browser tests

Added `tests/e2e/final-ui-polish.spec.ts`, covering 1440, 1280, 1024, 900, 768, 430, 390 and 375px. Checks include equal card/preview heights, CTA alignment, grid column counts, nested content overflow, mortgage panel alignment, responsive navigation, keyboard selection, panel/CTA updates, bounded detail width and desktop spacing. Updated the existing content test to use desktop calculator navigation.

## H. Verification results

- `npm test`: 311 tests passed across 11 files.
- `npm run lint`: passed, including after final refinements.
- `npx tsc --noEmit`: passed, including after final refinements.
- `npx next build --webpack`: passed, including after final refinements.
- `npm run test:e2e`: all 54 tests passed.
- Final spacing refinements: reran the 8 breakpoint tests and 8 shared hero tests against the rebuilt production application; all 16 passed.

Screenshots were visually reviewed for desktop/sidebar density, tablet hero composition, mobile stacking, readable preview metrics and the mortgage workspace. Learning-card crops hide the sticky header during capture so it cannot obscure the content. Browser execution required permission to bind the local test server because the sandbox initially returned EPERM. Tests ran in Chrome; other browser engines were not tested.

## I. Screenshots

Artifacts are saved under `output/playwright/final-ui/`:

- `home-1440.png`, `home-1024.png`, `home-390.png` (full page)
- `learning-1440.png`, `learning-1024.png`, `learning-390.png` (learning section)
- `how-it-works-1440.png`, `how-it-works-1280.png`, `how-it-works-1024.png`, `how-it-works-768.png`, `how-it-works-390.png` (full page)

## J. Intentionally unchanged

Financial formulas, calculator behavior and inputs, guide prose and examples, source data, SEO metadata, URLs, calculator/guide page architecture, approved directory layouts, brand colors, logo, primary navigation and footer. No dependencies added and no deployment performed. The starting working tree already contained extensive uncommitted application work; this pass preserves it.
