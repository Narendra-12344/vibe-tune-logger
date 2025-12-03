import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

interface AudioVisualizerProps {
  barCount?: number;
  className?: string;
}

export const AudioVisualizer = ({ barCount = 20, className = '' }: AudioVisualizerProps) => {
  const { isPlaying, currentSong } = useAudioPlayer();
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying && currentSong) {
      const animate = () => {
        // Generate random bar heights for visualization effect
        const newBars = Array(barCount).fill(0).map(() => 
          Math.random() * 100
        );
        setBars(newBars);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Slower animation for smoother effect
      const interval = setInterval(() => {
        const newBars = Array(barCount).fill(0).map(() => 
          20 + Math.random() * 80
        );
        setBars(newBars);
      }, 100);

      return () => {
        clearInterval(interval);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setBars(Array(barCount).fill(10));
    }
  }, [isPlaying, currentSong, barCount]);

  if (!currentSong) return null;

  return (
    <div className={`flex items-end gap-0.5 h-8 ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-100"
          style={{ 
            height: `${isPlaying ? height : 10}%`,
            opacity: isPlaying ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );
};
