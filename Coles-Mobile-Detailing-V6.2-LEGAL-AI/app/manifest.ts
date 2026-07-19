import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cole's Mobile Detailing",
    short_name: "Cole's Detailing",
    description: "Premium mobile detailing across Evansville, Newburgh, and Southern Indiana.",
    start_url: "/",
    display: "standalone",
    background_color: "#070707",
    theme_color: "#b11217",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
