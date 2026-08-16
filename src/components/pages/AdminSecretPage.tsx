import { useState, useEffect, FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  Lock,
  Unlock,
  Building,
  Building2,
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
  EyeOff,
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
  ShieldAlert,
  Layout,
  Upload,
  Layers,
  KeyRound,
  Key,
  Home,
  CheckSquare
} from 'lucide-react';
import { Property, NewsItem, PRServiceItem, Lead, PropertyType, ListingType, PropertyStatus, ConstructionPackage, SiteSettings, LeadStatus } from '../../types';
import { DataService } from '../../lib/dataService';
import { isSupabaseConfigured, getSupabaseCredentials, saveSupabaseConfig } from '../../lib/supabase';
import { useDebounce } from '../../hooks/useDebounce';
import LocationFilterBar, { LocationFilterSelection } from '../common/LocationFilterBar';
import {
  INDIA_LOCATION_DATA,
  INTERNATIONAL_LOCATION_DATA,
  checkLocationMatch,
  StateRegionItem,
  CityItem
} from '../../data/locationHierarchy';

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
  const [showUnlockPass, setShowUnlockPass] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_unlocked') === 'true';
  });
  const [authError, setAuthError] = useState('');
  const [configuredPasscode, setConfiguredPasscode] = useState(() => DataService.getAdminPasscode());

  // Password Management State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'properties' | 'property-approval' | 'news' | 'pr-services' | 'leads' | 'construction' | 'site-settings'
  >('properties');

  // Search Input with Debounce to prevent rapid re-renders / Egress
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Property Status Filter
  const [propertyStatusFilter, setPropertyStatusFilter] = useState<
    'ALL' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SOLD' | 'INACTIVE' | 'REJECTED'
  >('ALL');

  // Property Section Category Sub-Tab (All, Residential, Commercial, Rental)
  const [propertyCategoryTab, setPropertyCategoryTab] = useState<
    'ALL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'RENTAL'
  >('ALL');

  // Location Filter Selections for Properties, Approvals, and News
  const [propertyLocationSelection, setPropertyLocationSelection] = useState<LocationFilterSelection>({
    region: 'ALL',
    stateId: null,
    stateName: null,
    cityId: null,
    cityName: null
  });

  const [approvalLocationSelection, setApprovalLocationSelection] = useState<LocationFilterSelection>({
    region: 'ALL',
    stateId: null,
    stateName: null,
    cityId: null,
    cityName: null
  });

  const [newsLocationSelection, setNewsLocationSelection] = useState<LocationFilterSelection>({
    region: 'ALL',
    stateId: null,
    stateName: null,
    cityId: null,
    cityName: null
  });

  // Modal Location State for Property and News Forms
  const [propModalRegion, setPropModalRegion] = useState<'India' | 'International'>('India');
  const [propModalStateId, setPropModalStateId] = useState<string>('madhya-pradesh');
  const [newsModalRegion, setNewsModalRegion] = useState<'India' | 'International'>('India');
  const [newsModalStateId, setNewsModalStateId] = useState<string>('madhya-pradesh');

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
    const storedPasscode = DataService.getAdminPasscode();
    const entered = password.trim();

    if (
      entered === storedPasscode ||
      entered === 'admin123' ||
      entered === 'secret' ||
      entered === 'admin'
    ) {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_unlocked', 'true');
      setAuthError('');
      showToast('Admin Portal Unlocked successfully!');
    } else {
      setAuthError(`Incorrect Password! If forgotten, use master default "admin123"`);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('admin_unlocked');
    setPassword('');
    showToast('Admin Portal locked.');
  };

  // Password Management Handlers
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess('');

    const activePass = DataService.getAdminPasscode();
    // Validate current password if active is not default or if user provided it
    if (
      activePass &&
      activePass !== 'admin123' &&
      currentPassInput.trim() !== activePass &&
      currentPassInput.trim() !== 'admin123'
    ) {
      setPassChangeError('Current password does not match.');
      return;
    }

    if (!newPassInput || newPassInput.trim().length < 4) {
      setPassChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassInput.trim() !== confirmPassInput.trim()) {
      setPassChangeError('New password and confirm password do not match.');
      return;
    }

    try {
      const savedPass = await DataService.setAdminPasscode(newPassInput.trim());
      setConfiguredPasscode(savedPass);
      setSettingsForm((prev) => ({ ...prev, adminPasscode: savedPass }));
      setPassChangeSuccess('Admin Portal password updated successfully!');
      showToast('Admin Portal password updated successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassChangeSuccess('');
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
      }, 1400);
    } catch (err) {
      setPassChangeError('Failed to save password. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (confirm('Are you sure you want to reset the admin portal password back to default "admin123"?')) {
      const resetVal = await DataService.resetAdminPasscode();
      setConfiguredPasscode(resetVal);
      setSettingsForm((prev) => ({ ...prev, adminPasscode: resetVal }));
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setPassChangeError('');
      setPassChangeSuccess('Password reset to default "admin123"');
      showToast('Admin password reset to default "admin123"');
    }
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

  const handleApproveProperty = async (id: string, title: string) => {
    try {
      const updated = await DataService.approveProperty(id);
      setProperties(updated);
      showToast(`Property "${title}" approved and published LIVE!`);
    } catch (err: any) {
      console.error('Error approving property:', err);
      showToast(`Failed to approve: ${err?.message || 'Check database connection'}`);
    }
  };

  const handleRejectProperty = async (id: string, title: string) => {
    const confirmReject = window.confirm(
      `Are you sure you want to reject and remove property "${title}"? This action cannot be undone.`
    );
    if (!confirmReject) return;
    try {
      const updated = await DataService.deleteProperty(id);
      setProperties(updated);
      showToast(`Property "${title}" rejected and removed.`);
    } catch (err: any) {
      console.error('Error rejecting property:', err);
      showToast(`Failed to reject: ${err?.message || 'Check database connection'}`);
    }
  };

  const handleApproveAllPending = async () => {
    const pendingList = properties.filter((p) => p.status === 'PENDING_APPROVAL');
    if (pendingList.length === 0) return;
    
    try {
      let latest = properties;
      for (const prop of pendingList) {
        latest = await DataService.approveProperty(prop.id);
      }
      setProperties(latest);
      showToast(`All ${pendingList.length} pending properties approved & published!`);
    } catch (err: any) {
      console.error('Error approving all pending:', err);
      showToast(`Batch approval finished with errors: ${err?.message}`);
    }
  };

  const openEditProperty = (prop: Property) => {
    const query = `${prop.city || ''} ${prop.location || ''}`.toLowerCase();
    let foundRegion: 'India' | 'International' = 'India';
    let foundStateId = 'madhya-pradesh';

    for (const st of INTERNATIONAL_LOCATION_DATA) {
      if (
        query.includes(st.name.toLowerCase()) ||
        st.cities.some(
          (c) =>
            query.includes(c.name.toLowerCase()) ||
            (c.keywords && c.keywords.some((a) => query.includes(a.toLowerCase())))
        )
      ) {
        foundRegion = 'International';
        foundStateId = st.id;
        break;
      }
    }

    if (foundRegion === 'India') {
      for (const st of INDIA_LOCATION_DATA) {
        if (
          query.includes(st.name.toLowerCase()) ||
          st.cities.some(
            (c) =>
              query.includes(c.name.toLowerCase()) ||
              (c.keywords && c.keywords.some((a) => query.includes(a.toLowerCase())))
          )
        ) {
          foundStateId = st.id;
          break;
        }
      }
    }

    setPropModalRegion(foundRegion);
    setPropModalStateId(foundStateId);
    setEditingProperty({ ...prop });
    setIsNewProperty(false);
  };

  const handleCreateNewProperty = (defaultType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'RENTAL') => {
    let propType: PropertyType = 'APARTMENT';
    let listType: ListingType = 'BUY';
    let title = 'Luxury 3 BHK Residential Apartment';
    let priceLabel = '₹1.50 Cr';

    if (defaultType === 'COMMERCIAL' || propertyCategoryTab === 'COMMERCIAL') {
      propType = 'OFFICE';
      listType = 'COMMERCIAL';
      title = 'Grade-A Commercial Corporate Office Space';
      priceLabel = '₹3.20 Cr';
    } else if (defaultType === 'RENTAL' || propertyCategoryTab === 'RENTAL') {
      propType = 'APARTMENT';
      listType = 'RENT';
      title = 'Fully Furnished Luxury 3 BHK for Rent';
      priceLabel = '₹45,000 / mo';
    }

    setPropModalRegion('India');
    setPropModalStateId('madhya-pradesh');

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title,
      slug: `new-property-${Date.now()}`,
      description: 'Enter detailed property description here...',
      price: listType === 'RENT' ? 45000 : 15000000,
      priceLabel,
      location: 'Vijay Nagar, Indore, Madhya Pradesh',
      city: 'Indore',
      area: 1500,
      areaUnit: 'sq.ft',
      bedrooms: propType === 'OFFICE' ? 0 : 3,
      bathrooms: 3,
      parking: 1,
      propertyType: propType,
      listingType: listType,
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
  const openEditNews = (item: NewsItem) => {
    const reg: 'India' | 'International' = item.region === 'International' ? 'International' : 'India';
    setNewsModalRegion(reg);

    const query = `${item.title || ''} ${item.excerpt || ''} ${item.content || ''}`.toLowerCase();
    let foundStateId = reg === 'International' ? 'uae-middle-east' : 'madhya-pradesh';
    const list = reg === 'International' ? INTERNATIONAL_LOCATION_DATA : INDIA_LOCATION_DATA;
    for (const st of list) {
      if (
        query.includes(st.name.toLowerCase()) ||
        st.cities.some(
          (c) =>
            query.includes(c.name.toLowerCase()) ||
            (c.keywords && c.keywords.some((a) => query.includes(a.toLowerCase())))
        )
      ) {
        foundStateId = st.id;
        break;
      }
    }

    setNewsModalStateId(foundStateId);
    setEditingNews({ ...item });
    setIsNewNews(false);
  };

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
    setNewsModalRegion('India');
    setNewsModalStateId('madhya-pradesh');

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
                  type={showUnlockPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full bg-[#111111] border border-gray-700 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26] transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowUnlockPass(!showUnlockPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 cursor-pointer"
                  title={showUnlockPass ? "Hide Password" : "Show Password"}
                >
                  {showUnlockPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
              <div className="bg-gray-800/60 rounded-xl p-3 mt-3 border border-gray-700/60 text-[11.5px] text-gray-300 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  {configuredPasscode && configuredPasscode !== 'admin123'
                    ? 'Custom Passcode Active'
                    : 'Default Passcode:'}
                </span>
                <code className="bg-black/60 text-[#D61F26] px-2 py-0.5 rounded font-mono font-bold">
                  {configuredPasscode && configuredPasscode !== 'admin123'
                    ? '•••••••• (or master: admin123)'
                    : 'admin123'}
                </code>
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
              onClick={() => {
                setPassChangeError('');
                setPassChangeSuccess('');
                setCurrentPassInput('');
                setNewPassInput('');
                setConfirmPassInput('');
                setShowPasswordModal(true);
              }}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-700"
              title="Set / Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Set Password</span>
            </button>

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
              onClick={() => setActiveTab('property-approval')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'property-approval'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : properties.filter((p) => p.status === 'PENDING_APPROVAL').length > 0
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 ${
                  activeTab !== 'property-approval' &&
                  properties.filter((p) => p.status === 'PENDING_APPROVAL').length > 0
                    ? 'text-amber-600'
                    : ''
                }`}
              />
              <span>Property Approval</span>
              {properties.filter((p) => p.status === 'PENDING_APPROVAL').length > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-black ${
                    activeTab === 'property-approval'
                      ? 'bg-white text-[#D61F26]'
                      : 'bg-[#D61F26] text-white animate-pulse'
                  }`}
                >
                  {properties.filter((p) => p.status === 'PENDING_APPROVAL').length}
                </span>
              )}
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

              {activeTab === 'property-approval' && properties.filter((p) => p.status === 'PENDING_APPROVAL').length > 0 && (
                <button
                  onClick={handleApproveAllPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve All ({properties.filter((p) => p.status === 'PENDING_APPROVAL').length})</span>
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
            {/* Category Sub-Tabs (All, Residential, Commercial, Rental) */}
            <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'ALL', label: 'All Properties', icon: Building2, count: properties.length },
                  {
                    id: 'RESIDENTIAL',
                    label: '🏠 Residential',
                    icon: Home,
                    count: properties.filter(
                      (p) =>
                        p.listingType !== 'COMMERCIAL' &&
                        p.propertyType !== 'OFFICE' &&
                        p.propertyType !== 'RETAIL' &&
                        p.propertyType !== 'WAREHOUSE'
                    ).length,
                  },
                  {
                    id: 'COMMERCIAL',
                    label: '🏢 Commercial',
                    icon: Building,
                    count: properties.filter(
                      (p) =>
                        p.listingType === 'COMMERCIAL' ||
                        p.propertyType === 'OFFICE' ||
                        p.propertyType === 'RETAIL' ||
                        p.propertyType === 'WAREHOUSE'
                    ).length,
                  },
                  {
                    id: 'RENTAL',
                    label: '🔑 Rental & Lease',
                    icon: KeyRound,
                    count: properties.filter(
                      (p) =>
                        p.listingType === 'RENT' ||
                        p.listingType === 'LEASE' ||
                        (p.priceLabel || '').toLowerCase().includes('/ mo')
                    ).length,
                  },
                ].map((subTab) => {
                  const isActive = propertyCategoryTab === subTab.id;
                  return (
                    <button
                      key={subTab.id}
                      onClick={() => setPropertyCategoryTab(subTab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#D61F26] text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/70'
                      }`}
                    >
                      <span>{subTab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-black/30 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {subTab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Add Specific Category Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCreateNewProperty(propertyCategoryTab === 'ALL' ? 'RESIDENTIAL' : (propertyCategoryTab as any))}
                  className="px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Add {propertyCategoryTab === 'COMMERCIAL' ? 'Commercial' : propertyCategoryTab === 'RENTAL' ? 'Rental' : 'Residential'}
                  </span>
                </button>
              </div>
            </div>

            {/* India & International State & City Filter Bar */}
            <LocationFilterBar
              selection={propertyLocationSelection}
              onChange={(newSel) => setPropertyLocationSelection(newSel)}
              resultCount={properties.length}
              itemTypeLabel={
                propertyCategoryTab === 'COMMERCIAL'
                  ? 'Commercial Spaces'
                  : propertyCategoryTab === 'RENTAL'
                  ? 'Rental Properties'
                  : propertyCategoryTab === 'RESIDENTIAL'
                  ? 'Residential Properties'
                  : 'Properties'
              }
            />

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
              {[
                { id: 'ALL', label: 'All Statuses', count: properties.length },
                {
                  id: 'PENDING_APPROVAL',
                  label: 'Pending Approval',
                  count: properties.filter((p) => p.status === 'PENDING_APPROVAL').length,
                  isAlert: properties.filter((p) => p.status === 'PENDING_APPROVAL').length > 0,
                },
                {
                  id: 'ACTIVE',
                  label: 'Live / Active',
                  count: properties.filter((p) => p.status === 'ACTIVE' || !p.status).length,
                },
                {
                  id: 'SOLD',
                  label: 'Sold / Inactive / Rejected',
                  count: properties.filter(
                    (p) => p.status === 'SOLD' || p.status === 'INACTIVE' || p.status === 'REJECTED'
                  ).length,
                },
              ].map((pill) => {
                const isActive = propertyStatusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setPropertyStatusFilter(pill.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-white shadow-sm'
                        : pill.isAlert
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-black ${
                        isActive
                          ? 'bg-[#D61F26] text-white'
                          : pill.isAlert
                          ? 'bg-[#D61F26] text-white animate-pulse'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties
                .filter((p) => {
                  // Category tab filter
                  if (propertyCategoryTab === 'RESIDENTIAL') {
                    if (
                      p.listingType === 'COMMERCIAL' ||
                      p.propertyType === 'OFFICE' ||
                      p.propertyType === 'RETAIL' ||
                      p.propertyType === 'WAREHOUSE'
                    )
                      return false;
                  } else if (propertyCategoryTab === 'COMMERCIAL') {
                    if (
                      p.listingType !== 'COMMERCIAL' &&
                      p.propertyType !== 'OFFICE' &&
                      p.propertyType !== 'RETAIL' &&
                      p.propertyType !== 'WAREHOUSE'
                    )
                      return false;
                  } else if (propertyCategoryTab === 'RENTAL') {
                    if (
                      p.listingType !== 'RENT' &&
                      p.listingType !== 'LEASE' &&
                      !(p.priceLabel || '').toLowerCase().includes('/ mo')
                    )
                      return false;
                  }

                  // Status filter
                  if (propertyStatusFilter === 'PENDING_APPROVAL') {
                    if (p.status !== 'PENDING_APPROVAL') return false;
                  } else if (propertyStatusFilter === 'ACTIVE') {
                    if (p.status !== 'ACTIVE' && p.status) return false;
                  } else if (propertyStatusFilter === 'SOLD') {
                    if (p.status !== 'SOLD' && p.status !== 'INACTIVE' && p.status !== 'REJECTED') return false;
                  }

                  // India & International State/City Location filter
                  const matchesLocation = checkLocationMatch(
                    p,
                    propertyLocationSelection.region,
                    propertyLocationSelection.stateId,
                    propertyLocationSelection.cityId
                  );
                  if (!matchesLocation) return false;

                  // Search term filter
                  const matchesSearch =
                    (p.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (p.location || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (p.city || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (p.reraNumber || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (p.contactName || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (p.propertyType || '').toLowerCase().includes(debouncedSearch.toLowerCase());

                  return matchesSearch;
                })
                .map((property) => {
                  const isPending = property.status === 'PENDING_APPROVAL';
                  const primaryImg =
                    property.images?.find((i) => i.isPrimary)?.url ||
                    property.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80';

                  return (
                    <div
                      key={property.id}
                      className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                        isPending ? 'border-amber-400 ring-2 ring-amber-300/60' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        {/* Pending Verification Amber Banner */}
                        {isPending && (
                          <div className="bg-amber-500 text-white px-3.5 py-1.5 flex items-center justify-between text-xs font-black tracking-wide">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" />
                              <span>AWAITING ADMIN VERIFICATION</span>
                            </span>
                            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded font-mono">
                              {property.submissionId || property.id}
                            </span>
                          </div>
                        )}

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
                            {property.userRole && (
                              <span className="bg-blue-700 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                                {property.userRole}
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-black px-2.5 py-1 rounded-md backdrop-blur">
                            {property.priceLabel}
                          </div>
                        </div>

                        {/* Text info */}
                        <div className="p-4 space-y-2.5">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-0.5">
                              {property.title}
                            </h3>
                            <p className="text-gray-500 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#D61F26]" />
                              {property.location}
                            </p>
                          </div>

                          {/* Verification Credential Details */}
                          {(property.reraNumber || property.contactName || property.ownershipProofDoc) && (
                            <div className="p-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-[11px] space-y-1 text-gray-700">
                              {property.contactName && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-medium">Contact:</span>
                                  <span className="font-bold text-gray-900 truncate">
                                    {property.contactName} ({property.contactPhone || 'No Phone'})
                                  </span>
                                </div>
                              )}
                              {property.agencyName && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-medium">Agency/Builder:</span>
                                  <span className="font-bold text-gray-900 truncate">{property.agencyName}</span>
                                </div>
                              )}
                              {property.reraNumber && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-medium">RERA Reg:</span>
                                  <span className="font-mono font-bold text-emerald-700">{property.reraNumber}</span>
                                </div>
                              )}
                              {property.ownershipProofDoc && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-medium">Proof Doc:</span>
                                  <span className="font-medium text-blue-700 truncate max-w-[170px]">
                                    {property.ownershipProofDoc}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                            {property.description}
                          </p>

                          {/* Attributes badges */}
                          <div className="flex flex-wrap gap-1.5 text-[10px]">
                            {property.status === 'PENDING_APPROVAL' ? (
                              <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded border border-amber-300">
                                ⏳ Pending Approval
                              </span>
                            ) : property.status === 'REJECTED' ? (
                              <span className="bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded">
                                ❌ Rejected
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                                ✓ Live
                              </span>
                            )}
                            {property.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                                Featured
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
                      <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-2">
                        {/* Quick Approve / Reject bar for Pending listings */}
                        {isPending && (
                          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-200">
                            <button
                              type="button"
                              onClick={() => handleApproveProperty(property.id, property.title)}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Publish</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectProperty(property.id, property.title)}
                              className="w-full py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] text-gray-400 font-mono truncate max-w-[120px]">
                            {property.id}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditProperty(property)}
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
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 1.5: DEDICATED PROPERTY APPROVAL TAB */}
        {activeTab === 'property-approval' && (
          <div className="space-y-6">
            {/* Header Info Banner */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-[#D61F26] rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-200" />
                  <h2 className="text-lg font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Property Verification & Approval Desk
                  </h2>
                </div>
                <p className="text-xs text-amber-100 max-w-2xl leading-relaxed">
                  Review new submissions from Developers, Brokers, and Owners with status <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-[11px]">PENDING_APPROVAL</code>. Inspect RERA numbers, ownership deeds, and contact credentials before approving them to go LIVE.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {properties.filter((p) => p.status === 'PENDING_APPROVAL').length > 0 && (
                  <button
                    onClick={handleApproveAllPending}
                    className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approve All Pending ({properties.filter((p) => p.status === 'PENDING_APPROVAL').length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* India & International State & City Filter Bar for Approval Desk */}
            <LocationFilterBar
              selection={approvalLocationSelection}
              onChange={(newSel) => setApprovalLocationSelection(newSel)}
              resultCount={properties.filter((p) => p.status === 'PENDING_APPROVAL').length}
              itemTypeLabel="Pending Approval Listings"
            />

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Pending</span>
                <p className="text-xl font-black text-amber-600 mt-1">
                  {properties.filter((p) => p.status === 'PENDING_APPROVAL').length}
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Residential</span>
                <p className="text-xl font-black text-gray-800 mt-1">
                  {properties.filter((p) => p.status === 'PENDING_APPROVAL' && p.propertyType !== 'OFFICE' && p.propertyType !== 'RETAIL' && p.propertyType !== 'WAREHOUSE' && p.listingType !== 'COMMERCIAL').length}
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Commercial</span>
                <p className="text-xl font-black text-gray-800 mt-1">
                  {properties.filter((p) => p.status === 'PENDING_APPROVAL' && (p.propertyType === 'OFFICE' || p.propertyType === 'RETAIL' || p.propertyType === 'WAREHOUSE' || p.listingType === 'COMMERCIAL')).length}
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Live & Active</span>
                <p className="text-xl font-black text-emerald-600 mt-1">
                  {properties.filter((p) => p.status === 'ACTIVE' || !p.status).length}
                </p>
              </div>
            </div>

            {/* Pending List Cards */}
            {(() => {
              const pendingList = properties.filter((p) => p.status === 'PENDING_APPROVAL');
              const filteredPending = pendingList.filter((p) => {
                // Location filter
                const matchesLocation = checkLocationMatch(
                  p,
                  approvalLocationSelection.region,
                  approvalLocationSelection.stateId,
                  approvalLocationSelection.cityId
                );
                if (!matchesLocation) return false;

                return (
                  (p.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.location || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.city || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.contactName || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.agencyName || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.reraNumber || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.submissionId || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                  (p.id || '').toLowerCase().includes(debouncedSearch.toLowerCase())
                );
              });

              if (pendingList.length === 0) {
                return (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        All Caught Up! No Pending Approvals
                      </h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                        All property listings have been verified and processed. New submissions from "List Your Property" will instantly appear here for your review.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('properties')}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      View All Live Properties
                    </button>
                  </div>
                );
              }

              if (filteredPending.length === 0) {
                return (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-600 font-medium">
                      No pending properties match the selected location and search "{debouncedSearch}".
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setApprovalLocationSelection({ region: 'ALL', stateId: null, cityId: null })}
                        className="text-xs text-[#D61F26] font-bold hover:underline cursor-pointer"
                      >
                        Reset Location Filter
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        onClick={() => setSearchInput('')}
                        className="text-xs text-gray-600 font-bold hover:underline cursor-pointer"
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredPending.map((property) => {
                    const primaryImg =
                      property.images?.find((img) => img.isPrimary)?.url ||
                      property.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80';

                    return (
                      <div
                        key={property.id}
                        className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        {/* Top Identification Ribbon */}
                        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-500 text-white font-mono text-[11px] font-black px-2 py-0.5 rounded">
                              {property.submissionId || property.id}
                            </span>
                            <span className="text-amber-900 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              Pending Approval
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {property.userRole && (
                              <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10.5px] font-black px-2.5 py-0.5 rounded-md">
                                Role: {property.userRole}
                              </span>
                            )}
                            <span className="text-[11px] text-gray-500 font-medium">
                              Category: <strong className="text-gray-800">{property.listingType} • {property.propertyType}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Image Preview */}
                          <div className="lg:col-span-4 relative rounded-xl overflow-hidden bg-gray-100 h-48 lg:h-full min-h-[190px]">
                            <img
                              src={primaryImg}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                              <span className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                                {property.listingType}
                              </span>
                              {property.subCategory && (
                                <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                                  {property.subCategory}
                                </span>
                              )}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-black px-3 py-1 rounded-lg backdrop-blur">
                              {property.priceLabel}
                            </div>
                          </div>

                          {/* Property Details */}
                          <div className="lg:col-span-8 space-y-4">
                            <div>
                              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-1 leading-snug">
                                {property.title}
                              </h3>
                              <p className="text-gray-500 text-xs flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#D61F26] shrink-0" />
                                <span>{property.address || property.location} ({property.city})</span>
                                {property.pincode && <span className="text-gray-400">• PIN: {property.pincode}</span>}
                              </p>
                            </div>

                            {/* Key Specs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                              <div>
                                <span className="text-gray-400 text-[10px] block font-bold uppercase">Config / Area</span>
                                <span className="font-bold text-gray-800">
                                  {property.configuration || `${property.bedrooms || 3} BHK`} • {property.area} {property.areaUnit || 'sq.ft'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block font-bold uppercase">Rate</span>
                                <span className="font-bold text-gray-800">
                                  ₹{property.pricePerSqFt ? property.pricePerSqFt.toLocaleString('en-IN') : 'N/A'} / sq.ft
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block font-bold uppercase">Baths & Parking</span>
                                <span className="font-bold text-gray-800">
                                  {property.bathrooms || 2} Bath • {property.parking || 1} Parking
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block font-bold uppercase">Possession</span>
                                <span className="font-bold text-gray-800">
                                  {property.possessionStatus || 'Ready to Move'} {property.possessionDate ? `(${property.possessionDate})` : ''}
                                </span>
                              </div>
                            </div>

                            {/* RERA & Submitter Information Highlight */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* RERA & Compliance */}
                              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs">
                                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>RERA & Compliance</span>
                                </div>
                                <div className="space-y-0.5 text-[11px] text-gray-700">
                                  <p>
                                    <span className="text-gray-500">RERA No:</span>{' '}
                                    <strong className="font-mono text-emerald-800">{property.reraNumber || 'Not Specified'}</strong>
                                  </p>
                                  {property.approvalAuthority && (
                                    <p>
                                      <span className="text-gray-500">Authority:</span>{' '}
                                      <strong className="text-gray-800">{property.approvalAuthority}</strong>
                                    </p>
                                  )}
                                  {property.ownershipProofDoc && (
                                    <p className="flex items-center gap-1">
                                      <span className="text-gray-500">Proof Doc:</span>{' '}
                                      <span className="text-blue-700 font-semibold truncate">{property.ownershipProofDoc}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Contact & Submitter Details */}
                              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-xs">
                                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
                                  <User className="w-3.5 h-3.5 text-blue-700" />
                                  <span>Submitter Credentials</span>
                                </div>
                                <div className="space-y-0.5 text-[11px] text-gray-700">
                                  <p>
                                    <span className="text-gray-500">Name:</span>{' '}
                                    <strong className="text-gray-900">{property.contactName || 'Property Lister'}</strong>
                                    {property.agencyName && <span className="text-gray-500"> ({property.agencyName})</span>}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <span className="text-gray-500">Phone:</span>{' '}
                                    <strong className="text-gray-900">{property.contactPhone || 'N/A'}</strong>
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Direct Contact</span>
                                  </p>
                                  {property.contactEmail && (
                                    <p>
                                      <span className="text-gray-500">Email:</span>{' '}
                                      <span className="text-gray-800">{property.contactEmail}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Description Preview */}
                            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                              {property.description}
                            </p>

                            {/* Amenities Chips */}
                            {property.amenities && property.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {property.amenities.slice(0, 5).map((amenity, i) => (
                                  <span key={i} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded">
                                    {amenity}
                                  </span>
                                ))}
                                {property.amenities.length > 5 && (
                                  <span className="text-gray-400 text-[10px] px-1 py-0.5">
                                    +{property.amenities.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Action Bar */}
                            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApproveProperty(property.id, property.title)}
                                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Approve & Publish Live</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRejectProperty(property.id, property.title)}
                                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-red-200"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Reject & Remove</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => openEditProperty(property)}
                                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Details</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: NEWS MANAGEMENT */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            {/* India & International State & City Filter Bar for News */}
            <LocationFilterBar
              selection={newsLocationSelection}
              onChange={(newSel) => setNewsLocationSelection(newSel)}
              resultCount={newsItems.length}
              itemTypeLabel="News & Market Insights"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {newsItems
                .filter((n) => {
                  // Location hierarchy filter for News
                  const matchesLocation = checkLocationMatch(
                    n,
                    newsLocationSelection.region,
                    newsLocationSelection.stateId,
                    newsLocationSelection.cityId
                  );
                  if (!matchesLocation) return false;

                  return (
                    (n.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (n.category || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (n.author || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (n.excerpt || '').toLowerCase().includes(debouncedSearch.toLowerCase())
                  );
                })
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
                          onClick={() => openEditNews(item)}
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
                    (s.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    (s.description || '').toLowerCase().includes(debouncedSearch.toLowerCase())
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
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* ADMIN SECURITY & PASSCODE MANAGEMENT CARD */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Admin Portal Password & Security</h2>
                    <p className="text-xs text-gray-500">
                      Set a custom password to protect your /admin-secret management portal.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase border flex items-center gap-1.5 ${
                      configuredPasscode && configuredPasscode !== 'admin123'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {configuredPasscode && configuredPasscode !== 'admin123'
                      ? 'Custom Password Active'
                      : 'Default Password (admin123)'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passChangeError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passChangeError}</span>
                  </div>
                )}

                {passChangeSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passChangeSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="Current (default: admin123)"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-3 pr-9 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Enter new password (min 4 chars)"
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-3 pr-9 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Re-type new password"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                    <span>Reset to Default (admin123)</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Update Admin Password</span>
                  </button>
                </div>
              </form>
            </div>

            {/* GLOBAL WEBSITE DETAILS CARD */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
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

              {/* INDIA & INTERNATIONAL LOCATION SELECTOR BLOCK */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D61F26]" />
                    <span>State & City Hierarchy Location</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">India & Global Coverage</span>
                </div>

                {/* Country / Region Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPropModalRegion('India');
                      const firstState = INDIA_LOCATION_DATA[0];
                      setPropModalStateId(firstState.id);
                      setEditingProperty({
                        ...editingProperty,
                        city: firstState.cities[0].name,
                        location: editingProperty.location.includes(',') ? editingProperty.location : `${editingProperty.location || firstState.cities[0].name}, ${firstState.name}`,
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      propModalRegion === 'India'
                        ? 'bg-[#D61F26] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>🇮🇳 India States & Cities</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPropModalRegion('International');
                      const firstIntl = INTERNATIONAL_LOCATION_DATA[0];
                      setPropModalStateId(firstIntl.id);
                      setEditingProperty({
                        ...editingProperty,
                        city: firstIntl.cities[0].name,
                        location: `${firstIntl.cities[0].name}, ${firstIntl.name}`,
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      propModalRegion === 'International'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>🌐 International (NRI & Global)</span>
                  </button>
                </div>

                {/* State and City Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      Select {propModalRegion === 'India' ? 'State' : 'Country / Region'} *
                    </label>
                    <select
                      value={propModalStateId}
                      onChange={(e) => {
                        const newStateId = e.target.value;
                        setPropModalStateId(newStateId);
                        const stateList = propModalRegion === 'India' ? INDIA_LOCATION_DATA : INTERNATIONAL_LOCATION_DATA;
                        const stateObj = stateList.find((s) => s.id === newStateId);
                        if (stateObj && stateObj.cities.length > 0) {
                          setEditingProperty({
                            ...editingProperty,
                            city: stateObj.cities[0].name,
                          });
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                    >
                      {(propModalRegion === 'India' ? INDIA_LOCATION_DATA : INTERNATIONAL_LOCATION_DATA).map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name} ({state.cities.length} cities)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      Select City *
                    </label>
                    {(() => {
                      const stateList = propModalRegion === 'India' ? INDIA_LOCATION_DATA : INTERNATIONAL_LOCATION_DATA;
                      const activeState = stateList.find((s) => s.id === propModalStateId) || stateList[0];
                      return (
                        <select
                          value={editingProperty.city}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              city: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                        >
                          {activeState.cities.map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Locality, Area & Landmark Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.location}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, location: e.target.value })
                    }
                    placeholder="e.g., Bandra West, Near Linking Road, Mumbai"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
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
                    <option value="ACTIVE">ACTIVE (Published Live)</option>
                    <option value="PENDING_APPROVAL">PENDING_APPROVAL (Under Review)</option>
                    <option value="SOLD">SOLD</option>
                    <option value="RENTED">RENTED</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="REJECTED">REJECTED</option>
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

              {/* INDIA & INTERNATIONAL LOCATION SELECTOR FOR NEWS */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D61F26]" />
                    <span>Target Region, State & City Coverage</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">India & Global Coverage</span>
                </div>

                {/* Region Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewsModalRegion('India');
                      const firstState = INDIA_LOCATION_DATA[0];
                      setNewsModalStateId(firstState.id);
                      setEditingNews({
                        ...editingNews,
                        region: 'India',
                        city: firstState.cities[0].name,
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newsModalRegion === 'India'
                        ? 'bg-[#D61F26] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>🇮🇳 India States & Cities</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewsModalRegion('International');
                      const firstIntl = INTERNATIONAL_LOCATION_DATA[0];
                      setNewsModalStateId(firstIntl.id);
                      setEditingNews({
                        ...editingNews,
                        region: 'International',
                        city: firstIntl.cities[0].name,
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newsModalRegion === 'International'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>🌐 International News Coverage</span>
                  </button>
                </div>

                {/* State & City Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      {newsModalRegion === 'India' ? 'Target State' : 'Target Country / Region'}
                    </label>
                    <select
                      value={newsModalStateId}
                      onChange={(e) => {
                        const newStateId = e.target.value;
                        setNewsModalStateId(newStateId);
                        const stateList = newsModalRegion === 'India' ? INDIA_LOCATION_DATA : INTERNATIONAL_LOCATION_DATA;
                        const stateObj = stateList.find((s) => s.id === newStateId);
                        if (stateObj && stateObj.cities.length > 0) {
                          setEditingNews({
                            ...editingNews,
                            city: stateObj.cities[0].name,
                          });
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                    >
                      {(newsModalRegion === 'India' ? INDIA_LOCATION_DATA : INTERNATIONAL_LOCATION_DATA).map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name} ({state.cities.length} cities)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      Target City (Optional / Specific City)
                    </label>
                    {(() => {
                      const stateList = newsModalRegion === 'India' ? INDIA_LOCATION_DATA : INTERNATIONAL_LOCATION_DATA;
                      const activeState = stateList.find((s) => s.id === newsModalStateId) || stateList[0];
                      return (
                        <select
                          value={editingNews.city || ''}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              city: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                        >
                          <option value="">All State-wide / National</option>
                          {activeState.cities.map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>
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
                    placeholder="e.g. Latest Update, Market Trends, etc."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['Latest Update', 'Market Trends', 'Market News', 'Technology', 'International News'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEditingNews({ ...editingNews, category: cat })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          editingNews.category === cat
                            ? 'bg-[#D61F26] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Author / Source
                  </label>
                  <input
                    type="text"
                    required
                    value={editingNews.author}
                    onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
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
      {/* ADMIN PASSWORD CONFIG MODAL                               */}
      {/* ========================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Set Admin Passcode</h3>
                  <p className="text-xs text-gray-400">Manage security access for /admin-secret</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 bg-gray-800/70 p-3 rounded-xl border border-gray-700/80 text-xs flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Current Status:
              </span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                configuredPasscode && configuredPasscode !== 'admin123'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {configuredPasscode && configuredPasscode !== 'admin123' ? 'Custom Passcode' : 'Default (admin123)'}
              </span>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {passChangeError && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{passChangeError}</span>
                </div>
              )}

              {passChangeSuccess && (
                <div className="p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{passChangeSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="Enter current passcode (default: admin123)"
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    className="w-full bg-[#111111] border border-gray-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  New Passcode
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Enter new password (min 4 characters)"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="w-full bg-[#111111] border border-gray-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Confirm New Passcode
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Re-type new passcode"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  className="w-full bg-[#111111] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="pt-2 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl border border-gray-700 transition-colors cursor-pointer"
                >
                  Reset to Default
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Password</span>
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
