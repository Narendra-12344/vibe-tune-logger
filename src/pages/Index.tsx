import { MoodLogger } from '@/components/MoodLogger';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <MoodLogger />
    </div>
  );
};

export default Index;
