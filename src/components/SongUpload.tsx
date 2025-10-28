import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Upload, Music } from 'lucide-react';

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Happy' },
  { id: 'calm', label: 'Calm' },
  { id: 'sad', label: 'Sad' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'melancholic', label: 'Melancholic' },
];

export const SongUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleMoodToggle = (moodId: string) => {
    setSelectedMoods(prev =>
      prev.includes(moodId)
        ? prev.filter(m => m !== moodId)
        : [...prev, moodId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's an audio file
      if (!selectedFile.type.startsWith('audio/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an audio file',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !artist || selectedMoods.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and select at least one mood',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-songs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-songs')
        .getPublicUrl(fileName);

      // Save song metadata to database
      const { error: dbError } = await supabase
        .from('user_songs')
        .insert({
          user_id: user.id,
          title,
          artist,
          mood_tags: selectedMoods,
          file_path: fileName,
          file_size: file.size,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Song uploaded successfully!',
        description: 'Your song has been added to your library',
      });

      // Reset form
      setFile(null);
      setTitle('');
      setArtist('');
      setSelectedMoods([]);
      // Reset file input
      const fileInput = document.getElementById('song-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading song:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your song',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Upload Your Songs
        </CardTitle>
        <CardDescription>
          Add your own music collection and tag them with moods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="song-file">Audio File</Label>
          <Input
            id="song-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="song-title">Song Title</Label>
          <Input
            id="song-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
            disabled={uploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="song-artist">Artist</Label>
          <Input
            id="song-artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name"
            disabled={uploading}
          />
        </div>

        <div className="space-y-2">
          <Label>Mood Tags (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3">
            {MOOD_OPTIONS.map((mood) => (
              <div key={mood.id} className="flex items-center space-x-2">
                <Checkbox
                  id={mood.id}
                  checked={selectedMoods.includes(mood.id)}
                  onCheckedChange={() => handleMoodToggle(mood.id)}
                  disabled={uploading}
                />
                <Label
                  htmlFor={mood.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {mood.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploading || !file || !title || !artist || selectedMoods.length === 0}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Song'}
        </Button>
      </CardContent>
    </Card>
  );
};
