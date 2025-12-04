import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [cachedSongs, setCachedSongs] = useState<string[]>([]);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setSwRegistration(registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheSong = (url: string) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_SONG',
        url,
      });
    }
  };

  const removeSongCache = (url: string) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'REMOVE_SONG_CACHE',
        url,
      });
    }
  };

  const getCachedSongs = (): Promise<string[]> => {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve([]);
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.cachedSongs || []);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHED_SONGS' },
        [messageChannel.port2]
      );
    });
  };

  const refreshCachedSongs = async () => {
    const songs = await getCachedSongs();
    setCachedSongs(songs);
  };

  return {
    isOnline,
    swRegistration,
    cachedSongs,
    cacheSong,
    removeSongCache,
    getCachedSongs,
    refreshCachedSongs,
  };
};
