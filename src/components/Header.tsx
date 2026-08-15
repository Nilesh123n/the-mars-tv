import { useState, useEffect } from 'react';
import { Home, Building2, Building, Newspaper, Megaphone, Phone, Heart, Menu, X, PlusCircle, KeyRound, HardHat } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  wishlistCount: number;
  onOpenListProperty?: () => void;
  onOpenEMICalculator?: () => void;
}

const navLinks = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'residential', label: 'Residential', icon: Building },
  { id: 'commercial', label: 'Commercial', icon: Building2 },
  { id: 'rent', label: 'Rental', icon: KeyRound },
  { id: 'construction', label: 'Construction', icon: HardHat },
  { id: 'pr-services', label: 'PR Services', icon: Megaphone },
  { id: 'contact', label: 'Contact Us', icon: Phone },
];

export default function Header({
  currentView,
  onNavigate,
  wishlistCount,
  onOpenListProperty,
  onOpenEMICalculator
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBg = 'bg-[#D61F26] shadow-xl border-b border-red-700/60';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => { onNavigate('home'); setMobileOpen(false); }}
            className="flex items-center gap-2.5 flex-shrink-0 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white text-[#D61F26] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Home className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="font-extrabold text-[18px] tracking-wide text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                THE MARS TV
              </span>
              <span className="text-[10px] text-white/80 tracking-widest uppercase font-semibold">
                Find. Buy. Sell. Trust.
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navLinks.map((link) => {
              const active = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`
                    px-2 xl:px-3 py-1.5 xl:py-2 text-[12.5px] xl:text-[13.5px] font-semibold transition-all duration-200 cursor-pointer rounded-xl flex items-center gap-1 xl:gap-1.5 text-white hover:bg-white/15 whitespace-nowrap flex-shrink-0
                    ${active ? 'bg-white/20 font-extrabold text-white shadow-sm ring-1 ring-white/40' : 'opacity-90 hover:opacity-100'}
                  `}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <link.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white flex-shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* List Your Property Button (White Background, Red Text) */}
            <button
              onClick={onOpenListProperty}
              className="bg-white hover:bg-gray-100 text-[#D61F26] px-3.5 xl:px-4 py-2 xl:py-2 rounded-xl text-[12.5px] xl:text-[13.5px] font-black transition-all flex items-center gap-1.5 xl:gap-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap border border-white"
              title="List Your Property on The Mars TV"
            >
              <PlusCircle className="w-4 h-4 xl:w-4.5 xl:h-4.5 text-[#D61F26] flex-shrink-0" />
              <span>List Your Property</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative text-white hover:bg-white/15 p-2 xl:p-2.5 rounded-xl transition-all flex items-center justify-center border border-white/30 cursor-pointer flex-shrink-0"
              title="Saved Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 xl:w-5 xl:h-5 ${wishlistCount > 0 ? 'fill-white text-white' : 'text-white'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#D61F26] text-[10px] font-extrabold w-4.5 h-4.5 xl:w-5 xl:h-5 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-white hover:bg-white/15 rounded-xl"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-white text-white' : 'text-white'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#D61F26] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              className="p-2 text-white hover:bg-white/15 rounded-xl cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#D61F26] border-t border-red-700/60 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all text-left text-white hover:bg-white/15
                ${currentView === link.id ? 'bg-white/20 ring-1 ring-white/40 font-extrabold' : ''}`}
            >
              <link.icon className="w-5 h-5 text-white" />
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-red-700/60 flex flex-col gap-2">
            <button
              onClick={() => { onOpenListProperty?.(); setMobileOpen(false); }}
              className="w-full text-center py-3 bg-white text-[#D61F26] hover:bg-gray-100 rounded-[14px] text-[14px] font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
            >
              <PlusCircle className="w-4.5 h-4.5 text-[#D61F26]" />
              <span>List Your Property</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
