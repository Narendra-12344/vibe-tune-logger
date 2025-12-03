import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Plus, Trash2, Music, Save, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Song {
  id: string;
  title: string;
  artist: string;
  mood_tags: string[];
}

interface PlaylistSong {
  id: string;
  title: string;
  artist: string;
}

const MOOD_COLORS: Record<string, string> = {
  happy: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  calm: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  sad: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  energetic: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  romantic: 'bg-pink-500/20 text-pink-700 dark:text-pink-400',
  melancholic: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  excited: 'bg-red-500/20 text-red-700 dark:text-red-400',
  angry: 'bg-red-600/20 text-red-700 dark:text-red-400',
  neutral: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

export const DragDropPlaylistBuilder = () => {
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<PlaylistSong[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string | null>(null);
  const [draggedSong, setDraggedSong] = useState<Song | PlaylistSong | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserSongs();
  }, []);

  const fetchUserSongs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_songs')
      .select('id, title, artist, mood_tags')
      .eq('user_id', user.id);

    if (!error && data) {
      setAvailableSongs(data);
    }
  };

  const handleDragStart = (e: React.DragEvent, song: Song | PlaylistSong) => {
    setDraggedSong(song);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToPlaylist = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSong && !playlistSongs.find(s => s.id === draggedSong.id)) {
      setPlaylistSongs(prev => [...prev, {
        id: draggedSong.id,
        title: draggedSong.title,
        artist: draggedSong.artist,
      }]);
    }
    setDraggedSong(null);
  };

  const handleRemoveFromPlaylist = (songId: string) => {
    setPlaylistSongs(prev => prev.filter(s => s.id !== songId));
  };

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const newList = [...playlistSongs];
    const [removed] = newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, removed);
    setPlaylistSongs(newList);
  };

  const savePlaylist = async () => {
    if (!playlistName.trim()) {
      toast({ title: 'Please enter a playlist name', variant: 'destructive' });
      return;
    }
    if (playlistSongs.length === 0) {
      toast({ title: 'Add at least one song', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create playlist
      const { data: playlist, error: playlistError } = await supabase
        .from('custom_playlists')
        .insert({ user_id: user.id, name: playlistName })
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Add songs to playlist
      const playlistSongsData = playlistSongs.map((song, index) => ({
        playlist_id: playlist.id,
        song_id: song.id,
        title: song.title,
        artist: song.artist,
      }));

      const { error: songsError } = await supabase
        .from('playlist_songs')
        .insert(playlistSongsData);

      if (songsError) throw songsError;

      toast({ title: 'Playlist saved successfully!' });
      setPlaylistName('');
      setPlaylistSongs([]);
    } catch (error) {
      console.error('Error saving playlist:', error);
      toast({ title: 'Failed to save playlist', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const filteredSongs = selectedMoodFilter
    ? availableSongs.filter(s => s.mood_tags.includes(selectedMoodFilter))
    : availableSongs;

  const uniqueMoods = [...new Set(availableSongs.flatMap(s => s.mood_tags))];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Available Songs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Your Songs
          </CardTitle>
          <CardDescription>Drag songs to build your playlist</CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant={selectedMoodFilter === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedMoodFilter(null)}
            >
              All
            </Badge>
            {uniqueMoods.map(mood => (
              <Badge
                key={mood}
                variant={selectedMoodFilter === mood ? 'default' : 'outline'}
                className={cn('cursor-pointer', MOOD_COLORS[mood])}
                onClick={() => setSelectedMoodFilter(mood)}
              >
                {mood}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredSongs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No songs found. Upload some songs first!
              </p>
            ) : (
              filteredSongs.map(song => (
                <div
                  key={song.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, song)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-grab active:cursor-grabbing hover:bg-muted transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  <div className="flex gap-1">
                    {song.mood_tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className={cn('text-xs', MOOD_COLORS[tag])}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setPlaylistSongs(prev => [...prev, { id: song.id, title: song.title, artist: song.artist }])}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Playlist Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListMusic className="w-5 h-5" />
            New Playlist
          </CardTitle>
          <Input
            placeholder="Enter playlist name..."
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropToPlaylist}
            className={cn(
              "min-h-[300px] max-h-[400px] overflow-y-auto rounded-lg border-2 border-dashed p-4 transition-colors",
              draggedSong ? "border-primary bg-primary/5" : "border-muted"
            )}
          >
            {playlistSongs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Drop songs here to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {playlistSongs.map((song, index) => (
                  <div
                    key={`${song.id}-${index}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', index.toString());
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      handleReorder(dragIndex, index);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border cursor-grab active:cursor-grabbing"
                  >
                    <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFromPlaylist(song.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button
            onClick={savePlaylist}
            disabled={saving || !playlistName.trim() || playlistSongs.length === 0}
            className="w-full mt-4"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Playlist'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
