-- Create storage bucket for user uploaded songs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-songs', 'user-songs', true);

-- Create storage policies for user songs
CREATE POLICY "Users can upload their own songs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'user-songs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own songs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'user-songs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own songs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'user-songs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create table for user uploaded songs
CREATE TABLE public.user_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  mood_tags TEXT[] NOT NULL DEFAULT '{}',
  file_path TEXT NOT NULL,
  file_size INTEGER,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_songs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own uploaded songs"
ON public.user_songs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploaded songs"
ON public.user_songs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploaded songs"
ON public.user_songs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploaded songs"
ON public.user_songs
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_songs_updated_at
BEFORE UPDATE ON public.user_songs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_user_songs_user_id ON public.user_songs(user_id);
CREATE INDEX idx_user_songs_mood_tags ON public.user_songs USING GIN(mood_tags);