import { assertValid } from "@/lib/validation/index";
import { getTaxYearData, type FilingStatus, type TaxYearData } from "@/data/tax";

export type SalaryInput = {
  annualSalary?: number;
  hourlyRate?: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  filingStatus: FilingStatus;
  taxYear?: number;
  mode: "salary" | "hourly";
  state?: string;
  traditional401k?: number;
  healthInsurance?: number;
  otherPretax?: number;
};

export type PayPeriodRow = {
  period: string;
  id: "hourly" | "weekly" | "biweekly" | "monthly" | "annual";
  gross: number;
  tax: number;
  net: number;
  isHourly: boolean;
};

export type SalaryResult = {
  taxYear: number;
  annualSalary: number;
  hourlyRate: number;
  standardDeduction: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  stateName: string;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  fica: number;
  totalTax: number;
  netAnnual: number;
  netHourly: number;
  effectiveRate: number;
  pretax: number;
  periods: PayPeriodRow[];
};

export function federalIncomeTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
  data: TaxYearData,
) {
  const brackets = data.brackets[filingStatus];
  let remaining = taxableIncome;
  let tax = 0;
  let previousCap = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, bracket.cap - previousCap);
    tax += slice * bracket.rate;
    remaining -= slice;
    previousCap = bracket.cap;
  }

  return tax;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  assertValid("salary", input);
  const tax = getTaxYearData(input.taxYear);
  const totalHours = input.hoursPerWeek * input.weeksPerYear;
  const annualSalary =
    input.mode === "hourly"
      ? (input.hourlyRate ?? 0) * totalHours
      : (input.annualSalary ?? 0);
  const hourlyRate = totalHours > 0 ? annualSalary / totalHours : 0;
  const traditional401k = input.traditional401k ?? 0;
  const cafeteria = (input.healthInsurance ?? 0) + (input.otherPretax ?? 0);
  const pretax = traditional401k + cafeteria;
  const ficaWages = Math.max(0, annualSalary - cafeteria);
  const federalWages = Math.max(0, annualSalary - pretax);
  const standardDeduction = tax.standardDeduction[input.filingStatus];
  const taxableIncome = Math.max(0, federalWages - standardDeduction);
  const federalTax = federalIncomeTax(taxableIncome, input.filingStatus, tax);
  const stateTax = 0; // State/local taxes excluded; no unsupported blended state rates.
  const socialSecurity =
    Math.min(ficaWages, tax.socialSecurityWageBase) * tax.socialSecurityRate;
  const additionalMedicare = Math.max(0, ficaWages - (input.filingStatus === "mfj" ? 250000 : 200000)) * 0.009;
  const medicare = ficaWages * tax.medicareRate + additionalMedicare;
  const fica = socialSecurity + medicare;
  const totalTax = federalTax + stateTax + fica;
  const netAnnual = annualSalary - pretax - totalTax;
  const netHourly = totalHours > 0 ? netAnnual / totalHours : 0;
  const effectiveRate = annualSalary > 0 ? (totalTax / annualSalary) * 100 : 0;

  const periods: PayPeriodRow[] = [
    { id: "annual", period: "Annual", gross: annualSalary, tax: totalTax, net: netAnnual, isHourly: false },
    { id: "monthly", period: "Monthly", gross: annualSalary / 12, tax: totalTax / 12, net: netAnnual / 12, isHourly: false },
    { id: "biweekly", period: "Biweekly", gross: annualSalary / 26, tax: totalTax / 26, net: netAnnual / 26, isHourly: false },
    { id: "weekly", period: "Weekly", gross: annualSalary / input.weeksPerYear, tax: totalTax / input.weeksPerYear, net: netAnnual / input.weeksPerYear, isHourly: false },
    { id: "hourly", period: "Hourly", gross: hourlyRate, tax: totalHours > 0 ? totalTax / totalHours : 0, net: netHourly, isHourly: true },
  ];

  return {
    taxYear: tax.year,
    annualSalary,
    hourlyRate,
    standardDeduction,
    taxableIncome,
    federalTax,
    stateTax,
    stateName: "State/local taxes excluded",
    socialSecurity,
    medicare,
    additionalMedicare,
    fica,
    totalTax,
    netAnnual,
    netHourly,
    effectiveRate,
    pretax,
    periods,
  };
}
