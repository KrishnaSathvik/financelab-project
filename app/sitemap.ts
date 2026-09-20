import type { MetadataRoute } from "next";
import { calculatorList } from "@/lib/calculators/catalog";
import { guideList } from "@/lib/guides/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/calculators",
    "/guides",
    "/how-it-works",
    "/sources",
    "/privacy",
    "/about",
    "/disclaimer",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date("2026-09-17"),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...calculatorList.map((calculator) => ({
      url: `${SITE_URL}${calculator.href}`,
      lastModified: new Date("2026-09-17"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...guideList.map((guide) => ({
      url: `${SITE_URL}${guide.href}`,
      lastModified: new Date(guide.reviewedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
