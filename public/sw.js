const CACHE_NAME = 'mood-music-v1';
const AUDIO_CACHE_NAME = 'mood-music-audio-v1';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle audio files specially - cache them for offline playback
  if (event.request.url.includes('user-songs') || 
      event.request.destination === 'audio' ||
      url.pathname.endsWith('.mp3') ||
      url.pathname.endsWith('.wav') ||
      url.pathname.endsWith('.ogg')) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving audio from cache:', event.request.url);
            return cachedResponse;
          }
          
          return fetch(event.request).then((networkResponse) => {
            // Clone the response before caching
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
              console.log('Cached audio:', event.request.url);
            }
            return networkResponse;
          }).catch(() => {
            console.log('Audio not available offline:', event.request.url);
            return new Response('Audio not available offline', { status: 503 });
          });
        });
      })
    );
    return;
  }

  // For other requests - network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful GET requests
        if (event.request.method === 'GET' && response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Listen for messages to cache specific songs
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_SONG') {
    const { url } = event.data;
    caches.open(AUDIO_CACHE_NAME).then((cache) => {
      fetch(url).then((response) => {
        if (response.ok) {
          cache.put(url, response);
          console.log('Song cached for offline:', url);
        }
      });
    });
  }
  
  if (event.data.type === 'REMOVE_SONG_CACHE') {
    const { url } = event.data;
    caches.open(AUDIO_CACHE_NAME).then((cache) => {
      cache.delete(url);
      console.log('Song removed from cache:', url);
    });
  }
  
  if (event.data.type === 'GET_CACHED_SONGS') {
    caches.open(AUDIO_CACHE_NAME).then((cache) => {
      cache.keys().then((keys) => {
        const urls = keys.map(key => key.url);
        event.ports[0].postMessage({ cachedSongs: urls });
      });
    });
  }
});
