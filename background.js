// No-op service worker used only so we can bundle icons without errors in some Chrome versions
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());


