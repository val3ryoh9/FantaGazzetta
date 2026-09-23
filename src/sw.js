import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Senza questi il nuovo service worker resta in attesa e le pagine
// continuano a ricevere dalla cache la versione precedente dell'app
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.hostname.endsWith(".supabase.co"),
  new NetworkFirst({
    cacheName: "supabase-api",
    networkTimeoutSeconds: 5,
  }),
);
