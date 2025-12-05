import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  songId: string;
  title: string;
  artist: string;
  moodId?: string;
  className?: string;
  size?: 'icon' | 'default';
}

export const FavoriteButton = ({ 
  songId, 
  title, 
  artist, 
  moodId = 'general',
  className,
  size = 'icon'
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfFavorite();
  }, [songId]);

  const checkIfFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('liked_songs')
        .select('id')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .maybeSingle();

      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to save favorites',
          variant: 'destructive',
        });
        return;
      }

      if (isFavorite) {
        await supabase
          .from('liked_songs')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songId);

        setIsFavorite(false);
        toast({
          title: 'Removed from favorites',
          description: `${title} removed from your liked songs`,
        });
      } else {
        await supabase
          .from('liked_songs')
          .insert({
            user_id: user.id,
            song_id: songId,
            title,
            artist,
            mood_id: moodId,
          });

        setIsFavorite(true);
        toast({
          title: 'Added to favorites',
          description: `${title} added to your liked songs`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(className)}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-colors",
          isFavorite && "fill-red-500 text-red-500"
        )} 
      />
    </Button>
  );
};
