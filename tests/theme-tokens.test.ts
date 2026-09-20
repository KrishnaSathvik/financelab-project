import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
const dark = css.slice(css.indexOf(".dark {"), css.indexOf("@theme inline"));

const required = [
  "--bg",
  "--surface",
  "--surface-subtle",
  "--surface-raised",
  "--text",
  "--text-secondary",
  "--text-tertiary",
  "--text-inverse",
  "--border",
  "--border-strong",
  "--brand",
  "--brand-hover",
  "--brand-soft",
  "--brand-border",
  "--focus",
  "--shadow-sm",
  "--shadow-md",
  "--home",
  "--growth",
  "--retirement",
  "--savings",
  "--budget",
  "--salary",
  "--loan",
  "--debt",
  "--net-worth",
  "--comparison",
  "--home-soft",
  "--growth-soft",
  "--chart-primary",
  "--chart-growth",
  "--chart-cost",
  "--chart-neutral",
  "--chart-grid",
  "--chart-axis",
  "--chart-tooltip-bg",
  "--success",
  "--warning",
  "--error",
];

const coolNeutrals = [
  "#f7f8fa",
  "#f2f4f7",
  "#e3e7ed",
  "#cbd2dc",
  "#5f6b7a",
  "#8a94a3",
  "#111318",
  "#090a0b",
  "#111214",
  "#17181b",
  "#a6afbc",
  "#747d89",
  "#14213d",
  "#64748b",
  "#94a3b8",
];

describe("design tokens", () => {
  it("declares the semantic light and dark families", () => {
    for (const token of required) {
      expect(root, token).toContain(`${token}:`);
      expect(dark.includes(`${token}:`) || root.includes(`${token}:`), token).toBe(true);
    }
  });

  it("uses true-neutral black/white/gray canvases instead of cool slate", () => {
    expect(root).toMatch(/--bg:\s*#ffffff/i);
    expect(root).toMatch(/--surface:\s*#ffffff/i);
    expect(root).toMatch(/--surface-subtle:\s*#f5f5f4/i);
    expect(root).toMatch(/--text:\s*#111111/i);
    expect(root).toMatch(/--text-secondary:\s*#666666/i);
    expect(root).toMatch(/--text-tertiary:\s*#8a8a8a/i);
    expect(root).toMatch(/--border:\s*#e5e5e5/i);
    expect(root).toMatch(/--brand:\s*#111111/i);
    expect(root).toMatch(/--chart-primary:\s*#2563eb/i);
    expect(dark).toMatch(/--bg:\s*#0a0a0a/i);
    expect(dark).toMatch(/--surface:\s*#121212/i);
    expect(dark).toMatch(/--surface-subtle:\s*#181818/i);
    expect(dark).toMatch(/--text:\s*#fafafa/i);
    expect(dark).toMatch(/--text-secondary:\s*#b3b3b3/i);
    expect(dark).toMatch(/--border:\s*#262626/i);
    expect(dark).not.toMatch(/--bg:\s*#0b1220/i);
    expect(dark).not.toMatch(/--surface:\s*#111827/i);
    expect(dark).not.toMatch(/--bg:\s*#090a0b/i);
    for (const value of coolNeutrals) {
      expect(root.toLowerCase(), value).not.toContain(value);
      expect(dark.toLowerCase(), value).not.toContain(value);
    }
  });

  it("keeps brand-soft as a tiny-state token, not a navy panel", () => {
    expect(root).toMatch(/--brand-soft:\s*#f5f5f4/i);
    expect(dark).toMatch(/--brand-soft:\s*#181818/i);
    expect(dark).toMatch(/--brand:\s*#fafafa/i);
    expect(dark).not.toMatch(/--brand-soft:\s*#14213d/i);
    expect(dark).not.toMatch(/--home-soft:\s*#eff6ff/i);
  });

  it("constrains category tints to icon chips", () => {
    expect(css).toContain(".icon-chip");
    expect(css).toMatch(/\.icon-chip[\s\S]*width:\s*36px/);
    expect(css).toMatch(/\.icon-chip[\s\S]*height:\s*36px/);
  });
});
