import { useAudioPlayer, Song } from '@/contexts/AudioPlayerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListMusic, Play, X, GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

export const QueueManager = () => {
  const { queue, currentSong, play, removeFromQueue, clearQueue, setQueue } = useAudioPlayer();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newQueue = [...queue];
    const draggedItem = newQueue[draggedIndex];
    newQueue.splice(draggedIndex, 1);
    newQueue.splice(index, 0, draggedItem);
    setQueue(newQueue);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListMusic className="w-5 h-5" />
            Queue ({queue.length})
          </CardTitle>
          {queue.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearQueue}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {currentSong && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-primary font-medium mb-1">Now Playing</p>
            <p className="font-medium truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        )}

        <ScrollArea className="h-64">
          {queue.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <ListMusic className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Queue is empty</p>
              <p className="text-sm mt-2">Add songs to play next</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg border bg-card
                    hover:bg-muted/50 cursor-grab active:cursor-grabbing
                    transition-all duration-200
                    ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  `}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{song.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => play(song)}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      onClick={() => removeFromQueue(song.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
