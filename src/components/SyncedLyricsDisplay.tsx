import { useEffect, useState, useRef } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Music, MicVocal, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyricLine {
  time: number; // in seconds
  text: string;
}

// Synced lyrics database with timestamps
const SYNCED_LYRICS: Record<string, LyricLine[]> = {
  'Butta Bomma': [
    { time: 0, text: '🎵 ఇంట్రో...' },
    { time: 5, text: 'బుట్టా బొమ్మ బుట్టా బొమ్మ' },
    { time: 10, text: 'నీలాకాశం లోన వెలిగే చుక్క' },
    { time: 15, text: 'అందాల అప్సరసకు వేసే తోట' },
    { time: 20, text: 'మనసున్న మరదలు నువ్వే నా జోడు' },
    { time: 28, text: '♪ ♫ ♪' },
    { time: 32, text: 'ఓ బుట్టా బొమ్మా' },
    { time: 36, text: 'నీ చెక్కిలి మీద చిన్న మచ్చ' },
    { time: 42, text: 'అది చూసే కళ్లకు తీయని కచ్చ' },
    { time: 48, text: 'నీ నవ్వుల్లో దాగిన మాట' },
    { time: 54, text: 'అది విన్న మనసుకు పెద్ద ఆట' },
    { time: 62, text: 'చందమామ చూపిస్తే చాలా ఇష్టం' },
    { time: 70, text: 'నీ కళ్లే చంద్రులైతే మరింత ప్రేమ' },
    { time: 80, text: 'ఏమి చేసావో నాకేమో తెలియదు' },
    { time: 88, text: 'ఎందుకో నిన్నే చూడాలని ఉంది' },
  ],
  'Inkem Inkem': [
    { time: 0, text: '🎵 ఇంట్రో...' },
    { time: 4, text: 'ఇంకేం ఇంకేం కావాలే' },
    { time: 8, text: 'ఇంకేం ఇంకేం కావాలే' },
    { time: 12, text: 'నీకు నేను నాకు నువ్వు' },
    { time: 16, text: 'ఇంకేం ఇంకేం కావాలే' },
    { time: 24, text: '♪ ♫ ♪' },
    { time: 28, text: 'ఎందుకో మనసు తేలిపోతోందే' },
    { time: 34, text: 'ఎందుకో మైమరచిపోతోందే' },
    { time: 40, text: 'నీ తోడు ఉంటే చాలు' },
    { time: 46, text: 'ఇంకేమి వద్దు ఈ మనసుకి' },
    { time: 54, text: 'ప్రేమంటే ఏమిటో తెలీదు' },
    { time: 60, text: 'నిన్ను చూసే వరకు' },
    { time: 66, text: 'ఇప్పుడు తెలిసింది' },
    { time: 72, text: 'ప్రేమంటే నువ్వే అని' },
  ],
  'Samajavaragamana': [
    { time: 0, text: '🎵 ఆలాపన...' },
    { time: 6, text: 'సమజవరగమన సా నీ ధపమగరిస' },
    { time: 14, text: 'స రి గ మ ప ద ని స' },
    { time: 20, text: 'స ని ద ప మ గ రి స' },
    { time: 28, text: '♪ ♫ ♪' },
    { time: 34, text: 'ఎన్ని యుగాలైనా మారని ఈ రాగం' },
    { time: 42, text: 'అమరంగా వినిపించే ప్రేమ సందేశం' },
    { time: 50, text: 'స్వరాల్లో దాగున్న మధురమైన భావం' },
    { time: 58, text: 'మనసుల్ని కలిపే అందమైన బంధం' },
    { time: 68, text: 'నీలో నేను కరిగిపోయా' },
    { time: 76, text: 'నీ ప్రేమలో మునిగిపోయా' },
  ],
  'Naatu Naatu': [
    { time: 0, text: '🎵 బీట్ స్టార్ట్...' },
    { time: 4, text: 'నాటు నాటు నాటు నాటు' },
    { time: 8, text: 'నాట్యం చేసే నేస్తం నాటు' },
    { time: 12, text: 'ఎగిరే గుర్రం మీద' },
    { time: 16, text: 'పరిగెత్తే మనసుతో' },
    { time: 22, text: '♪ ♫ ♪' },
    { time: 28, text: 'జోష్ తో కలిసి పోదాం' },
    { time: 34, text: 'ఉత్సాహంతో ఆడదాం' },
    { time: 40, text: 'ఈ రాత్రి మన రాత్రి' },
    { time: 46, text: 'ఈ పండుగ మన పండుగ' },
  ],
  'Srivalli': [
    { time: 0, text: '🎵 ఇంట్రో...' },
    { time: 5, text: 'సృవల్లి సృవల్లి' },
    { time: 10, text: 'నీ అందం చూసి మతి పోయింది' },
    { time: 16, text: 'నీ నవ్వు చూసి మనసు దోచేసింది' },
    { time: 22, text: 'ఓ సృవల్లీ ఓ సృవల్లీ' },
    { time: 30, text: '♪ ♫ ♪' },
    { time: 36, text: 'పూలతోట లో పువ్వు నువ్వు' },
    { time: 42, text: 'చందమామ కన్నా అందం నువ్వు' },
    { time: 48, text: 'నీ కోసం ఈ ప్రాణం' },
    { time: 54, text: 'నీకే నా జీవితం' },
  ],
  'Oo Antava': [
    { time: 0, text: '🎵 బీట్ డ్రాప్...' },
    { time: 4, text: 'ఓ అంటావా మావా ఓ అంటావా' },
    { time: 10, text: 'నీ కళ్ళలో ఏమో దాచావా' },
    { time: 16, text: 'నా మనసు దోచేశావా' },
    { time: 22, text: 'ఈ ఆట ఎందుకు ఆడావా' },
    { time: 30, text: '♪ ♫ ♪' },
    { time: 36, text: 'ఏం చేశావో ఏమో నీవు' },
    { time: 42, text: 'నా వెంట పడేశావు' },
    { time: 48, text: 'ఈ అందం ఎక్కడిది' },
    { time: 54, text: 'ఈ మోహం ఎందుకిది' },
  ],
};

export const SyncedLyricsDisplay = () => {
  const { currentSong, currentTime, isPlaying } = useAudioPlayer();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isKaraokeMode, setIsKaraokeMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find matching lyrics
  const findLyrics = (title: string): LyricLine[] | null => {
    const normalizedTitle = title.toLowerCase();
    for (const [key, value] of Object.entries(SYNCED_LYRICS)) {
      if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
        return value;
      }
    }
    return null;
  };

  const lyrics = currentSong ? findLyrics(currentSong.title) : null;

  // Update current line based on playback time
  useEffect(() => {
    if (!lyrics || !isPlaying) return;

    const currentIndex = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    if (currentIndex !== -1 && currentIndex !== currentLineIndex) {
      setCurrentLineIndex(currentIndex);
    }
  }, [currentTime, lyrics, isPlaying, currentLineIndex]);

  // Auto-scroll to current line
  useEffect(() => {
    if (scrollRef.current && isKaraokeMode) {
      const activeElement = scrollRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLineIndex, isKaraokeMode]);

  if (!currentSong) {
    return (
      <Card className="h-full border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-primary" />
            Karaoke Lyrics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Play a song to see synced lyrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-primary" />
              {currentSong.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
          </div>
          <Badge
            variant={isKaraokeMode ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setIsKaraokeMode(!isKaraokeMode)}
          >
            <MicVocal className="w-3 h-3 mr-1" />
            Karaoke
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72" ref={scrollRef}>
          {lyrics ? (
            <div className="space-y-3 py-4">
              {lyrics.map((line, index) => {
                const isActive = index === currentLineIndex;
                const isPast = index < currentLineIndex;
                
                return (
                  <div
                    key={index}
                    data-active={isActive}
                    className={cn(
                      "py-2 px-4 rounded-lg transition-all duration-300 text-center",
                      isActive && "bg-primary/20 scale-105 shadow-lg border border-primary/30",
                      isPast && "opacity-50",
                      !isActive && !isPast && "opacity-70"
                    )}
                  >
                    <p
                      className={cn(
                        "text-lg transition-all duration-300",
                        isActive && "text-primary font-bold text-xl",
                        isPast && "text-muted-foreground",
                        !isActive && !isPast && "text-foreground/80"
                      )}
                    >
                      {line.text}
                    </p>
                    {isActive && isKaraokeMode && (
                      <div className="mt-2 h-1 bg-primary/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full animate-pulse"
                          style={{ 
                            width: lyrics[index + 1] 
                              ? `${((currentTime - line.time) / (lyrics[index + 1].time - line.time)) * 100}%`
                              : '100%'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <MicVocal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Synced lyrics not available for this song</p>
              <p className="text-sm mt-2">Lyrics will sync with playback when available</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};