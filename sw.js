const CACHE_NAME = 'amin-portfolio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/images/profile.jpg',
  '/images/quran.png',
  '/images/market.png',
  '/images/nova.png',
  '/images/nova_plus.png',
  '/images/mizaniti.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js'
];

// تثبيت التطبيق وتخزين الملفات في الذاكرة للأوفلاين
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// تفعيل السيرفيس وركر وتنظيف أي كاش قديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// تشغيل الموقع من الذاكرة لو مفيش إنترنت (Offline First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/index.html');
    })
  );
});