import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BookOpen, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  mood_label: string;
  mood_id: string;
  note: string;
  created_at: string;
}

export const MoodJournal = ({ selectedMood }: { selectedMood: { id: string; label: string } | null }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast.error('Failed to load journal entries');
    }
  };

  const saveEntry = async () => {
    if (!selectedMood || !note.trim()) {
      toast.error('Please select a mood and write a note');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (editingId) {
        const { error } = await supabase
          .from('mood_journal_entries')
          .update({ note })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('📝 Entry updated!');
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('mood_journal_entries')
          .insert({
            user_id: user.id,
            mood_id: selectedMood.id,
            mood_label: selectedMood.label,
            note
          });

        if (error) throw error;
        toast.success('✍️ Journal entry saved!');
      }

      setNote('');
      fetchEntries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mood_journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
      toast.success('🗑️ Entry deleted');
    } catch (error: any) {
      toast.error('Failed to delete entry');
    }
  };

  const startEdit = (entry: JournalEntry) => {
    setNote(entry.note);
    setEditingId(entry.id);
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          📝 Mood Journal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {selectedMood && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Current mood: <span className="font-medium">{getMoodEmoji(selectedMood.id)} {selectedMood.label}</span>
            </div>
          )}
          <Textarea
            placeholder="✍️ How are you feeling? Write your thoughts..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={saveEntry} disabled={loading || !selectedMood}>
              {editingId ? '💾 Update Entry' : '📝 Save Entry'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => { setEditingId(null); setNote(''); }}>
                ❌ Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="p-4 bg-accent rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(entry.mood_id)}</span>
                  <span className="font-medium">{entry.mood_label}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">{entry.note}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(entry.created_at), 'PPp')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};