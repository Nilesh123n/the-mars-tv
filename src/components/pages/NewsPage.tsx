import { useState } from 'react';
import { NewsItem } from '../../types';
import { Search, Clock, User, Eye, ArrowRight, Newspaper } from 'lucide-react';

interface NewsPageProps {
  newsItems: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
}

export default function NewsPage({ newsItems, onSelectNews }: NewsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Market News', 'Market Trends', 'Policy Update', 'Technology'];

  const filtered = newsItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-[90px] pb-16 min-h-screen bg-[#F5F5F5]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-12 px-4 border-b border-gray-800">
        <div className="max-w-[1320px] mx-auto px-2">
          <span className="text-[#D61F26] text-xs font-bold uppercase tracking-widest block mb-2">Real Estate Intelligence</span>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold flex items-center gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Newspaper className="w-8 h-8 text-[#D61F26]" />
            Property News & Market Analysis
          </h1>
          <p className="text-gray-400 text-[14.5px] mt-1 max-w-[600px]">
            Stay updated with RBI repo rate updates, stamp duty policies, infrastructure developments, and smart home technology trends.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6">
        <div className="bg-white rounded-[20px] p-5 shadow-xl border border-gray-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news, interest rates, stamp duty..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] focus:outline-none focus:border-[#D61F26]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-[#D61F26] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Articles List (Horizontal Rectangular Cards: Left Image, Right Text) */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-10">
        <div className="flex flex-col gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="bg-white rounded-[20px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer"
            >
              {/* Left Side: Image Box */}
              <div className="relative w-full sm:w-[280px] md:w-[340px] lg:w-[380px] shrink-0 h-[220px] sm:h-auto min-h-[200px] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#D61F26] text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-md">
                  {item.category}
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
                  <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                    3 min read
                  </span>
                  <div className="flex items-center gap-2 text-[#D61F26] font-bold text-[13.5px] group-hover:translate-x-1 transition-transform">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-[20px] p-12 text-center border border-gray-200">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No News Articles Found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms or filter selections.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
