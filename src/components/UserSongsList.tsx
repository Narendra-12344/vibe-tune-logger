import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useToast } from '@/hooks/use-toast';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { SongSearchFilter } from '@/components/SongSearchFilter';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Play, Pause, Trash2, Music2, ListPlus, Download, Clock, WifiOff, Wifi } from 'lucide-react';

interface UserSong {
  id: string;
  title: string;
  artist: string;
  mood_tags: string[];
  file_path: string;
  duration: number | null;
}

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface UserSongsListProps {
  selectedMood?: string;
}

export const UserSongsList = ({ selectedMood }: UserSongsListProps) => {
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [allSongs, setAllSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<string | undefined>(selectedMood);
  const { currentSong, isPlaying, play, pause, addToQueue } = useAudioPlayer();
  const { toast } = useToast();
  const { isOnline, cacheSong, cachedSongs } = useServiceWorker();

  // Get unique moods from all songs
  const availableMoods = useMemo(() => {
    const moods = new Set<string>();
    allSongs.forEach(song => {
      song.mood_tags?.forEach(mood => moods.add(mood));
    });
    return Array.from(moods);
  }, [allSongs]);

  useEffect(() => {
    fetchUserSongs();
  }, []);

  useEffect(() => {
    filterSongs();
  }, [searchQuery, moodFilter, allSongs, selectedMood]);

  const fetchUserSongs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = () => {
    let filtered = [...allSongs];
    
    // Apply mood filter from prop or search filter
    const activeMood = moodFilter || selectedMood;
    if (activeMood) {
      filtered = filtered.filter(song => song.mood_tags?.includes(activeMood));
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
      );
    }
    
    setSongs(filtered);
  };

  const handleSearch = (query: string, filters: { mood?: string }) => {
    setSearchQuery(query);
    setMoodFilter(filters.mood);
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

  if (allSongs.length === 0) {
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Music Library ({songs.length} songs)</CardTitle>
            <CardDescription>
              {moodFilter || selectedMood ? `Filtered by ${moodFilter || selectedMood}` : 'All uploaded songs'}
            </CardDescription>
          </div>
          <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SongSearchFilter 
          onSearch={handleSearch} 
          availableMoods={availableMoods} 
        />
        
        {songs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Music2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No songs match your search</p>
          </div>
        ) : (
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">{song.artist}</span>
                    {song.duration && (
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatDuration(song.duration)}
                      </span>
                    )}
                  </div>
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
                <FavoriteButton
                  songId={song.id}
                  title={song.title}
                  artist={song.artist}
                  moodId={song.mood_tags?.[0]}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const songUrl = song.file_path.startsWith('http') 
                      ? song.file_path 
                      : supabase.storage.from('user-songs').getPublicUrl(song.file_path).data.publicUrl;
                    cacheSong(songUrl);
                    toast({
                      title: 'Song cached',
                      description: 'Song saved for offline playback',
                    });
                  }}
                  title="Save for offline"
                >
                  <Download className="w-4 h-4" />
                </Button>
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
        )}
      </CardContent>
    </Card>
  );
};
