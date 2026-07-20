import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://colesmobiledetail.com";
  const pages = [
    "/",
    "/services",
    "/ceramic-coatings",
    "/ceramic-care",
    "/paint-correction",
    "/rv-marine",
    "/fleet",
    "/gallery",
    "/about",
    "/book",
    "/privacy",
    "/terms",
    "/ai-disclosure",
    "/sms-alerts",
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/book" ? 0.9 : 0.7,
  }));
}
