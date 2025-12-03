import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FolderUp, Music, Upload, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Auto mood detection based on filename patterns
const detectMoodFromFilename = (filename: string): string[] => {
  const name = filename.toLowerCase();
  const moods: string[] = [];
  
  // Telugu mood keywords
  const moodPatterns: Record<string, string[]> = {
    happy: ['happy', 'joy', 'party', 'dance', 'celebration', 'fun', 'upbeat', 'energetic', 'butta', 'bomma', 'ramulo'],
    sad: ['sad', 'emotional', 'heart', 'cry', 'pain', 'miss', 'neeli', 'prema', 'virahamu'],
    romantic: ['love', 'romantic', 'pyaar', 'inkem', 'prema', 'ishq', 'priya', 'kannu'],
    calm: ['calm', 'peace', 'relax', 'soft', 'melody', 'classical', 'sleep', 'soothing'],
    excited: ['mass', 'item', 'dj', 'bass', 'beat', 'rock', 'seeti', 'ringa'],
    devotional: ['bhakti', 'god', 'temple', 'prayer', 'devotional', 'mantra', 'sri', 'rama', 'krishna']
  };

  for (const [mood, patterns] of Object.entries(moodPatterns)) {
    if (patterns.some(pattern => name.includes(pattern))) {
      moods.push(mood);
    }
  }

  // Default mood if none detected
  if (moods.length === 0) {
    moods.push('happy');
  }

  return moods;
};

// Extract artist and title from filename
const parseFilename = (filename: string): { title: string; artist: string } => {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(mp3|wav|m4a|ogg|flac|aac)$/i, '');
  
  // Common patterns: "Artist - Title", "Title - Artist", "Title"
  if (nameWithoutExt.includes(' - ')) {
    const parts = nameWithoutExt.split(' - ');
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim()
    };
  }
  
  // If no separator, use filename as title
  return {
    title: nameWithoutExt.trim(),
    artist: 'Unknown Artist'
  };
};

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  title: string;
  artist: string;
  moods: string[];
  progress: number;
  error?: string;
}

export const FolderUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const audioFiles = selectedFiles.filter(file => 
      file.type.startsWith('audio/') || 
      /\.(mp3|wav|m4a|ogg|flac|aac)$/i.test(file.name)
    );

    if (audioFiles.length === 0) {
      toast({
        title: 'No audio files found',
        description: 'Please select a folder containing audio files (MP3, WAV, M4A, etc.)',
        variant: 'destructive'
      });
      return;
    }

    const uploadFiles: UploadedFile[] = audioFiles.map(file => {
      const { title, artist } = parseFilename(file.name);
      const moods = detectMoodFromFilename(file.name);
      return {
        file,
        status: 'pending',
        title,
        artist,
        moods,
        progress: 0
      };
    });

    setFiles(uploadFiles);
    toast({
      title: `${uploadFiles.length} audio files found`,
      description: 'Click "Upload All" to start uploading'
    });
  };

  const uploadFile = async (uploadFile: UploadedFile, index: number): Promise<boolean> => {
    try {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading' } : f
      ));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload to storage
      const fileExt = uploadFile.file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}-${uploadFile.title}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-songs')
        .upload(filePath, uploadFile.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-songs')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('user_songs')
        .insert({
          user_id: user.id,
          title: uploadFile.title,
          artist: uploadFile.artist,
          mood_tags: uploadFile.moods,
          file_path: urlData.publicUrl,
          file_size: uploadFile.file.size
        });

      if (dbError) throw dbError;

      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'success', progress: 100 } : f
      ));

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error', error: (error as Error).message } : f
      ));
      return false;
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        const success = await uploadFile(files[i], i);
        if (success) successCount++;
        setOverallProgress(((i + 1) / files.length) * 100);
      }
    }

    setIsUploading(false);
    toast({
      title: 'Upload Complete',
      description: `Successfully uploaded ${successCount} of ${files.length} files`
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setOverallProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderUp className="w-5 h-5" />
          Bulk Upload Songs
        </CardTitle>
        <CardDescription>
          Select a folder to upload multiple songs. Moods will be auto-detected from filenames.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Folder Select */}
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            ref={inputRef}
            type="file"
            // @ts-ignore - webkitdirectory is not in types
            webkitdirectory=""
            multiple
            accept="audio/*"
            onChange={handleFolderSelect}
            className="hidden"
            id="folder-upload"
          />
          <label 
            htmlFor="folder-upload" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <FolderUp className="w-12 h-12 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Click to select a folder with audio files
            </span>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{files.length} files selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={uploadAll} 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload All
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isUploading && (
              <Progress value={overallProgress} className="h-2" />
            )}

            <div className="max-h-64 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="shrink-0">
                    {file.status === 'pending' && <Music className="w-4 h-4 text-muted-foreground" />}
                    {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    {file.status === 'success' && <Check className="w-4 h-4 text-green-500" />}
                    {file.status === 'error' && <X className="w-4 h-4 text-destructive" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{file.artist}</p>
                  </div>
                  
                  <div className="flex gap-1 flex-wrap justify-end">
                    {file.moods.map(mood => (
                      <Badge key={mood} variant="secondary" className="text-xs">
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
