import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  initialProperties,
  initialNews,
  initialPRServices,
  initialLeads,
  initialConstructionPackages,
  initialSiteSettings,
  initialProjects,
} from './src/data/mockData';
import { Property, Lead, NewsItem, PRServiceItem, ConstructionPackage, SiteSettings, Project } from './src/types';

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

interface AppDataStore {
  properties: Property[];
  news: NewsItem[];
  prServices: PRServiceItem[];
  leads: Lead[];
  construction: ConstructionPackage[];
  siteSettings: SiteSettings;
  projects: Project[];
  version: number;
}

// In-Memory state with disk persistence
let store: AppDataStore = {
  properties: initialProperties,
  news: initialNews,
  prServices: initialPRServices,
  leads: initialLeads,
  construction: initialConstructionPackages,
  siteSettings: initialSiteSettings,
  projects: initialProjects,
  version: Date.now(),
};

// Load existing data from file if available
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    store = {
      properties: parsed.properties || initialProperties,
      news: parsed.news || initialNews,
      prServices: parsed.prServices || initialPRServices,
      leads: parsed.leads || initialLeads,
      construction: parsed.construction || initialConstructionPackages,
      siteSettings: parsed.siteSettings || initialSiteSettings,
      projects: parsed.projects || initialProjects,
      version: parsed.version || Date.now(),
    };
    console.log(`[Store] Loaded ${store.properties.length} properties from storage file.`);
  }
} catch (e) {
  console.warn('[Store] Failed to read storage file, initializing with defaults:', e);
}

function persistStore() {
  try {
    store.version = Date.now();
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Store] Failed to persist data store:', e);
  }
}

// SSE Connected Clients for Real-Time Multi-Device Sync
type SSEClient = {
  id: string;
  res: Response;
};

let sseClients: SSEClient[] = [];

function broadcastRealtimeUpdate(type: string, payload: any) {
  store.version = Date.now();
  persistStore();

  const message = `data: ${JSON.stringify({ type, version: store.version, payload, timestamp: Date.now() })}\n\n`;
  
  sseClients = sseClients.filter((client) => {
    try {
      client.res.write(message);
      return true;
    } catch (err) {
      return false;
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // -----------------------------------------------------------------
  // REAL-TIME MULTI-DEVICE SSE SYNC STREAM
  // -----------------------------------------------------------------
  app.get('/api/sync/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const client: SSEClient = { id: clientId, res };
    sseClients.push(client);

    // Initial greeting
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId, version: store.version })}\n\n`);

    // Keep connection alive every 25 seconds
    const keepAliveTimer = setInterval(() => {
      try {
        res.write(`: keep-alive ping\n\n`);
      } catch (e) {
        clearInterval(keepAliveTimer);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      sseClients = sseClients.filter((c) => c.id !== clientId);
    });
  });

  app.get('/api/sync/version', (req: Request, res: Response) => {
    res.json({ version: store.version });
  });

  // -----------------------------------------------------------------
  // 1. PROPERTIES API
  // -----------------------------------------------------------------
  app.get('/api/properties', (req: Request, res: Response) => {
    res.json({ success: true, data: store.properties, version: store.version });
  });

  app.post('/api/properties', (req: Request, res: Response) => {
    const property: Property = req.body;
    if (!property || !property.id) {
      return res.status(400).json({ success: false, error: 'Property ID and payload required' });
    }

    const index = store.properties.findIndex((p) => p.id === property.id);
    if (index >= 0) {
      store.properties[index] = { ...store.properties[index], ...property };
    } else {
      store.properties = [property, ...store.properties];
    }

    persistStore();
    broadcastRealtimeUpdate('PROPERTY_SAVED', { property, allProperties: store.properties });

    res.json({ success: true, data: store.properties });
  });

  // Approve a pending property directly
  app.post('/api/properties/:id/approve', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = store.properties.findIndex((p) => p.id === id);
    if (index < 0) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    store.properties[index] = {
      ...store.properties[index],
      status: 'ACTIVE',
      isVerified: true,
    };

    persistStore();
    broadcastRealtimeUpdate('PROPERTY_APPROVED', {
      property: store.properties[index],
      allProperties: store.properties,
    });

    res.json({ success: true, data: store.properties, approved: store.properties[index] });
  });

  // Reject / Delete a property
  app.delete('/api/properties/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    store.properties = store.properties.filter((p) => p.id !== id);

    persistStore();
    broadcastRealtimeUpdate('PROPERTY_DELETED', { id, allProperties: store.properties });

    res.json({ success: true, data: store.properties });
  });

  // -----------------------------------------------------------------
  // 2. LEADS / INQUIRIES API
  // -----------------------------------------------------------------
  app.get('/api/leads', (req: Request, res: Response) => {
    res.json({ success: true, data: store.leads, version: store.version });
  });

  app.post('/api/leads', (req: Request, res: Response) => {
    const lead: Lead = req.body;
    if (!lead || !lead.id) {
      return res.status(400).json({ success: false, error: 'Lead payload required' });
    }

    const index = store.leads.findIndex((l) => l.id === lead.id);
    if (index >= 0) {
      store.leads[index] = lead;
    } else {
      store.leads = [lead, ...store.leads];
    }

    persistStore();
    broadcastRealtimeUpdate('LEAD_SAVED', { lead, allLeads: store.leads });

    res.json({ success: true, data: store.leads });
  });

  app.delete('/api/leads/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    store.leads = store.leads.filter((l) => l.id !== id);

    persistStore();
    broadcastRealtimeUpdate('LEAD_DELETED', { id, allLeads: store.leads });

    res.json({ success: true, data: store.leads });
  });

  // -----------------------------------------------------------------
  // 3. NEWS API
  // -----------------------------------------------------------------
  app.get('/api/news', (req: Request, res: Response) => {
    res.json({ success: true, data: store.news, version: store.version });
  });

  app.post('/api/news', (req: Request, res: Response) => {
    const newsItem: NewsItem = req.body;
    if (!newsItem || !newsItem.id) {
      return res.status(400).json({ success: false, error: 'News item payload required' });
    }
    const index = store.news.findIndex((n) => n.id === newsItem.id);
    if (index >= 0) {
      store.news[index] = newsItem;
    } else {
      store.news = [newsItem, ...store.news];
    }

    persistStore();
    broadcastRealtimeUpdate('NEWS_SAVED', { newsItem, allNews: store.news });

    res.json({ success: true, data: store.news });
  });

  app.delete('/api/news/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    store.news = store.news.filter((n) => n.id !== id);

    persistStore();
    broadcastRealtimeUpdate('NEWS_DELETED', { id, allNews: store.news });

    res.json({ success: true, data: store.news });
  });

  // -----------------------------------------------------------------
  // 4. PR SERVICES API
  // -----------------------------------------------------------------
  app.get('/api/pr-services', (req: Request, res: Response) => {
    res.json({ success: true, data: store.prServices, version: store.version });
  });

  app.post('/api/pr-services', (req: Request, res: Response) => {
    const service: PRServiceItem = req.body;
    if (!service || !service.id) {
      return res.status(400).json({ success: false, error: 'Service payload required' });
    }
    const index = store.prServices.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      store.prServices[index] = service;
    } else {
      store.prServices = [...store.prServices, service];
    }

    persistStore();
    broadcastRealtimeUpdate('PR_SERVICE_SAVED', { service, allPRServices: store.prServices });
    res.json({ success: true, data: store.prServices });
  });

  app.delete('/api/pr-services/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    store.prServices = store.prServices.filter((s) => s.id !== id);
    persistStore();
    broadcastRealtimeUpdate('PR_SERVICE_DELETED', { id, allPRServices: store.prServices });
    res.json({ success: true, data: store.prServices });
  });

  // -----------------------------------------------------------------
  // 5. CONSTRUCTION PACKAGES API
  // -----------------------------------------------------------------
  app.get('/api/construction', (req: Request, res: Response) => {
    res.json({ success: true, data: store.construction, version: store.version });
  });

  app.post('/api/construction', (req: Request, res: Response) => {
    const pkg: ConstructionPackage = req.body;
    if (!pkg || !pkg.id) {
      return res.status(400).json({ success: false, error: 'Package payload required' });
    }
    const index = store.construction.findIndex((p) => p.id === pkg.id);
    if (index >= 0) {
      store.construction[index] = pkg;
    } else {
      store.construction = [...store.construction, pkg];
    }

    persistStore();
    broadcastRealtimeUpdate('CONSTRUCTION_SAVED', { pkg, allConstruction: store.construction });
    res.json({ success: true, data: store.construction });
  });

  app.delete('/api/construction/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    store.construction = store.construction.filter((p) => p.id !== id);
    persistStore();
    broadcastRealtimeUpdate('CONSTRUCTION_DELETED', { id, allConstruction: store.construction });
    res.json({ success: true, data: store.construction });
  });

  // -----------------------------------------------------------------
  // 6. PROJECTS API
  // -----------------------------------------------------------------
  app.get('/api/projects', (req: Request, res: Response) => {
    res.json({ success: true, data: store.projects, version: store.version });
  });

  app.post('/api/projects', (req: Request, res: Response) => {
    const project: Project = req.body;
    if (!project || !project.id) {
      return res.status(400).json({ success: false, error: 'Project payload required' });
    }
    const index = store.projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      store.projects[index] = project;
    } else {
      store.projects = [...store.projects, project];
    }

    persistStore();
    broadcastRealtimeUpdate('PROJECT_SAVED', { project, allProjects: store.projects });
    res.json({ success: true, data: store.projects });
  });

  app.delete('/api/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    store.projects = store.projects.filter((p) => p.id !== id);
    persistStore();
    broadcastRealtimeUpdate('PROJECT_DELETED', { id, allProjects: store.projects });
    res.json({ success: true, data: store.projects });
  });

  // -----------------------------------------------------------------
  // 7. SITE SETTINGS API
  // -----------------------------------------------------------------
  app.get('/api/site-settings', (req: Request, res: Response) => {
    res.json({ success: true, data: store.siteSettings, version: store.version });
  });

  app.post('/api/site-settings', (req: Request, res: Response) => {
    const settings: SiteSettings = req.body;
    if (settings) {
      store.siteSettings = { ...store.siteSettings, ...settings };
      persistStore();
      broadcastRealtimeUpdate('SETTINGS_SAVED', { siteSettings: store.siteSettings });
    }
    res.json({ success: true, data: store.siteSettings });
  });

  // -----------------------------------------------------------------
  // 8. RESET TO FACTORY DEFAULTS
  // -----------------------------------------------------------------
  app.post('/api/reset-defaults', (req: Request, res: Response) => {
    store = {
      properties: initialProperties,
      news: initialNews,
      prServices: initialPRServices,
      leads: initialLeads,
      construction: initialConstructionPackages,
      siteSettings: initialSiteSettings,
      projects: initialProjects,
      version: Date.now(),
    };
    persistStore();
    broadcastRealtimeUpdate('ALL_DATA_RESET', store);
    res.json({ success: true, message: 'Reset all data to default mock store' });
  });

  // -----------------------------------------------------------------
  // VITE / STATIC ASSET SERVING
  // -----------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mars TV App] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
