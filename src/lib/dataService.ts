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

// Cache TTL in milliseconds (5 minutes memory fallback)
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
}

// Memory Cache
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

// Multi-Tab & Cross-Device Real-Time Sync Channel
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('the_mars_tv_realtime_sync');
  }
} catch (e) {
  // Ignore fallback
}

// Registered listeners for data updates
type SyncListener = (eventType: string, payload: any) => void;
const syncListeners: Set<SyncListener> = new Set();

// Track last known server version for polling comparison
let currentServerVersion = 0;
let isRealtimeInitialized = false;

export class DataService {
  // -----------------------------------------------------------------
  // 0. REAL-TIME MULTI-DEVICE SYNCHRONIZATION ENGINE
  // -----------------------------------------------------------------
  static initRealtimeSync(onUpdateCallback?: SyncListener) {
    if (onUpdateCallback) {
      syncListeners.add(onUpdateCallback);
    }

    if (isRealtimeInitialized || typeof window === 'undefined') {
      return () => {
        if (onUpdateCallback) syncListeners.delete(onUpdateCallback);
      };
    }

    isRealtimeInitialized = true;

    // 1. BroadcastChannel (Instant 0ms sync across tabs on same device)
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type && payload) {
          DataService.handleIncomingRealtimeUpdate(type, payload);
        }
      };
    }

    // 2. Storage event listener (Cross-tab backup)
    window.addEventListener('storage', (e) => {
      if (e.key === 'pr_properties_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.data) {
            memoryCache.properties = parsed;
            syncListeners.forEach((fn) => fn('PROPERTY_SAVED', { allProperties: parsed.data }));
          }
        } catch (err) {}
      }
    });

    // 3. Server-Sent Events (SSE) for Real-Time Cross-Device Sync (Mobile <-> Desktop <-> Tablet)
    let eventSource: EventSource | null = null;

    function connectSSE() {
      try {
        eventSource = new EventSource('/api/sync/events');

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data?.version) {
              currentServerVersion = data.version;
            }
            if (data?.type && data.type !== 'CONNECTED') {
              DataService.handleIncomingRealtimeUpdate(data.type, data.payload);
            }
          } catch (err) {
            // Ping or non-json message
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect after 4 seconds
          setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        console.warn('SSE connection failed, falling back to polling:', err);
      }
    }

    connectSSE();

    // 4. Background Fallback Poller (Every 4 seconds - checks lightweight version number)
    const pollerTimer = setInterval(async () => {
      try {
        const res = await fetch('/api/sync/version');
        if (res.ok) {
          const data = await res.json();
          if (data.version && currentServerVersion && data.version > currentServerVersion) {
            currentServerVersion = data.version;
            // Version changed on another device! Refresh active data
            DataService.refreshAllDataFromServer();
          } else if (data.version && !currentServerVersion) {
            currentServerVersion = data.version;
          }
        }
      } catch (e) {
        // Silent poll error
      }
    }, 4000);

    return () => {
      if (onUpdateCallback) syncListeners.delete(onUpdateCallback);
      if (eventSource) eventSource.close();
      clearInterval(pollerTimer);
    };
  }

  // Handle incoming real-time messages
  private static handleIncomingRealtimeUpdate(type: string, payload: any) {
    if (type === 'PROPERTY_SAVED' || type === 'PROPERTY_APPROVED' || type === 'PROPERTY_DELETED') {
      if (payload?.allProperties) {
        memoryCache.properties = { data: payload.allProperties, timestamp: Date.now() };
        saveToStorage('pr_properties_v2', payload.allProperties);
      }
    } else if (type === 'LEAD_SAVED' || type === 'LEAD_DELETED') {
      if (payload?.allLeads) {
        memoryCache.leads = { data: payload.allLeads, timestamp: Date.now() };
        saveToStorage('pr_leads_v2', payload.allLeads);
      }
    } else if (type === 'NEWS_SAVED' || type === 'NEWS_DELETED') {
      if (payload?.allNews) {
        memoryCache.news = { data: payload.allNews, timestamp: Date.now() };
        saveToStorage('pr_news_v2', payload.allNews);
      }
    } else if (type === 'ALL_DATA_RESET') {
      DataService.resetAllLocalCache();
    }

    // Notify all UI subscribers
    syncListeners.forEach((fn) => {
      try {
        fn(type, payload);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  // Refresh data from server
  static async refreshAllDataFromServer() {
    try {
      const [p, l, n] = await Promise.all([
        DataService.getProperties(true),
        DataService.getLeads(true),
        DataService.getNews(true),
      ]);
      syncListeners.forEach((fn) => fn('DATA_SYNC_REFRESH', { properties: p, leads: l, news: n }));
    } catch (e) {}
  }

  // Broadcast to other tabs locally
  private static broadcastLocal(type: string, payload: any) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      } catch (e) {}
    }
  }

  // -----------------------------------------------------------------
  // 1. PROPERTIES
  // -----------------------------------------------------------------
  static async getProperties(forceRefresh = false): Promise<Property[]> {
    // 1. Check memory cache if not force refresh
    if (!forceRefresh && memoryCache.properties && Date.now() - memoryCache.properties.timestamp < CACHE_TTL_MS) {
      return memoryCache.properties.data;
    }

    // 2. Fetch from Express Backend Server API
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          memoryCache.properties = { data: json.data, timestamp: Date.now() };
          saveToStorage('pr_properties_v2', json.data);
          if (json.version) currentServerVersion = json.version;
          return json.data;
        }
      }
    } catch (err) {
      // Backend not reached, proceed to local storage
    }

    // 3. LocalStorage Cache
    const stored = readFromStorage<Property[]>('pr_properties_v2');
    if (!forceRefresh && stored && stored.data && stored.data.length > 0) {
      memoryCache.properties = stored;
      return stored.data;
    }

    // Fallback default
    let result: Property[] = stored?.data || initialProperties;

    // 4. Sync from Supabase if configured
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
        console.warn('Supabase fetch properties fallback:', err);
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

    // Update cache immediately for instant local UI update
    memoryCache.properties = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updated);
    this.broadcastLocal('PROPERTY_SAVED', { property, allProperties: updated });

    // Send to Server Backend for Cross-Device Persistence & SSE Broadcast
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          updated = json.data;
          memoryCache.properties = { data: updated, timestamp: Date.now() };
          saveToStorage('pr_properties_v2', updated);
        }
      }
    } catch (err) {
      console.warn('Backend server save property warning:', err);
    }

    // Sync to Supabase in background if configured
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

  static async approveProperty(id: string): Promise<Property[]> {
    const current = await this.getProperties();
    const index = current.findIndex((p) => p.id === id);
    if (index >= 0) {
      const approved: Property = {
        ...current[index],
        status: 'ACTIVE',
        isVerified: true,
      };
      return this.saveProperty(approved);
    }
    return current;
  }

  static async deleteProperty(id: string): Promise<Property[]> {
    const current = await this.getProperties();
    const updated = current.filter((p) => p.id !== id);

    memoryCache.properties = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updated);
    this.broadcastLocal('PROPERTY_DELETED', { id, allProperties: updated });

    try {
      await fetch(`/api/properties/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

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

    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          let newsList: NewsItem[] = json.data;
          newsList = newsList.map((item) => {
            if (item.category === 'Policy Update' || item.category === 'Policy Updates') {
              return { ...item, category: 'Latest Update' };
            }
            return item;
          });
          memoryCache.news = { data: newsList, timestamp: Date.now() };
          saveToStorage('pr_news_v2', newsList);
          return newsList;
        }
      }
    } catch (e) {}

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
    this.broadcastLocal('NEWS_SAVED', { newsItem: item, allNews: updated });

    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (e) {}

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
    this.broadcastLocal('NEWS_DELETED', { id, allNews: updated });

    try {
      await fetch(`/api/news/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

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
        console.warn('Supabase fetch PR services failed:', err);
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
        console.warn('Supabase save PR service warning:', err);
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
        console.warn('Supabase delete PR service warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 4. LEADS & INQUIRIES
  // -----------------------------------------------------------------
  static async getLeads(forceRefresh = false): Promise<Lead[]> {
    if (!forceRefresh && memoryCache.leads && Date.now() - memoryCache.leads.timestamp < CACHE_TTL_MS) {
      return memoryCache.leads.data;
    }

    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          memoryCache.leads = { data: json.data, timestamp: Date.now() };
          saveToStorage('pr_leads_v2', json.data);
          return json.data;
        }
      }
    } catch (e) {}

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
    this.broadcastLocal('LEAD_SAVED', { lead, allLeads: updated });

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (e) {}

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

  static async deleteLead(id: string): Promise<Lead[]> {
    const current = await this.getLeads();
    const updated = current.filter((l) => l.id !== id);

    memoryCache.leads = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_leads_v2', updated);
    this.broadcastLocal('LEAD_DELETED', { id, allLeads: updated });

    try {
      await fetch(`/api/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('leads').delete().eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase delete lead warning:', err);
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
        console.warn('Supabase save package warning:', err);
      }
    }

    return updated;
  }

  static async deleteConstructionPackage(id: string): Promise<ConstructionPackage[]> {
    const current = await this.getConstructionPackages();
    const updated = current.filter((p) => p.id !== id);

    memoryCache.construction = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('construction_packages').delete().eq('id', id);
        }
      } catch (err) {}
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 6. SITE SETTINGS
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
  // 7. PROJECTS
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
          const { data, error } = await supabase.from('projects').select('*');
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

  static async deleteProject(id: string): Promise<Project[]> {
    const current = await this.getProjects();
    const updated = current.filter((p) => p.id !== id);

    memoryCache.projects = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_projects_v2', updated);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('projects').delete().eq('id', id);
        }
      } catch (err) {}
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 8. ADMIN PASSCODE MANAGEMENT
  // -----------------------------------------------------------------
  static getAdminPasscode(): string {
    const custom = localStorage.getItem('pr_admin_passcode_custom');
    return custom || 'admin123';
  }

  static setAdminPasscode(newPass: string): void {
    if (newPass && newPass.trim().length >= 4) {
      localStorage.setItem('pr_admin_passcode_custom', newPass.trim());
    }
  }

  static resetAdminPasscode(): void {
    localStorage.removeItem('pr_admin_passcode_custom');
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

    try {
      fetch('/api/reset-defaults', { method: 'POST' });
    } catch (e) {}
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
