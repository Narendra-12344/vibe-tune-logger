import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, MicVocal } from 'lucide-react';

// Sample Telugu song lyrics database
const TELUGU_LYRICS: Record<string, string> = {
  'Butta Bomma': `బుట్టా బొమ్మ బుట్టా బొమ్మ
నీలాకాశం లోన వెలిగే చుక్క
అందాల అప్సరసకు వేసే తోట
మనసున్న మరదలు నువ్వే నా జోడు

ఓ బుట్టా బొమ్మా
నీ చెక్కిలి మీద చిన్న మచ్చ
అది చూసే కళ్లకు తీయని కచ్చ
నీ నవ్వుల్లో దాగిన మాట
అది విన్న మనసుకు పెద్ద ఆట

చందమామ చూపిస్తే చాలా ఇష్టం
నీ కళ్లే చంద్రులైతే మరింత ప్రేమ`,

  'Inkem Inkem Kavale': `ఇంకేం ఇంకేం కావాలే
ఇంకేం ఇంకేం కావాలే
నీకు నేను నాకు నువ్వు
ఇంకేం ఇంకేం కావాలే

ఎందుకో మనసు తేలిపోతోందే
ఎందుకో మైమరచిపోతోందే
నీ తోడు ఉంటే చాలు
ఇంకేమి వద్దు ఈ మనసుకి

ప్రేమంటే ఏమిటో తెలీదు
నిన్ను చూసే వరకు
ఇప్పుడు తెలిసింది
ప్రేమంటే నువ్వే అని`,

  'Samajavaragamana': `సమజవరగమన సా నీ ధపమగరిస
స రి గ మ ప ద ని స
స ని ద ప మ గ రి స

ఎన్ని యుగాలైనా మారని ఈ రాగం
అమరంగా వినిపించే ప్రేమ సందేశం
స్వరాల్లో దాగున్న మధురమైన భావం
మనసుల్ని కలిపే అందమైన బంధం`,

  'Buttabomma': `బుట్టా బొమ్మ బుట్టా బొమ్మ
నీలాకాశం లోన వెలిగే చుక్క
అందాల అప్సరసకు వేసే తోట
మనసున్న మరదలు నువ్వే నా జోడు`,
};

export const LyricsDisplay = () => {
  const { currentSong } = useAudioPlayer();

  if (!currentSong) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicVocal className="w-5 h-5" />
            Lyrics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Play a song to see lyrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find matching lyrics (case-insensitive partial match)
  const findLyrics = (title: string) => {
    const normalizedTitle = title.toLowerCase();
    for (const [key, value] of Object.entries(TELUGU_LYRICS)) {
      if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
        return value;
      }
    }
    return currentSong.lyrics || null;
  };

  const lyrics = findLyrics(currentSong.title);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MicVocal className="w-5 h-5" />
          {currentSong.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {lyrics ? (
            <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {lyrics}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <MicVocal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No lyrics available for this song</p>
              <p className="text-sm mt-2">Lyrics will appear here when available</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
