import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Sliders, RotateCcw } from 'lucide-react';

interface BandConfig {
  frequency: number;
  label: string;
  gain: number;
}

const defaultBands: BandConfig[] = [
  { frequency: 60, label: '60Hz', gain: 0 },
  { frequency: 170, label: '170Hz', gain: 0 },
  { frequency: 310, label: '310Hz', gain: 0 },
  { frequency: 600, label: '600Hz', gain: 0 },
  { frequency: 1000, label: '1kHz', gain: 0 },
  { frequency: 3000, label: '3kHz', gain: 0 },
  { frequency: 6000, label: '6kHz', gain: 0 },
  { frequency: 12000, label: '12kHz', gain: 0 },
];

const presets = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0],
  bass: [6, 5, 3, 0, 0, 0, 0, 0],
  treble: [0, 0, 0, 0, 2, 4, 5, 6],
  vocal: [-2, 0, 2, 4, 4, 2, 0, -2],
  rock: [4, 3, 1, 0, -1, 2, 4, 5],
  pop: [-1, 2, 4, 4, 2, 0, -1, -2],
  jazz: [3, 2, 0, 1, -1, 2, 3, 4],
  classical: [4, 3, 2, 1, 0, 1, 2, 3],
};

export const Equalizer = () => {
  const { audioRef, isPlaying } = useAudioPlayer();
  const [bands, setBands] = useState<BandConfig[]>(defaultBands);
  const [activePreset, setActivePreset] = useState<string>('flat');
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isConnectedRef = useRef(false);

  // Initialize Web Audio API and connect filters
  useEffect(() => {
    if (!audioRef?.current || !isPlaying || isConnectedRef.current) return;

    try {
      // Create or resume AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Create source only once
      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audioRef.current);
      }

      // Create filters for each band
      filtersRef.current = bands.map((band, index) => {
        const filter = ctx.createBiquadFilter();
        filter.type = index === 0 ? 'lowshelf' : index === bands.length - 1 ? 'highshelf' : 'peaking';
        filter.frequency.value = band.frequency;
        filter.gain.value = band.gain;
        filter.Q.value = 1;
        return filter;
      });

      // Connect filters in series
      let currentNode: AudioNode = sourceRef.current;
      filtersRef.current.forEach(filter => {
        currentNode.connect(filter);
        currentNode = filter;
      });
      currentNode.connect(ctx.destination);

      isConnectedRef.current = true;
    } catch (error) {
      console.error('Error initializing equalizer:', error);
    }

    return () => {
      // Don't disconnect on cleanup - let it persist
    };
  }, [audioRef, isPlaying]);

  // Update filter gains when bands change
  useEffect(() => {
    filtersRef.current.forEach((filter, index) => {
      if (filter && bands[index]) {
        filter.gain.value = bands[index].gain;
      }
    });
  }, [bands]);

  const handleBandChange = (index: number, value: number[]) => {
    setBands(prev => prev.map((band, i) => 
      i === index ? { ...band, gain: value[0] } : band
    ));
    setActivePreset('custom');
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    const presetGains = presets[presetName];
    setBands(prev => prev.map((band, i) => ({ ...band, gain: presetGains[i] })));
    setActivePreset(presetName);
  };

  const resetEqualizer = () => {
    applyPreset('flat');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sliders className="h-5 w-5" />
          Equalizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(presets).map((preset) => (
            <Button
              key={preset}
              variant={activePreset === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset(preset as keyof typeof presets)}
              className="capitalize text-xs"
            >
              {preset}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetEqualizer}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Frequency Bands */}
        <div className="flex gap-2 items-end justify-between pt-4">
          {bands.map((band, index) => (
            <div key={band.frequency} className="flex flex-col items-center gap-2">
              <div className="h-32 flex items-center">
                <Slider
                  orientation="vertical"
                  value={[band.gain]}
                  min={-12}
                  max={12}
                  step={1}
                  onValueChange={(value) => handleBandChange(index, value)}
                  className="h-full"
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {band.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {band.gain > 0 ? '+' : ''}{band.gain}dB
              </span>
            </div>
          ))}
        </div>

        {/* dB Scale Reference */}
        <div className="flex justify-between text-[10px] text-muted-foreground px-2">
          <span>+12dB</span>
          <span>0dB</span>
          <span>-12dB</span>
        </div>
      </CardContent>
    </Card>
  );
};
