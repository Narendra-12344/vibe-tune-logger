import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

interface AudioVisualizerProps {
  barCount?: number;
  className?: string;
}

export const AudioVisualizer = ({ barCount = 20, className = '' }: AudioVisualizerProps) => {
  const { isPlaying, currentSong, audioRef } = useAudioPlayer();
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!audioRef?.current || !isPlaying || !currentSong) {
      setBars(Array(barCount).fill(10));
      return;
    }

    const setupAnalyser = async () => {
      try {
        // Create audio context only once
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Create analyser only once
        if (!analyserRef.current) {
          analyserRef.current = audioContext.createAnalyser();
          analyserRef.current.fftSize = 64;
          analyserRef.current.smoothingTimeConstant = 0.8;
        }

        // Connect source only once per audio element
        if (!isConnectedRef.current && audioRef.current) {
          try {
            sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContext.destination);
            isConnectedRef.current = true;
          } catch (e) {
            // Source might already be connected
            console.log('Audio source already connected');
          }
        }

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
          analyser.getByteFrequencyData(dataArray);
          
          const newBars = Array(barCount).fill(0).map((_, i) => {
            const index = Math.floor((i / barCount) * bufferLength);
            return (dataArray[index] / 255) * 100;
          });
          
          setBars(newBars);
          animationRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.error('Web Audio API error:', error);
        // Fallback to simulated visualization
        const interval = setInterval(() => {
          const newBars = Array(barCount).fill(0).map(() => 
            20 + Math.random() * 80
          );
          setBars(newBars);
        }, 100);

        return () => clearInterval(interval);
      }
    };

    setupAnalyser();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentSong, barCount, audioRef]);

  if (!currentSong) return null;

  return (
    <div className={`flex items-end gap-0.5 h-8 ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-75"
          style={{ 
            height: `${Math.max(isPlaying ? height : 10, 5)}%`,
            opacity: isPlaying ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );
};
