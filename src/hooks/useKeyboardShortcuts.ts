import { useEffect } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export const useKeyboardShortcuts = () => {
  const { 
    isPlaying, 
    pause, 
    resume, 
    playNext, 
    playPrevious, 
    volume, 
    setVolume,
    currentSong 
  } = useAudioPlayer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (currentSong) {
            isPlaying ? pause() : resume();
          }
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            e.preventDefault();
            playNext();
          }
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            e.preventDefault();
            playPrevious();
          }
          break;
        case 'ArrowUp':
          if (e.shiftKey) {
            e.preventDefault();
            setVolume(Math.min(1, volume + 0.1));
          }
          break;
        case 'ArrowDown':
          if (e.shiftKey) {
            e.preventDefault();
            setVolume(Math.max(0, volume - 0.1));
          }
          break;
        case 'KeyM':
          if (e.shiftKey) {
            e.preventDefault();
            setVolume(volume === 0 ? 0.7 : 0);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, pause, resume, playNext, playPrevious, volume, setVolume, currentSong]);
};
