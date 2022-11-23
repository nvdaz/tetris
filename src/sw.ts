/// <reference lib="WebWorker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);

self.skipWaiting();
clientsClaim();
