import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { Property, NewsItem, PRServiceItem, Lead, ConstructionPackage, SiteSettings, Project } from '../types';
import {
  initialProperties,
  initialNews,
  initialPRServices,
  initialLeads,
  initialConstructionPackages,
  initialSiteSettings,
  initialProjects,
} from '../data/mockData';

// Cache TTL in milliseconds (10 minutes to minimize network Egress)
const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
}

// Memory Cache to eliminate re-reads
const memoryCache: {
  properties?: CacheEnvelope<Property[]>;
  news?: CacheEnvelope<NewsItem[]>;
  prServices?: CacheEnvelope<PRServiceItem[]>;
  leads?: CacheEnvelope<Lead[]>;
  construction?: CacheEnvelope<ConstructionPackage[]>;
  siteSettings?: CacheEnvelope<SiteSettings>;
  projects?: CacheEnvelope<Project[]>;
} = {};

// Helper to save to LocalStorage safely
function saveToStorage<T>(key: string, data: T) {
  try {
    const envelope: CacheEnvelope<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (e) {
    console.warn('Storage save warning:', e);
  }
}

// Helper to read from LocalStorage safely
function readFromStorage<T>(key: string): CacheEnvelope<T> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEnvelope<T>;
  } catch (e) {
    return null;
  }
}

export class DataService {
  // -----------------------------------------------------------------
  // 1. PROPERTIES
  // -----------------------------------------------------------------
  static async getProperties(forceRefresh = false): Promise<Property[]> {
    // 1. Memory Cache
    if (!forceRefresh && memoryCache.properties && Date.now() - memoryCache.properties.timestamp < CACHE_TTL_MS) {
      return memoryCache.properties.data;
    }

    // 2. LocalStorage Cache
    const stored = readFromStorage<Property[]>('pr_properties_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.properties = stored;
      return stored.data;
    }

    // Fallback data
    let result: Property[] = stored?.data || initialProperties;

    // 3. Sync from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('properties').select('*').order('createdAt', { ascending: false });
          if (!error && data && data.length > 0) {
            result = data as Property[];
          }
        }
      } catch (err) {
        console.warn('Supabase fetch properties failed, using local cache:', err);
      }
    }

    // Update memory & local storage
    memoryCache.properties = { data: result, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', result);
    return result;
  }

  static async saveProperty(property: Property): Promise<Property[]> {
    const current = await this.getProperties();
    const index = current.findIndex((p) => p.id === property.id);
    let updated: Property[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = property;
    } else {
      updated = [property, ...current];
    }

    // Update cache immediately
    memoryCache.properties = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updated);

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('properties').upsert(property, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase upsert property warning:', err);
      }
    }

    return updated;
  }

  static async deleteProperty(id: string): Promise<Property[]> {
    const current = await this.getProperties();
    const updated = current.filter((p) => p.id !== id);

    memoryCache.properties = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('properties').delete().eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase delete property warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 2. NEWS ITEMS
  // -----------------------------------------------------------------
  static async getNews(forceRefresh = false): Promise<NewsItem[]> {
    if (!forceRefresh && memoryCache.news && Date.now() - memoryCache.news.timestamp < CACHE_TTL_MS) {
      return memoryCache.news.data;
    }

    const stored = readFromStorage<NewsItem[]>('pr_news_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.news = stored;
      return stored.data;
    }

    let result: NewsItem[] = stored?.data || initialNews;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('news_items').select('*').order('publishedAt', { ascending: false });
          if (!error && data && data.length > 0) {
            result = data as NewsItem[];
          }
        }
      } catch (err) {
        console.warn('Supabase fetch news failed:', err);
      }
    }

    // Auto-normalize any legacy "Policy Update" category to "Latest Update"
    result = result.map((item) => {
      if (item.category === 'Policy Update' || item.category === 'Policy Updates') {
        return { ...item, category: 'Latest Update' };
      }
      return item;
    });

    memoryCache.news = { data: result, timestamp: Date.now() };
    saveToStorage('pr_news_v2', result);
    return result;
  }

  static async saveNewsItem(item: NewsItem): Promise<NewsItem[]> {
    const current = await this.getNews();
    const index = current.findIndex((n) => n.id === item.id);
    let updated: NewsItem[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = item;
    } else {
      updated = [item, ...current];
    }

    memoryCache.news = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_news_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('news_items').upsert(item, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save news warning:', err);
      }
    }

    return updated;
  }

  static async deleteNewsItem(id: string): Promise<NewsItem[]> {
    const current = await this.getNews();
    const updated = current.filter((n) => n.id !== id);

    memoryCache.news = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_news_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('news_items').delete().eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase delete news warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 3. PR SERVICES
  // -----------------------------------------------------------------
  static async getPRServices(forceRefresh = false): Promise<PRServiceItem[]> {
    if (!forceRefresh && memoryCache.prServices && Date.now() - memoryCache.prServices.timestamp < CACHE_TTL_MS) {
      return memoryCache.prServices.data;
    }

    const stored = readFromStorage<PRServiceItem[]>('pr_services_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.prServices = stored;
      return stored.data;
    }

    let result: PRServiceItem[] = stored?.data || initialPRServices;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('pr_services').select('*').order('order', { ascending: true });
          if (!error && data && data.length > 0) {
            result = data as PRServiceItem[];
          }
        }
      } catch (err) {
        console.warn('Supabase fetch pr services failed:', err);
      }
    }

    memoryCache.prServices = { data: result, timestamp: Date.now() };
    saveToStorage('pr_services_v2', result);
    return result;
  }

  static async savePRService(service: PRServiceItem): Promise<PRServiceItem[]> {
    const current = await this.getPRServices();
    const index = current.findIndex((s) => s.id === service.id);
    let updated: PRServiceItem[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = service;
    } else {
      updated = [...current, service];
    }

    memoryCache.prServices = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_services_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('pr_services').upsert(service, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save pr service warning:', err);
      }
    }

    return updated;
  }

  static async deletePRService(id: string): Promise<PRServiceItem[]> {
    const current = await this.getPRServices();
    const updated = current.filter((s) => s.id !== id);

    memoryCache.prServices = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_services_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('pr_services').delete().eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase delete pr service warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 4. LEADS
  // -----------------------------------------------------------------
  static async getLeads(forceRefresh = false): Promise<Lead[]> {
    if (!forceRefresh && memoryCache.leads && Date.now() - memoryCache.leads.timestamp < CACHE_TTL_MS) {
      return memoryCache.leads.data;
    }

    const stored = readFromStorage<Lead[]>('pr_leads_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.leads = stored;
      return stored.data;
    }

    let result: Lead[] = stored?.data || initialLeads;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('leads').select('*').order('createdAt', { ascending: false });
          if (!error && data && data.length > 0) {
            result = data as Lead[];
          }
        }
      } catch (err) {
        console.warn('Supabase fetch leads failed:', err);
      }
    }

    memoryCache.leads = { data: result, timestamp: Date.now() };
    saveToStorage('pr_leads_v2', result);
    return result;
  }

  static async saveLead(lead: Lead): Promise<Lead[]> {
    const current = await this.getLeads();
    const index = current.findIndex((l) => l.id === lead.id);
    let updated: Lead[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = lead;
    } else {
      updated = [lead, ...current];
    }

    memoryCache.leads = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_leads_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('leads').upsert(lead, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save lead warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 5. CONSTRUCTION PACKAGES
  // -----------------------------------------------------------------
  static async getConstructionPackages(forceRefresh = false): Promise<ConstructionPackage[]> {
    if (!forceRefresh && memoryCache.construction && Date.now() - memoryCache.construction.timestamp < CACHE_TTL_MS) {
      return memoryCache.construction.data;
    }

    const stored = readFromStorage<ConstructionPackage[]>('pr_construction_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.construction = stored;
      return stored.data;
    }

    let result: ConstructionPackage[] = stored?.data || initialConstructionPackages;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('construction_packages').select('*');
          if (!error && data && data.length > 0) {
            result = data as ConstructionPackage[];
          }
        }
      } catch (err) {
        console.warn('Supabase fetch construction packages failed:', err);
      }
    }

    memoryCache.construction = { data: result, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', result);
    return result;
  }

  static async saveConstructionPackage(pkg: ConstructionPackage): Promise<ConstructionPackage[]> {
    const current = await this.getConstructionPackages();
    const index = current.findIndex((p) => p.id === pkg.id);
    let updated: ConstructionPackage[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = pkg;
    } else {
      updated = [...current, pkg];
    }

    memoryCache.construction = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('construction_packages').upsert(pkg, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save construction pkg warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 6. SITE SETTINGS & PAGE DETAILS
  // -----------------------------------------------------------------
  static async getSiteSettings(forceRefresh = false): Promise<SiteSettings> {
    if (!forceRefresh && memoryCache.siteSettings && Date.now() - memoryCache.siteSettings.timestamp < CACHE_TTL_MS) {
      return memoryCache.siteSettings.data;
    }

    const stored = readFromStorage<SiteSettings>('pr_site_settings_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.siteSettings = stored;
      return stored.data;
    }

    let result: SiteSettings = stored?.data || initialSiteSettings;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('site_settings').select('*').single();
          if (!error && data) {
            result = data as SiteSettings;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch site settings failed:', err);
      }
    }

    memoryCache.siteSettings = { data: result, timestamp: Date.now() };
    saveToStorage('pr_site_settings_v2', result);
    return result;
  }

  static async saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
    memoryCache.siteSettings = { data: settings, timestamp: Date.now() };
    saveToStorage('pr_site_settings_v2', settings);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('site_settings').upsert({ id: 'main_settings', ...settings }, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save site settings warning:', err);
      }
    }

    return settings;
  }

  // -----------------------------------------------------------------
  // ADMIN PASSCODE MANAGEMENT
  // -----------------------------------------------------------------
  static getAdminPasscode(): string {
    try {
      const custom = localStorage.getItem('admin_portal_passcode');
      if (custom && custom.trim()) return custom.trim();
      const settings = readFromStorage<SiteSettings>('pr_site_settings_v2');
      if (settings?.data?.adminPasscode && settings.data.adminPasscode.trim()) {
        return settings.data.adminPasscode.trim();
      }
    } catch (e) {
      // Fallback
    }
    return 'admin123';
  }

  static async setAdminPasscode(newPasscode: string): Promise<string> {
    const trimmed = newPasscode.trim();
    localStorage.setItem('admin_portal_passcode', trimmed);
    const settings = await this.getSiteSettings();
    const updatedSettings: SiteSettings = {
      ...settings,
      adminPasscode: trimmed,
    };
    await this.saveSiteSettings(updatedSettings);
    return trimmed;
  }

  static async resetAdminPasscode(): Promise<string> {
    localStorage.removeItem('admin_portal_passcode');
    const settings = await this.getSiteSettings();
    const updatedSettings: SiteSettings = {
      ...settings,
      adminPasscode: 'admin123',
    };
    await this.saveSiteSettings(updatedSettings);
    return 'admin123';
  }

  // -----------------------------------------------------------------
  // 7. EXCLUSIVE PROJECTS
  // -----------------------------------------------------------------
  static async getProjects(forceRefresh = false): Promise<Project[]> {
    if (!forceRefresh && memoryCache.projects && Date.now() - memoryCache.projects.timestamp < CACHE_TTL_MS) {
      return memoryCache.projects.data;
    }

    const stored = readFromStorage<Project[]>('pr_projects_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.projects = stored;
      return stored.data;
    }

    let result: Project[] = stored?.data || initialProjects;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('projects').select('*').order('createdAt', { ascending: false });
          if (!error && data && data.length > 0) {
            result = data as Project[];
          }
        }
      } catch (err) {
        console.warn('Supabase fetch projects failed:', err);
      }
    }

    memoryCache.projects = { data: result, timestamp: Date.now() };
    saveToStorage('pr_projects_v2', result);
    return result;
  }

  static async saveProject(project: Project): Promise<Project[]> {
    const current = await this.getProjects();
    const index = current.findIndex((p) => p.id === project.id);
    let updated: Project[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = project;
    } else {
      updated = [project, ...current];
    }

    memoryCache.projects = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_projects_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('projects').upsert(project, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save project warning:', err);
      }
    }

    return updated;
  }

  // Reset local cache back to initial defaults
  static resetAllLocalCache() {
    localStorage.removeItem('pr_properties_v2');
    localStorage.removeItem('pr_news_v2');
    localStorage.removeItem('pr_services_v2');
    localStorage.removeItem('pr_leads_v2');
    localStorage.removeItem('pr_construction_v2');
    localStorage.removeItem('pr_site_settings_v2');
    localStorage.removeItem('pr_projects_v2');

    delete memoryCache.properties;
    delete memoryCache.news;
    delete memoryCache.prServices;
    delete memoryCache.leads;
    delete memoryCache.construction;
    delete memoryCache.siteSettings;
    delete memoryCache.projects;
  }

  // Get Supabase SQL Schema for setup
  static getSupabaseSQLSchema(): string {
    return `-- ============================================================
-- SUPABASE DATABASE SCHEMA FOR THE MARS TV ADMIN PANEL
-- Copy and run this SQL script in your Supabase SQL Editor.
-- ============================================================

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  price NUMERIC,
  "priceLabel" TEXT,
  location TEXT,
  city TEXT,
  area NUMERIC,
  "areaUnit" TEXT,
  bedrooms INT,
  bathrooms INT,
  parking INT,
  "propertyType" TEXT,
  "listingType" TEXT,
  status TEXT,
  "isSponsored" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  "isVerified" BOOLEAN DEFAULT true,
  "isReraReg" BOOLEAN DEFAULT true,
  "reraNumber" TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NEWS ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.news_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  region TEXT DEFAULT 'India',
  image TEXT,
  author TEXT,
  "publishedAt" TIMESTAMPTZ DEFAULT NOW(),
  "isFeatured" BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'PUBLISHED',
  "viewCount" INT DEFAULT 0
);

-- 3. PR SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.pr_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  icon TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "order" INT DEFAULT 1
);

-- 4. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT,
  "leadType" TEXT,
  status TEXT DEFAULT 'NEW',
  source TEXT,
  "propertyTitle" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONSTRUCTION PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.construction_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "ratePerSqFt" NUMERIC,
  "rateLabel" TEXT,
  badge TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  "isPopular" BOOLEAN DEFAULT false
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  "siteName" TEXT,
  tagline TEXT,
  "heroHeadline" TEXT,
  "heroSubheadline" TEXT,
  "phonePrimary" TEXT,
  "phoneSecondary" TEXT,
  "emailContact" TEXT,
  "whatsappNumber" TEXT,
  "officeAddress" TEXT,
  "reraRegistrationNo" TEXT,
  "aboutText" TEXT,
  "activePromotionalBanner" TEXT
);

-- Enable Row Level Security (RLS) & Allow Read/Write
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create Public Access Policies
CREATE POLICY "Public Read Properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public All Properties" ON public.properties FOR ALL USING (true);

CREATE POLICY "Public Read News" ON public.news_items FOR SELECT USING (true);
CREATE POLICY "Public All News" ON public.news_items FOR ALL USING (true);

CREATE POLICY "Public Read PR Services" ON public.pr_services FOR SELECT USING (true);
CREATE POLICY "Public All PR Services" ON public.pr_services FOR ALL USING (true);

CREATE POLICY "Public Read Leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Public All Leads" ON public.leads FOR ALL USING (true);

CREATE POLICY "Public Read Construction" ON public.construction_packages FOR SELECT USING (true);
CREATE POLICY "Public All Construction" ON public.construction_packages FOR ALL USING (true);

CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public All Site Settings" ON public.site_settings FOR ALL USING (true);
`;
  }
}
