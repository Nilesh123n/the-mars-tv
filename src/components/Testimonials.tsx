import { useState } from 'react';
import { Testimonial } from '../types';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onViewAllTestimonials: () => void;
}

export default function Testimonials({
  testimonials,
  onViewAllTestimonials,
}: TestimonialsProps) {
  const [startIndex, setStartIndex] = useState(0);

  const prevSlide = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 1) : prev - 1));
  };

  const nextSlide = () => {
    setStartIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  const visibleList = testimonials
    .slice(startIndex, startIndex + 4)
    .concat(testimonials.slice(0, Math.max(0, 4 - (testimonials.length - startIndex))))
    .slice(0, 4);

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2
              className="text-[22px] sm:text-[24px] font-extrabold text-[#222222] tracking-tight flex items-center gap-2.5"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <MessageSquareQuote className="w-6 h-6 text-[#D61F26]" />
              WHAT OUR CLIENTS SAY
            </h2>
            <span className="w-12 h-[3.5px] bg-[#D61F26] rounded-full block" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewAllTestimonials}
              className="text-[#D61F26] text-[13.5px] font-bold hover:underline flex items-center gap-1 cursor-pointer hidden sm:flex"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Read All Testimonials
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#D61F26] hover:border-[#D61F26] hover:text-white transition-all text-gray-700 cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#D61F26] hover:border-[#D61F26] hover:text-white transition-all text-gray-700 cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Cards - 4 columns on desktop & desktop site mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {visibleList.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-[20px] p-7 border border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-[15px] shadow-md flex-shrink-0"
                      style={{ backgroundColor: t.avatarBg, fontFamily: 'Poppins, sans-serif' }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <h3
                        className="text-[15px] font-bold text-[#222222]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {t.name}
                      </h3>
                      <p className="text-[12px] text-gray-400 font-medium">{t.location}</p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-[#D61F26]/20 flex-shrink-0" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="text-[12px] font-bold text-gray-700 ml-1.5">5.0</span>
                </div>

                {/* Message */}
                <p
                  className="text-[13.5px] text-gray-600 leading-relaxed italic"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  "{t.message}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11.5px] text-emerald-600 font-semibold">
                <span>✓ Verified Homebuyer</span>
                <span className="text-gray-400 font-normal">The Mars TV Reviews</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
