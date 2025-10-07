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
  audioPreviewUrl?: string;
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
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      matchReason: 'Upbeat tempo and positive lyrics'
    },
    {
      id: '2',
      title: 'Can\'t Stop the Feeling!',
      artist: 'Justin Timberlake',
      album: 'Trolls',
      duration: '3:56',
      genre: 'Pop',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      matchReason: 'Feel-good energy and catchy rhythm'
    },
    {
      id: '3',
      title: 'Walking on Sunshine',
      artist: 'Katrina and the Waves',
      album: 'Walking on Sunshine',
      duration: '3:59',
      genre: 'New Wave',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      matchReason: 'Bright, optimistic sound'
    },
    {
      id: '101',
      title: 'Happy',
      artist: 'Pharrell Williams',
      album: 'G I R L',
      duration: '3:53',
      genre: 'Pop',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      matchReason: 'Pure joy and infectious rhythm'
    },
    {
      id: '102',
      title: 'Shake It Off',
      artist: 'Taylor Swift',
      album: '1989',
      duration: '3:39',
      genre: 'Pop',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      matchReason: 'Carefree attitude and danceable beat'
    },
    {
      id: '103',
      title: 'September',
      artist: 'Earth, Wind & Fire',
      album: 'The Best of Earth, Wind & Fire',
      duration: '3:35',
      genre: 'Funk',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      matchReason: 'Celebratory and uplifting groove'
    },
    {
      id: '104',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      duration: '4:30',
      genre: 'Funk Pop',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      matchReason: 'High energy and feel-good vibes'
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
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      matchReason: 'High energy and driving beat'
    },
    {
      id: '5',
      title: 'Pump It',
      artist: 'Black Eyed Peas',
      album: 'Monkey Business',
      duration: '3:33',
      genre: 'Hip Hop',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      matchReason: 'Explosive energy and party vibe'
    },
    {
      id: '6',
      title: 'Don\'t Stop Me Now',
      artist: 'Queen',
      album: 'Jazz',
      duration: '3:29',
      genre: 'Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      matchReason: 'Pure excitement and unstoppable energy'
    },
    {
      id: '105',
      title: 'Eye of the Tiger',
      artist: 'Survivor',
      album: 'Eye of the Tiger',
      duration: '4:05',
      genre: 'Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      matchReason: 'Motivating and adrenaline-pumping'
    },
    {
      id: '106',
      title: 'We Will Rock You',
      artist: 'Queen',
      album: 'News of the World',
      duration: '2:02',
      genre: 'Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      matchReason: 'Powerful and energizing anthem'
    },
    {
      id: '107',
      title: 'Levels',
      artist: 'Avicii',
      album: 'Levels',
      duration: '3:18',
      genre: 'EDM',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
      matchReason: 'Euphoric build-ups and electric energy'
    },
    {
      id: '108',
      title: 'Jump',
      artist: 'Van Halen',
      album: '1984',
      duration: '4:04',
      genre: 'Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
      matchReason: 'High-octane excitement and joy'
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
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      matchReason: 'Scientifically designed to reduce anxiety'
    },
    {
      id: '8',
      title: 'River',
      artist: 'Leon Bridges',
      album: 'Coming Home',
      duration: '4:17',
      genre: 'Soul',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      matchReason: 'Gentle vocals and peaceful melody'
    },
    {
      id: '9',
      title: 'Mad World',
      artist: 'Gary Jules',
      album: 'Trading Snakeoil for Wolftickets',
      duration: '3:07',
      genre: 'Alternative',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      matchReason: 'Contemplative and serene atmosphere'
    },
    {
      id: '109',
      title: 'Clair de Lune',
      artist: 'Claude Debussy',
      album: 'Suite Bergamasque',
      duration: '5:00',
      genre: 'Classical',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      matchReason: 'Soothing piano and peaceful ambiance'
    },
    {
      id: '110',
      title: 'Breathe Me',
      artist: 'Sia',
      album: 'Colour the Small One',
      duration: '4:33',
      genre: 'Alternative',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      matchReason: 'Soft, introspective, and calming'
    },
    {
      id: '111',
      title: 'Holocene',
      artist: 'Bon Iver',
      album: 'Bon Iver',
      duration: '5:36',
      genre: 'Indie Folk',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      matchReason: 'Ethereal and meditative soundscape'
    },
    {
      id: '112',
      title: 'Stay',
      artist: 'Rihanna ft. Mikky Ekko',
      album: 'Unapologetic',
      duration: '4:00',
      genre: 'Pop',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      matchReason: 'Gentle and emotionally soothing'
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
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      matchReason: 'Emotional depth and cathartic release'
    },
    {
      id: '11',
      title: 'Hurt',
      artist: 'Johnny Cash',
      album: 'American IV: The Man Comes Around',
      duration: '3:38',
      genre: 'Country',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      matchReason: 'Raw emotion and introspective lyrics'
    },
    {
      id: '12',
      title: 'Black',
      artist: 'Pearl Jam',
      album: 'Ten',
      duration: '5:43',
      genre: 'Grunge',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      matchReason: 'Melancholic melody and heartfelt vocals'
    },
    {
      id: '113',
      title: 'The Night We Met',
      artist: 'Lord Huron',
      album: 'Strange Trails',
      duration: '3:28',
      genre: 'Indie Folk',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      matchReason: 'Nostalgic and deeply emotional'
    },
    {
      id: '114',
      title: 'Say Something',
      artist: 'A Great Big World & Christina Aguilera',
      album: 'Is There Anybody Out There?',
      duration: '3:51',
      genre: 'Pop Ballad',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      matchReason: 'Heartbreaking and vulnerable'
    },
    {
      id: '115',
      title: 'Tears in Heaven',
      artist: 'Eric Clapton',
      album: 'Unplugged',
      duration: '4:32',
      genre: 'Acoustic Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
      matchReason: 'Deeply moving and sorrowful'
    },
    {
      id: '116',
      title: 'Fix You',
      artist: 'Coldplay',
      album: 'X&Y',
      duration: '4:54',
      genre: 'Alternative Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
      matchReason: 'Comforting yet melancholic'
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
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      matchReason: 'Aggressive energy for emotional release'
    },
    {
      id: '14',
      title: 'Break Stuff',
      artist: 'Limp Bizkit',
      album: 'Significant Other',
      duration: '2:47',
      genre: 'Nu Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      matchReason: 'Raw anger and cathartic expression'
    },
    {
      id: '15',
      title: 'Killing in the Name',
      artist: 'Rage Against the Machine',
      album: 'Rage Against the Machine',
      duration: '5:14',
      genre: 'Rap Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      matchReason: 'Rebellious energy and powerful message'
    },
    {
      id: '117',
      title: 'Down with the Sickness',
      artist: 'Disturbed',
      album: 'The Sickness',
      duration: '4:38',
      genre: 'Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      matchReason: 'Intense aggression and power'
    },
    {
      id: '118',
      title: 'Last Resort',
      artist: 'Papa Roach',
      album: 'Infest',
      duration: '3:20',
      genre: 'Nu Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      matchReason: 'Frustrated energy and raw emotion'
    },
    {
      id: '119',
      title: 'Freak on a Leash',
      artist: 'Korn',
      album: 'Follow the Leader',
      duration: '4:15',
      genre: 'Nu Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      matchReason: 'Dark and aggressive release'
    },
    {
      id: '120',
      title: 'Chop Suey!',
      artist: 'System of a Down',
      album: 'Toxicity',
      duration: '3:30',
      genre: 'Alternative Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      matchReason: 'Chaotic and cathartic energy'
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
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      matchReason: 'Balanced and contemplative'
    },
    {
      id: '17',
      title: 'Everyday People',
      artist: 'Sly & The Family Stone',
      album: 'Stand!',
      duration: '2:24',
      genre: 'Funk',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      matchReason: 'Steady groove and universal appeal'
    },
    {
      id: '18',
      title: 'The Sound of Silence',
      artist: 'Disturbed',
      album: 'Immortalized',
      duration: '4:08',
      genre: 'Alternative Metal',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      matchReason: 'Reflective and emotionally balanced'
    },
    {
      id: '121',
      title: 'Life on Mars?',
      artist: 'David Bowie',
      album: 'Hunky Dory',
      duration: '3:48',
      genre: 'Art Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      matchReason: 'Thought-provoking and balanced'
    },
    {
      id: '122',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: '6:30',
      genre: 'Rock',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      matchReason: 'Smooth and introspective'
    },
    {
      id: '123',
      title: 'Everything in Its Right Place',
      artist: 'Radiohead',
      album: 'Kid A',
      duration: '4:11',
      genre: 'Electronic',
      audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
      matchReason: 'Ambient and neutrally calming'
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

    // Check if song has audio preview URL
    if (!song.audioPreviewUrl) {
      toast({
        title: "Preview not available",
        description: "This song doesn't have an audio preview yet.",
        variant: "destructive"
      });
      return;
    }

    setPlayingSongId(song.id);

    // Create and play audio
    const audio = new Audio(song.audioPreviewUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingSongId(null);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setPlayingSongId(null);
      audioRef.current = null;
      toast({
        title: "Playback error",
        description: "Could not play this song. Please try another.",
        variant: "destructive"
      });
    };

    try {
      await audio.play();
      toast({
        title: "Now playing",
        description: `${song.title} by ${song.artist}`,
      });
    } catch (error) {
      setPlayingSongId(null);
      audioRef.current = null;
      toast({
        title: "Playback error",
        description: "Could not play this song. Please try another.",
        variant: "destructive"
      });
    }
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
            🎵 Song Recommender 🎧
          </CardTitle>
          <CardDescription>
            🎶 Get personalized music recommendations based on your current mood ✨
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
                  🎧 Generate Recommendations
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
                  🎼 Recommended for you 🎸
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
                    🔍 No songs found matching "{searchQuery}"
                  </p>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSongs.map((song) => (
                  <Card key={song.id} className="group hover:shadow-mood transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-1 flex items-center gap-1">
                          🎵 {song.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1">
                          🎤 {song.artist}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                          💿 {song.album}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">⏱️ {song.duration}</span>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          🎸 {song.genre}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground italic flex items-start gap-1">
                        <span>💡</span>
                        <span>{song.matchReason}</span>
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