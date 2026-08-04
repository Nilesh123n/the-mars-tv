import { useState, useEffect, FormEvent } from 'react';
import { Search, MapPin, Home, DollarSign, CheckCircle, Shield, Users, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onSearch: (criteria: { tab: 'Buy' | 'Sell'; location: string; propertyCategory: string; propertyType: string; budget: string }) => void;
}

const trustBadges = [
  { icon: CheckCircle, label: 'Verified Properties', color: '#22c55e' },
  { icon: Users, label: 'Trusted by Millions', color: '#3b82f6' },
  { icon: Shield, label: 'RERA Registered', color: '#D61F26' },
];

const propertyCategories = [
  'Residential',
  'Commercial',
  'Agriculture',
];

const propertyTypes = [
  'Apartment', 'Villa', 'Plot', 'Row House',
  'Office', 'Retail', 'Warehouse', 'Agricultural Land', 'Farmhouse',
];

const budgetRanges = [
  'Under ₹50 L',
  '₹50 L - ₹1 Cr',
  '₹1 Cr - ₹2 Cr',
  '₹2 Cr - ₹5 Cr',
  'Above ₹5 Cr',
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
  const [activeTab, setActiveTab] = useState<'Buy' | 'Sell'>('Buy');
  const [location, setLocation] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

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

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({
      tab: activeTab,
      location,
      propertyCategory,
      propertyType,
      budget,
    });
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#7A0D12] via-[#52090C] to-[#2B0406] pb-10 pt-[110px] lg:pt-[130px]">
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
          {/* Subtle light vignette gradient to ensure white text readability without black darkening */}
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
        <div key={slide.id} className="text-center max-w-[880px] mx-auto space-y-4 transition-all duration-500 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#D61F26]/20 border border-[#D61F26]/40 text-[#E84A50] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#D61F26] animate-pulse" />
            {slide.badge}
          </div>

          <h1
            className="text-[34px] sm:text-[46px] lg:text-[54px] font-extrabold text-white leading-[1.15] tracking-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {slide.titlePrefix}
            <span className="text-[#D61F26]">{slide.highlight}</span>
            {slide.titleSuffix}
          </h1>

          <p
            className="text-gray-300 text-[15px] sm:text-[17px] leading-relaxed max-w-[720px] mx-auto"
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
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                <badge.icon className="w-4 h-4 flex-shrink-0" style={{ color: badge.color }} />
                <span className="text-gray-200 text-[12.5px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* One-Line Horizontal Search Bar Structure */}
        <div className="mt-8 sm:mt-12 max-w-[1260px] mx-auto">
          {/* Floating Buy / Sell Tabs */}
          <div className="flex items-center gap-2 mb-0 px-1">
            <div className="bg-red-950/80 backdrop-blur-md p-1.5 rounded-t-2xl border-t border-x border-white/20 flex gap-1">
              {(['Buy', 'Sell'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 sm:px-6 sm:py-2 text-[13px] sm:text-[13.5px] font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#D61F26] text-white shadow-lg shadow-red-900/40'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Single Horizontal Row Form - Strictly 1 Line on Desktop, Responsive on Mobile */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl rounded-tl-none p-2.5 sm:p-3 shadow-2xl shadow-black/80 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-gray-200 items-center"
          >
            {/* Location / City Field */}
            <div className="lg:px-3.5 py-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Location / City
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-[#D61F26] flex-shrink-0 mr-2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Vijay Nagar, Indore"
                  className="w-full text-[13.5px] font-semibold text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>

            {/* Property Category Field */}
            <div className="lg:px-3.5 py-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Property Category
              </label>
              <div className="relative flex items-center">
                <Layers className="w-4 h-4 text-[#D61F26] flex-shrink-0 mr-2" />
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="w-full text-[13.5px] font-semibold text-gray-900 focus:outline-none bg-transparent cursor-pointer pr-4 appearance-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="">All Categories</option>
                  {propertyCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="absolute right-0 text-gray-400 text-[10px] pointer-events-none">▼</span>
              </div>
            </div>

            {/* Property Type Field */}
            <div className="lg:px-3.5 py-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Property Type
              </label>
              <div className="relative flex items-center">
                <Home className="w-4 h-4 text-[#D61F26] flex-shrink-0 mr-2" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-[13.5px] font-semibold text-gray-900 focus:outline-none bg-transparent cursor-pointer pr-4 appearance-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="">All Property Types</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="absolute right-0 text-gray-400 text-[10px] pointer-events-none">▼</span>
              </div>
            </div>

            {/* Budget Bracket Field */}
            <div className="lg:px-3.5 py-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Budget Bracket
              </label>
              <div className="relative flex items-center">
                <DollarSign className="w-4 h-4 text-[#D61F26] flex-shrink-0 mr-2" />
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-[13.5px] font-semibold text-gray-900 focus:outline-none bg-transparent cursor-pointer pr-4 appearance-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="">Any Budget</option>
                  {budgetRanges.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <span className="absolute right-0 text-gray-400 text-[10px] pointer-events-none">▼</span>
              </div>
            </div>

            {/* Search Action Button */}
            <div className="sm:col-span-2 lg:col-span-1 lg:pl-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-red-900/30 hover:shadow-red-900/50 cursor-pointer active:scale-98 whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

