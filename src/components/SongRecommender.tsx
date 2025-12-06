import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Pause, Heart, RefreshCw, Search, Share2, ListPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { ShareDialog } from '@/components/ShareDialog';
import { teluguMoodSongs, TeluguSong } from '@/data/teluguSongs';

interface SongRecommenderProps {
  selectedMood?: { id: string; label: string } | null;
  likedSongs: any[];
  setLikedSongs: (songs: any[]) => void;
}

export const SongRecommender = ({ selectedMood, likedSongs, setLikedSongs }: SongRecommenderProps) => {
  const [currentSongs, setCurrentSongs] = useState<TeluguSong[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [likedSongsSet, setLikedSongsSet] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { currentSong, isPlaying, play, pause, resume, addToQueue } = useAudioPlayer();

  // Load liked songs from database on mount
  useEffect(() => {
    loadLikedSongs();
  }, []);

  const loadLikedSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*');

      if (error) throw error;
      
      const songIds = new Set(data?.map(s => s.song_id) || []);
      setLikedSongsSet(songIds);
      setLikedSongs(data || []);
    } catch (error: any) {
      console.error('Error loading liked songs:', error);
    }
  };

  const generateRecommendations = () => {
    if (!selectedMood) {
      toast({
        title: "No mood selected",
        description: "Please select a mood first to get song recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const songsForMood = teluguMoodSongs[selectedMood.id] || teluguMoodSongs.neutral;
      setCurrentSongs(songsForMood);
      setIsGenerating(false);
      
      toast({
        title: "Songs generated!",
        description: `Found ${songsForMood.length} Telugu songs for your ${selectedMood.label} mood.`
      });
    }, 1500);
  };

  const toggleLike = async (songId: string) => {
    const song = currentSongs.find(s => s.id === songId);
    if (!song) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        sonnerToast.error('Please login to like songs');
        return;
      }

      const newLikedSongsSet = new Set(likedSongsSet);
      
      if (newLikedSongsSet.has(songId)) {
        // Unlike the song
        newLikedSongsSet.delete(songId);
        
        const { error } = await supabase
          .from('liked_songs')
          .delete()
          .eq('song_id', songId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setLikedSongs(likedSongs.filter(s => s.song_id !== songId));
        sonnerToast.success('💔 Removed from favorites');
      } else {
        // Like the song
        newLikedSongsSet.add(songId);
        
        const { error } = await supabase
          .from('liked_songs')
          .insert({
            user_id: user.id,
            song_id: songId,
            title: song.title,
            artist: song.artist,
            mood_id: selectedMood?.id || 'neutral'
          });

        if (error) throw error;
        
        setLikedSongs([...likedSongs, { 
          song_id: songId,
          title: song.title,
          artist: song.artist,
          mood_id: selectedMood?.id || 'neutral'
        }]);
        sonnerToast.success('❤️ Added to favorites!');
      }
      
      setLikedSongsSet(newLikedSongsSet);
    } catch (error: any) {
      console.error('Error toggling like:', error);
      sonnerToast.error('Failed to update favorites');
    }
  };

  const playSong = async (song: TeluguSong) => {
    // If clicking the same song that's playing, toggle pause/play
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
      return;
    }

    // Check if song has audio preview URL
    if (!song.audioPreviewUrl) {
      toast({
        title: "Preview not available",
        description: "This song doesn't have an audio preview yet.",
        variant: "destructive"
      });
      return;
    }

    // Play with global audio player
    play({
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.audioPreviewUrl,
      mood: selectedMood?.id,
    });
  };

  // Filter songs based on search query
  const filteredSongs = currentSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent flex items-center justify-center gap-2">
            🎵 Telugu Song Recommender 🎧
          </CardTitle>
          <CardDescription>
            🎶 Get personalized Telugu music recommendations based on your current mood ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generate button */}
          <div className="flex justify-center">
            <Button 
              onClick={generateRecommendations}
              disabled={!selectedMood || isGenerating}
              className="min-w-[200px] h-12 bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  🎵 Generating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  🎧 Generate Telugu Songs
                </>
              )}
            </Button>
          </div>

          {!selectedMood && (
            <div className="text-center text-muted-foreground">
              😊 Select a mood from the Mood Logger to get started! 🎵
            </div>
          )}

          {selectedMood && (
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                🎭 Current mood: {selectedMood.label}
              </Badge>
            </div>
          )}

          {/* Song recommendations */}
          {currentSongs.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-center">
                  🎼 Telugu Songs for you 🎸
                </h3>
                
                {/* Search bar */}
                <div className="relative max-w-md mx-auto w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Telugu songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSongs.map((song) => (
                  <Card key={song.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate flex items-center gap-1">
                            🎵 {song.title}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                            🎤 {song.artist}
                          </p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            💿 {song.album}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>⏱️ {song.duration}</span>
                        <Badge variant="outline" className="text-xs">
                          🎸 {song.genre}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        💡 {song.matchReason}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playSong(song)}
                          className="flex-1"
                        >
                          {currentSong?.id === song.id && isPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Play
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            addToQueue({
                              id: song.id,
                              title: song.title,
                              artist: song.artist,
                              url: song.audioPreviewUrl,
                              mood: selectedMood?.id,
                            });
                            sonnerToast.success('Added to queue');
                          }}
                          title="Add to queue"
                        >
                          <ListPlus className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleLike(song.id)}
                          className={likedSongsSet.has(song.id) ? 'text-red-500' : ''}
                        >
                          <Heart className={`h-4 w-4 ${likedSongsSet.has(song.id) ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <ShareDialog title={song.title} artist={song.artist} type="song">
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </ShareDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredSongs.length === 0 && searchQuery && (
                <p className="text-center text-muted-foreground py-4">
                  No Telugu songs found matching "{searchQuery}"
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
