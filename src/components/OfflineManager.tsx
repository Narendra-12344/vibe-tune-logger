import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { useAudioPlayer, Song } from '@/contexts/AudioPlayerContext';
import { toast } from 'sonner';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Trash2, 
  Play, 
  HardDrive, 
  Music, 
  CheckCircle,
  Loader2,
  CloudOff
} from 'lucide-react';
import { teluguMoodSongs } from '@/data/teluguSongs';

interface CachedSong {
  id: string;
  title: string;
  artist: string;
  url: string;
  mood: string;
  size?: number;
}

export const OfflineManager = () => {
  const { isOnline, cacheSong, removeSongCache, getCachedSongs } = useServiceWorker();
  const { play, currentSong, isPlaying, pause } = useAudioPlayer();
  const [cachedSongs, setCachedSongs] = useState<CachedSong[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [storageUsed, setStorageUsed] = useState(0);

  // Get all available songs from the library
  const allSongs: CachedSong[] = Object.entries(teluguMoodSongs).flatMap(([mood, songs]) =>
    songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.audioPreviewUrl,
      mood,
    }))
  );

  // Refresh cached songs list
  const refreshCachedList = async () => {
    try {
      const cached = await getCachedSongs();
      const cachedSongsData = allSongs.filter(song => cached.includes(song.url));
      setCachedSongs(cachedSongsData);
      
      // Estimate storage
      setStorageUsed(cachedSongsData.length * 3); // Rough estimate: 3MB per song
    } catch (error) {
      console.error('Error refreshing cached songs:', error);
    }
  };

  useEffect(() => {
    refreshCachedList();
  }, []);

  const handleDownload = async (song: CachedSong) => {
    setDownloading(song.id);
    try {
      // First, fetch the song to ensure it's available
      const response = await fetch(song.url);
      if (!response.ok) throw new Error('Failed to fetch song');
      
      // Cache the song via service worker
      cacheSong(song.url);
      
      // Wait a moment for the cache to be updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshCachedList();
      toast.success(`"${song.title}" saved for offline playback`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download "${song.title}"`);
    } finally {
      setDownloading(null);
    }
  };

  const handleRemove = async (song: CachedSong) => {
    try {
      removeSongCache(song.url);
      await new Promise(resolve => setTimeout(resolve, 500));
      await refreshCachedList();
      toast.success(`"${song.title}" removed from offline storage`);
    } catch (error) {
      toast.error('Failed to remove song');
    }
  };

  const handlePlay = (song: CachedSong) => {
    const playerSong: Song = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.url,
      mood: song.mood,
    };

    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(playerSong);
    }
  };

  const isCached = (url: string) => cachedSongs.some(s => s.url === url);

  // Popular songs to suggest for offline download
  const suggestedSongs = allSongs.slice(0, 10);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-orange-500" />
              )}
              Offline Mode
            </CardTitle>
            <CardDescription>
              {isOnline 
                ? 'Download songs to play without internet' 
                : 'You\'re offline - only cached songs available'}
            </CardDescription>
          </div>
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage Used
            </span>
            <span>{storageUsed} MB / 100 MB</span>
          </div>
          <Progress value={(storageUsed / 100) * 100} className="h-2" />
        </div>

        {/* Cached Songs */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <CloudOff className="w-4 h-4" />
            Saved for Offline ({cachedSongs.length})
          </h4>
          {cachedSongs.length > 0 ? (
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {cachedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-card/50 border border-border/50"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handlePlay(song)}
                        className="h-7 w-7"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(song)}
                        className="h-7 w-7 text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No songs saved for offline playback</p>
            </div>
          )}
        </div>

        {/* Suggested Downloads */}
        {isOnline && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Suggested Downloads
            </h4>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {suggestedSongs.map((song) => {
                  const cached = isCached(song.url);
                  const isDownloading = downloading === song.id;
                  
                  return (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-card/50 border border-border/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      {cached ? (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Saved
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(song)}
                          disabled={isDownloading}
                          className="h-7"
                        >
                          {isDownloading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};