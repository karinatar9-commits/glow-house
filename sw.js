// Minimal service worker so the management page can be installed as an app. Pages always come from the network;
// nothing with booking data is cached.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
