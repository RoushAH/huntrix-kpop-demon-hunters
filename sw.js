const CACHE_NAME = 'huntrix-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/config.js',
  '/js/core/Game.js',
  '/js/core/InputManager.js',
  '/js/core/CollisionDetector.js',
  '/js/core/Renderer.js',
  '/js/entities/Entity.js',
  '/js/entities/Player.js',
  '/js/entities/Enemy.js',
  '/js/entities/EnemySpawner.js',
  '/js/states/BaseState.js',
  '/js/states/TitleState.js',
  '/js/states/PlayState.js',
  '/js/data/characters.js',
  '/js/utils/Vector2.js',
  '/js/utils/Storage.js',
  '/js/utils/Timer.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
