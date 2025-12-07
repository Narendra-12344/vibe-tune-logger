import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer, Song } from '@/contexts/AudioPlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Play, Pause, Plus, Music2, Loader2 } from 'lucide-react';

interface JioSaavnSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  previewUrl: string | null;
  language: string;
}

export const JioSaavnSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JioSaavnSong[]>([]);
  const [loading, setLoading] = useState(false);
  const { play, pause, isPlaying, currentSong, addToQueue } = useAudioPlayer();

  const searchSongs = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jiosaavn-search', {
        body: { query: query.trim(), language: 'telugu' },
      });

      if (error) throw error;

      if (data?.songs) {
        setResults(data.songs);
        if (data.songs.length === 0) {
          toast.info('No songs found. Try a different search term.');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song: JioSaavnSong) => {
    if (!song.previewUrl) {
      toast.error('Preview not available for this song');
      return;
    }

    const playerSong: Song = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.previewUrl,
      mood: 'happy',
    };

    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(playerSong);
    }
  };

  const handleAddToQueue = (song: JioSaavnSong) => {
    if (!song.previewUrl) {
      toast.error('Preview not available for this song');
      return;
    }

    const playerSong: Song = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.previewUrl,
      mood: 'happy',
    };

    addToQueue(playerSong);
    toast.success(`Added "${song.title}" to queue`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchSongs();
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-primary" />
          JioSaavn Telugu Songs
        </CardTitle>
        <CardDescription>
          Search and stream Telugu songs from JioSaavn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search Telugu songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={searchSongs} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {results.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors border border-border/50"
                >
                  {song.image && (
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {song.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {song.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handlePlay(song)}
                      disabled={!song.previewUrl}
                      className="h-8 w-8"
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddToQueue(song)}
                      disabled={!song.previewUrl}
                      className="h-8 w-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-8 text-muted-foreground">
            <Music2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Search for your favorite Telugu songs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};