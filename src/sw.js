import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

importScripts("https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js");

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.hostname.endsWith(".supabase.co"),
  new NetworkFirst({
    cacheName: "supabase-api",
    networkTimeoutSeconds: 5,
  }),
);
