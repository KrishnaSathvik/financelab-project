"use client";

import { useCallback, useState } from "react";

export function useCalculatorFlow() {
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculate = useCallback(() => {
    setHasCalculated(true);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    const scrollToCharts = () => {
      document.querySelector(".calculator-summary")?.scrollIntoView({ behavior, block: "start" });
    };
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToCharts);
    });
  }, []);

  const markReset = useCallback(() => {
    setHasCalculated(false);
  }, []);

  return { hasCalculated, calculate, markReset };
}
