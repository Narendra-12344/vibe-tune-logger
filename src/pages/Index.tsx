import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MoodLogger } from '@/components/MoodLogger';
import { SongRecommender } from '@/components/SongRecommender';
import { PreferenceLearner } from '@/components/PreferenceLearner';
import { MoodHistory } from '@/components/MoodHistory';
import { MoodJournal } from '@/components/MoodJournal';
import { PlaylistManager } from '@/components/PlaylistManager';
import { UserProfile } from '@/components/UserProfile';
import { SongSearch } from '@/components/SongSearch';
import { Statistics } from '@/components/Statistics';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SongUpload } from '@/components/SongUpload';
import { UserSongsList } from '@/components/UserSongsList';
import { Button } from '@/components/ui/button';
import { Music, Heart, Brain, Calendar, BookOpen, List, User, Search, BarChart3 } from 'lucide-react';

type ModuleType = 'mood' | 'songs' | 'preferences' | 'history' | 'journal' | 'playlists' | 'profile' | 'search' | 'stats' | 'upload';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('mood');
  const [selectedMood, setSelectedMood] = useState<{ id: string; label: string } | null>(null);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    } else {
      setUser(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 relative">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* App Title */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
          🎵 MoodTunes 🎧
        </h1>
        <p className="text-muted-foreground text-lg">
          🎶 Discover music that matches your mood ✨
        </p>
      </div>

      {/* Module Navigation */}
      <div className="flex justify-center mb-8 overflow-x-auto">
        <div className="flex flex-wrap gap-2 bg-card rounded-lg p-2 shadow-card justify-center">
          <Button
            variant={activeModule === 'mood' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('mood')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Heart className="h-4 w-4" />
            😊 Mood
          </Button>
          <Button
            variant={activeModule === 'songs' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('songs')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Music className="h-4 w-4" />
            🎵 Songs
          </Button>
          <Button
            variant={activeModule === 'preferences' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('preferences')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Brain className="h-4 w-4" />
            🧠 Learn
          </Button>
          <Button
            variant={activeModule === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('history')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Calendar className="h-4 w-4" />
            📊 History
          </Button>
          <Button
            variant={activeModule === 'journal' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('journal')}
            className="flex items-center gap-2"
            size="sm"
          >
            <BookOpen className="h-4 w-4" />
            📝 Journal
          </Button>
          <Button
            variant={activeModule === 'playlists' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('playlists')}
            className="flex items-center gap-2"
            size="sm"
          >
            <List className="h-4 w-4" />
            🎧 Playlists
          </Button>
          <Button
            variant={activeModule === 'search' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('search')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Search className="h-4 w-4" />
            🔍 Search
          </Button>
          <Button
            variant={activeModule === 'stats' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('stats')}
            className="flex items-center gap-2"
            size="sm"
          >
            <BarChart3 className="h-4 w-4" />
            📈 Stats
          </Button>
          <Button
            variant={activeModule === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('profile')}
            className="flex items-center gap-2"
            size="sm"
          >
            <User className="h-4 w-4" />
            👤 Profile
          </Button>
          <Button
            variant={activeModule === 'upload' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('upload')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Music className="h-4 w-4" />
            📁 Upload
          </Button>
        </div>
      </div>

      {/* Module Content */}
      <div className="flex justify-center w-full max-w-7xl mx-auto">
        {activeModule === 'mood' && <MoodLogger onMoodSelect={setSelectedMood} />}
        {activeModule === 'songs' && (
          <div className="w-full space-y-6">
            <SongRecommender selectedMood={selectedMood} likedSongs={likedSongs} setLikedSongs={setLikedSongs} />
            <UserSongsList selectedMood={selectedMood?.id} />
          </div>
        )}
        {activeModule === 'preferences' && <PreferenceLearner likedSongs={likedSongs} />}
        {activeModule === 'history' && <MoodHistory />}
        {activeModule === 'journal' && <MoodJournal selectedMood={selectedMood} />}
        {activeModule === 'playlists' && <PlaylistManager />}
        {activeModule === 'search' && <SongSearch />}
        {activeModule === 'stats' && <Statistics />}
        {activeModule === 'profile' && <UserProfile />}
        {activeModule === 'upload' && (
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SongUpload />
            <UserSongsList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
