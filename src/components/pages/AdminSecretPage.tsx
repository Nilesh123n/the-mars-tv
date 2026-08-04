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
  Image as ImageIcon,
  CheckCircle2,
  X,
  ArrowLeft,
  RefreshCw,
  Eye,
  DollarSign,
  User,
  FileText,
  Save,
  LogOut,
  Tag,
  MapPin,
  ListFilter,
  Check,
  AlertCircle,
  Upload,
  UploadCloud
} from 'lucide-react';
import { Property, NewsItem, PRServiceItem, Lead, PropertyType, ListingType, PropertyStatus } from '../../types';

interface AdminSecretPageProps {
  properties: Property[];
  setProperties: Dispatch<SetStateAction<Property[]>>;
  newsItems: NewsItem[];
  setNewsItems: Dispatch<SetStateAction<NewsItem[]>>;
  prServices: PRServiceItem[];
  setPRServices: Dispatch<SetStateAction<PRServiceItem[]>>;
  leads: Lead[];
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
  const [activeTab, setActiveTab] = useState<'properties' | 'news' | 'pr-services' | 'leads'>('properties');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Editing States
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isNewProperty, setIsNewProperty] = useState(false);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  const [editingPR, setEditingPR] = useState<PRServiceItem | null>(null);
  const [isNewPR, setIsNewPR] = useState(false);

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
        showToast('Image uploaded from system successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // PROPERTY ACTIONS
  // -------------------------------------------------------------
  const handleSaveProperty = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    if (isNewProperty) {
      setProperties((prev) => [editingProperty, ...prev]);
      showToast(`Added property "${editingProperty.title}"`);
    } else {
      setProperties((prev) =>
        prev.map((p) => (p.id === editingProperty.id ? editingProperty : p))
      );
      showToast(`Updated property "${editingProperty.title}"`);
    }
    setEditingProperty(null);
    setIsNewProperty(false);
  };

  const handleDeleteProperty = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
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
  // NEWS ACTIONS
  // -------------------------------------------------------------
  const handleSaveNews = (e: FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    if (isNewNews) {
      setNewsItems((prev) => [editingNews, ...prev]);
      showToast(`Article "${editingNews.title}" added.`);
    } else {
      setNewsItems((prev) =>
        prev.map((n) => (n.id === editingNews.id ? editingNews : n))
      );
      showToast(`Updated article "${editingNews.title}"`);
    }
    setEditingNews(null);
    setIsNewNews(false);
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (confirm(`Delete article "${title}"?`)) {
      setNewsItems((prev) => prev.filter((n) => n.id !== id));
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
  // PR SERVICES ACTIONS
  // -------------------------------------------------------------
  const handleSavePR = (e: FormEvent) => {
    e.preventDefault();
    if (!editingPR) return;

    if (isNewPR) {
      setPRServices((prev) => [...prev, editingPR]);
      showToast(`PR Service "${editingPR.title}" created.`);
    } else {
      setPRServices((prev) =>
        prev.map((s) => (s.id === editingPR.id ? editingPR : s))
      );
      showToast(`Updated PR service "${editingPR.title}"`);
    }
    setEditingPR(null);
    setIsNewPR(false);
  };

  const handleDeletePR = (id: string, title: string) => {
    if (confirm(`Delete PR Service "${title}"?`)) {
      setPRServices((prev) => prev.filter((s) => s.id !== id));
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

  // =============================================================
  // 1. LOCKED / PASSWORD PROTECTION SCREEN
  // =============================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative text-white">
          <div className="w-16 h-16 bg-[#D61F26]/10 border border-[#D61F26]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#D61F26]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Secret Admin Portal
            </h1>
            <p className="text-gray-400 text-xs mt-2">
              Protected access to manage Properties, News, and PR Services.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                Enter Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g. admin123)"
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
              <div className="bg-gray-800/60 rounded-lg p-2.5 mt-3 border border-gray-700/60 text-[11.5px] text-gray-400 flex justify-between items-center">
                <span>Default Passcode:</span>
                <code className="bg-black/50 text-[#D61F26] px-2 py-0.5 rounded font-mono font-bold">admin123</code>
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
              className="text-gray-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Secret Content Admin
                </h1>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-green-500/30">
                  Unlocked
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Edit & manage Live Properties, News Articles, and PR Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            {onResetData && (
              <button
                onClick={() => {
                  if (confirm('Reset all content back to original default mock data?')) {
                    onResetData();
                  }
                }}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset Content to Defaults"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset Defaults</span>
              </button>
            )}

            <button
              onClick={handleLock}
              className="px-3.5 py-1.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setActiveTab('properties');
                setSearchTerm('');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'properties'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Properties ({properties.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('news');
                setSearchTerm('');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'news'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>News Hub ({newsItems.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('pr-services');
                setSearchTerm('');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'pr-services'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>PR Services ({prServices.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('leads');
                setSearchTerm('');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Lead Inquiries ({leads.length})</span>
            </button>
          </div>

          {/* Search Bar & Action Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties
                .filter(
                  (p) =>
                    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
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
                    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.author.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <div className="absolute top-2 left-2">
                          <span className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow">
                            {item.category}
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
                        {item.viewCount} Reads
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
                    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
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
              {/* Title & Price */}
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

              {/* Location & City */}
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

              {/* Type Selectors */}
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

              {/* Area, BHK, Baths */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    value={editingProperty.area}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        area: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms || 0}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        bedrooms: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={editingProperty.bathrooms || 0}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        bathrooms: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              {/* Primary Image & System Image Upload */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Property Primary Image *
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Upload from PC/Mobile or paste Image URL
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0 border border-gray-300 relative group">
                    {editingProperty.images[0]?.url ? (
                      <img
                        src={editingProperty.images[0].url}
                        alt="Property Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Input & Upload Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      required
                      value={editingProperty.images[0]?.url || ''}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        const updatedImages = [...editingProperty.images];
                        if (updatedImages.length > 0) {
                          updatedImages[0] = { ...updatedImages[0], url: newUrl, isPrimary: true };
                        } else {
                          updatedImages.push({ url: newUrl, isPrimary: true });
                        }
                        setEditingProperty({ ...editingProperty, images: updatedImages });
                      }}
                      placeholder="Paste image URL here (https://...)"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#D61F26]"
                    />

                    {/* System File Upload Button */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 sm:flex-none px-4 py-2 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Image from System</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (uploadedDataUrl) => {
                              const updatedImages = [...editingProperty.images];
                              if (updatedImages.length > 0) {
                                updatedImages[0] = {
                                  ...updatedImages[0],
                                  url: uploadedDataUrl,
                                  isPrimary: true,
                                };
                              } else {
                                updatedImages.push({ url: uploadedDataUrl, isPrimary: true });
                              }
                              setEditingProperty({ ...editingProperty, images: updatedImages });
                            })
                          }
                        />
                      </label>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Supports JPG, PNG, WEBP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Property Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProperty.description}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, description: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 text-sm leading-relaxed font-normal text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              {/* Checkbox Flags */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={editingProperty.isFeatured}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 text-[#D61F26] rounded accent-[#D61F26]"
                  />
                  <span>Show in Featured Section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={editingProperty.isSponsored}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, isSponsored: e.target.checked })
                    }
                    className="w-4 h-4 text-[#D61F26] rounded accent-[#D61F26]"
                  />
                  <span>Show in Sponsored Top Bar</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={editingProperty.isVerified}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, isVerified: e.target.checked })
                    }
                    className="w-4 h-4 text-[#D61F26] rounded accent-[#D61F26]"
                  />
                  <span>Verified Tag</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
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
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6 bg-[#111111] text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D61F26] rounded-xl text-white">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {isNewNews ? 'Add News Article' : 'Edit News Article'}
                  </h3>
                  <p className="text-xs text-gray-400">ID: {editingNews.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingNews(null)}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-6 space-y-5 text-gray-800">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingNews.title}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, title: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingNews.category}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, category: e.target.value })
                    }
                    placeholder="e.g. REAL ESTATE TRENDS, POLICY, MARKET"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingNews.author}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, author: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              {/* News Image & System Upload */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Article Cover Image *
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Upload from PC/Mobile or paste Image URL
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0 border border-gray-300 relative group">
                    {editingNews.image ? (
                      <img
                        src={editingNews.image}
                        alt="News Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Input & Upload Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      required
                      value={editingNews.image}
                      onChange={(e) =>
                        setEditingNews({ ...editingNews, image: e.target.value })
                      }
                      placeholder="Paste image URL here (https://...)"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#D61F26]"
                    />

                    {/* System File Upload Button */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 sm:flex-none px-4 py-2 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Image from System</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (uploadedDataUrl) => {
                              setEditingNews({ ...editingNews, image: uploadedDataUrl });
                            })
                          }
                        />
                      </label>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Supports JPG, PNG, WEBP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Short Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.excerpt}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, excerpt: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Full Article Body Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingNews.content}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, content: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 text-sm leading-relaxed text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / CREATE PR SERVICE FORM MODAL                        */}
      {/* ========================================================= */}
      {editingPR && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-[#111111] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D61F26] rounded-xl text-white">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {isNewPR ? 'Add PR Service' : 'Edit PR Service'}
                  </h3>
                  <p className="text-xs text-gray-400">ID: {editingPR.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPR(null)}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePR} className="p-6 space-y-4 text-gray-800">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPR.title}
                  onChange={(e) => setEditingPR({ ...editingPR, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingPR.description}
                  onChange={(e) =>
                    setEditingPR({ ...editingPR, description: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D61F26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Icon Name
                  </label>
                  <select
                    value={editingPR.icon}
                    onChange={(e) => setEditingPR({ ...editingPR, icon: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  >
                    <option value="Newspaper">Newspaper</option>
                    <option value="Tv">Tv (Television)</option>
                    <option value="Globe">Globe (Digital)</option>
                    <option value="Shield">Shield (Brand PR)</option>
                    <option value="AlertCircle">AlertCircle (Crisis PR)</option>
                    <option value="Calendar">Calendar (Events)</option>
                    <option value="Megaphone">Megaphone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingPR.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingPR({ ...editingPR, isActive: e.target.value === 'true' })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#D61F26]"
                  >
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPR(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save PR Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
