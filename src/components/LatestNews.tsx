import { useState } from 'react';
import { NewsItem } from '../types';
import { ArrowRight, Clock, User, Newspaper, TrendingUp, FileText, Cpu, Sparkles } from 'lucide-react';

interface LatestNewsProps {
  newsItems: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
  onViewAllNews: () => void;
}

const categories = [
  { id: 'All', label: 'All Insights', icon: Sparkles },
  { id: 'India News', label: 'India News', icon: Newspaper },
  { id: 'International News', label: 'International News', icon: Newspaper },
  { id: 'Market Trends', label: 'Market Trends', icon: TrendingUp },
  { id: 'Latest Update', label: 'Latest Updates', icon: FileText },
];

export default function LatestNews({
  newsItems,
  onSelectNews,
  onViewAllNews,
}: LatestNewsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = selectedCategory === 'All'
    ? newsItems
    : newsItems.filter((n) => {
        const catLower = (n.category || '').toLowerCase();
        const selLower = selectedCategory.toLowerCase();
        return (
          catLower === selLower ||
          catLower.includes(selLower) ||
          (selectedCategory === 'Market Trends' && (catLower.includes('trend') || catLower.includes('market'))) ||
          (selectedCategory === 'Latest Update' && (catLower.includes('update') || catLower.includes('policy') || catLower.includes('latest'))) ||
          (selectedCategory === 'India News' && (n.region === 'India' || catLower.includes('india'))) ||
          (selectedCategory === 'International News' && (n.region === 'International' || catLower.includes('international') || catLower.includes('global')))
        );
      });

  // Display top recent news items (up to 6)
  const displayItems = filteredItems.slice(0, 6);

  return (
    <section className="py-14 bg-[#F8F9FA] border-b border-gray-200/80">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2
              className="text-[22px] sm:text-[24px] font-extrabold text-[#222222] tracking-tight flex items-center gap-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Newspaper className="w-6 h-6 text-[#D61F26]" />
              LATEST NEWS & INSIGHTS
            </h2>
            <span className="w-12 h-[3.5px] bg-[#D61F26] rounded-full block" />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D61F26] text-white shadow-md shadow-red-900/20 scale-102'
                      : 'bg-white text-gray-700 hover:text-[#D61F26] hover:bg-red-50 border border-gray-200'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#D61F26]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            <button
              onClick={onViewAllNews}
              className="ml-auto lg:ml-2 text-[#D61F26] text-[13px] font-bold hover:underline flex items-center gap-1 cursor-pointer py-2 px-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2 News Cards Stacked Vertically (Image Left, Text Right) */}
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
            <p className="text-gray-500 font-medium">No articles found in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-[1180px] mx-auto">
            {displayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="bg-white rounded-[20px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row sm:items-start group cursor-pointer"
              >
                {/* Left Side 16:9 Image - Seamlessly fitted into card without black/gray space */}
                <div className="relative w-full sm:w-[340px] md:w-[380px] lg:w-[420px] aspect-[16/9] flex-shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80';
                    }}
                  />
                </div>

                {/* Right Side Text Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Badges Shifted Below/Beside Image (No Text on Image) */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider text-white ${
                          item.region === 'International' || item.category === 'International News'
                            ? 'bg-blue-600'
                            : 'bg-[#D61F26]'
                        }`}
                      >
                        {item.region === 'International' || item.category === 'International News'
                          ? '🌐 International'
                          : '🇮🇳 India'}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-gray-200">
                        {item.category}
                      </span>
                      {(item.city || item.state) && (
                        <span className="bg-gray-50 text-gray-700 text-[11px] font-semibold px-2 py-1 rounded-md border border-gray-200">
                          📍 {item.city && item.state ? `${item.city}, ${item.state}` : (item.city || item.state)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-2.5">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#D61F26]" />
                        {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-gray-600 font-semibold">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {item.author}
                      </span>
                    </div>

                    <h3
                      className="text-[17px] sm:text-[19px] font-bold text-[#222222] mb-2.5 leading-snug group-hover:text-[#D61F26] transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {item.title}
                    </h3>

                    <p className="text-[13.5px] sm:text-[14px] text-gray-600 leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#D61F26] font-bold text-[13.5px] pt-3 border-t border-gray-100 group-hover:underline mt-auto">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}


