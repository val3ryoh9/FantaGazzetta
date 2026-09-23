import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // sw.js lo registra OneSignal (serviceWorkerPath in App/utils.js): una
      // seconda registrazione senza i suoi parametri lo sovrascriverebbe
      injectRegister: false,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "FantaGazzetta",
        short_name: "Magazine",
        description: "Magazine FantaGazzetta",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  server: { port: 5173 },
});
