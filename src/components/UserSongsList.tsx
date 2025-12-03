import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, Trash2, Music2, ListPlus } from 'lucide-react';

interface UserSong {
  id: string;
  title: string;
  artist: string;
  mood_tags: string[];
  file_path: string;
}

interface UserSongsListProps {
  selectedMood?: string;
}

export const UserSongsList = ({ selectedMood }: UserSongsListProps) => {
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSong, isPlaying, play, pause, addToQueue } = useAudioPlayer();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserSongs();
  }, [selectedMood]);

  const fetchUserSongs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('user_songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Filter by mood if selected
      const filteredData = selectedMood
        ? data?.filter(song => song.mood_tags?.includes(selectedMood))
        : data;

      setSongs(filteredData || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (song: UserSong) => {
    // file_path already contains the full public URL from upload
    const songUrl = song.file_path.startsWith('http') 
      ? song.file_path 
      : supabase.storage.from('user-songs').getPublicUrl(song.file_path).data.publicUrl;

    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play({
        id: song.id,
        title: song.title,
        artist: song.artist,
        url: songUrl,
        mood: song.mood_tags?.[0],
      });
    }
  };

  const handleAddToQueue = (song: UserSong) => {
    const songUrl = song.file_path.startsWith('http') 
      ? song.file_path 
      : supabase.storage.from('user-songs').getPublicUrl(song.file_path).data.publicUrl;

    addToQueue({
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: songUrl,
      mood: song.mood_tags?.[0],
    });
    
    toast({
      title: 'Added to queue',
      description: `${song.title} will play next`,
    });
  };

  const handleDelete = async (song: UserSong) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete from storage
      await supabase.storage
        .from('user-songs')
        .remove([song.file_path]);

      // Delete from database
      await supabase
        .from('user_songs')
        .delete()
        .eq('id', song.id)
        .eq('user_id', user.id);

      toast({
        title: 'Song deleted',
        description: 'Song has been removed from your library',
      });

      fetchUserSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the song',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading your songs...</div>;
  }

  if (songs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Music2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No songs uploaded yet. Upload your first song above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Music Library</CardTitle>
        <CardDescription>
          {selectedMood ? `Showing ${selectedMood} songs` : 'All uploaded songs'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {songs.map((song) => (
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
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {song.mood_tags?.map((mood) => (
                      <Badge key={mood} variant="secondary" className="text-xs">
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </div>
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
                  onClick={() => handleDelete(song)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
