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
import { SongUpload } from '@/components/SongUpload';
import { UserSongsList } from '@/components/UserSongsList';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DragDropPlaylistBuilder } from '@/components/DragDropPlaylistBuilder';
import { LyricsDisplay } from '@/components/LyricsDisplay';
import { QueueManager } from '@/components/QueueManager';
import { FolderUpload } from '@/components/FolderUpload';
import { Equalizer } from '@/components/Equalizer';
import { FavoritesList } from '@/components/FavoritesList';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

type ModuleType = 'mood' | 'songs' | 'preferences' | 'history' | 'journal' | 'playlists' | 'profile' | 'search' | 'stats' | 'upload' | 'playlist-builder' | 'favorites';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('mood');
  const [selectedMood, setSelectedMood] = useState<{ id: string; label: string } | null>(null);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();
  const { setCurrentMood, getMoodStyles } = useMoodTheme();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Update mood theme when mood is selected
  const handleMoodSelect = (mood: { id: string; label: string }) => {
    setSelectedMood(mood);
    setCurrentMood(mood.id as any);
  };

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
      setUserEmail(user.email || '');
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "min-h-screen flex w-full transition-all duration-500 pb-24",
        `bg-gradient-to-br ${getMoodStyles()}`
      )}>
        <AppSidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
          userEmail={userEmail}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-2" />
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                🎵 MoodTunes 🎧
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {activeModule === 'mood' && <MoodLogger onMoodSelect={handleMoodSelect} />}
              {activeModule === 'songs' && (
                <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                    <SongRecommender selectedMood={selectedMood} likedSongs={likedSongs} setLikedSongs={setLikedSongs} />
                    <UserSongsList selectedMood={selectedMood?.id} />
                  </div>
                  <div className="xl:col-span-1 space-y-6">
                    <Equalizer />
                    <LyricsDisplay />
                    <QueueManager />
                  </div>
                </div>
              )}
              {activeModule === 'preferences' && <PreferenceLearner likedSongs={likedSongs} />}
              {activeModule === 'history' && <MoodHistory />}
              {activeModule === 'journal' && <MoodJournal selectedMood={selectedMood} />}
              {activeModule === 'playlists' && <PlaylistManager />}
              {activeModule === 'playlist-builder' && <DragDropPlaylistBuilder />}
              {activeModule === 'search' && <SongSearch />}
              {activeModule === 'stats' && <Statistics />}
              {activeModule === 'profile' && <UserProfile />}
              {activeModule === 'favorites' && <FavoritesList />}
              {activeModule === 'upload' && (
                <div className="w-full max-w-6xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SongUpload />
                    <FolderUpload />
                  </div>
                  <UserSongsList />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
