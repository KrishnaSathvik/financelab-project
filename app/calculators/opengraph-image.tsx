import { renderOgImage } from "@/lib/og";

export const alt = "MoneyBasis financial calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("Financial Calculators", "Mortgage, investing, retirement, debt, savings and more.");
}
