import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Heart } from 'lucide-react';

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  gradient: string;
}

const moods: Mood[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'text-yellow-600', gradient: 'bg-gradient-happy' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'text-pink-600', gradient: 'bg-gradient-excited' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'text-blue-600', gradient: 'bg-gradient-calm' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-500', gradient: 'bg-gradient-sad' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-600', gradient: 'bg-gradient-angry' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-600', gradient: 'bg-gradient-neutral' },
];

interface MoodLoggerProps {
  onMoodSelect?: (mood: { id: string; label: string }) => void;
}

export const MoodLogger = ({ onMoodSelect }: MoodLoggerProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [intensity, setIntensity] = useState(5);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
  };

  const handleLogMood = () => {
    if (selectedMood) {
      console.log('Mood logged:', { mood: selectedMood, intensity });
      // Here you would typically save to a database
      // For now, we'll just show a success state
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          How are you feeling?
        </h2>
        <p className="text-muted-foreground">
          Select your current mood to get personalized music suggestions
        </p>
      </div>

      {/* Mood Selection */}
      <Card className="p-6 shadow-card">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`
                group relative p-4 rounded-xl border-2 transition-all duration-300 ease-spring
                hover:scale-105 hover:shadow-mood focus:outline-none focus:ring-2 focus:ring-primary
                ${selectedMood?.id === mood.id 
                  ? 'border-primary shadow-mood scale-105' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">{mood.emoji}</div>
                <div className={`text-sm font-medium transition-colors ${
                  selectedMood?.id === mood.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {mood.label}
                </div>
              </div>
              
              {/* Selection indicator */}
              {selectedMood?.id === mood.id && (
                <div className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Intensity Slider */}
        {selectedMood && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="text-center">
              <label className="text-sm font-medium text-foreground">
                How intense is this feeling?
              </label>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span className="font-medium text-primary">{intensity}/10</span>
                <span>Intense</span>
              </div>
            </div>
          </div>
        )}

        {/* Log Button */}
        {selectedMood && (
          <Button 
            onClick={handleLogMood}
            className="w-full mt-6 bg-gradient-primary hover:shadow-mood transition-all duration-300 ease-spring group"
          >
            <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Log My Mood
          </Button>
        )}
      </Card>

      {/* Selected Mood Display */}
      {selectedMood && (
        <Card className={`p-4 border-primary/20 ${selectedMood.gradient} bg-opacity-10 animate-in slide-in-from-bottom-2 duration-500`}>
          <div className="text-center space-y-2">
            <div className="text-2xl">{selectedMood.emoji}</div>
            <div className="text-sm font-medium text-foreground">
              You're feeling <span className="font-semibold">{selectedMood.label.toLowerCase()}</span> with intensity {intensity}/10
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};