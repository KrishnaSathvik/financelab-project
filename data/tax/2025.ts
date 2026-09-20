import { sourceLinks } from "@/lib/sources";
import type { TaxYearData } from "./types";

/** IRS Revenue Procedure 2024-40 / OBBB 2025 standard deduction amounts. */
export const tax2025: TaxYearData = {
  year: 2025,
  sources: sourceLinks("irs2025", "irs2026", "ssa", "medicare"),
  source: "IRS Revenue Procedure 2024-40; OBBB 2025 standard deduction amounts",
  standardDeduction: {
    single: 15_750,
    mfj: 31_500,
    hoh: 23_625,
  },
  brackets: {
    single: [
      { rate: 0.1, cap: 11_925 },
      { rate: 0.12, cap: 48_475 },
      { rate: 0.22, cap: 103_350 },
      { rate: 0.24, cap: 197_300 },
      { rate: 0.32, cap: 250_525 },
      { rate: 0.35, cap: 626_350 },
      { rate: 0.37, cap: Number.POSITIVE_INFINITY },
    ],
    mfj: [
      { rate: 0.1, cap: 23_850 },
      { rate: 0.12, cap: 96_950 },
      { rate: 0.22, cap: 206_700 },
      { rate: 0.24, cap: 394_600 },
      { rate: 0.32, cap: 501_050 },
      { rate: 0.35, cap: 751_600 },
      { rate: 0.37, cap: Number.POSITIVE_INFINITY },
    ],
    hoh: [
      { rate: 0.1, cap: 17_000 },
      { rate: 0.12, cap: 64_850 },
      { rate: 0.22, cap: 103_350 },
      { rate: 0.24, cap: 197_300 },
      { rate: 0.32, cap: 250_500 },
      { rate: 0.35, cap: 626_350 },
      { rate: 0.37, cap: Number.POSITIVE_INFINITY },
    ],
  },
  socialSecurityWageBase: 176_100,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
};
