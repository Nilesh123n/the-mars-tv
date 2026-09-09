import { useState } from 'react';
import { NewsItem } from '../types';
import { X, Clock, User, Eye, Share2, Tag, BookOpen, Check } from 'lucide-react';
import ArticleRenderer from './ArticleRenderer';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: NewsDetailModalProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  if (!news) return null;

  // Calculate estimated reading time
  const wordCount = (news.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[24px] max-w-[880px] w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col">
        
        {/* Sticky Header Bar with Category & Reading Controls */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-8 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#D61F26] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
              {news.category}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
              <BookOpen className="w-3.5 h-3.5 text-gray-500" />
              <span>{readTimeMinutes} min read</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font Size Adjuster */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200 text-xs font-bold text-gray-700">
              <span className="text-[10px] text-gray-400 px-2 uppercase tracking-wider hidden md:inline">Text Size</span>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-white text-[#D61F26] shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
                title="Standard Text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-white text-[#D61F26] shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
                title="Large Text"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  fontSize === 'xlarge'
                    ? 'bg-white text-[#D61F26] shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
                title="Extra Large Text"
              >
                A++
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-7">
          {/* Main Title */}
          <div>
            <h1
              className="text-[24px] sm:text-[32px] font-extrabold text-[#111111] leading-[1.25] mb-3.5 tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] sm:text-[13px] text-gray-500 border-b border-gray-100 pb-4">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#D61F26]" />
                {new Date(news.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-gray-400" />
                By {news.author}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="w-4 h-4 text-gray-400" />
                {news.viewCount} Reads
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Verified Real Estate Report
              </span>
            </div>
          </div>

          {/* Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider text-white shadow-xs ${
                news.region === 'International' || news.category === 'International News'
                  ? 'bg-blue-600'
                  : 'bg-[#D61F26]'
              }`}
            >
              {news.region === 'International' || news.category === 'International News'
                ? '🌐 International'
                : '🇮🇳 India'}
            </span>
            <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-3 py-1 rounded-md border border-gray-200">
              {news.category}
            </span>
            {news.city && (
              <span className="flex items-center gap-1 bg-gray-50 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-gray-200">
                <span>📍 {news.city}</span>
              </span>
            )}
          </div>

          {/* Hero Banner Image */}
          <div className="w-full aspect-[16/9] rounded-[20px] overflow-hidden shadow-md bg-gray-100 border border-gray-200/60">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Excerpt Banner */}
          {news.excerpt && (
            <div className="bg-gradient-to-r from-red-50/80 via-red-50/30 to-transparent border-l-4 border-[#D61F26] p-4.5 rounded-r-2xl text-[15.5px] sm:text-[16.5px] font-medium text-gray-800 leading-relaxed italic shadow-xs">
              "{news.excerpt}"
            </div>
          )}

          {/* Article Formatted Content with proper spacing, bold letters, and paragraph transitions */}
          <div className="py-2 border-t border-gray-100/80">
            <ArticleRenderer content={news.content} fontSize={fontSize} />
          </div>

          {/* Footer Share & Actions */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-[13px]">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D61F26]" />
              <span className="text-gray-500">Filed under:</span>
              <strong className="text-gray-800 font-bold">{news.category}</strong>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-[#D61F26] font-bold transition-all cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#D61F26]" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
