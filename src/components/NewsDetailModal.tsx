import { NewsItem } from '../types';
import { X, Clock, User, Eye, Share2, Tag } from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: NewsDetailModalProps) {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[24px] max-w-[840px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#D61F26] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
              {news.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Title */}
          <div>
            <h1
              className="text-[24px] sm:text-[30px] font-extrabold text-[#222222] leading-tight mb-3"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-gray-500 border-b border-gray-100 pb-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D61F26]" />
                {new Date(news.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" />
                By {news.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-gray-400" />
                {news.viewCount} Reads
              </span>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="h-[280px] sm:h-[380px] rounded-[20px] overflow-hidden bg-gray-100 shadow-md">
            <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
          </div>

          {/* Excerpt Banner */}
          <div className="bg-red-50/60 border-l-4 border-[#D61F26] p-4 rounded-r-2xl text-[15px] font-semibold text-gray-800 leading-relaxed italic">
            "{news.excerpt}"
          </div>

          {/* Article HTML Content */}
          <div
            className="prose max-w-none text-[15px] text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Footer Share */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D61F26]" />
              <span className="text-gray-500">Filed under:</span>
              <strong className="text-gray-800 font-bold">{news.category}</strong>
            </div>

            <button
              onClick={() => alert('Article link copied to clipboard!')}
              className="flex items-center gap-1.5 text-[#D61F26] font-bold hover:underline cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
