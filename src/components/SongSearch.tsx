import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Play, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Song {
  id: string;
  title: string;
  artist: string;
  mood: string;
}

const MOCK_SONGS: Song[] = [
  { id: '1', title: 'Happy Together', artist: 'The Turtles', mood: 'happy' },
  { id: '2', title: 'Walking on Sunshine', artist: 'Katrina and the Waves', mood: 'excited' },
  { id: '3', title: 'Weightless', artist: 'Marconi Union', mood: 'calm' },
  { id: '4', title: 'Someone Like You', artist: 'Adele', mood: 'sad' },
  { id: '5', title: 'Eye of the Tiger', artist: 'Survivor', mood: 'excited' },
  { id: '6', title: 'Let It Be', artist: 'The Beatles', mood: 'calm' },
];

export const SongSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    const filtered = MOCK_SONGS.filter(
      song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
    if (filtered.length === 0) {
      toast.info('🔍 No songs found');
    }
  };

  const playSong = (song: Song) => {
    toast.success(`🎵 Playing: ${song.title} by ${song.artist}`);
  };

  const likeSong = (song: Song) => {
    toast.success(`❤️ Added ${song.title} to favorites!`);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          🔍 Song Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="🎵 Search for songs or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              🎼 Search for your favorite songs
            </div>
          ) : (
            results.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-3 bg-accent rounded-lg"
              >
                <div>
                  <p className="font-medium">🎵 {song.title}</p>
                  <p className="text-sm text-muted-foreground">👤 {song.artist}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => playSong(song)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => likeSong(song)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};