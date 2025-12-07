import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'telugu' } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // JioSaavn unofficial API endpoint
    const searchUrl = `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('JioSaavn API request failed');
    }

    const data = await response.json();

    // Process and return songs
    const songs = data.songs?.data?.map((song: any) => ({
      id: song.id || song.songid,
      title: song.title || song.song,
      artist: song.more_info?.singers || song.primary_artists || 'Unknown Artist',
      album: song.more_info?.album || song.album || 'Unknown Album',
      duration: formatDuration(song.more_info?.duration || 0),
      image: song.image?.replace('150x150', '500x500') || song.image,
      previewUrl: song.more_info?.encrypted_media_url || null,
      language: song.more_info?.language || language,
    })) || [];

    return new Response(
      JSON.stringify({ songs, total: songs.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('JioSaavn search error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search songs', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}