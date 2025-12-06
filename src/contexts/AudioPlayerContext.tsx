import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

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
  const isLoadingRef = useRef(false);

  const playInternal = useCallback(async (song: Song) => {
    // Prevent multiple simultaneous play attempts
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current = null;
    }

    try {
      const audio = new Audio();
      audio.volume = volume;
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      // Set up event listeners before loading
      const handleCanPlay = async () => {
        try {
          await audio.play();
          if (currentSong && currentSong.id !== song.id) {
            setHistoryStack(prev => [...prev, currentSong]);
          }
          setCurrentSong(song);
          setIsPlaying(true);
          isLoadingRef.current = false;
        } catch (playError) {
          if ((playError as Error).name !== 'AbortError') {
            console.error('Playback failed:', playError);
            toast.error('Failed to play song. Please try again.');
          }
          isLoadingRef.current = false;
        }
      };

      const handleError = () => {
        console.error('Audio load error for:', song.title);
        toast.error(`Unable to load "${song.title}". The audio source may be unavailable.`);
        isLoadingRef.current = false;
        setIsPlaying(false);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      audio.addEventListener('error', handleError, { once: true });
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      // Start loading
      audio.src = song.url;
      audio.load();

      // Timeout fallback
      setTimeout(() => {
        if (isLoadingRef.current) {
          isLoadingRef.current = false;
          if (!audio.readyState) {
            toast.error('Song is taking too long to load. Please try another.');
          }
        }
      }, 10000);

    } catch (error) {
      console.error('Error setting up audio:', error);
      toast.error('Failed to initialize audio player');
      isLoadingRef.current = false;
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

    audio.addEventListener('ended', handleSongEnded);

    return () => {
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
      }).catch((e) => {
        if (e.name !== 'AbortError') {
          toast.error('Failed to resume playback');
        }
      });
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentTime(0);
    setDuration(0);
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
