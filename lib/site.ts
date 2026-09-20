export const SITE_NAME = "MoneyBasis";
export const SITE_TAGLINE = "Clear tools for everyday money decisions.";
export const SITE_HERO = "Understand the numbers behind your money.";
export const SITE_SUPPORTING =
  "Free calculators for mortgages, investing, retirement, budgeting, debt, savings and everyday financial decisions.";
export const SITE_TITLE =
  "MoneyBasis — Free Financial Calculators for Everyday Money Decisions";
export const SITE_DESCRIPTION =
  "Free calculators for mortgages, investing, retirement, budgeting, debt, savings and more. Clear results, transparent formulas and no account required.";
export const SITE_SHORT_DESCRIPTION =
  "MoneyBasis provides free financial calculators for everyday money decisions.";
export const SITE_STANDARD_DESCRIPTION =
  "MoneyBasis is a free, privacy-first collection of financial calculators for mortgages, investing, retirement, budgeting, debt, savings and everyday money planning. Calculations are designed to be clear, transparent and easy to understand.";
export const SITE_LONG_DESCRIPTION =
  "MoneyBasis helps people understand the numbers behind everyday financial decisions through free interactive calculators, visual breakdowns and transparent calculations. Explore mortgage payments, investment growth, retirement savings, debt payoff, budgeting, net worth, savings goals and rent-versus-buy scenarios without creating an account.";
export const SITE_TRUST_LINE =
  "Free · Private · No account required · Transparent calculations";
export const SITE_PRIVACY_LINE =
  "Standard calculator inputs are processed locally in your browser. No account is required.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moneybasis.app";
export const GITHUB_URL =
  "https://github.com/KrishnaSathvik/financelab-project";
export const AUTHOR_NAME = "Krishna Sathvik";
export const TAX_YEAR = 2026;
export const DISCLAIMER_LINE =
  "Educational estimates only. MoneyBasis does not provide financial, investment, tax or legal advice.";
export const THEME_COLOR = "#FFFFFF";
export const BRAND_BLUE = "#2563EB";

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
