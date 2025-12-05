import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface SongSearchFilterProps {
  onSearch: (query: string, filters: { mood?: string }) => void;
  availableMoods: string[];
}

export const SongSearchFilter = ({ onSearch, availableMoods }: SongSearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | undefined>();

  const handleSearch = () => {
    onSearch(searchQuery, { mood: selectedMood });
  };

  const handleMoodToggle = (mood: string) => {
    const newMood = selectedMood === mood ? undefined : mood;
    setSelectedMood(newMood);
    onSearch(searchQuery, { mood: newMood });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMood(undefined);
    onSearch('', {});
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, artist..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value, { mood: selectedMood });
            }}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        {(searchQuery || selectedMood) && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {availableMoods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Filter by mood:</span>
          {availableMoods.map((mood) => (
            <Badge
              key={mood}
              variant={selectedMood === mood ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleMoodToggle(mood)}
            >
              {mood}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
