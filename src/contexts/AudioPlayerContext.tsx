import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  mood?: string;
  lyrics?: string;
}

type RepeatMode = 'off' | 'all' | 'one';

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  shuffle: boolean;
  repeatMode: RepeatMode;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (songs: Song[]) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);
  const [historyStack, setHistoryStack] = useState<Song[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playInternal = useCallback(async (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    try {
      const audio = new Audio();
      audio.volume = volume;
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', async () => {
        try {
          await audio.play();
          if (currentSong) {
            setHistoryStack(prev => [...prev, currentSong]);
          }
          setCurrentSong(song);
          setIsPlaying(true);
        } catch (playError) {
          if ((playError as Error).name !== 'AbortError') {
            console.error('Error playing audio:', playError);
          }
        }
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
      });

      audioRef.current = audio;
      audio.src = song.url;
      audio.load();
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  }, [volume, currentSong]);

  const playNextInternal = useCallback(() => {
    if (queue.length > 0) {
      const nextIndex = shuffle ? Math.floor(Math.random() * queue.length) : 0;
      const nextSong = queue[nextIndex];
      setQueueState(prev => prev.filter((_, i) => i !== nextIndex));
      playInternal(nextSong);
    }
  }, [queue, shuffle, playInternal]);

  // Handle song ended with repeat modes
  const handleSongEnded = useCallback(() => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    } else if (queue.length > 0) {
      playNextInternal();
    } else if (repeatMode === 'all' && originalQueue.length > 0) {
      const shuffledQueue = shuffle 
        ? [...originalQueue].sort(() => Math.random() - 0.5)
        : [...originalQueue];
      setQueueState(shuffledQueue.slice(1));
      playInternal(shuffledQueue[0]);
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, queue, originalQueue, shuffle, playInternal, playNextInternal]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleSongEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleSongEnded);
    };
  }, [handleSongEnded]);

  const play = useCallback((song: Song) => {
    playInternal(song);
  }, [playInternal]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSong(null);
      setCurrentTime(0);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueueState(prev => [...prev, song]);
    setOriginalQueue(prev => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((songId: string) => {
    setQueueState(prev => prev.filter(s => s.id !== songId));
    setOriginalQueue(prev => prev.filter(s => s.id !== songId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueueState([]);
    setOriginalQueue([]);
  }, []);

  const setQueue = useCallback((songs: Song[]) => {
    setQueueState(songs);
    setOriginalQueue(songs);
  }, []);

  const playNext = useCallback(() => {
    playNextInternal();
  }, [playNextInternal]);

  const playPrevious = useCallback(() => {
    if (historyStack.length > 0) {
      const prevSong = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      if (currentSong) {
        setQueueState(prev => [currentSong, ...prev]);
      }
      playInternal(prevSong);
    }
  }, [historyStack, currentSong, playInternal]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      currentTime,
      duration,
      queue,
      shuffle,
      repeatMode,
      audioRef,
      play,
      pause,
      resume,
      stop,
      setVolume,
      seek,
      addToQueue,
      removeFromQueue,
      clearQueue,
      playNext,
      playPrevious,
      setQueue,
      toggleShuffle,
      toggleRepeat,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};
