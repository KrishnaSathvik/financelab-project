import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));

describe("responsive container tokens", () => {
  it("declares purpose-based max widths", () => {
    expect(root).toMatch(/--container-wide:\s*1480px/);
    expect(root).toMatch(/--container-product:\s*1440px/);
    expect(root).toMatch(/--container-reference:\s*1180px/);
    expect(root).toMatch(/--container-article:\s*1120px/);
    expect(root).toMatch(/--calculator-form-width:\s*370px/);
    expect(root).toMatch(/--chart-height-lg:\s*380px/);
    expect(root).toMatch(/--chart-height-sm:\s*250px/);
  });

  it("uses fluid wide/product/reference shells instead of a shared 1200px cap", () => {
    expect(css).toMatch(/\.header-inner,\s*\.site-container\s*\{[\s\S]*?width:\s*min\(94vw,\s*var\(--container-wide\)\)/);
    expect(css).toMatch(/\.site-container-product\s*\{[\s\S]*?width:\s*min\(92vw,\s*var\(--container-product\)\)/);
    expect(css).toMatch(/\.site-container-reference\s*\{[\s\S]*?width:\s*min\(92vw,\s*var\(--container-reference\)\)/);
    expect(css).toMatch(/\.guide-page\s*\{[\s\S]*?width:\s*min\(92vw,\s*var\(--container-article\)\)/);
    expect(css).toMatch(/\.trust-page\s*\{[\s\S]*?width:\s*min\(92vw,\s*var\(--container-reference\)\)/);
    expect(css).not.toMatch(/\.site-container\s*\{[\s\S]*?1200px/);
    expect(css).not.toMatch(/\.calculator-workspace\s*\{[\s\S]*?max-width:\s*1180px/);
    expect(css).toMatch(/\.calculator-workspace\s*\{[\s\S]*?align-items:\s*start/);
    expect(css).toMatch(/grid-template-columns:\s*clamp\(330px,\s*26vw,\s*var\(--calculator-form-width\)\)/);
  });

  it("keeps reading widths narrower than product shells", () => {
    expect(css).toMatch(/\.guide-header\s*\{\s*max-width:\s*780px/);
    expect(css).toMatch(/\.trust-hero\s*\{[\s\S]*?max-width:\s*760px/);
    expect(css).toMatch(/\.guide-article p\s*\{[\s\S]*?max-width:\s*68ch/);
  });
});
