import { useState } from 'react';
import { NewsItem } from '../../types';
import { Search, Clock, User, Eye, ArrowRight, Newspaper, Globe, Landmark, TrendingUp, Sparkles, SlidersHorizontal, Cpu, Layers } from 'lucide-react';

interface NewsPageProps {
  newsItems: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
}

export default function NewsPage({ newsItems, onSelectNews }: NewsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');

  const mainCategories = [
    { id: 'ALL', label: 'All News', icon: Sparkles, badge: newsItems.length },
    {
      id: 'India News',
      label: 'India News',
      icon: Landmark,
      flag: '🇮🇳',
      badge: newsItems.filter(i => i.region === 'India' || i.category === 'India News').length,
    },
    {
      id: 'International News',
      label: 'International News',
      icon: Globe,
      flag: '🌐',
      badge: newsItems.filter(i => i.region === 'International' || i.category === 'International News').length,
    },
  ];

  const subCategories = [
    { id: 'ALL', label: 'All Topics', icon: Layers },
    { id: 'Market Trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'Market News', label: 'Market News', icon: Newspaper },
    { id: 'Policy Update', label: 'Policy Updates', icon: SlidersHorizontal },
    { id: 'Technology', label: 'Technology', icon: Cpu },
  ];

  const filtered = newsItems.filter((item) => {
    // Determine item region
    const itemRegion = item.region || (item.category.includes('International') ? 'International' : 'India');

    // Main Category matching
    let matchesMain = true;
    if (selectedMainCategory === 'India News') {
      matchesMain = itemRegion === 'India' || item.category === 'India News';
    } else if (selectedMainCategory === 'International News') {
      matchesMain = itemRegion === 'International' || item.category === 'International News';
    }

    // Sub Category matching
    let matchesSub = true;
    if (selectedSubCategory !== 'ALL') {
      matchesSub = item.category.toLowerCase() === selectedSubCategory.toLowerCase();
    }

    // Search matching
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    return matchesMain && matchesSub && matchesSearch;
  });

  return (
    <div className="pt-[90px] pb-16 min-h-screen bg-[#F5F5F5]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-12 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-2 relative z-10">
          <div className="flex items-center gap-2 text-[#D61F26] text-xs font-bold uppercase tracking-widest mb-2">
            <Newspaper className="w-4 h-4" />
            <span>Real Estate Global & National Intelligence</span>
          </div>

          <h1 className="text-[30px] sm:text-[42px] font-extrabold flex items-center gap-3 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Property News & Market Analysis
          </h1>

          <p className="text-gray-300 text-[14.5px] mt-2 max-w-[650px] leading-relaxed">
            Stay updated with top headlines across <strong>India News</strong> and <strong>International Property Markets</strong>, policy updates, interest rate forecasts, and market trends.
          </p>
        </div>
      </div>

      {/* Category Filter Toolbar */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-[22px] p-5 shadow-xl border border-gray-200/90 space-y-4">
          
          {/* Main Categories Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                Main Categories
              </span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">
              {mainCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedMainCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedMainCategory(cat.id);
                      setSelectedSubCategory('ALL');
                    }}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-[#D61F26] text-white border-[#D61F26] shadow-lg shadow-red-900/25 scale-[1.02]'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat.flag ? <span className="text-base">{cat.flag}</span> : <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D61F26]'}`} />}
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Sub Categories Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 shrink-0 mr-1">
                Sub Category:
              </span>
              {subCategories.map((sub) => {
                const Icon = sub.icon;
                const isActive = selectedSubCategory === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-[320px] shrink-0 mt-2 md:mt-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search headlines or keywords..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#D61F26] bg-gray-50/60"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Articles List (Horizontal Rectangular Cards) */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-[13.5px] text-gray-600 font-semibold">
            Showing <span className="text-[#D61F26] font-bold">{filtered.length}</span> Articles in{' '}
            <span className="text-gray-900 font-bold">{selectedMainCategory === 'ALL' ? 'All Regions' : selectedMainCategory}</span>
            {selectedSubCategory !== 'ALL' && <span> • Sub Category: <strong className="text-[#D61F26]">{selectedSubCategory}</strong></span>}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {filtered.map((item) => {
            const isInternational = item.region === 'International' || item.category === 'International News';

            return (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="bg-white rounded-[20px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer"
              >
                {/* Left Side: Image Box with Prominent Region & Sub-Category Indicators */}
                <div className="relative w-full sm:w-[280px] md:w-[340px] lg:w-[380px] shrink-0 h-[220px] sm:h-auto min-h-[200px] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Overlay Badge for Region (India vs International) */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                    <span
                      className={`text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1.5 ${
                        isInternational ? 'bg-blue-600' : 'bg-[#D61F26]'
                      }`}
                    >
                      {isInternational ? (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          <span>🌐 International News</span>
                        </>
                      ) : (
                        <>
                          <Landmark className="w-3.5 h-3.5" />
                          <span>🇮🇳 India News</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Bottom-left or Top-right Badge for Sub-Category */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider border border-white/20">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Right Side: News & Article Details */}
                <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-gray-500 mb-3 font-medium">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-[#D61F26]" />
                        {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5 text-[#D61F26]" />
                        {item.author}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Eye className="w-3.5 h-3.5 text-[#D61F26]" />
                        {item.viewCount} Reads
                      </span>
                    </div>

                    <h3
                      className="text-[19px] sm:text-[21px] font-bold text-[#222222] mb-3 leading-snug group-hover:text-[#D61F26] transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {item.title}
                    </h3>

                    <p className="text-[14px] sm:text-[14.5px] text-gray-600 leading-relaxed mb-5 line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      Verified Intelligence
                    </span>
                    <div className="flex items-center gap-2 text-[#D61F26] font-bold text-[13.5px] group-hover:translate-x-1 transition-transform">
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-white rounded-[20px] p-12 text-center border border-gray-200">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No News Articles Found</h3>
              <p className="text-gray-500 text-sm mt-1">Try selecting a different category or clear search terms.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}


