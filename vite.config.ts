import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  // 🔹 Base path per GitHub Pages
  base: mode === "production" ? "/feedback-fort/" : "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),

    // Attiva tagging componenti solo in dev
    mode === "development" && componentTagger(),

    // 🔹 Configurazione PWA
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "pwa-512x512-maskable.png",
      ],

      // 🧩 Manifest PWA
      manifest: {
        name: "FeedbackFort",
        short_name: "FeedbackFort",
        description: "Sistema di gestione e analisi questionari",
        lang: "it",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/feedback-fort/",
        start_url: "/feedback-fort/index.html",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      // 🔹 Configurazione del service worker Workbox
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      // 🔹 Abilita PWA anche in dev (utile per test)
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));