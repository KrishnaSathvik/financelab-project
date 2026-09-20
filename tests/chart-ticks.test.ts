import { describe, expect, it } from "vitest";
import { markersCollide, temporalTickLimit, temporalTickStep } from "@/lib/chart-data/ticks";

describe("chart tick and annotation helpers", () => {
  it("caps temporal ticks by chart width", () => {
    expect(temporalTickLimit(1200)).toBe(7);
    expect(temporalTickLimit(900)).toBe(7);
    expect(temporalTickLimit(899)).toBe(5);
    expect(temporalTickLimit(650)).toBe(5);
    expect(temporalTickLimit(649)).toBe(4);
    expect(temporalTickLimit(430)).toBe(4);
    expect(temporalTickLimit(429)).toBe(3);
    expect(temporalTickLimit(320)).toBe(3);
  });

  it("uses 5-year steps on a 30-year desktop chart", () => {
    expect(temporalTickStep(30, 7)).toBe(5);
    expect(temporalTickStep(30, 5)).toBe(10);
    expect(temporalTickStep(20, 7)).toBe(5);
    expect(temporalTickStep(4, 7)).toBe(1);
  });

  it("treats markers closer than 80px as colliding", () => {
    expect(markersCollide(400, 470)).toBe(true);
    expect(markersCollide(400, 480)).toBe(false);
    expect(markersCollide(12, 90)).toBe(true);
  });
});
