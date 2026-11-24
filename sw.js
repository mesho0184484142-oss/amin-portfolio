const CACHE_NAME = 'amin-portfolio-v8';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.svg',
  '/images/profile.jpg',
  '/images/nova_plus.png',
  '/images/nova.png',
  '/images/market.png',
  '/images/mizaniti.png',
  '/images/quran.png',
  '/images/arkestra-preview.jpg',
  '/images/ahmed-rizk.png',
  '/images/dr-amr-preview.jpg'
];

// Sibling repositories hosted on the same domain that must NEVER be intercepted
const EXCLUDED_SUBPATHS = [
  '/arkestra',
  '/ahmed-rizk-landing',
  '/dr-amr-elkiki'
];

function isExcludedSubpath(pathname) {
  const normalized = pathname.toLowerCase();
  return EXCLUDED_SUBPATHS.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

function isRootPortfolioPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') return true;
  if (ASSETS_TO_CACHE.includes(pathname)) return true;
  if (pathname.startsWith('/images/')) return true;
  return false;
}

// Install: precache verified local portfolio assets only, then activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge outdated caches and take control of open root clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keyList = await caches.keys();
      await Promise.all(
        keyList
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch: strict root-scope guard + Network-First HTML + Stale-While-Revalidate assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bypass cross-origin requests (CDNs, fonts, external links)
  if (url.origin !== self.location.origin) return;

  // CRITICAL SCOPE GUARD: never intercept sibling project repositories or unknown subpaths
  if (isExcludedSubpath(url.pathname) || !isRootPortfolioPath(url.pathname)) {
    return;
  }

  const isHtmlNavigation =
    request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname === '/index.html';

  const isCoreCodeAsset =
    url.pathname === '/style.css' ||
    url.pathname === '/script.js' ||
    url.pathname === '/manifest.json';

  if (isHtmlNavigation || isCoreCodeAsset) {
    // Network-First for HTML, CSS, JS, and Manifest so deployments appear immediately
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request, { cache: 'no-cache' });
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(isHtmlNavigation ? '/index.html' : request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return (
            (await caches.match(request)) ||
            (isHtmlNavigation ? (await caches.match('/index.html')) || (await caches.match('/')) : null) ||
            Response.error()
          );
        }
      })()
    );
    return;
  }

  // Stale-While-Revalidate for CSS, JS, SVG, Manifest, and Images
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);

      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cachedResponse) {
        event.waitUntil(networkFetch);
        return cachedResponse;
      }

      const freshResponse = await networkFetch;
      if (freshResponse) return freshResponse;

      return Response.error();
    })()
  );
});
