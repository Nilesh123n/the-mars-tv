import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { Property, NewsItem, PRServiceItem, Lead, ConstructionPackage, SiteSettings, Project } from '../types';
import {
  fromSupabaseRow,
  toSupabaseRow,
  fromSupabaseNewsRow,
  toSupabaseNewsRow,
  fromSupabasePRServiceRow,
  toSupabasePRServiceRow,
  fromSupabaseLeadRow,
  toSupabaseLeadRow,
  fromSupabaseConstructionRow,
  toSupabaseConstructionRow,
  fromSupabaseSiteSettingsRow,
  toSupabaseSiteSettingsRow,
  fromSupabaseProjectRow,
  toSupabaseProjectRow,
} from './supabaseMappers';
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
let supabaseRealtimeChannels: any[] = [];

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

    // 1. Supabase Realtime Subscription for ALL TABLES (Instant Multi-Device Live Sync)
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase && supabaseRealtimeChannels.length === 0) {
          console.log('[DataService] ⚡ Subscribing to Supabase Realtime channels for all entities...');

          // A. Properties Table Channel
          const propChannel = supabase
            .channel('public:properties:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'properties' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase Property Realtime event:', payload.eventType);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  if (payload.new) {
                    try {
                      const property = fromSupabaseRow(payload.new);
                      DataService.handleIncomingPropertyRealtime(property, payload.eventType);
                    } catch (err) {
                      console.error('[DataService] Error mapping realtime property:', err);
                    }
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedId = payload.old?.id;
                  if (deletedId) {
                    DataService.handleIncomingPropertyDelete(deletedId);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(propChannel);

          // B. News Items Table Channel
          const newsChannel = supabase
            .channel('public:news_items:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'news_items' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase News Realtime event:', payload.eventType);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  if (payload.new) {
                    try {
                      const newsItem = fromSupabaseNewsRow(payload.new);
                      DataService.handleIncomingNewsRealtime(newsItem);
                    } catch (err) {
                      console.error('[DataService] Error mapping realtime news:', err);
                    }
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedId = payload.old?.id;
                  if (deletedId) {
                    DataService.handleIncomingNewsDelete(deletedId);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(newsChannel);

          // C. PR Services Table Channel
          const prChannel = supabase
            .channel('public:pr_services:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'pr_services' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase PR Services Realtime event:', payload.eventType);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  if (payload.new) {
                    try {
                      const service = fromSupabasePRServiceRow(payload.new);
                      DataService.handleIncomingPRServiceRealtime(service);
                    } catch (err) {
                      console.error('[DataService] Error mapping realtime PR service:', err);
                    }
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedId = payload.old?.id;
                  if (deletedId) {
                    DataService.handleIncomingPRServiceDelete(deletedId);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(prChannel);

          // D. Leads Table Channel
          const leadsChannel = supabase
            .channel('public:leads:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'leads' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase Leads Realtime event:', payload.eventType);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  if (payload.new) {
                    try {
                      const lead = fromSupabaseLeadRow(payload.new);
                      DataService.handleIncomingLeadRealtime(lead);
                    } catch (err) {
                      console.error('[DataService] Error mapping realtime lead:', err);
                    }
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedId = payload.old?.id;
                  if (deletedId) {
                    DataService.handleIncomingLeadDelete(deletedId);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(leadsChannel);

          // E. Construction Packages Table Channel
          const constrChannel = supabase
            .channel('public:construction_packages:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'construction_packages' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase Construction Realtime event:', payload.eventType);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  if (payload.new) {
                    try {
                      const pkg = fromSupabaseConstructionRow(payload.new);
                      DataService.handleIncomingConstructionRealtime(pkg);
                    } catch (err) {
                      console.error('[DataService] Error mapping realtime construction:', err);
                    }
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedId = payload.old?.id;
                  if (deletedId) {
                    DataService.handleIncomingConstructionDelete(deletedId);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(constrChannel);

          // F. Site Settings Table Channel
          const settingsChannel = supabase
            .channel('public:site_settings:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'site_settings' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase Site Settings Realtime event:', payload.eventType);
                if (payload.new) {
                  try {
                    const settings = fromSupabaseSiteSettingsRow(payload.new);
                    DataService.handleIncomingSettingsRealtime(settings);
                  } catch (err) {
                    console.error('[DataService] Error mapping realtime settings:', err);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(settingsChannel);

          // G. Projects Table Channel
          const projChannel = supabase
            .channel('public:projects:realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'projects' },
              async (payload) => {
                console.log('[DataService] ⚡ Supabase Projects Realtime event:', payload.eventType);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  if (payload.new) {
                    try {
                      const project = fromSupabaseProjectRow(payload.new);
                      DataService.handleIncomingProjectRealtime(project);
                    } catch (err) {
                      console.error('[DataService] Error mapping realtime project:', err);
                    }
                  }
                } else if (payload.eventType === 'DELETE') {
                  const deletedId = payload.old?.id;
                  if (deletedId) {
                    DataService.handleIncomingProjectDelete(deletedId);
                  }
                }
              }
            )
            .subscribe();
          supabaseRealtimeChannels.push(projChannel);
        }
      } catch (err) {
        console.warn('[DataService] Failed to initialize Supabase Realtime channel:', err);
      }
    }

    // 2. BroadcastChannel (Instant 0ms sync across tabs on same device)
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type && payload) {
          DataService.handleIncomingRealtimeUpdate(type, payload);
        }
      };
    }

    // 3. Storage event listener (Cross-tab backup)
    window.addEventListener('storage', (e) => {
      if (e.key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.data) {
            if (e.key === 'pr_properties_v2') {
              memoryCache.properties = parsed;
              syncListeners.forEach((fn) => fn('PROPERTY_SAVED', { allProperties: parsed.data }));
            } else if (e.key === 'pr_news_v2') {
              memoryCache.news = parsed;
              syncListeners.forEach((fn) => fn('NEWS_SAVED', { allNews: parsed.data }));
            } else if (e.key === 'pr_services_v2') {
              memoryCache.prServices = parsed;
              syncListeners.forEach((fn) => fn('PR_SERVICE_SAVED', { allPRServices: parsed.data }));
            } else if (e.key === 'pr_leads_v2') {
              memoryCache.leads = parsed;
              syncListeners.forEach((fn) => fn('LEAD_SAVED', { allLeads: parsed.data }));
            } else if (e.key === 'pr_site_settings_v2') {
              memoryCache.siteSettings = parsed;
              syncListeners.forEach((fn) => fn('SETTINGS_SAVED', { siteSettings: parsed.data }));
            }
          }
        } catch (err) {}
      }
    });

    // 4. Server-Sent Events (SSE) for Real-Time Cross-Device Sync (Mobile <-> Desktop)
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
          } catch (err) {}
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          setTimeout(connectSSE, 3000);
        };
      } catch (err) {
        console.warn('SSE connection fallback:', err);
      }
    }

    connectSSE();

    // 5. Window focus & visibility listener (instantly sync when user opens tab/app)
    const handleFocusOrVisible = () => {
      DataService.checkForServerUpdates();
    };
    window.addEventListener('visibilitychange', handleFocusOrVisible);
    window.addEventListener('focus', handleFocusOrVisible);

    // 6. Background Fallback Poller (Every 4 seconds)
    const pollerTimer = setInterval(() => {
      DataService.checkForServerUpdates();
    }, 4000);

    return () => {
      if (onUpdateCallback) syncListeners.delete(onUpdateCallback);
      if (eventSource) eventSource.close();
      supabaseRealtimeChannels.forEach((ch) => {
        if (ch && typeof ch.unsubscribe === 'function') {
          ch.unsubscribe();
        }
      });
      supabaseRealtimeChannels = [];
      window.removeEventListener('visibilitychange', handleFocusOrVisible);
      window.removeEventListener('focus', handleFocusOrVisible);
      clearInterval(pollerTimer);
    };
  }

  // Realtime Handlers for Individual Entities
  private static handleIncomingPropertyRealtime(property: Property, eventType: 'INSERT' | 'UPDATE') {
    const currentList = memoryCache.properties?.data || [];
    const index = currentList.findIndex((p) => p.id === property.id);
    let updatedList: Property[];

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = property;
    } else {
      updatedList = [property, ...currentList];
    }

    memoryCache.properties = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updatedList);

    const eventName = property.status === 'ACTIVE' && eventType === 'UPDATE' ? 'PROPERTY_APPROVED' : 'PROPERTY_SAVED';
    syncListeners.forEach((fn) => {
      try {
        fn(eventName, { property, allProperties: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingPropertyDelete(id: string) {
    const currentList = memoryCache.properties?.data || [];
    const updatedList = currentList.filter((p) => p.id !== id);

    memoryCache.properties = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('PROPERTY_DELETED', { id, allProperties: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingNewsRealtime(item: NewsItem) {
    const currentList = memoryCache.news?.data || [];
    const index = currentList.findIndex((n) => n.id === item.id);
    let updatedList: NewsItem[];

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = item;
    } else {
      updatedList = [item, ...currentList];
    }

    memoryCache.news = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_news_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('NEWS_SAVED', { newsItem: item, allNews: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingNewsDelete(id: string) {
    const currentList = memoryCache.news?.data || [];
    const updatedList = currentList.filter((n) => n.id !== id);

    memoryCache.news = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_news_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('NEWS_DELETED', { id, allNews: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingPRServiceRealtime(service: PRServiceItem) {
    const currentList = memoryCache.prServices?.data || [];
    const index = currentList.findIndex((s) => s.id === service.id);
    let updatedList: PRServiceItem[];

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = service;
    } else {
      updatedList = [service, ...currentList];
    }

    memoryCache.prServices = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_services_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('PR_SERVICE_SAVED', { prService: service, allPRServices: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingPRServiceDelete(id: string) {
    const currentList = memoryCache.prServices?.data || [];
    const updatedList = currentList.filter((s) => s.id !== id);

    memoryCache.prServices = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_services_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('PR_SERVICE_DELETED', { id, allPRServices: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingLeadRealtime(lead: Lead) {
    const currentList = memoryCache.leads?.data || [];
    const index = currentList.findIndex((l) => l.id === lead.id);
    let updatedList: Lead[];

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = lead;
    } else {
      updatedList = [lead, ...currentList];
    }

    memoryCache.leads = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_leads_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('LEAD_SAVED', { lead, allLeads: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingLeadDelete(id: string) {
    const currentList = memoryCache.leads?.data || [];
    const updatedList = currentList.filter((l) => l.id !== id);

    memoryCache.leads = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_leads_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('LEAD_DELETED', { id, allLeads: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingConstructionRealtime(pkg: ConstructionPackage) {
    const currentList = memoryCache.construction?.data || [];
    const index = currentList.findIndex((c) => c.id === pkg.id);
    let updatedList: ConstructionPackage[];

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = pkg;
    } else {
      updatedList = [pkg, ...currentList];
    }

    memoryCache.construction = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('CONSTRUCTION_SAVED', { package: pkg, allConstruction: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingConstructionDelete(id: string) {
    const currentList = memoryCache.construction?.data || [];
    const updatedList = currentList.filter((c) => c.id !== id);

    memoryCache.construction = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('CONSTRUCTION_DELETED', { id, allConstruction: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingSettingsRealtime(settings: SiteSettings) {
    memoryCache.siteSettings = { data: settings, timestamp: Date.now() };
    saveToStorage('pr_site_settings_v2', settings);

    syncListeners.forEach((fn) => {
      try {
        fn('SETTINGS_SAVED', { siteSettings: settings });
      } catch (err) {}
    });
  }

  private static handleIncomingProjectRealtime(project: Project) {
    const currentList = memoryCache.projects?.data || [];
    const index = currentList.findIndex((p) => p.id === project.id);
    let updatedList: Project[];

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = project;
    } else {
      updatedList = [project, ...currentList];
    }

    memoryCache.projects = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_projects_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('PROJECT_SAVED', { project, allProjects: updatedList });
      } catch (err) {}
    });
  }

  private static handleIncomingProjectDelete(id: string) {
    const currentList = memoryCache.projects?.data || [];
    const updatedList = currentList.filter((p) => p.id !== id);

    memoryCache.projects = { data: updatedList, timestamp: Date.now() };
    saveToStorage('pr_projects_v2', updatedList);

    syncListeners.forEach((fn) => {
      try {
        fn('PROJECT_DELETED', { id, allProjects: updatedList });
      } catch (err) {}
    });
  }

  // Check version and refresh if stale
  static async checkForServerUpdates() {
    try {
      if (isSupabaseConfigured()) {
        return;
      }
      const res = await fetch('/api/sync/version');
      if (res.ok) {
        const data = await res.json();
        if (data.version && currentServerVersion && data.version > currentServerVersion) {
          currentServerVersion = data.version;
          await DataService.refreshAllDataFromServer();
        } else if (data.version && !currentServerVersion) {
          currentServerVersion = data.version;
        }
      }
    } catch (e) {}
  }

  // Handle incoming real-time messages from local BroadcastChannel or SSE
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
    } else if (type === 'PR_SERVICE_SAVED' || type === 'PR_SERVICE_DELETED') {
      if (payload?.allPRServices) {
        memoryCache.prServices = { data: payload.allPRServices, timestamp: Date.now() };
        saveToStorage('pr_services_v2', payload.allPRServices);
      }
    } else if (type === 'CONSTRUCTION_SAVED' || type === 'CONSTRUCTION_DELETED') {
      if (payload?.allConstruction) {
        memoryCache.construction = { data: payload.allConstruction, timestamp: Date.now() };
        saveToStorage('pr_construction_v2', payload.allConstruction);
      }
    } else if (type === 'PROJECT_SAVED' || type === 'PROJECT_DELETED') {
      if (payload?.allProjects) {
        memoryCache.projects = { data: payload.allProjects, timestamp: Date.now() };
        saveToStorage('pr_projects_v2', payload.allProjects);
      }
    } else if (type === 'SETTINGS_SAVED') {
      if (payload?.siteSettings) {
        memoryCache.siteSettings = { data: payload.siteSettings, timestamp: Date.now() };
        saveToStorage('pr_site_settings_v2', payload.siteSettings);
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

  // Refresh all data from server
  static async refreshAllDataFromServer() {
    try {
      const [p, l, n, pr, c, proj, s] = await Promise.all([
        DataService.getProperties(true),
        DataService.getLeads(true),
        DataService.getNews(true),
        DataService.getPRServices(true),
        DataService.getConstructionPackages(true),
        DataService.getProjects(true),
        DataService.getSiteSettings(true),
      ]);
      syncListeners.forEach((fn) =>
        fn('DATA_SYNC_REFRESH', {
          properties: p,
          leads: l,
          news: n,
          prServices: pr,
          construction: c,
          projects: proj,
          siteSettings: s,
        })
      );
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
  // 1. PROPERTIES (SUPABASE PRIMARY SOURCE OF TRUTH)
  // -----------------------------------------------------------------
  static async getProperties(forceRefresh = false): Promise<Property[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          throw new Error('Supabase client failed to initialize');
        }

        console.log('[PropertyService] Fetching properties from Supabase...');
        let { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error && (error.code === '42703' || error.message?.toLowerCase().includes('created_at'))) {
          const fallbackRes = await supabase.from('properties').select('*');
          data = fallbackRes.data;
          error = fallbackRes.error;
        }

        if (error) {
          console.error('[PropertyService] Supabase getProperties error:', error);
          throw new Error(`Supabase query failed: ${error.message}`);
        }

        const propertiesList: Property[] = (data || []).map(fromSupabaseRow);
        memoryCache.properties = { data: propertiesList, timestamp: Date.now() };
        saveToStorage('pr_properties_v2', propertiesList);

        return propertiesList;
      } catch (err) {
        console.error('[PropertyService] Supabase fetch failed:', err);
        throw err;
      }
    }

    if (!forceRefresh && memoryCache.properties && Date.now() - memoryCache.properties.timestamp < CACHE_TTL_MS) {
      return memoryCache.properties.data;
    }

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
    } catch (err) {}

    const stored = readFromStorage<Property[]>('pr_properties_v2');
    if (!forceRefresh && stored && stored.data && stored.data.length > 0) {
      memoryCache.properties = stored;
      return stored.data;
    }

    const fallback = stored?.data || initialProperties;
    memoryCache.properties = { data: fallback, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', fallback);
    return fallback;
  }

  static async saveProperty(property: Property): Promise<Property[]> {
    console.log('[PropertyService] Initiating property save:', {
      id: property.id,
      title: property.title,
      status: property.status,
    });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase client is not available. Please verify credentials.');
      }

      const supabaseRow = toSupabaseRow(property);
      console.log('[PropertyService] Upserting row to Supabase properties table:', supabaseRow.id);

      const { data, error } = await supabase
        .from('properties')
        .upsert(supabaseRow, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('[PropertyService] Supabase upsert error:', error);
        throw new Error(`Failed to save property to database: ${error.message}`);
      }

      console.log('[PropertyService] Supabase upsert successful:', data);
      const updatedList = await this.getProperties(true);

      this.broadcastLocal('PROPERTY_SAVED', { property, allProperties: updatedList });
      syncListeners.forEach((fn) => {
        try {
          fn('PROPERTY_SAVED', { property, allProperties: updatedList });
        } catch (e) {}
      });

      return updatedList;
    }

    const current = await this.getProperties();
    const index = current.findIndex((p) => p.id === property.id);
    let updated: Property[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = property;
    } else {
      updated = [property, ...current];
    }

    memoryCache.properties = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updated);
    this.broadcastLocal('PROPERTY_SAVED', { property, allProperties: updated });

    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
    } catch (e) {}

    syncListeners.forEach((fn) => {
      try {
        fn('PROPERTY_SAVED', { property, allProperties: updated });
      } catch (e) {}
    });

    return updated;
  }

  static async approveProperty(id: string): Promise<Property[]> {
    console.log('[PropertyService] Approving property ID:', id);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await supabase
        .from('properties')
        .update({
          status: 'ACTIVE',
          is_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('[PropertyService] Supabase approve property error:', error);
        throw new Error(`Failed to approve property in Supabase: ${error.message}`);
      }

      console.log('[PropertyService] Supabase property approved:', data);
      const updatedList = await this.getProperties(true);

      const approvedProp = updatedList.find((p) => p.id === id);
      this.broadcastLocal('PROPERTY_APPROVED', { property: approvedProp, allProperties: updatedList });

      syncListeners.forEach((fn) => {
        try {
          fn('PROPERTY_APPROVED', { property: approvedProp, allProperties: updatedList });
        } catch (e) {}
      });

      return updatedList;
    }

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

  static async rejectProperty(id: string): Promise<Property[]> {
    console.log('[PropertyService] Rejecting property ID:', id);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { error } = await supabase
        .from('properties')
        .update({
          status: 'REJECTED',
          is_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('[PropertyService] Supabase reject property error:', error);
        throw new Error(`Failed to reject property in Supabase: ${error.message}`);
      }

      const updatedList = await this.getProperties(true);
      const rejectedProp = updatedList.find((p) => p.id === id);
      this.broadcastLocal('PROPERTY_SAVED', { property: rejectedProp, allProperties: updatedList });

      syncListeners.forEach((fn) => {
        try {
          fn('PROPERTY_SAVED', { property: rejectedProp, allProperties: updatedList });
        } catch (e) {}
      });

      return updatedList;
    }

    const current = await this.getProperties();
    const index = current.findIndex((p) => p.id === id);
    if (index >= 0) {
      const rejected: Property = {
        ...current[index],
        status: 'REJECTED',
        isVerified: false,
      };
      return this.saveProperty(rejected);
    }
    return current;
  }

  static async deleteProperty(id: string): Promise<Property[]> {
    console.log('[PropertyService] Deleting property ID:', id);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) {
          console.error('[PropertyService] Supabase delete property warning:', error);
          throw new Error(`Failed to delete property in Supabase: ${error.message}`);
        }
      }
    }

    try {
      await fetch(`/api/properties/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

    const current = await this.getProperties(isSupabaseConfigured());
    const updated = current.filter((p) => p.id !== id);

    memoryCache.properties = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_properties_v2', updated);
    this.broadcastLocal('PROPERTY_DELETED', { id, allProperties: updated });

    syncListeners.forEach((fn) => {
      try {
        fn('PROPERTY_DELETED', { id, allProperties: updated });
      } catch (e) {}
    });

    return updated;
  }

  // -----------------------------------------------------------------
  // 2. NEWS ITEMS (SUPABASE REALTIME SYNC)
  // -----------------------------------------------------------------
  static async getNews(forceRefresh = false): Promise<NewsItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          let { data, error } = await supabase
            .from('news_items')
            .select('*')
            .order('published_at', { ascending: false });

          if (error) {
            const fallbackRes = await supabase.from('news_items').select('*');
            data = fallbackRes.data;
            error = fallbackRes.error;
          }

          if (!error && data && data.length > 0) {
            const newsList: NewsItem[] = data.map(fromSupabaseNewsRow);
            memoryCache.news = { data: newsList, timestamp: Date.now() };
            saveToStorage('pr_news_v2', newsList);
            return newsList;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch news failed:', err);
      }
    }

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
          const row = toSupabaseNewsRow(item);
          await supabase.from('news_items').upsert(row, { onConflict: 'id' });
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
  // 3. PR SERVICES (SUPABASE REALTIME SYNC)
  // -----------------------------------------------------------------
  static async getPRServices(forceRefresh = false): Promise<PRServiceItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          let { data, error } = await supabase.from('pr_services').select('*').order('order', { ascending: true });
          if (error) {
            const fallbackRes = await supabase.from('pr_services').select('*');
            data = fallbackRes.data;
          }
          if (data && data.length > 0) {
            const list: PRServiceItem[] = data.map(fromSupabasePRServiceRow);
            memoryCache.prServices = { data: list, timestamp: Date.now() };
            saveToStorage('pr_services_v2', list);
            return list;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch PR services failed:', err);
      }
    }

    if (!forceRefresh && memoryCache.prServices && Date.now() - memoryCache.prServices.timestamp < CACHE_TTL_MS) {
      return memoryCache.prServices.data;
    }

    try {
      const res = await fetch('/api/pr-services');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          memoryCache.prServices = { data: json.data, timestamp: Date.now() };
          saveToStorage('pr_services_v2', json.data);
          return json.data;
        }
      }
    } catch (e) {}

    const stored = readFromStorage<PRServiceItem[]>('pr_services_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.prServices = stored;
      return stored.data;
    }

    let result: PRServiceItem[] = stored?.data || initialPRServices;
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
      updated = [service, ...current];
    }

    memoryCache.prServices = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_services_v2', updated);
    this.broadcastLocal('PR_SERVICE_SAVED', { prService: service, allPRServices: updated });

    try {
      await fetch('/api/pr-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const row = toSupabasePRServiceRow(service);
          await supabase.from('pr_services').upsert(row, { onConflict: 'id' });
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
    this.broadcastLocal('PR_SERVICE_DELETED', { id, allPRServices: updated });

    try {
      await fetch(`/api/pr-services/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

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
  // 4. LEADS (SUPABASE REALTIME SYNC)
  // -----------------------------------------------------------------
  static async getLeads(forceRefresh = false): Promise<Lead[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          let { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
          if (error) {
            const fallbackRes = await supabase.from('leads').select('*');
            data = fallbackRes.data;
          }
          if (data && data.length > 0) {
            const list: Lead[] = data.map(fromSupabaseLeadRow);
            memoryCache.leads = { data: list, timestamp: Date.now() };
            saveToStorage('pr_leads_v2', list);
            return list;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch leads failed:', err);
      }
    }

    if (!forceRefresh && memoryCache.leads && Date.now() - memoryCache.leads.timestamp < CACHE_TTL_MS) {
      return memoryCache.leads.data;
    }

    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
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
          const row = toSupabaseLeadRow(lead);
          await supabase.from('leads').upsert(row, { onConflict: 'id' });
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
  // 5. CONSTRUCTION PACKAGES (SUPABASE REALTIME SYNC)
  // -----------------------------------------------------------------
  static async getConstructionPackages(forceRefresh = false): Promise<ConstructionPackage[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('construction_packages').select('*');
          if (!error && data && data.length > 0) {
            const list: ConstructionPackage[] = data.map(fromSupabaseConstructionRow);
            memoryCache.construction = { data: list, timestamp: Date.now() };
            saveToStorage('pr_construction_v2', list);
            return list;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch construction packages failed:', err);
      }
    }

    if (!forceRefresh && memoryCache.construction && Date.now() - memoryCache.construction.timestamp < CACHE_TTL_MS) {
      return memoryCache.construction.data;
    }

    try {
      const res = await fetch('/api/construction');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          memoryCache.construction = { data: json.data, timestamp: Date.now() };
          saveToStorage('pr_construction_v2', json.data);
          return json.data;
        }
      }
    } catch (e) {}

    const stored = readFromStorage<ConstructionPackage[]>('pr_construction_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.construction = stored;
      return stored.data;
    }

    let result: ConstructionPackage[] = stored?.data || initialConstructionPackages;
    memoryCache.construction = { data: result, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', result);
    return result;
  }

  static async saveConstructionPackage(pkg: ConstructionPackage): Promise<ConstructionPackage[]> {
    const current = await this.getConstructionPackages();
    const index = current.findIndex((c) => c.id === pkg.id);
    let updated: ConstructionPackage[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = pkg;
    } else {
      updated = [pkg, ...current];
    }

    memoryCache.construction = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', updated);
    this.broadcastLocal('CONSTRUCTION_SAVED', { package: pkg, allConstruction: updated });

    try {
      await fetch('/api/construction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg),
      });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const row = toSupabaseConstructionRow(pkg);
          await supabase.from('construction_packages').upsert(row, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save construction warning:', err);
      }
    }

    return updated;
  }

  static async deleteConstructionPackage(id: string): Promise<ConstructionPackage[]> {
    const current = await this.getConstructionPackages();
    const updated = current.filter((c) => c.id !== id);

    memoryCache.construction = { data: updated, timestamp: Date.now() };
    saveToStorage('pr_construction_v2', updated);
    this.broadcastLocal('CONSTRUCTION_DELETED', { id, allConstruction: updated });

    try {
      await fetch(`/api/construction/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('construction_packages').delete().eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase delete construction warning:', err);
      }
    }

    return updated;
  }

  // -----------------------------------------------------------------
  // 6. SITE SETTINGS (SUPABASE REALTIME SYNC)
  // -----------------------------------------------------------------
  static async getSiteSettings(forceRefresh = false): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
          if (!error && data) {
            const settings = fromSupabaseSiteSettingsRow(data);
            memoryCache.siteSettings = { data: settings, timestamp: Date.now() };
            saveToStorage('pr_site_settings_v2', settings);
            return settings;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch site settings failed:', err);
      }
    }

    if (!forceRefresh && memoryCache.siteSettings && Date.now() - memoryCache.siteSettings.timestamp < CACHE_TTL_MS) {
      return memoryCache.siteSettings.data;
    }

    try {
      const res = await fetch('/api/site-settings');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          memoryCache.siteSettings = { data: json.data, timestamp: Date.now() };
          saveToStorage('pr_site_settings_v2', json.data);
          return json.data;
        }
      }
    } catch (e) {}

    const stored = readFromStorage<SiteSettings>('pr_site_settings_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.siteSettings = stored;
      return stored.data;
    }

    let result: SiteSettings = stored?.data || initialSiteSettings;
    memoryCache.siteSettings = { data: result, timestamp: Date.now() };
    saveToStorage('pr_site_settings_v2', result);
    return result;
  }

  static async saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
    memoryCache.siteSettings = { data: settings, timestamp: Date.now() };
    saveToStorage('pr_site_settings_v2', settings);
    this.broadcastLocal('SETTINGS_SAVED', { siteSettings: settings });

    try {
      await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const row = toSupabaseSiteSettingsRow(settings);
          await supabase.from('site_settings').upsert(row, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase save site settings warning:', err);
      }
    }

    return settings;
  }

  // -----------------------------------------------------------------
  // 7. EXCLUSIVE PROJECTS (SUPABASE REALTIME SYNC)
  // -----------------------------------------------------------------
  static async getProjects(forceRefresh = false): Promise<Project[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('projects').select('*');
          if (!error && data && data.length > 0) {
            const list: Project[] = data.map(fromSupabaseProjectRow);
            memoryCache.projects = { data: list, timestamp: Date.now() };
            saveToStorage('pr_projects_v2', list);
            return list;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch projects failed:', err);
      }
    }

    if (!forceRefresh && memoryCache.projects && Date.now() - memoryCache.projects.timestamp < CACHE_TTL_MS) {
      return memoryCache.projects.data;
    }

    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          memoryCache.projects = { data: json.data, timestamp: Date.now() };
          saveToStorage('pr_projects_v2', json.data);
          return json.data;
        }
      }
    } catch (e) {}

    const stored = readFromStorage<Project[]>('pr_projects_v2');
    if (!forceRefresh && stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
      memoryCache.projects = stored;
      return stored.data;
    }

    let result: Project[] = stored?.data || initialProjects;
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
    this.broadcastLocal('PROJECT_SAVED', { project, allProjects: updated });

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const row = toSupabaseProjectRow(project);
          await supabase.from('projects').upsert(row, { onConflict: 'id' });
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
    this.broadcastLocal('PROJECT_DELETED', { id, allProjects: updated });

    try {
      await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}

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
    return `-- =========================================================================
-- THE MARS TV - COMPLETE SUPABASE REAL ESTATE SCHEMA & REALTIME SYNC
-- =========================================================================
-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    submission_id TEXT,
    title TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    price_label TEXT,
    location TEXT,
    city TEXT DEFAULT 'Indore',
    locality TEXT,
    address TEXT,
    pincode TEXT,
    coordinates TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    area NUMERIC DEFAULT 0,
    area_unit TEXT DEFAULT 'sq.ft',
    configuration TEXT,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    parking INTEGER DEFAULT 0,
    price_per_sq_ft NUMERIC,
    maintenance_charges NUMERIC,
    possession_status TEXT DEFAULT 'READY_TO_MOVE',
    possession_date TEXT,
    property_type TEXT DEFAULT 'APARTMENT',
    sub_category TEXT,
    listing_type TEXT DEFAULT 'BUY',
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
    is_sponsored BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_rera_reg BOOLEAN DEFAULT FALSE,
    rera_number TEXT,
    approval_authority TEXT,
    ownership_proof_doc TEXT,
    user_role TEXT DEFAULT 'DEVELOPER',
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    agency_name TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    images JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NEWS ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.news_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Indore Real Estate',
    region TEXT DEFAULT 'India',
    image TEXT,
    author TEXT DEFAULT 'The Mars TV News Desk',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    publishedAt TIMESTAMPTZ DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    isFeatured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PUBLISHED',
    view_count INT DEFAULT 120,
    viewCount INT DEFAULT 120,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PR SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.pr_services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    icon_name TEXT DEFAULT 'Megaphone',
    iconName TEXT DEFAULT 'Megaphone',
    deliverables JSONB DEFAULT '[]'::jsonb,
    price_starting_from TEXT DEFAULT '₹ 25,000',
    priceStartingFrom TEXT DEFAULT '₹ 25,000',
    price_numeric NUMERIC DEFAULT 25000,
    priceNumeric NUMERIC DEFAULT 25000,
    highlight BOOLEAN DEFAULT FALSE,
    "order" INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT,
    lead_type TEXT DEFAULT 'PROPERTY_ENQUIRY',
    leadType TEXT DEFAULT 'PROPERTY_ENQUIRY',
    status TEXT DEFAULT 'NEW',
    source TEXT DEFAULT 'WEBSITE',
    property_id TEXT,
    propertyId TEXT,
    property_title TEXT,
    propertyTitle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONSTRUCTION PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.construction_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_per_sq_ft NUMERIC NOT NULL DEFAULT 1650,
    pricePerSqFt NUMERIC DEFAULT 1650,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE,
    isPopular BOOLEAN DEFAULT FALSE,
    steel_grade TEXT DEFAULT 'Fe-500',
    steelGrade TEXT DEFAULT 'Fe-500',
    cement_grade TEXT DEFAULT 'Grade 53',
    cementGrade TEXT DEFAULT 'Grade 53',
    warranty_years INT DEFAULT 5,
    warrantyYears INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main_settings',
    site_name TEXT DEFAULT 'The Mars TV',
    siteName TEXT DEFAULT 'The Mars TV',
    tagline TEXT DEFAULT 'Central India’s Premier Real Estate Portal',
    contact_email TEXT DEFAULT 'support@themarstv.in',
    contactEmail TEXT DEFAULT 'support@themarstv.in',
    contact_phone TEXT DEFAULT '+91 123 456 7890',
    contactPhone TEXT DEFAULT '+91 123 456 7890',
    office_address TEXT DEFAULT '101-104 The Mars TV Tower, Vijay Nagar Square, Indore, MP 452001',
    officeAddress TEXT DEFAULT '101-104 The Mars TV Tower, Vijay Nagar Square, Indore, MP 452001',
    rera_reg_no TEXT DEFAULT 'RERA/MP/IND/2024/09912',
    reraRegNo TEXT DEFAULT 'RERA/MP/IND/2024/09912',
    gstin TEXT DEFAULT '23AABCT1234F1Z5',
    facebook_url TEXT DEFAULT '#',
    facebookUrl TEXT DEFAULT '#',
    instagram_url TEXT DEFAULT '#',
    instagramUrl TEXT DEFAULT '#',
    youtube_url TEXT DEFAULT '#',
    youtubeUrl TEXT DEFAULT '#',
    linkedin_url TEXT DEFAULT '#',
    linkedinUrl TEXT DEFAULT '#',
    twitter_url TEXT DEFAULT '#',
    twitterUrl TEXT DEFAULT '#',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    developer TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT DEFAULT 'Indore',
    price NUMERIC DEFAULT 0,
    price_label TEXT,
    priceLabel TEXT,
    project_type TEXT DEFAULT 'RESIDENTIAL',
    projectType TEXT DEFAULT 'RESIDENTIAL',
    possession_status TEXT DEFAULT 'READY_TO_MOVE',
    possessionStatus TEXT DEFAULT 'READY_TO_MOVE',
    possession_date TEXT,
    possessionDate TEXT,
    rera_number TEXT,
    reraNumber TEXT,
    description TEXT,
    image TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT TRUE,
    isFeatured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Properties" ON public.properties;
CREATE POLICY "Public Read Properties" ON public.properties FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Properties" ON public.properties;
CREATE POLICY "Public Write Properties" ON public.properties FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read News" ON public.news_items;
CREATE POLICY "Public Read News" ON public.news_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write News" ON public.news_items;
CREATE POLICY "Public Write News" ON public.news_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read PR" ON public.pr_services;
CREATE POLICY "Public Read PR" ON public.pr_services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write PR" ON public.pr_services;
CREATE POLICY "Public Write PR" ON public.pr_services FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Leads" ON public.leads;
CREATE POLICY "Public Read Leads" ON public.leads FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Leads" ON public.leads;
CREATE POLICY "Public Write Leads" ON public.leads FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Construction" ON public.construction_packages;
CREATE POLICY "Public Read Construction" ON public.construction_packages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Construction" ON public.construction_packages;
CREATE POLICY "Public Write Construction" ON public.construction_packages FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Settings" ON public.site_settings;
CREATE POLICY "Public Write Settings" ON public.site_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Projects" ON public.projects;
CREATE POLICY "Public Write Projects" ON public.projects FOR ALL USING (true);

-- 9. SUPABASE REALTIME REPLICATION (Instant Live Sync)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'properties') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'news_items') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.news_items;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'pr_services') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pr_services;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'construction_packages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.construction_packages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'site_settings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'projects') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
END $$;
`;
  }
}
