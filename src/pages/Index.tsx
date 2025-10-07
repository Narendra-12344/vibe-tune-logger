import { useState } from 'react';
import { MoodLogger } from '@/components/MoodLogger';
import { SongRecommender } from '@/components/SongRecommender';
import { PreferenceLearner } from '@/components/PreferenceLearner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Music, Heart, Brain } from 'lucide-react';

const Index = () => {
  const [activeModule, setActiveModule] = useState<'mood' | 'songs' | 'preferences'>('mood');
  const [selectedMood, setSelectedMood] = useState<{ id: string; label: string } | null>(null);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);

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
      <div className="flex justify-center mb-8">
        <div className="flex bg-card rounded-lg p-1 shadow-card">
          <Button
            variant={activeModule === 'mood' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('mood')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            😊 Mood Logger
          </Button>
          <Button
            variant={activeModule === 'songs' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('songs')}
            className="flex items-center gap-2"
          >
            <Music className="h-4 w-4" />
            🎵 Song Recommender
          </Button>
          <Button
            variant={activeModule === 'preferences' ? 'default' : 'ghost'}
            onClick={() => setActiveModule('preferences')}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            🧠 Preference Learner
          </Button>
        </div>
      </div>

      {/* Module Content */}
      <div className="flex justify-center">
        {activeModule === 'mood' ? (
          <MoodLogger onMoodSelect={setSelectedMood} />
        ) : activeModule === 'songs' ? (
          <SongRecommender selectedMood={selectedMood} likedSongs={likedSongs} setLikedSongs={setLikedSongs} />
        ) : (
          <PreferenceLearner likedSongs={likedSongs} />
        )}
      </div>
    </div>
  );
};

export default Index;
