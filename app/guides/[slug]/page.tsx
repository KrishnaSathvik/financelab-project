import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guide/article";
import { JsonLd } from "@/components/seo/json-ld";
import { getGuide, guideList } from "@/lib/guides/catalog";
import { financialSources } from "@/lib/sources";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guideList.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: { canonical: guide.href },
    openGraph: {
      type: "article",
      title: `${guide.seoTitle} | ${SITE_NAME}`,
      description: guide.description,
      url: guide.href,
      modifiedTime: guide.reviewedAt,
      section: guide.category,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogHeadline,
      description: guide.ogSubheadline,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          dateModified: guide.reviewedAt,
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
          mainEntityOfPage: `${SITE_URL}${guide.href}`,
          image: `${SITE_URL}${guide.href}/opengraph-image`,
          articleSection: guide.category,
          inLanguage: "en-US",
          isAccessibleForFree: true,
          citation: guide.sourceIds.map((key) => financialSources[key].url),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { name: "Home", item: SITE_URL },
            { name: "Guides", item: `${SITE_URL}/guides` },
            { name: guide.title, item: `${SITE_URL}${guide.href}` },
          ].map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
        }}
      />
      <GuideArticle guide={guide} />
    </>
  );
}
