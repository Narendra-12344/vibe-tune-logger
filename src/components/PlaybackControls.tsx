import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Timer, Gauge, Waves } from 'lucide-react';
import { usePlaybackFeatures, PlaybackSpeed } from '@/hooks/usePlaybackFeatures';
import { cn } from '@/lib/utils';

const SLEEP_TIMER_OPTIONS = [5, 10, 15, 30, 45, 60, 90];
const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const PlaybackControls = () => {
  const {
    sleepTimerMinutes,
    sleepTimerRemaining,
    startSleepTimer,
    cancelSleepTimer,
    formatSleepTimerRemaining,
    playbackSpeed,
    setPlaybackSpeed,
    crossfadeDuration,
    setCrossfadeDuration,
  } = usePlaybackFeatures();

  return (
    <div className="flex items-center gap-1">
      {/* Sleep Timer */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 relative", sleepTimerMinutes && "text-primary")}
            title="Sleep Timer"
          >
            <Timer className="h-4 w-4" />
            {sleepTimerMinutes && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground rounded-full px-1">
                {formatSleepTimerRemaining()}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sleep Timer</h4>
            {sleepTimerMinutes ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Stopping in {formatSleepTimerRemaining()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={cancelSleepTimer}
                >
                  Cancel Timer
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {SLEEP_TIMER_OPTIONS.map((mins) => (
                  <Button
                    key={mins}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => startSleepTimer(mins)}
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Playback Speed */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", playbackSpeed !== 1 && "text-primary")}
            title="Playback Speed"
          >
            <Gauge className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Speed</h4>
            <div className="grid grid-cols-2 gap-1">
              {SPEED_OPTIONS.map((speed) => (
                <Button
                  key={speed}
                  variant={playbackSpeed === speed ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setPlaybackSpeed(speed)}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Crossfade */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", crossfadeDuration > 0 && "text-primary")}
            title="Crossfade"
          >
            <Waves className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Crossfade</h4>
              <span className="text-xs text-muted-foreground">
                {crossfadeDuration === 0 ? 'Off' : `${crossfadeDuration}s`}
              </span>
            </div>
            <Slider
              value={[crossfadeDuration]}
              onValueChange={(values) => setCrossfadeDuration(values[0])}
              max={12}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Smooth transitions between songs
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
