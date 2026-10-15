import type { MetadataRoute } from "next";
import { site } from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.tokenName} — ${site.ticker} Presale`,
    short_name: "1WIN",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080506",
    theme_color: "#e50914",
    categories: ["finance"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
