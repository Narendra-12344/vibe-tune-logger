import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, MicVocal } from 'lucide-react';

// Expanded Telugu song lyrics database
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
నీ కళ్లే చంద్రులైతే మరింత ప్రేమ

ఏమి చేసావో నాకేమో తెలియదు
ఎందుకో నిన్నే చూడాలని ఉంది
నీ అందం చూసి మైమరిచాను
నీ ప్రేమలో నేను పడిపోయాను`,

  'Inkem Inkem': `ఇంకేం ఇంకేం కావాలే
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
ప్రేమంటే నువ్వే అని

నీ కళ్ళలో నా ప్రపంచం
నీ చిరునవ్వులో నా స్వర్గం
నీతో ఉంటే ఏమీ వద్దు
ఈ జీవితమంతా నీతోనే`,

  'Inkem Inkem Kavale': `ఇంకేం ఇంకేం కావాలే
ఇంకేం ఇంకేం కావాలే
నీకు నేను నాకు నువ్వు
ఇంకేం ఇంకేం కావాలే

ఎందుకో మనసు తేలిపోతోందే
ఎందుకో మైమరచిపోతోందే
నీ తోడు ఉంటే చాలు
ఇంకేమి వద్దు ఈ మనసుకి`,

  'Samajavaragamana': `సమజవరగమన సా నీ ధపమగరిస
స రి గ మ ప ద ని స
స ని ద ప మ గ రి స

ఎన్ని యుగాలైనా మారని ఈ రాగం
అమరంగా వినిపించే ప్రేమ సందేశం
స్వరాల్లో దాగున్న మధురమైన భావం
మనసుల్ని కలిపే అందమైన బంధం

నీలో నేను కరిగిపోయా
నీ ప్రేమలో మునిగిపోయా
ఈ బంధం శాశ్వతం
ఈ ప్రేమ అనంతం`,

  'Ramuloo Ramulaa': `రాములో రాములా
ఉయ్యాలో ఊగిందిరా
పువ్వు లాంటి పిల్ల నీకు
మొగ్గ లాంటి మొగుడు నేను

ఆకాశంలో నక్షత్రాలు
భూమిపైన మనిషిలు
అందరిలో అందమైన
నువ్వే నాకు ఇష్టమైన

పండుగొచ్చింది పట్నమొచ్చింది
పిల్ల నిన్ను చూడాలని వచ్చింది`,

  'Seeti Maar': `సీటీ మార్ సీటీ మార్
ఏంటి మార్ ఏంటి మార్
నీ అందం చూసి
మతి పోయింది నాకు

డీజే డీజే డీజే డీజే
మ్యూజిక్ వేయి వేయి
డాన్స్ ఫ్లోర్ మీద
మన ప్రేమ చాటుకో`,

  'Neeli Neeli Aakasam': `నీలి నీలి ఆకాశం
నీలో నేను చేరాలి
నీ కళ్ళలో నేను మునిగి
నీ ప్రేమలో కరిగిపోవాలి

ఎంత దూరం వెళ్ళినా
నిన్ను మరచిపోలేను
ఎన్ని జన్మలైనా
నీకే నా ప్రేమ`,

  'Nee Kannu Neeli Samudram': `నీ కన్ను నీలి సముద్రం
నా మనసు తెల్ల మేఘం
నీ నవ్వు వెన్నెల వెలుగు
నా ఊపిరి నీ ఆలోచన

ఎక్కడ చూసినా నువ్వే
ఏం చేసినా నువ్వే
నీ ప్రేమ నాకు చాలు
ఈ జీవితానికి`,

  'Yemaaya Chesave': `ఏ మాయ చేసావే
నా గుండెను దోచావే
నీ చూపుల్లో మాయ
నీ మాటల్లో ప్రేమ

ఎందుకో తెలియదు
నిన్ను చూస్తే మనసు
ఆగదు ఆగదు
నీ వెంట పరుగు`,

  'Nuvvunte Naa Jathagaa': `నువ్వుంటే నా జతగా
ఈ లోకం అందమవ్వా
నీ తోడు ఉంటే చాలు
మిగతాదంతా మాయా

ఈ బంధం ఏమిటో
ఈ ప్రేమ ఏమిటో
నీలో నేను కరిగిపోతూ
నిన్నే ప్రేమిస్తున్నా`,

  'Pranaamam': `ప్రణామం ప్రణామం
నీకే నా ప్రణామం
నీ త్యాగానికి వందనం
నీ ప్రేమకు పుష్పాంజలి

తండ్రి నీవే దేవుడు
నీ ఆశీర్వాదం వరము
ఈ జీవితం నీ బహుమానం`,

  'Ringa Ringa': `రింగా రింగా రింగా రింగా
రోజ రింగా రింగా రింగా
పార్టీ మొదలైంది
డాన్స్ చేయండి

ఈ రాత్రి మన రాత్రి
ఈ పండుగ మన పండుగ
సంతోషంగా ఉండండి
ఆనందంగా ఆడండి`,

  'Dheemtanakka': `ధీమ్ తనక్క ధీమ్ తనక్క
ధీమ్ తనక్క తక తక తక
జయ జయ జయ జయహే
విజయం మనదే

పోరాటం మన బాట
విజయం మన గమ్యం
ధైర్యంగా ముందుకు
వీరత్వంతో యుద్ధానికి`,

  'Srivalli': `సృవల్లి సృవల్లి
నీ అందం చూసి మతి పోయింది
నీ నవ్వు చూసి మనసు దోచేసింది
ఓ సృవల్లీ ఓ సృవల్లీ

పూలతోట లో పువ్వు నువ్వు
చందమామ కన్నా అందం నువ్వు
నీ కోసం ఈ ప్రాణం
నీకే నా జీవితం`,

  'Naatu Naatu': `నాటు నాటు నాటు నాటు
నాట్యం చేసే నేస్తం నాటు
ఎగిరే గుర్రం మీద
పరిగెత్తే మనసుతో

జోష్ తో కలిసి పోదాం
ఉత్సాహంతో ఆడదాం
ఈ రాత్రి మన రాత్రి
ఈ పండుగ మన పండుగ`,

  'Oo Antava': `ఓ అంటావా మావా ఓ అంటావా
నీ కళ్ళలో ఏమో దాచావా
నా మనసు దోచేశావా
ఈ ఆట ఎందుకు ఆడావా

ఏం చేశావో ఏమో నీవు
నా వెంట పడేశావు
ఈ అందం ఎక్కడిది
ఈ మోహం ఎందుకిది`,

  'Yenti Yenti': `ఏంటి ఏంటి ఏమైంది
నిన్ను చూసి ఏమైంది
గుండె చప్పుడు పెరిగింది
ఊపిరి ఆగిపోయింది

ప్రేమంటే ఇదేనా
ఈ ఫీలింగ్ ఏంటి చెప్పు
నీ తో ఉండాలని
మనసు అడుగుతోంది`,

  'Vachinde': `వచ్చిందే వచ్చిందే మేఘం
నీ రూపంలో ప్రేమ వచ్చింది
నీ కళ్ళలో కలలు చూశా
నీ మాటలో మధురం విన్నా

ఈ బంధం శాశ్వతం
ఈ ప్రేమ అనంతం
నీతో ఈ జీవితం
ఎంతో అందం`,

  'Pillaa Raa': `పిల్లా రా పిల్లా రా
ఓ పిల్లా రా పిల్లా రా
నీ అందం చూసి
మనసు పరవశం

నీ నవ్వు వెన్నెల
నీ మాట తేనె
నీతో ఉంటే చాలు
ఇంకేమి వద్దు`,

  'Kanulu Kanulanu': `కనులు కనులను దోచాయంటే
అవి నీ కనులే కదా
మనసు మనసును దోచాయంటే
అది నీ ప్రేమే కదా

ఎందుకో తెలియదు నీ వెంట
ఈ మనసు పరిగెత్తుతోంది
నీ చూపుల్లో మునిగిపోయింది`,

  'Emo Emo': `ఏమో ఏమో ఏమో ఏమో
ఏమైందో నాకు తెలియదు
నిన్ను చూసినప్పటి నుండి
ఈ మనసు మారిపోయింది

విరహంలో ఉన్నాను
నీ కోసం ఎదురు చూస్తున్నాను
ఈ బాధ ఎవరికి చెప్పను
ఈ ప్రేమ ఎలా మరచిపోను`,

  'Mind Block': `మైండ్ బ్లాక్ మైండ్ బ్లాక్
నీ అందం చూసి మైండ్ బ్లాక్
నీ నడక చూసి హార్ట్ అటాక్
ఈ ఫీలింగ్ కి నో ఫీడ్ బ్యాక్

జోష్ తో నిండిన యూత్
స్టైల్ తో ఉన్న యూత్
పార్టీ చేద్దాం రండి
సంతోషంగా ఉందాం`
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
