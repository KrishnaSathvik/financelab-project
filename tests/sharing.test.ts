import { describe, expect, it } from "vitest";
import { matchesSharedInput } from "@/lib/use-shared-inputs";
import { decodeSharePayload, encodeSharePayload } from "@/lib/persistence";

describe("shared calculator inputs", () => {
  it("round trips named scenarios and fractional mortgage rates", () => {
    const payload = { goalName: "Home 🏡", mortgageRatePercent: 6.5, yearsToStay: 10 };
    const decoded = decodeSharePayload(encodeSharePayload(payload));
    expect(decoded).toEqual(payload);
    expect(matchesSharedInput(decoded, payload)).toBe(true);
  });
  it("rejects malformed fields and excessive projection horizons", () => {
    expect(matchesSharedInput({ years: 10000 }, { years: 30 })).toBe(false);
    expect(matchesSharedInput({ years: "30" }, { years: 30 })).toBe(false);
    expect(matchesSharedInput({ currentAge: -1 }, { currentAge: 30 })).toBe(false);
    expect(matchesSharedInput({ filingStatus: "invalid" }, { filingStatus: "single" })).toBe(false);
    expect(matchesSharedInput({ filingStatus: "mfj" }, { filingStatus: "single" })).toBe(true);
    expect(decodeSharePayload("not-json")).toBeNull();
  });
  it("checks editable rows before restoring them", () => {
    const schema = { categories: [{ name: "Housing", amount: 1000 }] };
    expect(matchesSharedInput({ categories: [{ name: "Food", amount: 400 }] }, schema)).toBe(true);
    expect(matchesSharedInput({ categories: [{ name: "Food" }] }, schema)).toBe(false);
    expect(matchesSharedInput({ categories: [] }, schema)).toBe(true);
  });
});
