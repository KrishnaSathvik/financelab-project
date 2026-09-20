import { renderOgImage } from "@/lib/og";

export const alt = "MoneyBasis guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("Guides", "Clear explanations connected to MoneyBasis calculators.");
}
