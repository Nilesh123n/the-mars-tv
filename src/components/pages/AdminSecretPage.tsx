import { useState, useEffect, FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  Lock,
  Unlock,
  Building,
  Newspaper,
  Megaphone,
  Edit3,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  X,
  ArrowLeft,
  RefreshCw,
  Eye,
  User,
  Save,
  LogOut,
  MapPin,
  AlertCircle,
  Database,
  Globe,
  Sliders,
  Copy,
  Check,
  Zap,
  HardHat,
  Phone,
  Mail,
  FileText,
  DollarSign,
  ShieldCheck,
  Layout,
  Upload,
  Layers
} from 'lucide-react';
import { Property, NewsItem, PRServiceItem, Lead, PropertyType, ListingType, PropertyStatus, ConstructionPackage, SiteSettings, LeadStatus } from '../../types';
import { DataService } from '../../lib/dataService';
import { isSupabaseConfigured, getSupabaseCredentials, saveSupabaseConfig } from '../../lib/supabase';
import { useDebounce } from '../../hooks/useDebounce';

interface AdminSecretPageProps {
  properties: Property[];
  setProperties: Dispatch<SetStateAction<Property[]>>;
  newsItems: NewsItem[];
  setNewsItems: Dispatch<SetStateAction<NewsItem[]>>;
  prServices: PRServiceItem[];
  setPRServices: Dispatch<SetStateAction<PRServiceItem[]>>;
  leads: Lead[];
  setLeads: Dispatch<SetStateAction<Lead[]>>;
  constructionPackages: ConstructionPackage[];
  setConstructionPackages: Dispatch<SetStateAction<ConstructionPackage[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: Dispatch<SetStateAction<SiteSettings>>;
  onNavigateHome: () => void;
  showToast: (msg: string) => void;
  onResetData?: () => void;
}

export default function AdminSecretPage({
  properties,
  setProperties,
  newsItems,
  setNewsItems,
  prServices,
  setPRServices,
  leads,
  setLeads,
  constructionPackages,
  setConstructionPackages,
  siteSettings,
  setSiteSettings,
  onNavigateHome,
  showToast,
  onResetData,
}: AdminSecretPageProps) {
  // Authentication State
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_unlocked') === 'true';
  });
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'properties' | 'news' | 'pr-services' | 'leads' | 'construction' | 'site-settings'>('properties');

  // Search Input with Debounce to prevent rapid re-renders / Egress
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Modals & Editing States
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isNewProperty, setIsNewProperty] = useState(false);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  const [editingPR, setEditingPR] = useState<PRServiceItem | null>(null);
  const [isNewPR, setIsNewPR] = useState(false);

  const [editingPackage, setEditingPackage] = useState<ConstructionPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);

  // Supabase Config Modal State
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setSupabaseUrlInput(creds.url);
    setSupabaseKeyInput(creds.key);
  }, [showSupabaseModal]);

  // Authentication Handler
  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'secret' || password === 'admin') {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_unlocked', 'true');
      setAuthError('');
      showToast('Admin Portal Unlocked successfully!');
    } else {
      setAuthError('Incorrect Password! Try "admin123"');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('admin_unlocked');
    setPassword('');
    showToast('Admin Portal locked.');
  };

  // Supabase Config Handler
  const handleSaveSupabaseConfig = (e: FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setShowSupabaseModal(false);
    showToast('Supabase connection details saved!');
  };

  // Manual Supabase Data Sync Handler
  const handleManualSync = async () => {
    setIsSyncing(true);
    showToast('Syncing local data with Supabase...');
    try {
      const freshProperties = await DataService.getProperties(true);
      const freshNews = await DataService.getNews(true);
      const freshPR = await DataService.getPRServices(true);
      const freshLeads = await DataService.getLeads(true);
      const freshPkg = await DataService.getConstructionPackages(true);
      const freshSettings = await DataService.getSiteSettings(true);

      setProperties(freshProperties);
      setNewsItems(freshNews);
      setPRServices(freshPR);
      setLeads(freshLeads);
      setConstructionPackages(freshPkg);
      setSiteSettings(freshSettings);

      showToast('All data synchronized smoothly with Supabase & Cache!');
    } catch (err) {
      showToast('Sync completed with local cached state.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopySchema = () => {
    const schema = DataService.getSupabaseSQLSchema();
    navigator.clipboard.writeText(schema);
    setCopiedSchema(true);
    showToast('Supabase SQL Schema copied to clipboard!');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleImageFileUpload = (e: ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
        showToast('Image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // 1. PROPERTY ACTIONS
  // -------------------------------------------------------------
  const handleSaveProperty = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const updated = await DataService.saveProperty(editingProperty);
    setProperties(updated);
    showToast(isNewProperty ? `Property "${editingProperty.title}" added!` : `Updated property "${editingProperty.title}"`);
    setEditingProperty(null);
    setIsNewProperty(false);
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = await DataService.deleteProperty(id);
      setProperties(updated);
      showToast(`Property deleted.`);
    }
  };

  const handleCreateNewProperty = () => {
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: 'New Commercial/Residential Property',
      slug: `new-property-${Date.now()}`,
      description: 'Enter detailed property description here...',
      price: 15000000,
      priceLabel: '₹1.50 Cr',
      location: 'Vijay Nagar, Indore',
      city: 'Indore',
      area: 1500,
      areaUnit: 'sq.ft',
      bedrooms: 3,
      bathrooms: 3,
      parking: 1,
      propertyType: 'APARTMENT',
      listingType: 'BUY',
      status: 'ACTIVE',
      isSponsored: false,
      isFeatured: true,
      isVerified: true,
      isReraReg: true,
      reraNumber: 'P-IND-24-9999',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
          isPrimary: true,
          alt: 'Main View',
        },
      ],
      amenities: ['Gymnasium', '24/7 Security', 'Clubhouse', 'Power Backup'],
      createdAt: new Date().toISOString(),
    };
    setEditingProperty(newProp);
    setIsNewProperty(true);
  };

  // -------------------------------------------------------------
  // 2. NEWS ACTIONS
  // -------------------------------------------------------------
  const handleSaveNews = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    const updated = await DataService.saveNewsItem(editingNews);
    setNewsItems(updated);
    showToast(isNewNews ? `Article "${editingNews.title}" added.` : `Updated article "${editingNews.title}"`);
    setEditingNews(null);
    setIsNewNews(false);
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (confirm(`Delete article "${title}"?`)) {
      const updated = await DataService.deleteNewsItem(id);
      setNewsItems(updated);
      showToast(`Article deleted.`);
    }
  };

  const handleCreateNewNews = () => {
    const newArticle: NewsItem = {
      id: `news-${Date.now()}`,
      title: 'Real Estate Growth Trends 2026',
      slug: `real-estate-trends-${Date.now()}`,
      excerpt: 'Indore and MP real estate market sees significant growth in commercial and residential developments.',
      content: 'Detailed analysis of investment patterns, infrastructure growth, metro corridor developments, and emerging real estate hubs in Central India.',
      category: 'REAL ESTATE TRENDS',
      region: 'India',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
      author: 'Property Research Desk',
      publishedAt: new Date().toISOString(),
      isFeatured: true,
      status: 'PUBLISHED',
      viewCount: 150,
    };
    setEditingNews(newArticle);
    setIsNewNews(true);
  };

  // -------------------------------------------------------------
  // 3. PR SERVICES ACTIONS
  // -------------------------------------------------------------
  const handleSavePR = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPR) return;

    const updated = await DataService.savePRService(editingPR);
    setPRServices(updated);
    showToast(isNewPR ? `PR Service "${editingPR.title}" created.` : `Updated PR service "${editingPR.title}"`);
    setEditingPR(null);
    setIsNewPR(false);
  };

  const handleDeletePR = async (id: string, title: string) => {
    if (confirm(`Delete PR Service "${title}"?`)) {
      const updated = await DataService.deletePRService(id);
      setPRServices(updated);
      showToast(`PR Service deleted.`);
    }
  };

  const handleCreateNewPR = () => {
    const newService: PRServiceItem = {
      id: `pr-${Date.now()}`,
      title: 'Custom PR Strategy & Press Launch',
      slug: `pr-service-${Date.now()}`,
      description: 'Exclusive press releases, press conferences, developer media coverage across major news channels and digital portals.',
      icon: 'Megaphone',
      isActive: true,
      order: prServices.length + 1,
    };
    setEditingPR(newService);
    setIsNewPR(true);
  };

  // -------------------------------------------------------------
  // 4. LEADS STATUS UPDATE
  // -------------------------------------------------------------
  const handleUpdateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const updatedLead = { ...lead, status: newStatus };
    const updatedList = await DataService.saveLead(updatedLead);
    setLeads(updatedList);
    showToast(`Lead status updated to ${newStatus}`);
  };

  // -------------------------------------------------------------
  // 5. CONSTRUCTION PACKAGE SAVE
  // -------------------------------------------------------------
  const handleSaveConstructionPackage = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    const updated = await DataService.saveConstructionPackage(editingPackage);
    setConstructionPackages(updated);
    showToast(`Saved Construction Package "${editingPackage.name}"`);
    setEditingPackage(null);
    setIsNewPackage(false);
  };

  // -------------------------------------------------------------
  // 6. SITE SETTINGS SAVE
  // -------------------------------------------------------------
  const handleSaveSiteSettings = async (e: FormEvent) => {
    e.preventDefault();
    const updated = await DataService.saveSiteSettings(settingsForm);
    setSiteSettings(updated);
    showToast('Site Details & Global Page Header/Footer updated successfully!');
  };

  // =============================================================
  // 1. LOCKED / PASSWORD PROTECTION SCREEN
  // =============================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative text-white">
          <div className="w-16 h-16 bg-[#D61F26]/10 border border-[#D61F26]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#D61F26]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Secret Admin Portal
            </h1>
            <p className="text-gray-400 text-xs mt-2">
              Supabase connected management system for Properties, News, PR Services, and Site Pages.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                Enter Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode (e.g. admin123)"
                  className="w-full bg-[#111111] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26] transition-colors"
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {authError}
                </p>
              )}
              <div className="bg-gray-800/60 rounded-xl p-3 mt-3 border border-gray-700/60 text-[11.5px] text-gray-300 flex justify-between items-center">
                <span>Default Passcode:</span>
                <code className="bg-black/60 text-[#D61F26] px-2 py-0.5 rounded font-mono font-bold">admin123</code>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <button
              onClick={onNavigateHome}
              className="text-gray-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSupaActive = isSupabaseConfigured();

  // =============================================================
  // 2. UNLOCKED ADMIN DASHBOARD
  // =============================================================
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pb-20">
      {/* Top Header Bar */}
      <header className="bg-[#111111] text-white sticky top-0 z-40 border-b border-gray-800 shadow-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#D61F26] p-2 rounded-xl text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Secret Admin Control Panel
                </h1>
                <span
                  onClick={() => setShowSupabaseModal(true)}
                  className={`cursor-pointer text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border flex items-center gap-1 ${
                    isSupaActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}
                  title="Click to Configure Supabase"
                >
                  <Zap className="w-3 h-3" />
                  {isSupaActive ? 'Supabase Live' : 'Offline Cache Mode'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden md:block">
                Egress Traffic Guard Enabled • Instant Local Caching • Supabase Integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-700"
              title="Supabase Settings"
            >
              <Sliders className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden sm:inline">Supabase Config</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-700 disabled:opacity-50"
              title="Manual Sync Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync Data</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden sm:inline">Live Site</span>
            </button>

            <button
              onClick={handleLock}
              className="px-3 py-1.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">

        {/* Egress Traffic & Supabase Banner */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Database Egress Traffic & Performance Guard Active
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                All data is loaded from fast local memory cache. Supabase network requests are debounced and executed asynchronously to prevent API loops and reduce Egress server bandwidth consumption.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySchema}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-600" />}
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy Supabase SQL'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'properties'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Properties ({properties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'news'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>News Hub ({newsItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pr-services')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'pr-services'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>PR Services ({prServices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('construction')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'construction'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Construction</span>
            </button>

            <button
              onClick={() => setActiveTab('site-settings')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'site-settings'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Page Details</span>
            </button>
          </div>

          {/* Search Bar & Action Button */}
          {activeTab !== 'site-settings' && activeTab !== 'construction' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              {activeTab === 'properties' && (
                <button
                  onClick={handleCreateNewProperty}
                  className="px-4 py-2 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              )}

              {activeTab === 'news' && (
                <button
                  onClick={handleCreateNewNews}
                  className="px-4 py-2 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Article</span>
                </button>
              )}

              {activeTab === 'pr-services' && (
                <button
                  onClick={handleCreateNewPR}
                  className="px-4 py-2 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add PR Service</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties
                .filter(
                  (p) =>
                    p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    p.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    p.propertyType.toLowerCase().includes(debouncedSearch.toLowerCase())
                )
                .map((property) => {
                  const primaryImg =
                    property.images.find((i) => i.isPrimary)?.url ||
                    property.images[0]?.url ||
                    '';
                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image preview */}
                        <div className="relative h-44 bg-gray-100 overflow-hidden">
                          <img
                            src={primaryImg}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                            <span className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                              {property.listingType}
                            </span>
                            <span className="bg-black/70 text-white text-[10px] font-extrabold px-2 py-0.5 rounded backdrop-blur">
                              {property.propertyType}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-black px-2.5 py-1 rounded-md backdrop-blur">
                            {property.priceLabel}
                          </div>
                        </div>

                        {/* Text info */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
                            {property.title}
                          </h3>
                          <p className="text-gray-500 text-xs flex items-center gap-1 mb-3">
                            <MapPin className="w-3 h-3 text-[#D61F26]" />
                            {property.location}
                          </p>
                          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-3">
                            {property.description}
                          </p>

                          {/* Attributes badges */}
                          <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                            {property.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                            {property.isSponsored && (
                              <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                                Sponsored
                              </span>
                            )}
                            {property.isVerified && (
                              <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400 font-mono">
                          ID: {property.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProperty({ ...property });
                              setIsNewProperty(false);
                            }}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id, property.title)}
                            className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                            title="Delete Property"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 2: NEWS MANAGEMENT */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {newsItems
                .filter(
                  (n) =>
                    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    n.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    n.author.toLowerCase().includes(debouncedSearch.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white shadow ${
                              item.region === 'International' ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}
                          >
                            {item.region === 'International' ? '🌐 International' : '🇮🇳 India'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-700">{item.author}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">
                        {item.viewCount || 100} Reads
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingNews({ ...item });
                            setIsNewNews(false);
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id, item.title)}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: PR SERVICES MANAGEMENT */}
        {activeTab === 'pr-services' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {prServices
                .filter(
                  (s) =>
                    s.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    s.description.toLowerCase().includes(debouncedSearch.toLowerCase())
                )
                .map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-[#D61F26]/10 text-[#D61F26] rounded-xl flex items-center justify-center font-bold">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            service.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base mb-1.5">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-gray-400">
                        Icon: {service.icon}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPR({ ...service });
                            setIsNewPR(false);
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePR(service.id, service.title)}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEADS MANAGEMENT */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs uppercase tracking-wider text-gray-500 flex justify-between items-center">
              <span>Client Inquiries & Call Back Requests ({leads.length})</span>
            </div>
            <div className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{lead.name}</h4>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {lead.leadType}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong>Phone:</strong> {lead.phone}</span>
                      {lead.email && <span><strong>Email:</strong> {lead.email}</span>}
                      {lead.propertyTitle && <span><strong>Property:</strong> {lead.propertyTitle}</span>}
                    </div>
                    {lead.message && (
                      <p className="text-xs text-gray-500 mt-1.5 italic bg-gray-50 p-2 rounded border border-gray-100">
                        "{lead.message}"
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-[11px] text-gray-400 block">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 cursor-pointer focus:outline-none focus:border-[#D61F26]"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONSTRUCTION PACKAGES */}
        {activeTab === 'construction' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {constructionPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-extrabold text-[#D61F26] uppercase tracking-wider">{pkg.id}</span>
                      {pkg.isPopular && <span className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">{pkg.badge || 'POPULAR'}</span>}
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-1">{pkg.name}</h3>
                    <div className="text-2xl font-black text-gray-900 mb-3">{pkg.rateLabel}</div>
                    <p className="text-xs text-gray-600 mb-4">{pkg.description}</p>

                    <div className="space-y-1.5 mb-6">
                      <p className="text-[11px] font-bold text-gray-500 uppercase">Included Features:</p>
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPackage({ ...pkg });
                      setIsNewPackage(false);
                    }}
                    className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Package Rates</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SITE SETTINGS & PAGE DETAILS */}
        {activeTab === 'site-settings' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2.5 bg-[#D61F26]/10 text-[#D61F26] rounded-xl">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Global Website Pages & Contact Details</h2>
                <p className="text-xs text-gray-500">
                  Update site brand name, hero headlines, phone numbers, email, and RERA registration displayed across all pages.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSiteSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Website Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.siteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.heroHeadline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Subheadline
                </label>
                <textarea
                  rows={2}
                  required
                  value={settingsForm.heroSubheadline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.phonePrimary}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsForm.emailContact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emailContact: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    RERA Registration Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.reraRegistrationNo}
                    onChange={(e) => setSettingsForm({ ...settingsForm, reraRegistrationNo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Office Address
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.officeAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  About Us Text
                </label>
                <textarea
                  rows={4}
                  required
                  value={settingsForm.aboutText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* EDIT / CREATE PROPERTY FORM MODAL                         */}
      {/* ========================================================= */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6 bg-[#111111] text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D61F26] rounded-xl text-white">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {isNewProperty ? 'Add New Property' : 'Edit Property Details'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    ID: {editingProperty.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="p-6 space-y-5 text-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, title: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Price Tag / Display (e.g. ₹1.25 Cr) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.priceLabel}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, priceLabel: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Location / Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.location}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, location: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.city}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, city: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Listing Type
                  </label>
                  <select
                    value={editingProperty.listingType}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        listingType: e.target.value as ListingType,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  >
                    <option value="BUY">BUY</option>
                    <option value="RENT">RENT</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Property Type
                  </label>
                  <select
                    value={editingProperty.propertyType}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        propertyType: e.target.value as PropertyType,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  >
                    <option value="APARTMENT">APARTMENT</option>
                    <option value="VILLA">VILLA</option>
                    <option value="PLOT">PLOT</option>
                    <option value="OFFICE">OFFICE</option>
                    <option value="RETAIL">RETAIL</option>
                    <option value="WAREHOUSE">WAREHOUSE</option>
                    <option value="PENTHOUSE">PENTHOUSE</option>
                    <option value="STUDIO">STUDIO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingProperty.status}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        status: e.target.value as PropertyStatus,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SOLD">SOLD</option>
                    <option value="RENTED">RENTED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Main Image URL or Upload
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingProperty.images[0]?.url || ''}
                    onChange={(e) => {
                      const newImgs = [...editingProperty.images];
                      if (newImgs.length === 0) {
                        newImgs.push({ url: e.target.value, isPrimary: true });
                      } else {
                        newImgs[0] = { ...newImgs[0], url: e.target.value };
                      }
                      setEditingProperty({ ...editingProperty, images: newImgs });
                    }}
                    placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                  <label className="px-3 py-2 bg-gray-800 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => {
                          const newImgs = [...editingProperty.images];
                          if (newImgs.length === 0) {
                            newImgs.push({ url, isPrimary: true });
                          } else {
                            newImgs[0] = { ...newImgs[0], url };
                          }
                          setEditingProperty({ ...editingProperty, images: newImgs });
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, description: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProperty.isFeatured}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#D61F26]"
                  />
                  <span>Featured Property</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProperty.isSponsored}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, isSponsored: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#D61F26]"
                  />
                  <span>Sponsored Banner</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProperty.isVerified}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, isVerified: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#D61F26]"
                  />
                  <span>Verified Document Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Property</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / CREATE NEWS FORM MODAL                             */}
      {/* ========================================================= */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="p-6 bg-[#111111] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D61F26] rounded-xl text-white">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {isNewNews ? 'Add News Article' : 'Edit News Article'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    ID: {editingNews.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingNews(null)}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-6 space-y-4 text-gray-800">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Region Badge
                  </label>
                  <select
                    value={editingNews.region || 'India'}
                    onChange={(e) => setEditingNews({ ...editingNews, region: e.target.value as 'India' | 'International' })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  >
                    <option value="India">🇮🇳 India</option>
                    <option value="International">🌐 International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Cover Image URL or Upload
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingNews.image}
                    onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                  <label className="px-3 py-2 bg-gray-800 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => {
                          setEditingNews({ ...editingNews, image: url });
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={editingNews.excerpt}
                  onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Full Article Content
                </label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save News Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUPABASE CONFIG MODAL                                     */}
      {/* ========================================================= */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D61F26]/20 text-[#D61F26] rounded-xl border border-[#D61F26]/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Supabase Connection Settings</h3>
                  <p className="text-xs text-gray-400">Configure real-time PostgreSQL database sync</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Supabase Project URL (VITE_SUPABASE_URL)
                </label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  className="w-full bg-[#111111] border border-gray-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
                </label>
                <textarea
                  rows={3}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  className="w-full bg-[#111111] border border-gray-700 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700 text-xs text-gray-300 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Egress & Network Bandwidth Protection:
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Even when connected to Supabase, queries are cached in memory for 10 minutes so users browsing your site consume minimum database Egress limits.
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-xl border border-gray-700 cursor-pointer"
                >
                  Copy SQL Table Setup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
