import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const out = "output/playwright/neutral-palette-v2";

async function cssVar(page: Page, name: string) {
  const value = await page.evaluate((token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim(), name);
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
  }
  return value.toLowerCase();
}

async function tokenColor(page: Page, name: string) {
  return page.evaluate((token) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${token})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
}

async function canvasColor(page: Page) {
  return page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
}

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate((next) => {
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
  }, theme);
  if (theme === "dark") await expect(page.locator("html")).toHaveClass(/dark/);
  else await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect.poll(async () => cssVar(page, "--bg")).toBe(theme === "dark" ? "#0a0a0a" : "#ffffff");
  const header = page.locator("header").first();
  if (await header.count()) {
    await expect.poll(async () => header.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--surface"));
  }
}

function contrast(rgb: string, against: string) {
  const parse = (value: string) => value.match(/\d+/g)!.slice(0, 3).map(Number);
  const channel = (n: number) => {
    const s = n / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const lum = (value: string) => {
    const [r, g, b] = parse(value);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const [a, b] = [lum(rgb), lum(against)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

test("theme tokens, switch, contrast and surfaces", async ({ page }) => {
  await page.goto("/");
  expect(await cssVar(page, "--bg")).toBe("#ffffff");
  expect(await cssVar(page, "--surface")).toBe("#ffffff");
  expect(await cssVar(page, "--surface-subtle")).toBe("#f5f5f4");
  expect(await cssVar(page, "--brand")).toBe("#111111");
  expect(await canvasColor(page)).toBe(await tokenColor(page, "--bg"));
  const header = page.locator("header").first();
  expect(await header.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--surface"));
  await expect(page.getByRole("link", { name: "Explore calculators" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Find your calculator" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "See the tools" })).toBeVisible();
  await expect(page.getByRole("link", { name: "How it works →" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View all 10 calculators" })).toBeVisible();
  const button = page.getByRole("button", { name: "30 years" });
  expect(contrast(await button.evaluate((el) => getComputedStyle(el).color), await button.evaluate((el) => getComputedStyle(el).backgroundColor))).toBeGreaterThanOrEqual(4.5);

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await cssVar(page, "--bg")).toBe("#0a0a0a");
  expect(await cssVar(page, "--surface")).toBe("#121212");
  await expect.poll(async () => canvasColor(page)).toBe(await tokenColor(page, "--bg"));
  await expect.poll(async () => header.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--surface"));
  expect(contrast(await button.evaluate((el) => getComputedStyle(el).color), await button.evaluate((el) => getComputedStyle(el).backgroundColor))).toBeGreaterThanOrEqual(4.5);

  await page.goto("/calculators");
  const chip = page.locator(".icon-chip.tint-home").first();
  await expect(chip).toBeVisible();
  expect(await chip.evaluate((el) => `${el.clientWidth}x${el.clientHeight}`)).toBe("36x36");
  expect(await chip.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--home-soft"));
});

test("calculator charts, tooltips and icon chips theme correctly", async ({ page }) => {
  await page.goto("/calculators/mortgage");
  const empty = page.locator(".empty-results");
  await expect(empty).toBeVisible();
  expect(await empty.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--surface"));
  expect(await page.locator(".calculator-header").evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--surface"));
  await page.getByRole("button", { name: /^Calculate/ }).click();
  await expect(page.locator(".interactive-chart").first().locator("canvas")).toBeVisible();
  const tooltip = page.locator(".money-tooltip");
  await page.locator(".interactive-chart").first().locator(".chart-stage").focus();
  await page.keyboard.press("Home");
  await expect(tooltip).toBeVisible();
  expect(await tooltip.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--chart-tooltip-bg"));
  expect(await cssVar(page, "--chart-axis")).not.toBe("");
  await setTheme(page, "dark");
  expect(await cssVar(page, "--chart-grid")).toBe("#262626");
  await expect(page.locator(".interactive-chart").first().locator("canvas")).toBeVisible();
  await page.locator(".interactive-chart").first().locator(".chart-stage").focus();
  await page.keyboard.press("Home");
  await expect(tooltip).toBeVisible();
  expect(await tooltip.evaluate((el) => getComputedStyle(el).color)).toBe(await tokenColor(page, "--text"));
});

test("trust and guide surfaces stay neutral in both themes", async ({ page }) => {
  for (const path of ["/privacy", "/sources", "/how-it-works", "/guides/apr-vs-apy"]) {
    await page.goto(path);
    await setTheme(page, "light");
    expect(await canvasColor(page)).toBe(await tokenColor(page, "--bg"));
    await setTheme(page, "dark");
    expect(await cssVar(page, "--bg")).toBe("#0a0a0a");
    expect(await canvasColor(page)).toBe(await tokenColor(page, "--bg"));
  }
  await page.goto("/guides");
  await setTheme(page, "light");
  const preview = page.locator("[data-guide-preview]").first();
  await expect(preview).toBeVisible();
  expect(await preview.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await tokenColor(page, "--surface-subtle"));
});

test("neutral-palette-v2 screenshot matrix", async ({ page }) => {
  test.setTimeout(180000);
  await mkdir(out, { recursive: true });
  const shots: Array<{ path: string; file: string; theme: "light" | "dark"; width: number; prepare?: (page: Page) => Promise<void> }> = [
    { path: "/", file: "home", theme: "light", width: 1440 },
    { path: "/", file: "home", theme: "dark", width: 1440 },
    { path: "/", file: "home", theme: "light", width: 390 },
    { path: "/", file: "home", theme: "dark", width: 390 },
    { path: "/calculators", file: "calculators", theme: "light", width: 1440 },
    { path: "/calculators", file: "calculators", theme: "dark", width: 1440 },
    { path: "/calculators/mortgage", file: "mortgage", theme: "light", width: 1440, prepare: async (p) => { await p.getByRole("button", { name: /^Calculate/ }).click(); } },
    { path: "/calculators/mortgage", file: "mortgage", theme: "dark", width: 1440, prepare: async (p) => { await p.getByRole("button", { name: /^Calculate/ }).click(); } },
    { path: "/calculators/mortgage", file: "mortgage", theme: "light", width: 390, prepare: async (p) => { await p.getByRole("button", { name: /^Calculate/ }).click(); } },
    { path: "/calculators/mortgage", file: "mortgage", theme: "dark", width: 390, prepare: async (p) => { await p.getByRole("button", { name: /^Calculate/ }).click(); } },
    { path: "/calculators/budget", file: "budget", theme: "light", width: 1440, prepare: async (p) => { await p.getByRole("button", { name: /^Calculate/ }).click(); } },
    { path: "/calculators/budget", file: "budget", theme: "dark", width: 1440, prepare: async (p) => { await p.getByRole("button", { name: /^Calculate/ }).click(); } },
    { path: "/guides/apr-vs-apy", file: "guide-apr-apy", theme: "light", width: 1440 },
    { path: "/guides/apr-vs-apy", file: "guide-apr-apy", theme: "dark", width: 1440 },
    { path: "/how-it-works", file: "how-it-works", theme: "light", width: 1440 },
    { path: "/how-it-works", file: "how-it-works", theme: "dark", width: 1440 },
    { path: "/privacy", file: "privacy", theme: "light", width: 1440 },
    { path: "/privacy", file: "privacy", theme: "dark", width: 1440 },
    { path: "/sources", file: "sources", theme: "light", width: 1440 },
    { path: "/sources", file: "sources", theme: "dark", width: 1440 },
  ];
  for (const shot of shots) {
    await page.setViewportSize({ width: shot.width, height: shot.width < 800 ? 844 : 1100 });
    await page.goto(shot.path);
    await setTheme(page, shot.theme);
    if (shot.prepare) await shot.prepare(page);
    const suffix = `${shot.theme}-${shot.width < 800 ? "mobile" : "desktop"}`;
    await page.screenshot({ path: `${out}/${shot.file}-${suffix}.png` });
  }
});
