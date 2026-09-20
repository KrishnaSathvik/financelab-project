import { ImageResponse } from "next/og";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { calculatorSlugs } from "@/lib/calculators/catalog";
import { SITE_NAME } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

function publicPng(name: string) {
  return readFileSync(join(process.cwd(), "public", name));
}

function pngDataUri(name: string) {
  return `data:image/png;base64,${publicPng(name).toString("base64")}`;
}

function BrandMark() {
  return <img src={pngDataUri("logo.png")} width={56} height={56} alt="" />;
}

export function OgCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#FFFFFF",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <BrandMark />
        <div style={{ fontSize: 28, fontWeight: 600, color: "#0F172A" }}>{SITE_NAME}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#0F172A", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#64748B", lineHeight: 1.4, maxWidth: 900 }}>{description}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ fontSize: 24, color: "#2563EB", fontWeight: 600 }}>moneybasis.app</div>
        <svg width="220" height="72" viewBox="0 0 220 72">
          <path d="M8 58 L48 36 L86 44 L128 18 L212 28" fill="none" stroke="#BFDBFE" strokeWidth="8" />
          <path d="M8 58 L48 36 L86 44 L128 18 L212 28 V68 H8 Z" fill="#EFF6FF" />
        </svg>
      </div>
    </div>
  );
}

export function renderOgImage(title: string, description: string) {
  return new ImageResponse(<OgCard title={title} description={description} />, {
    ...ogSize,
  });
}

export function renderCalculatorOgImage(slug: string, title: string, description: string) {
  const isCalculator = (calculatorSlugs as readonly string[]).includes(slug);
  const relative = `og/${slug}.png`;
  const path = join(process.cwd(), "public", relative);
  if (!isCalculator || !existsSync(path)) {
    return renderOgImage(title, description);
  }

  return new Response(publicPng(relative), {
    headers: {
      "Content-Type": "image/png",
    },
  });
}

function iconAsset(size: number) {
  if (size <= 32) return "favicon-32x32.png";
  if (size <= 192) return "apple-touch-icon.png";
  return "android-chrome-512x512.png";
}

export function renderIcon(size: number) {
  const src = pngDataUri(iconAsset(size));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
        }}
      >
        <img src={src} width={size} height={size} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
