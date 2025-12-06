import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { toast } from 'sonner';

export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export const usePlaybackFeatures = () => {
  const { audioRef, isPlaying, pause, currentSong, queue, playNext } = useAudioPlayer();
  
  // Sleep Timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number>(0);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Playback Speed
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1);
  
  // Crossfade
  const [crossfadeDuration, setCrossfadeDurationState] = useState<number>(0); // 0 = off, 1-12 seconds
  const crossfadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalVolumeRef = useRef<number>(0.7);

  // Sleep Timer Logic
  const startSleepTimer = useCallback((minutes: number) => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }
    
    setSleepTimerMinutes(minutes);
    setSleepTimerRemaining(minutes * 60);
    
    toast.success(`Sleep timer set for ${minutes} minutes`);
    
    sleepTimerRef.current = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev <= 1) {
          if (sleepTimerRef.current) {
            clearInterval(sleepTimerRef.current);
          }
          setSleepTimerMinutes(null);
          pause();
          toast.info('Sleep timer ended. Playback stopped.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [pause]);

  const cancelSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }
    setSleepTimerMinutes(null);
    setSleepTimerRemaining(0);
    toast.info('Sleep timer cancelled');
  }, []);

  // Playback Speed Logic
  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    toast.success(`Playback speed: ${speed}x`);
  }, [audioRef]);

  // Apply playback speed when audio changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [audioRef, currentSong, playbackSpeed]);

  // Crossfade Logic
  const setCrossfadeDuration = useCallback((seconds: number) => {
    setCrossfadeDurationState(seconds);
    if (seconds === 0) {
      toast.info('Crossfade disabled');
    } else {
      toast.success(`Crossfade: ${seconds} seconds`);
    }
  }, []);

  // Handle crossfade before song ends
  useEffect(() => {
    if (!audioRef.current || crossfadeDuration === 0 || !isPlaying) return;

    const audio = audioRef.current;
    
    const checkCrossfade = () => {
      const timeRemaining = audio.duration - audio.currentTime;
      
      if (timeRemaining <= crossfadeDuration && timeRemaining > 0 && queue.length > 0) {
        // Start fading out
        if (!crossfadeIntervalRef.current) {
          originalVolumeRef.current = audio.volume;
          const fadeStep = audio.volume / (crossfadeDuration * 10);
          
          crossfadeIntervalRef.current = setInterval(() => {
            if (audio.volume > fadeStep) {
              audio.volume = Math.max(0, audio.volume - fadeStep);
            } else {
              if (crossfadeIntervalRef.current) {
                clearInterval(crossfadeIntervalRef.current);
                crossfadeIntervalRef.current = null;
              }
              audio.volume = originalVolumeRef.current;
            }
          }, 100);
        }
      }
    };

    audio.addEventListener('timeupdate', checkCrossfade);
    
    return () => {
      audio.removeEventListener('timeupdate', checkCrossfade);
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
        crossfadeIntervalRef.current = null;
      }
    };
  }, [audioRef, crossfadeDuration, isPlaying, queue, playNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
      }
    };
  }, []);

  // Format remaining time
  const formatSleepTimerRemaining = useCallback(() => {
    if (sleepTimerRemaining === 0) return '';
    const mins = Math.floor(sleepTimerRemaining / 60);
    const secs = sleepTimerRemaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [sleepTimerRemaining]);

  return {
    // Sleep Timer
    sleepTimerMinutes,
    sleepTimerRemaining,
    startSleepTimer,
    cancelSleepTimer,
    formatSleepTimerRemaining,
    
    // Playback Speed
    playbackSpeed,
    setPlaybackSpeed,
    
    // Crossfade
    crossfadeDuration,
    setCrossfadeDuration,
  };
};
