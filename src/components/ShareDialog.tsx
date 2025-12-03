import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';

interface ShareDialogProps {
  title: string;
  artist?: string;
  type: 'song' | 'playlist';
  children?: React.ReactNode;
}

export const ShareDialog = ({ title, artist, type, children }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = type === 'song'
    ? `🎵 Check out "${title}" by ${artist} on MoodTunes!`
    : `🎶 Check out my playlist "${title}" on MoodTunes!`;

  const shareUrl = window.location.origin;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast({ title: 'Link copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MoodTunes - ${title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {type === 'song' ? 'Song' : 'Playlist'}</DialogTitle>
          <DialogDescription>
            Share "{title}" with your friends
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Share buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30"
              onClick={shareToWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2 text-[#25D366]" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30"
              onClick={shareToTwitter}
            >
              <svg className="w-5 h-5 mr-2 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter
            </Button>
          </div>

          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button variant="outline" className="w-full" onClick={nativeShare}>
              <Share2 className="w-4 h-4 mr-2" />
              More sharing options
            </Button>
          )}

          {/* Copy link */}
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`${shareText.slice(0, 50)}...`}
              className="bg-muted/50"
            />
            <Button variant="outline" size="icon" onClick={copyLink}>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
