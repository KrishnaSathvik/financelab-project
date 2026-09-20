import { tax2025 } from "./2025";
import { tax2026 } from "./2026";
import type { TaxYearData } from "./types";

export type { FilingStatus, TaxBracket, TaxYearData } from "./types";

export const CURRENT_TAX_YEAR = 2026;

export const taxYears: Record<number, TaxYearData> = {
  2025: tax2025,
  2026: tax2026,
};

export function getTaxYearData(year = CURRENT_TAX_YEAR): TaxYearData {
  const data = taxYears[year];
  if (!data) {
    throw new Error(`No tax data available for ${year}`);
  }
  return data;
}
