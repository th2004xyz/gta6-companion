import type { MetadataRoute } from "next";

// robots.txt：允许全部爬取，屏蔽 API 路由与内部资源
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://gta6-companion.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
