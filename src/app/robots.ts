import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/contests", "/codewar", "/curriculum", "/quizzes"],
        disallow: ["/admin", "/profile", "/api"],
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: "https://codezap.in/sitemap.xml",
  };
}
