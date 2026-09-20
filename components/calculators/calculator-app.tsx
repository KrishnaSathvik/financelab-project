import { BudgetCalculator } from "@/components/calculators/budget-calculator";
import { DebtSnowballCalculator } from "@/components/calculators/debt-snowball-calculator";
import { InvestmentCalculator } from "@/components/calculators/investment-calculator";
import { LoanPayoffCalculator } from "@/components/calculators/loan-payoff-calculator";
import { MortgageCalculator } from "@/components/calculators/mortgage-calculator";
import { NetWorthCalculator } from "@/components/calculators/net-worth-calculator";
import { RentVsBuyCalculator } from "@/components/calculators/rent-vs-buy-calculator";
import { RetirementCalculator } from "@/components/calculators/retirement-calculator";
import { SalaryCalculator } from "@/components/calculators/salary-calculator";
import { SavingsGoalCalculator } from "@/components/calculators/savings-goal-calculator";
import type { CalculatorSlug } from "@/lib/calculators/catalog";

export function CalculatorApp({ slug }: { slug: CalculatorSlug }) {
  switch (slug) {
    case "mortgage":
      return <MortgageCalculator />;
    case "compound-interest":
      return <InvestmentCalculator />;
    case "salary-hourly":
      return <SalaryCalculator />;
    case "loan-payoff":
      return <LoanPayoffCalculator />;
    case "net-worth":
      return <NetWorthCalculator />;
    case "budget":
      return <BudgetCalculator />;
    case "retirement":
      return <RetirementCalculator />;
    case "savings-goal":
      return <SavingsGoalCalculator />;
    case "debt-snowball":
      return <DebtSnowballCalculator />;
    case "rent-vs-buy":
      return <RentVsBuyCalculator />;
    default: {
      const exhaustive: never = slug;
      throw new Error(`Unhandled calculator: ${exhaustive}`);
    }
  }
}
