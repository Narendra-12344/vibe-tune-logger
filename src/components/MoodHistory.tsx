import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MoodLog {
  id: string;
  mood_label: string;
  mood_id: string;
  created_at: string;
}

export const MoodHistory = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const fetchMoodLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMoodLogs(data || []);
    } catch (error: any) {
      toast.error('Failed to load mood history');
    } finally {
      setLoading(false);
    }
  };

  const deleteMoodLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mood_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMoodLogs(moodLogs.filter(log => log.id !== id));
      toast.success('🗑️ Mood log deleted');
    } catch (error: any) {
      toast.error('Failed to delete mood log');
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
          <Calendar className="h-5 w-5" />
          📊 Mood History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moodLogs.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            📝 No mood logs yet. Start logging your moods!
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {moodLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-accent rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getMoodEmoji(log.mood_id)}</span>
                  <div>
                    <p className="font-medium">{log.mood_label}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), 'PPp')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMoodLog(log.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};