import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Smasheat · Smash Burgers in Patras",
    short_name: "Smasheat",
    description: "Smash burgers, loaded fries and house dips at Notara 60, Patras.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4E6",
    theme_color: "#FFF4E6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
