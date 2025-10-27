import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, LogOut, Settings } from 'lucide-react';

export const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);

      const { data: prefs, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!prefs) {
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newPrefs);
      } else {
        setPreferences(prefs);
      }
    } catch (error: any) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ notification_enabled: enabled })
        .eq('user_id', user.id);

      if (error) throw error;
      setPreferences({ ...preferences, notification_enabled: enabled });
      toast.success(enabled ? '🔔 Notifications enabled' : '🔕 Notifications disabled');
    } catch (error: any) {
      toast.error('Failed to update preferences');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('👋 Logged out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return <div className="text-center p-8">⏳ Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          👤 User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-medium">📧 {user?.email}</p>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              ⚙️ Settings
            </h3>
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <span>🔔 Notifications</span>
              <Switch
                checked={preferences?.notification_enabled ?? true}
                onCheckedChange={updateNotifications}
              />
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            🚪 Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};