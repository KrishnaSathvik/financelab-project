export type FilingStatus = "single" | "mfj" | "hoh";

export type TaxBracket = {
  rate: number;
  cap: number;
};

export type TaxYearData = {
  year: number;
  source: string;
  sources: { id: string; title: string; url: string; verifiedAt: string }[];
  standardDeduction: Record<FilingStatus, number>;
  brackets: Record<FilingStatus, TaxBracket[]>;
  socialSecurityWageBase: number;
  socialSecurityRate: number;
  medicareRate: number;
};
