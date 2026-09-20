import { sourceLinks } from "@/lib/sources";
import type { TaxYearData } from "./types";

/**
 * Tax year 2026 federal income tax data.
 * Brackets and standard deductions: IRS Revenue Procedure 2025-32.
 * Social Security wage base: SSA contribution and benefit base for 2026.
 */
export const tax2026: TaxYearData = {
  year: 2026,
  sources: sourceLinks("irs2026", "ssa", "medicare"),
  source:
    "IRS Revenue Procedure 2025-32; SSA contribution and benefit base for 2026",
  standardDeduction: {
    single: 16_100,
    mfj: 32_200,
    hoh: 24_150,
  },
  brackets: {
    single: [
      { rate: 0.1, cap: 12_400 },
      { rate: 0.12, cap: 50_400 },
      { rate: 0.22, cap: 105_700 },
      { rate: 0.24, cap: 201_775 },
      { rate: 0.32, cap: 256_225 },
      { rate: 0.35, cap: 640_600 },
      { rate: 0.37, cap: Number.POSITIVE_INFINITY },
    ],
    mfj: [
      { rate: 0.1, cap: 24_800 },
      { rate: 0.12, cap: 100_800 },
      { rate: 0.22, cap: 211_400 },
      { rate: 0.24, cap: 403_550 },
      { rate: 0.32, cap: 512_450 },
      { rate: 0.35, cap: 768_700 },
      { rate: 0.37, cap: Number.POSITIVE_INFINITY },
    ],
    hoh: [
      { rate: 0.1, cap: 17_700 },
      { rate: 0.12, cap: 67_450 },
      { rate: 0.22, cap: 105_700 },
      { rate: 0.24, cap: 201_750 },
      { rate: 0.32, cap: 256_200 },
      { rate: 0.35, cap: 640_600 },
      { rate: 0.37, cap: Number.POSITIVE_INFINITY },
    ],
  },
  socialSecurityWageBase: 184_500,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
};
