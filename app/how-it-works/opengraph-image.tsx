import { renderOgImage } from "@/lib/og";

export const alt = "MoneyBasis calculation explanations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(
    "How it works",
    "Formulas, assumptions, limitations and sources.",
  );
}
