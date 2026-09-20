import { amortizingPayment } from "@/lib/finance";
import { yearsToMonths } from "@/lib/calendar";
import { assertValid } from "@/lib/validation/index";
export type RentVsBuyInput = {
  homePrice: number;
  downPaymentPercent: number;
  mortgageRatePercent: number;
  monthlyRent: number;
  appreciationPercent: number;
  investmentReturnPercent: number;
  rentIncreasePercent: number;
  loanTermYears?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  annualMaintenance?: number;
  closingCostPercent?: number;
  monthlyRenterInsurance?: number;
  yearsToStay?: number;
};

export type RentVsBuyCostRow = {
  label: string;
  buy: number;
  rent: number;
};

export type RentVsBuyResult = {
  monthlyMortgage: number;
  downPayment: number;
  closingCosts: number;
  breakevenYear: number | null;
  yearsToStay: number;
  buyAtHorizon: number;
  rentAtHorizon: number;
  difference: number;
  buyAt10: number;
  rentAt10: number;
  costRows: RentVsBuyCostRow[];
  ledger: { month: number; mortgagePayment: number; loanBalance: number; homeValue: number; ownerPortfolio: number; renterPortfolio: number; ownerCost: number; renterCost: number; ownerDeposit: number; renterDeposit: number }[];
  series: { year: number; buyNetWorth: number; rentNetWorth: number }[];
};

export const RENT_VS_BUY_ASSUMPTIONS = {
  closingCostPercent: 0.03,
  annualPropertyTaxRate: 0.012,
  annualInsuranceRate: 0.005,
  annualMaintenanceRate: 0.01,
  loanTermYears: 30,
} as const;

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  assertValid("rent-buy", input);
  const termYears = input.loanTermYears ?? RENT_VS_BUY_ASSUMPTIONS.loanTermYears;
  const yearsToStay = input.yearsToStay ?? 10;
  const closingPercent =
    input.closingCostPercent !== undefined
      ? input.closingCostPercent / 100
      : RENT_VS_BUY_ASSUMPTIONS.closingCostPercent;
  const downPayment = (input.homePrice * input.downPaymentPercent) / 100;
  const closingCosts = input.homePrice * closingPercent;
  const loan = input.homePrice - downPayment;
  const monthlyRate = input.mortgageRatePercent / 100 / 12;
  const periods = yearsToMonths(termYears);
  const monthlyMortgage = amortizingPayment(loan, monthlyRate, periods);

  const annualPropertyTax = input.annualPropertyTax ?? input.homePrice * RENT_VS_BUY_ASSUMPTIONS.annualPropertyTaxRate;
  const annualInsurance = input.annualInsurance ?? input.homePrice * RENT_VS_BUY_ASSUMPTIONS.annualInsuranceRate;
  const annualMaintenance = input.annualMaintenance ?? input.homePrice * RENT_VS_BUY_ASSUMPTIONS.annualMaintenanceRate;
  const monthlyRenterInsurance = input.monthlyRenterInsurance ?? 20;
  const investmentRate = input.investmentReturnPercent / 100 / 12;
  const horizonYears = Math.max(yearsToStay, 30);

  const series: RentVsBuyResult["series"] = [{ year: 0, buyNetWorth: downPayment, rentNetWorth: downPayment + closingCosts }];
  const ledger: RentVsBuyResult["ledger"] = [];
  let ownerPortfolio = 0;
  let homeValue = input.homePrice;
  let loanBalance = loan;
  let renterPortfolio = downPayment + closingCosts;
  let currentRent = input.monthlyRent;
  let breakevenYear: number | null = null;
  let mortgagePaid = 0;
  let propertyTaxPaid = 0;
  let insurancePaid = 0;
  let maintenancePaid = 0;
  let rentPaid = 0;
  let renterInsurancePaid = 0;

  const horizonMonths = yearsToMonths(horizonYears);
  const selectedMonths = yearsToMonths(yearsToStay);
  for (let month = 1; month <= horizonMonths; month++) {
    const completedYears = Math.floor((month - 1) / 12);
    const costFactor = (1 + input.appreciationPercent / 100) ** completedYears;
    const propertyTax = annualPropertyTax / 12 * costFactor;
    const insurance = annualInsurance / 12 * costFactor;
    const maintenance = annualMaintenance / 12 * costFactor;
    currentRent = input.monthlyRent * (1 + input.rentIncreasePercent / 100) ** completedYears;
    const interest = loanBalance * monthlyRate;
    const actualPayment = month === periods ? loanBalance + interest : Math.min(monthlyMortgage, loanBalance + interest);
    loanBalance = Math.max(0, loanBalance + interest - actualPayment);
    const ownerCost = actualPayment + propertyTax + insurance + maintenance;
    const renterCost = currentRent + monthlyRenterInsurance;
    const renterDeposit = Math.max(0, ownerCost - renterCost);
    const ownerDeposit = Math.max(0, renterCost - ownerCost);
    renterPortfolio = renterPortfolio * (1 + investmentRate) + renterDeposit;
    ownerPortfolio = ownerPortfolio * (1 + investmentRate) + ownerDeposit;
    homeValue = input.homePrice * (1 + input.appreciationPercent / 100) ** (month / 12);
    ledger.push({ month, mortgagePayment: actualPayment, loanBalance, homeValue, ownerPortfolio, renterPortfolio, ownerCost, renterCost, ownerDeposit, renterDeposit });
    if (month <= selectedMonths) {
      mortgagePaid += actualPayment; propertyTaxPaid += propertyTax; insurancePaid += insurance; maintenancePaid += maintenance; rentPaid += currentRent; renterInsurancePaid += monthlyRenterInsurance;
    }
    if (month % 12 === 0 || month === selectedMonths || month === horizonMonths) {
      const buyNetWorth = homeValue - loanBalance + ownerPortfolio;
      series.push({ year: month / 12, buyNetWorth, rentNetWorth: renterPortfolio });
      if (breakevenYear === null && buyNetWorth > renterPortfolio) breakevenYear = month / 12;
    }
  }

  const horizon = series.find(p => p.year === yearsToStay) ?? series[series.length - 1];
  const buyAtHorizon = horizon?.buyNetWorth ?? 0;
  const rentAtHorizon = horizon?.rentNetWorth ?? 0;

  return {
    ledger,
    monthlyMortgage,
    downPayment,
    closingCosts,
    breakevenYear,
    yearsToStay,
    buyAtHorizon,
    rentAtHorizon,
    difference: buyAtHorizon - rentAtHorizon,
    buyAt10: series.find(p => p.year === 10)?.buyNetWorth ?? 0,
    rentAt10: series.find(p => p.year === 10)?.rentNetWorth ?? 0,
    costRows: [
      { label: "Down payment", buy: downPayment, rent: 0 },
      { label: "Closing costs", buy: closingCosts, rent: 0 },
      { label: "Mortgage payments", buy: mortgagePaid, rent: 0 },
      { label: "Property tax", buy: propertyTaxPaid, rent: 0 },
      { label: "Home insurance", buy: insurancePaid, rent: 0 },
      { label: "Maintenance", buy: maintenancePaid, rent: 0 },
      { label: "Rent payments", buy: 0, rent: rentPaid },
      { label: "Renter insurance", buy: 0, rent: renterInsurancePaid },
      { label: "Invested upfront difference", buy: 0, rent: downPayment + closingCosts },
    ],
    series,
  };
}
