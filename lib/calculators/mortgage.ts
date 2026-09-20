import { amortizingPayment } from "@/lib/finance";
import { yearsToMonths } from "@/lib/calendar";
import { assertValid } from "@/lib/validation/index";
export type MortgageInput = {
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  termYears: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  monthlyHoa?: number;
  monthlyPmi?: number;
};

export type MortgageYearRow = {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export type MortgageResult = {
  status: "amortizing" | "no-loan";
  loanAmount: number;
  downPaymentPercent: number;
  monthlyPayment: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  estimatedMonthlyCost: number;
  hasExtraCosts: boolean;
  totalInterest: number;
  totalCost: number;
  years: MortgageYearRow[];
  months: MortgageYearRow[];
};

export function calculateMortgage(input: MortgageInput): MortgageResult {
  assertValid("mortgage", input);
  const loanAmount = input.homePrice - input.downPayment;
  const downPaymentPercent =
    input.homePrice > 0 ? (input.downPayment / input.homePrice) * 100 : 0;
  const monthlyRate = input.annualRatePercent / 100 / 12;
  const periods = yearsToMonths(input.termYears);
  const monthlyPayment = amortizingPayment(loanAmount, monthlyRate, periods);
  const monthlyPropertyTax = (input.annualPropertyTax ?? 0) / 12;
  const monthlyInsurance = (input.annualInsurance ?? 0) / 12;
  const monthlyHoa = input.monthlyHoa ?? 0;
  const monthlyPmi = input.monthlyPmi ?? 0;
  const estimatedMonthlyCost =
    monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyHoa + monthlyPmi;

  const years: MortgageYearRow[] = [];
  const months: MortgageYearRow[] = [];
  let balance = loanAmount;

  for (let month = 1; month <= periods && loanAmount > 0; month++) {
    const interest = balance * monthlyRate;
    const principal = month === periods ? balance : Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - principal);
    months.push({ year: month, payment: principal + interest, principal, interest, balance });
    const year = Math.ceil(month / 12);
    let row = years[year - 1];
    if (!row) { row = { year, payment: 0, principal: 0, interest: 0, balance: 0 }; years.push(row); }
    row.payment += principal + interest;
    row.principal += principal;
    row.interest += interest;
    row.balance = balance;
  }
  const totalInterest = months.reduce((sum, row) => sum + row.interest, 0);

  return {
    status: loanAmount === 0 ? "no-loan" : "amortizing",
    loanAmount,
    downPaymentPercent,
    monthlyPayment,
    monthlyPrincipalAndInterest: monthlyPayment,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyPmi,
    estimatedMonthlyCost,
    hasExtraCosts: monthlyPropertyTax + monthlyInsurance + monthlyHoa + monthlyPmi > 0,
    totalInterest,
    totalCost: loanAmount + totalInterest,
    years,
    months,
  };
}
