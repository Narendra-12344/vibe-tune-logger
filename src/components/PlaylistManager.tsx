import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Music, Trash2, Plus } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error: any) {
      toast.error('Failed to load playlists');
    }
  };

  const createPlaylist = async () => {
    if (!name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('custom_playlists')
        .insert({
          user_id: user.id,
          name,
          description: description || null
        });

      if (error) throw error;
      toast.success('🎧 Playlist created!');
      setName('');
      setDescription('');
      fetchPlaylists();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlaylists(playlists.filter(p => p.id !== id));
      toast.success('🗑️ Playlist deleted');
    } catch (error: any) {
      toast.error('Failed to delete playlist');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          🎧 Custom Playlists
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="🎵 Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="📝 Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={createPlaylist} disabled={loading} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            ✨ Create Playlist
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {playlists.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              🎼 No playlists yet. Create your first one!
            </div>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between p-4 bg-accent rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">🎵 {playlist.name}</h3>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground">{playlist.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePlaylist(playlist.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};