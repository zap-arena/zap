import { Metadata } from "next";

export interface PageMetadataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
}

/**
 * Generate comprehensive metadata for pages with OG and Twitter cards
 */
export function generatePageMetadata(props: PageMetadataProps): Metadata {
  const {
    title,
    description,
    image = "/og-image.png",
    url = "https://codezap.in",
    type = "website",
    author,
    publishedAt,
    updatedAt,
  } = props;

  const fullTitle = `${title} | ZAP - CodeZap.in`;

  return {
    title: fullTitle,
    description,
    keywords: ["DSA", "algorithms", "data structures", "coding"],
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: "ZAP - CodeZap.in",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Metadata for contest pages
 */
export function getContestMetadata(
  contestName: string,
  contestSlug: string,
  description: string,
  imageUrl?: string
): Metadata {
  const url = `https://codezap.in/contests/${contestSlug}`;
  return generatePageMetadata({
    title: contestName,
    description,
    image: imageUrl,
    url,
    type: "article",
  });
}

/**
 * Metadata for quiz pages
 */
export function getQuizMetadata(
  quizTitle: string,
  quizId: string,
  description: string,
  difficulty?: string
): Metadata {
  const url = `https://codezap.in/quizzes/${quizId}`;
  const fullDescription = difficulty
    ? `${description} (${difficulty})`
    : description;

  return generatePageMetadata({
    title: quizTitle,
    description: fullDescription,
    url,
    type: "article",
  });
}

/**
 * Metadata for DSA guide pages
 */
export function getGuideMetadata(
  guideName: string,
  guideSlug: string,
  description: string,
  imageUrl?: string
): Metadata {
  const url = `https://codezap.in/curriculum/dsa/${guideSlug}`;
  return generatePageMetadata({
    title: guideName,
    description,
    image: imageUrl,
    url,
    type: "article",
    author: "ZAP Learning",
  });
}

/**
 * Metadata for user profile pages
 */
export function getProfileMetadata(
  username: string,
  bio: string,
  imageUrl?: string
): Metadata {
  const url = `https://codezap.in/profile/${username}`;
  return generatePageMetadata({
    title: `${username}'s Profile`,
    description: bio || `${username}'s profile on ZAP`,
    image: imageUrl,
    url,
    type: "profile",
  });
}

/**
 * Generate structured data (JSON-LD) for search engines
 */
export function generateStructuredData(
  type: "Organization" | "Course" | "BreadcrumbList" | "FAQPage" | "Article",
  data: Record<string, unknown>
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
}

/**
 * Organization schema for the website
 */
export const organizationSchema = generateStructuredData("Organization", {
  name: "ZAP - CodeZap.in",
  url: "https://codezap.in",
  logo: "https://codezap.in/logo-mark.png",
  description:
    "Interactive DSA learning platform with real-time coding challenges, contests, and AI-guided learning paths.",
  sameAs: [
    "https://twitter.com/codezap",
    "https://github.com/zap-arena/zap",
  ],
});

/**
 * Course schema for guide pages
 */
export function getCourseSchema(
  name: string,
  description: string,
  lessonCount: number
) {
  return generateStructuredData("Course", {
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "ZAP",
      url: "https://codezap.in",
    },
    hasPart: Array.from({ length: lessonCount }, (_, i) => ({
      "@type": "Lesson",
      position: i + 1,
      name: `Lesson ${i + 1}`,
    })),
  });
}

/**
 * BreadcrumbList schema for navigation
 */
export function getBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return generateStructuredData("BreadcrumbList", {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
}

/**
 * Article schema for contest/quiz pages
 */
export function getArticleSchema(
  title: string,
  description: string,
  imageUrl: string,
  publishedAt: string,
  authorName: string = "ZAP"
) {
  return generateStructuredData("Article", {
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
  });
}
