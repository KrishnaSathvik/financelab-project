import {
  ChartNoAxesCombined,
  CircleDollarSign,
  House,
  Landmark,
  Palmtree as PalmTree,
  PieChart,
  Scale,
  Target,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { CalculatorSlug } from "@/lib/calculators/catalog";

export const calculatorIcons: Record<CalculatorSlug, LucideIcon> = {
  mortgage: House,
  "compound-interest": TrendingUp,
  "salary-hourly": WalletCards,
  "loan-payoff": Landmark,
  "net-worth": ChartNoAxesCombined,
  budget: PieChart,
  retirement: PalmTree,
  "savings-goal": Target,
  "debt-snowball": CircleDollarSign,
  "rent-vs-buy": Scale,
};
