import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BarChart3, TrendingUp } from 'lucide-react';

export const Statistics = () => {
  const [stats, setStats] = useState<any>({
    totalMoods: 0,
    totalJournalEntries: 0,
    totalLikedSongs: 0,
    totalPlaylists: 0,
    moodDistribution: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [moods, journals, songs, playlists] = await Promise.all([
        supabase.from('mood_logs').select('mood_id', { count: 'exact' }),
        supabase.from('mood_journal_entries').select('id', { count: 'exact' }),
        supabase.from('liked_songs').select('id', { count: 'exact' }),
        supabase.from('custom_playlists').select('id', { count: 'exact' })
      ]);

      const moodDist: any = {};
      moods.data?.forEach((m: any) => {
        moodDist[m.mood_id] = (moodDist[m.mood_id] || 0) + 1;
      });

      setStats({
        totalMoods: moods.count || 0,
        totalJournalEntries: journals.count || 0,
        totalLikedSongs: songs.count || 0,
        totalPlaylists: playlists.count || 0,
        moodDistribution: moodDist
      });
    } catch (error: any) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (moodId: string) => {
    const emojis: Record<string, string> = {
      happy: '😊',
      excited: '🤩',
      calm: '😌',
      sad: '😢',
      angry: '😠',
      neutral: '😐'
    };
    return emojis[moodId] || '😐';
  };

  if (loading) {
    return <div className="text-center p-8">⏳ Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          📈 Your Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-accent rounded-lg text-center">
            <div className="text-3xl font-bold">📊 {stats.totalMoods}</div>
            <div className="text-sm text-muted-foreground">Mood Logs</div>
          </div>
          <div className="p-4 bg-accent rounded-lg text-center">
            <div className="text-3xl font-bold">📝 {stats.totalJournalEntries}</div>
            <div className="text-sm text-muted-foreground">Journal Entries</div>
          </div>
          <div className="p-4 bg-accent rounded-lg text-center">
            <div className="text-3xl font-bold">❤️ {stats.totalLikedSongs}</div>
            <div className="text-sm text-muted-foreground">Liked Songs</div>
          </div>
          <div className="p-4 bg-accent rounded-lg text-center">
            <div className="text-3xl font-bold">🎧 {stats.totalPlaylists}</div>
            <div className="text-sm text-muted-foreground">Playlists</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            🎭 Mood Distribution
          </h3>
          {Object.entries(stats.moodDistribution).length === 0 ? (
            <p className="text-center text-muted-foreground p-4">
              📊 No mood data yet
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(stats.moodDistribution).map(([mood, count]: any) => (
                <div key={mood} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(mood)}</span>
                    <span className="capitalize">{mood}</span>
                  </span>
                  <span className="font-medium">{count} times</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};