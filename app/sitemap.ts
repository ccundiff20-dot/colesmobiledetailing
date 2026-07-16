import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://colesmobiledetail.com";
  return ["/","/services","/ceramic-coatings","/paint-correction","/rv-marine","/fleet","/gallery","/about","/book"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : .8 }));
}
