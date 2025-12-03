import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const AudioPlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    pause,
    resume,
    stop,
    setVolume,
    seek,
    playNext,
    playPrevious,
  } = useAudioPlayer();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
      {/* Progress bar */}
      <div 
        className="h-1 bg-muted cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seek(percent * duration);
        }}
      >
        <div 
          className="h-full bg-primary transition-all group-hover:h-2"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-md bg-gradient-primary flex items-center justify-center shrink-0">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate text-foreground">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPrevious}
              className="h-9 w-9 hover:bg-muted"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              onClick={isPlaying ? pause : resume}
              className="h-11 w-11 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={playNext}
              className="h-9 w-9 hover:bg-muted"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Close */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              className="h-9 w-9"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <div className={cn(
              "absolute bottom-full right-0 mb-2 p-3 bg-popover rounded-lg shadow-lg border transition-all",
              showVolumeSlider ? "opacity-100 visible" : "opacity-0 invisible"
            )}>
              <Slider
                orientation="vertical"
                value={[volume * 100]}
                onValueChange={(values) => setVolume(values[0] / 100)}
                max={100}
                step={1}
                className="h-24"
              />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={stop}
            className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
