import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  play: (song: Song) => void;
  pause: () => void;
  stop: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((song: Song) => {
    // Stop current song if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio element
    const audio = new Audio(song.url);
    audioRef.current = audio;
    
    audio.play().then(() => {
      setCurrentSong(song);
      setIsPlaying(true);
    }).catch(error => {
      console.error('Error playing audio:', error);
    });

    // Handle when song ends
    audio.onended = () => {
      setIsPlaying(false);
    };
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSong(null);
    }
  }, []);

  return (
    <AudioPlayerContext.Provider value={{ currentSong, isPlaying, play, pause, stop }}>
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
