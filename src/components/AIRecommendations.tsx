import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAudioPlayer, Song } from '@/contexts/AudioPlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Play, Plus, RefreshCw, Brain, Music } from 'lucide-react';
import { teluguMoodSongs } from '@/data/teluguSongs';

interface AIRecommendation {
  title: string;
  artist: string;
  album: string;
  reason: string;
  mood: string;
}

interface AIRecommendationsProps {
  currentMood?: string;
  listeningHistory?: { title: string; artist: string; mood: string }[];
}

export const AIRecommendations = ({ currentMood, listeningHistory = [] }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { play, addToQueue, currentSong, isPlaying, pause } = useAudioPlayer();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          listeningHistory: listeningHistory.slice(-10), // Last 10 songs
          currentMood: currentMood || 'happy',
          favoriteGenres: ['romantic', 'folk', 'classical'],
        },
      });

      if (error) throw error;

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
        setHasLoaded(true);
      } else {
        toast.error('No recommendations received');
      }
    } catch (error: any) {
      console.error('AI recommendations error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('AI credits exhausted. Please add credits.');
      } else {
        toast.error('Failed to get AI recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  // Find matching audio URL from our Telugu songs database
  const findAudioUrl = (title: string, mood: string): string => {
    // First try to find exact match
    const allSongs = Object.values(teluguMoodSongs).flat();
    const exactMatch = allSongs.find(
      s => s.title.toLowerCase().includes(title.toLowerCase()) ||
           title.toLowerCase().includes(s.title.toLowerCase())
    );
    if (exactMatch) return exactMatch.audioPreviewUrl;

    // Fall back to mood-based song
    const moodSongs = teluguMoodSongs[mood] || teluguMoodSongs['happy'];
    if (moodSongs && moodSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * moodSongs.length);
      return moodSongs[randomIndex].audioPreviewUrl;
    }

    // Final fallback
    return teluguMoodSongs.happy[0].audioPreviewUrl;
  };

  const handlePlay = (rec: AIRecommendation) => {
    const audioUrl = findAudioUrl(rec.title, rec.mood);
    const song: Song = {
      id: `ai-${rec.title.replace(/\s+/g, '-').toLowerCase()}`,
      title: rec.title,
      artist: rec.artist,
      url: audioUrl,
      mood: rec.mood,
    };

    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(song);
    }
  };

  const handleAddToQueue = (rec: AIRecommendation) => {
    const audioUrl = findAudioUrl(rec.title, rec.mood);
    const song: Song = {
      id: `ai-${rec.title.replace(/\s+/g, '-').toLowerCase()}`,
      title: rec.title,
      artist: rec.artist,
      url: audioUrl,
      mood: rec.mood,
    };
    addToQueue(song);
    toast.success(`Added "${rec.title}" to queue`);
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-500/20 text-yellow-500',
      sad: 'bg-blue-500/20 text-blue-500',
      calm: 'bg-green-500/20 text-green-500',
      excited: 'bg-orange-500/20 text-orange-500',
      romantic: 'bg-pink-500/20 text-pink-500',
      devotional: 'bg-purple-500/20 text-purple-500',
      classical: 'bg-indigo-500/20 text-indigo-500',
      folk: 'bg-amber-500/20 text-amber-500',
    };
    return colors[mood] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Personalized Telugu songs based on your listening history
            </CardDescription>
          </div>
          <Button
            onClick={fetchRecommendations}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            <span className="ml-2">{hasLoaded ? 'Refresh' : 'Get Recommendations'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
                <Skeleton className="w-10 h-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors border border-border/50"
                >
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{rec.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {rec.artist} • {rec.album}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {rec.reason}
                    </p>
                    <Badge className={`mt-2 text-xs ${getMoodColor(rec.mood)}`}>
                      {rec.mood}
                    </Badge>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handlePlay(rec)}
                      className="h-8 w-8"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddToQueue(rec)}
                      className="h-8 w-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click "Get Recommendations" to receive AI-powered song suggestions</p>
            <p className="text-sm mt-2">Based on your mood and listening patterns</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};