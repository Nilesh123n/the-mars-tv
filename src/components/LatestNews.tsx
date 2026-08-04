import { NewsItem } from '../types';
import { ArrowRight, Clock, User, Newspaper } from 'lucide-react';

interface LatestNewsProps {
  newsItems: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
  onViewAllNews: () => void;
}

export default function LatestNews({
  newsItems,
  onSelectNews,
  onViewAllNews,
}: LatestNewsProps) {
  const featured = newsItems.find((n) => n.isFeatured) || newsItems[0];
  const smallArticles = newsItems.filter((n) => n.id !== featured?.id).slice(0, 3);

  return (
    <section className="py-14 bg-[#F5F5F5] border-b border-gray-200/80">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
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

          <button
            onClick={onViewAllNews}
            className="text-[#D61F26] text-[13.5px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            View All News
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Main Featured Article */}
          {featured && (
            <div
              onClick={() => onSelectNews(featured)}
              className="lg:col-span-5 bg-white rounded-[20px] overflow-hidden border border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative h-[250px] overflow-hidden bg-gray-200">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#D61F26] text-white text-[10.5px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-md">
                  {featured.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(featured.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-600 font-medium">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {featured.author}
                    </span>
                  </div>

                  <h3
                    className="text-[19px] font-bold text-[#222222] mb-3 leading-snug group-hover:text-[#D61F26] transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {featured.title}
                  </h3>

                  <p className="text-[14px] text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[#D61F26] font-bold text-[13.5px] pt-3 border-t border-gray-100 group-hover:underline">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Small Side Articles */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {smallArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="bg-white rounded-[18px] overflow-hidden border border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="relative h-[145px] overflow-hidden bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#D61F26] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400 mb-1.5">
                      {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                    <h4
                      className="text-[14px] font-bold text-[#222222] mb-2 leading-snug line-clamp-2 group-hover:text-[#D61F26] transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 text-[#D61F26] font-bold text-[12.5px] pt-2 border-t border-gray-100 group-hover:underline">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
