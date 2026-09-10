import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache client instance
let supabaseInstance: SupabaseClient | null = null;

// ⚠️ IMPORTANT: Apna real Supabase Project URL aur anon public key yahan paste karo.
// Supabase Dashboard -> apna project -> Settings -> API -> "Project URL" aur "anon public" key.
// Ye anon key public/safe hai (RLS policies isko protect karte hain), isliye code me rakhna theek hai.
// Ye fallback isliye zaroori hai kyunki VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY build ke
// time set nahi ho rahe the, isliye admin ke browser ke alawa kisi aur device par app
// Supabase se connect hi nahi ho raha tha aur sirf dummy/mock data dikha raha tha.
const FALLBACK_SUPABASE_URL = 'https://ioegwhawffdwnqltdyec.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_dymm9e67PvyYWarL6x3HDA_wfIgEIXQ';

export function getSupabaseCredentials() {
  const customUrl = localStorage.getItem('supabase_url');
  const customKey = localStorage.getItem('supabase_anon_key');

  const env = (import.meta as any).env || {};

  // Validate customUrl & customKey so placeholder strings or broken values are safely ignored
  const isCustomUrlValid = Boolean(
    customUrl &&
    customUrl.startsWith('http') &&
    !customUrl.includes('YOUR-PROJECT-REF') &&
    !customUrl.includes('your-project')
  );
  const isCustomKeyValid = Boolean(
    customKey &&
    customKey.length > 10 &&
    !customKey.includes('YOUR-ANON') &&
    !customKey.includes('your-anon')
  );

  const url = (isCustomUrlValid ? customUrl : null) || env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const key = (isCustomKeyValid ? customKey : null) || env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    !url.includes('YOUR-PROJECT-REF') &&
    !url.includes('your-project') &&
    key.length > 10 &&
    !key.includes('YOUR-ANON') &&
    !key.includes('your-anon')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    const { url, key } = getSupabaseCredentials();
    supabaseInstance = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  return supabaseInstance;
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url) localStorage.setItem('supabase_url', url.trim());
  else localStorage.removeItem('supabase_url');

  if (key) localStorage.setItem('supabase_anon_key', key.trim());
  else localStorage.removeItem('supabase_anon_key');

  // Reset instance so next call uses updated credentials
  supabaseInstance = null;
}

// -----------------------------------------------------------------
// Compress image before storage or base64 saving to avoid oversized payloads
// Converts multi-MB files down to lightweight ~40-80KB WebP/JPEG (max 1280x720)
// -----------------------------------------------------------------
export async function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 720,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, dataUrl });
              } else {
                resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
              }
            },
            'image/jpeg',
            quality
          );
        } else {
          resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
        }
      };
      img.onerror = () => {
        resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  });
}

// -----------------------------------------------------------------
// Upload a file to Supabase Storage and return its public URL.
// Used instead of embedding images as large base64 text directly in DB rows.
// Requires a public Storage bucket named "media" to exist.
// If the bucket doesn't exist, returns null so caller uses compressed dataUrl.
// -----------------------------------------------------------------
export async function uploadImageToStorage(file: File, folder: string = 'news'): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { blob } = await compressImageFile(file, 1280, 720, 0.82);
    const ext = 'jpg';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from('media').upload(path, blob, {
      cacheControl: '31536000',
      upsert: false,
      contentType: 'image/jpeg',
    });

    if (error) {
      console.warn('[Storage] Upload to media bucket failed (using compressed fallback):', error.message);
      return null;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.warn('[Storage] Upload exception (using compressed fallback):', err);
    return null;
  }
}