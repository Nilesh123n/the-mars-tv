/**
 * YouTube and Video Helper Utilities
 */

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Handle shorts, standard watch, youtu.be, embed, etc.
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  
  // Fallback: if user pasted just an 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  return null;
}

export function getYouTubeEmbedUrl(url?: string, autoplay = true): string | null {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
  }
  
  if (url && (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/'))) {
    return url;
  }
  
  return null;
}

export function getYouTubeThumbnailUrl(url?: string): string | null {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}
