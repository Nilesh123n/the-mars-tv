import { useState, useEffect } from 'react';
import { CheckCircle, Shield, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onSearch?: (criteria: { tab: 'Buy' | 'Sell'; location: string; propertyCategory: string; propertyType: string; budget: string }) => void;
}

const trustBadges = [
  { icon: CheckCircle, label: 'Verified Properties', color: '#22c55e' },
  { icon: Users, label: 'Trusted by Millions', color: '#3b82f6' },
  { icon: Shield, label: 'RERA Registered', color: '#D61F26' },
];

const slides = [
  {
    id: 1,
    badge: '#1 Real Estate Portal in Central India',
    titlePrefix: 'Find Your ',
    highlight: 'Dream Property',
    titleSuffix: ' With The Mars TV',
    subtitle: 'Thousands of verified residential apartments, luxury villas, commercial showrooms, and investment plots across prime locations.',
    bgImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85',
  },
  {
    id: 2,
    badge: 'Verified Commercial Workspaces',
    titlePrefix: 'Discover ',
    highlight: 'Prime Commercial',
    titleSuffix: ' & Office Spaces',
    subtitle: 'Grade-A office suites, retail showrooms, and high-ROI commercial investment hubs in top business locations.',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85',
  },
  {
    id: 3,
    badge: 'Fastest Property Selling Platform',
    titlePrefix: 'Sell & List ',
    highlight: 'Your Property',
    titleSuffix: ' With The Mars TV',
    subtitle: 'Connect directly with thousands of verified buyers & investors across India with 0% hidden commissions.',
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85',
  },
  {
    id: 4,
    badge: 'RERA Approved Townships & Plots',
    titlePrefix: 'Invest In ',
    highlight: 'Luxury Villas',
    titleSuffix: ' & Approved Plots',
    subtitle: 'Explore premium gated communities, high-appreciation residential lands, and luxury penthouses.',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=85',
  },
];

export default function Hero({ onSearch }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full min-h-[480px] lg:min-h-[540px] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#7A0D12] via-[#52090C] to-[#2B0406] py-16 lg:py-20 pt-[120px] lg:pt-[140px]">
      {/* Background Image Slider with Smooth Transition */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-85 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <img
            src={s.bgImage}
            alt={s.badge}
            className="w-full h-full object-cover object-center transition-transform duration-10000 ease-linear"
          />
          {/* Light vignette gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-red-950/20 to-red-950/70" />
        </div>
      ))}

      {/* Slide Navigation Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#D61F26]/70 hover:bg-[#D61F26] border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#D61F26]/70 hover:bg-[#D61F26] border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 lg:px-6 my-auto">
        {/* Centered Hero Header Content with Animation */}
        <div key={slide.id} className="text-center max-w-[880px] mx-auto space-y-5 transition-all duration-500 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#D61F26]/20 border border-[#D61F26]/40 text-[#E84A50] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#D61F26] animate-pulse" />
            {slide.badge}
          </div>

          <h1
            className="text-[34px] sm:text-[48px] lg:text-[58px] font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-md"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {slide.titlePrefix}
            <span className="text-[#D61F26]">{slide.highlight}</span>
            {slide.titleSuffix}
          </h1>

          <p
            className="text-gray-200 text-[16px] sm:text-[18px] leading-relaxed max-w-[740px] mx-auto font-normal drop-shadow"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {slide.subtitle}
          </p>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-[#D61F26]'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">
                <badge.icon className="w-4 h-4 flex-shrink-0" style={{ color: badge.color }} />
                <span className="text-white text-[13px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

