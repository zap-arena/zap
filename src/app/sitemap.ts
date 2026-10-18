import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://codezap.in";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/contests`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/codewar`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/curriculum/dsa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // DSA guide routes (19 guides)
  const doneGuides = [
    "sql",
    "ai-basics",
    "api-basics",
    "oops",
    "oops-visual",
    "django-react-guide",
    "flask-api-guide",
    "sdlc",
    "linked-list",
    "stack",
    "queue",
    "trees",
    "graphs",
    "hashing",
    "two-pointer",
    "sliding-window",
    "recursion",
    "dp-1d",
    "dp-2d",
  ];

  const guideRoutes: MetadataRoute.Sitemap = doneGuides.map((guide) => ({
    url: `${baseUrl}/curriculum/dsa/${guide}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...guideRoutes];
}
