import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, Heart, ListPlus, Shuffle } from 'lucide-react';

interface LikedSong {
  id: string;
  song_id: string;
  title: string;
  artist: string;
  mood_id: string;
  created_at: string;
}

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState<LikedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSong, isPlaying, play, pause, addToQueue, setQueue } = useAudioPlayer();
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
    
    // Subscribe to changes
    const channel = supabase
      .channel('liked_songs_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'liked_songs' },
        () => fetchFavorites()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = async (song: LikedSong) => {
    // Try to get the song URL from user_songs first
    const { data: userSong } = await supabase
      .from('user_songs')
      .select('file_path')
      .eq('id', song.song_id)
      .maybeSingle();

    const songUrl = userSong?.file_path?.startsWith('http')
      ? userSong.file_path
      : userSong?.file_path
        ? supabase.storage.from('user-songs').getPublicUrl(userSong.file_path).data.publicUrl
        : `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.floor(Math.random() * 16) + 1}.mp3`;

    if (currentSong?.id === song.song_id && isPlaying) {
      pause();
    } else {
      play({
        id: song.song_id,
        title: song.title,
        artist: song.artist,
        url: songUrl,
        mood: song.mood_id,
      });
    }
  };

  const handleAddToQueue = async (song: LikedSong) => {
    const { data: userSong } = await supabase
      .from('user_songs')
      .select('file_path')
      .eq('id', song.song_id)
      .maybeSingle();

    const songUrl = userSong?.file_path?.startsWith('http')
      ? userSong.file_path
      : userSong?.file_path
        ? supabase.storage.from('user-songs').getPublicUrl(userSong.file_path).data.publicUrl
        : `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.floor(Math.random() * 16) + 1}.mp3`;

    addToQueue({
      id: song.song_id,
      title: song.title,
      artist: song.artist,
      url: songUrl,
      mood: song.mood_id,
    });

    toast({
      title: 'Added to queue',
      description: `${song.title} will play next`,
    });
  };

  const handleShufflePlay = async () => {
    if (favorites.length === 0) return;

    const shuffled = [...favorites].sort(() => Math.random() - 0.5);
    const firstSong = shuffled[0];
    
    // Play first song
    await handlePlayPause(firstSong);

    // Add rest to queue
    for (let i = 1; i < shuffled.length; i++) {
      const song = shuffled[i];
      const { data: userSong } = await supabase
        .from('user_songs')
        .select('file_path')
        .eq('id', song.song_id)
        .maybeSingle();

      const songUrl = userSong?.file_path?.startsWith('http')
        ? userSong.file_path
        : userSong?.file_path
          ? supabase.storage.from('user-songs').getPublicUrl(userSong.file_path).data.publicUrl
          : `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.floor(Math.random() * 16) + 1}.mp3`;

      addToQueue({
        id: song.song_id,
        title: song.title,
        artist: song.artist,
        url: songUrl,
        mood: song.mood_id,
      });
    }

    toast({
      title: 'Shuffle play',
      description: `Playing ${favorites.length} songs in random order`,
    });
  };

  const removeFavorite = async (song: LikedSong) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('liked_songs')
        .delete()
        .eq('id', song.id)
        .eq('user_id', user.id);

      toast({
        title: 'Removed from favorites',
        description: `${song.title} removed from your liked songs`,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading favorites...</div>;
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No favorites yet. Heart songs to add them here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              Favorites ({favorites.length})
            </CardTitle>
            <CardDescription>Your liked songs</CardDescription>
          </div>
          <Button onClick={handleShufflePlay} variant="outline" size="sm">
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {favorites.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlayPause(song)}
                >
                  {currentSong?.id === song.song_id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {song.mood_id}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddToQueue(song)}
                  title="Add to queue"
                >
                  <ListPlus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFavorite(song)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
