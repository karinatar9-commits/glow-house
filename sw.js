// Service worker for Glow House: lets the pages be installed as apps and shows phone notifications
// (appointment reminders for clients, new-booking alerts for Rinat). Pages always come from the network;
// nothing with booking data is cached.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: 'Glow House', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Glow House', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    dir: 'rtl',
    lang: 'he',
    tag: d.tag || undefined,
    data: { url: d.url || '/' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/', self.location.origin);
  // only ever open pages of this site
  const target = url.origin === self.location.origin ? url.href : self.location.origin + '/';
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if (c.url.split('#')[0] === target.split('#')[0] && 'focus' in c) return c.focus(); }
    return self.clients.openWindow(target);
  })());
});
