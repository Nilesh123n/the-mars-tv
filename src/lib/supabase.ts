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
  const url = customUrl || env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const key = customKey || env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http') && key.length > 10);
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