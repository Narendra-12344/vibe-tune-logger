-- Add lyrics field to user_songs table
ALTER TABLE user_songs ADD COLUMN IF NOT EXISTS lyrics TEXT;

-- Add index for better search performance
CREATE INDEX IF NOT EXISTS idx_user_songs_mood_tags ON user_songs USING GIN(mood_tags);