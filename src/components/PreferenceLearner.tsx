import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Music, TrendingUp, BarChart3 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
}

interface PreferenceLearnerProps {
  likedSongs: Song[];
}

export const PreferenceLearner = ({ likedSongs }: PreferenceLearnerProps) => {
  // Calculate statistics
  const genreCounts = likedSongs.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodCounts = likedSongs.reduce((acc, song) => {
    acc[song.mood] = (acc[song.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const artistCounts = likedSongs.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topMoods = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topArtists = Object.entries(artistCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const totalLikes = likedSongs.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent flex items-center justify-center gap-2">
            🧠 Preference Learner 📊
          </CardTitle>
          <CardDescription>
            📈 Your personalized music insights based on listening patterns ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalLikes === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">💙 No preferences yet</h3>
              <p className="text-muted-foreground">
                🎵 Start liking songs in the Song Recommender to build your profile! ⭐
              </p>
            </div>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-3xl font-bold">{totalLikes}</div>
                    <p className="text-sm text-muted-foreground">❤️ Liked Songs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-3xl font-bold">{Object.keys(genreCounts).length}</div>
                    <p className="text-sm text-muted-foreground">🎸 Genres Explored</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-3xl font-bold">{Object.keys(artistCounts).length}</div>
                    <p className="text-sm text-muted-foreground">🎤 Artists Discovered</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Genres */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  🎸 Top Genres
                </h3>
                {topGenres.map(([genre, count]) => (
                  <div key={genre} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{genre}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {count} {count === 1 ? 'song' : 'songs'}
                      </span>
                    </div>
                    <Progress value={(count / totalLikes) * 100} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Top Moods */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  😊 Favorite Moods
                </h3>
                {topMoods.map(([mood, count]) => (
                  <div key={mood} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">{mood}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((count / totalLikes) * 100)}%
                      </span>
                    </div>
                    <Progress value={(count / totalLikes) * 100} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Top Artists */}
              {topArtists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    ⭐ Most Liked Artists
                  </h3>
                  <div className="grid gap-2">
                    {topArtists.map(([artist, count], index) => (
                      <div key={artist} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                          <div>
                            <div className="font-medium">{artist}</div>
                            <div className="text-sm text-muted-foreground">
                              {count} {count === 1 ? 'song' : 'songs'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Likes */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">🕐 Recently Liked</h3>
                <div className="grid gap-2">
                  {likedSongs.slice(-5).reverse().map((song) => (
                    <div key={song.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div>
                        <div className="font-medium">🎵 {song.title}</div>
                        <div className="text-sm text-muted-foreground">🎤 {song.artist}</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{song.genre}</Badge>
                        <Badge variant="secondary" className="text-xs capitalize">{song.mood}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
