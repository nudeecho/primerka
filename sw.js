'use strict';
const VERSION = 'primerka-1';
const SHELL = ['./', 'index.html', 'app.css', 'store.js', 'backup.js', 'app.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('primerka-') && k !== VERSION) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('message', e => { if (e.data === 'update') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !u.href.startsWith(self.registration.scope)) return;
  e.respondWith(caches.open(VERSION).then(async c => await c.match(e.request, { ignoreSearch: true }) || (e.request.mode === 'navigate' && await c.match('./')) || fetch(e.request)));
});
