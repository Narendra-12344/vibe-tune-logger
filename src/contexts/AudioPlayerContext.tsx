import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  mood?: string;
  lyrics?: string;
}

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
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
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [historyStack, setHistoryStack] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (queue.length > 0) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue]);

  const play = useCallback(async (song: Song) => {
    // Prevent race conditions by stopping any pending play operations
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    try {
      const audio = new Audio();
      audio.volume = volume;
      audio.preload = 'auto';
      
      // Set up event listeners before setting src
      audio.addEventListener('canplaythrough', async () => {
        try {
          await audio.play();
          if (currentSong) {
            setHistoryStack(prev => [...prev, currentSong]);
          }
          setCurrentSong(song);
          setIsPlaying(true);
        } catch (playError) {
          // Ignore AbortError as it's expected when quickly switching songs
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
  }, []);

  const removeFromQueue = useCallback((songId: string) => {
    setQueueState(prev => prev.filter(s => s.id !== songId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueueState([]);
  }, []);

  const setQueue = useCallback((songs: Song[]) => {
    setQueueState(songs);
  }, []);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueueState(prev => prev.slice(1));
      play(nextSong);
    }
  }, [queue, play]);

  const playPrevious = useCallback(() => {
    if (historyStack.length > 0) {
      const prevSong = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      if (currentSong) {
        setQueueState(prev => [currentSong, ...prev]);
      }
      play(prevSong);
    }
  }, [historyStack, currentSong, play]);

  return (
    <AudioPlayerContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      currentTime,
      duration,
      queue,
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
