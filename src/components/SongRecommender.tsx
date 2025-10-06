import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Heart, ExternalLink, RefreshCw, Search, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  spotifyUrl?: string;
  matchReason: string;
}

interface MoodSongs {
  [key: string]: Song[];
}

const moodSongs: MoodSongs = {
  happy: [
    {
      id: '1',
      title: 'Good as Hell',
      artist: 'Lizzo',
      album: 'Cuz I Love You',
      duration: '2:39',
      genre: 'Pop',
      matchReason: 'Upbeat tempo and positive lyrics'
    },
    {
      id: '2',
      title: 'Can\'t Stop the Feeling!',
      artist: 'Justin Timberlake',
      album: 'Trolls',
      duration: '3:56',
      genre: 'Pop',
      matchReason: 'Feel-good energy and catchy rhythm'
    },
    {
      id: '3',
      title: 'Walking on Sunshine',
      artist: 'Katrina and the Waves',
      album: 'Walking on Sunshine',
      duration: '3:59',
      genre: 'New Wave',
      matchReason: 'Bright, optimistic sound'
    }
  ],
  excited: [
    {
      id: '4',
      title: 'Thunder',
      artist: 'Imagine Dragons',
      album: 'Evolve',
      duration: '3:07',
      genre: 'Pop Rock',
      matchReason: 'High energy and driving beat'
    },
    {
      id: '5',
      title: 'Pump It',
      artist: 'Black Eyed Peas',
      album: 'Monkey Business',
      duration: '3:33',
      genre: 'Hip Hop',
      matchReason: 'Explosive energy and party vibe'
    },
    {
      id: '6',
      title: 'Don\'t Stop Me Now',
      artist: 'Queen',
      album: 'Jazz',
      duration: '3:29',
      genre: 'Rock',
      matchReason: 'Pure excitement and unstoppable energy'
    }
  ],
  calm: [
    {
      id: '7',
      title: 'Weightless',
      artist: 'Marconi Union',
      album: 'Weightless',
      duration: '8:10',
      genre: 'Ambient',
      matchReason: 'Scientifically designed to reduce anxiety'
    },
    {
      id: '8',
      title: 'River',
      artist: 'Leon Bridges',
      album: 'Coming Home',
      duration: '4:17',
      genre: 'Soul',
      matchReason: 'Gentle vocals and peaceful melody'
    },
    {
      id: '9',
      title: 'Mad World',
      artist: 'Gary Jules',
      album: 'Trading Snakeoil for Wolftickets',
      duration: '3:07',
      genre: 'Alternative',
      matchReason: 'Contemplative and serene atmosphere'
    }
  ],
  sad: [
    {
      id: '10',
      title: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      duration: '4:45',
      genre: 'Soul',
      matchReason: 'Emotional depth and cathartic release'
    },
    {
      id: '11',
      title: 'Hurt',
      artist: 'Johnny Cash',
      album: 'American IV: The Man Comes Around',
      duration: '3:38',
      genre: 'Country',
      matchReason: 'Raw emotion and introspective lyrics'
    },
    {
      id: '12',
      title: 'Black',
      artist: 'Pearl Jam',
      album: 'Ten',
      duration: '5:43',
      genre: 'Grunge',
      matchReason: 'Melancholic melody and heartfelt vocals'
    }
  ],
  angry: [
    {
      id: '13',
      title: 'Bodies',
      artist: 'Drowning Pool',
      album: 'Sinner',
      duration: '3:22',
      genre: 'Metal',
      matchReason: 'Aggressive energy for emotional release'
    },
    {
      id: '14',
      title: 'Break Stuff',
      artist: 'Limp Bizkit',
      album: 'Significant Other',
      duration: '2:47',
      genre: 'Nu Metal',
      matchReason: 'Raw anger and cathartic expression'
    },
    {
      id: '15',
      title: 'Killing in the Name',
      artist: 'Rage Against the Machine',
      album: 'Rage Against the Machine',
      duration: '5:14',
      genre: 'Rap Metal',
      matchReason: 'Rebellious energy and powerful message'
    }
  ],
  neutral: [
    {
      id: '16',
      title: 'Breathe',
      artist: 'Pink Floyd',
      album: 'The Dark Side of the Moon',
      duration: '2:43',
      genre: 'Progressive Rock',
      matchReason: 'Balanced and contemplative'
    },
    {
      id: '17',
      title: 'Everyday People',
      artist: 'Sly & The Family Stone',
      album: 'Stand!',
      duration: '2:24',
      genre: 'Funk',
      matchReason: 'Steady groove and universal appeal'
    },
    {
      id: '18',
      title: 'The Sound of Silence',
      artist: 'Disturbed',
      album: 'Immortalized',
      duration: '4:08',
      genre: 'Alternative Metal',
      matchReason: 'Reflective and emotionally balanced'
    }
  ]
};

interface SongRecommenderProps {
  selectedMood?: { id: string; label: string } | null;
  likedSongs: any[];
  setLikedSongs: (songs: any[]) => void;
}

export const SongRecommender = ({ selectedMood, likedSongs, setLikedSongs }: SongRecommenderProps) => {
  const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [likedSongsSet, setLikedSongsSet] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

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
      const songsForMood = moodSongs[selectedMood.id] || moodSongs.neutral;
      setCurrentSongs(songsForMood);
      setIsGenerating(false);
      
      toast({
        title: "Songs generated!",
        description: `Found ${songsForMood.length} songs for your ${selectedMood.label} mood.`
      });
    }, 1500);
  };

  const toggleLike = (songId: string) => {
    const newLikedSongsSet = new Set(likedSongsSet);
    const song = currentSongs.find(s => s.id === songId);
    
    if (newLikedSongsSet.has(songId)) {
      newLikedSongsSet.delete(songId);
      setLikedSongs(likedSongs.filter(s => s.id !== songId));
    } else {
      newLikedSongsSet.add(songId);
      if (song && selectedMood) {
        setLikedSongs([...likedSongs, { ...song, mood: selectedMood.label }]);
      }
    }
    setLikedSongsSet(newLikedSongsSet);
  };

  const playSong = async (song: Song) => {
    // Stop currently playing song if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // If clicking the same song, just stop it
    if (playingSongId === song.id) {
      setPlayingSongId(null);
      return;
    }

    setPlayingSongId(song.id);

    // Use Web Speech API to announce the song
    const utterance = new SpeechSynthesisUtterance(
      `Now playing ${song.title} by ${song.artist}`
    );
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setPlayingSongId(null);
    };

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);

    toast({
      title: "Playing song",
      description: `Now playing: ${song.title} by ${song.artist}`,
      action: (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            window.speechSynthesis.cancel();
            setPlayingSongId(null);
          }}
        >
          Stop
        </Button>
      ),
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
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Song Recommender
          </CardTitle>
          <CardDescription>
            Get personalized music recommendations based on your current mood
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
                  Generating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate Recommendations
                </>
              )}
            </Button>
          </div>

          {!selectedMood && (
            <div className="text-center text-muted-foreground">
              Select a mood from the Mood Logger to get started!
            </div>
          )}

          {selectedMood && (
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                Current mood: {selectedMood.label}
              </Badge>
            </div>
          )}

          {/* Song recommendations */}
          {currentSongs.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-center">
                  Recommended for you
                </h3>
                
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search songs, artists, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {filteredSongs.length === 0 && searchQuery && (
                  <p className="text-center text-muted-foreground">
                    No songs found matching "{searchQuery}"
                  </p>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSongs.map((song) => (
                  <Card key={song.id} className="group hover:shadow-mood transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-1">{song.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{song.album}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{song.duration}</span>
                        <Badge variant="outline" className="text-xs">
                          {song.genre}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground italic">
                        {song.matchReason}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant={playingSongId === song.id ? "default" : "outline"}
                          onClick={() => playSong(song)}
                          className="flex-1"
                        >
                          {playingSongId === song.id ? (
                            <>
                              <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
                              Playing
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Play
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleLike(song.id)}
                          className={likedSongsSet.has(song.id) ? 'text-red-500 border-red-500' : ''}
                        >
                          <Heart className={`h-3 w-3 ${likedSongsSet.has(song.id) ? 'fill-current' : ''}`} />
                        </Button>
                        {song.spotifyUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};