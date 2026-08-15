import { useState, useEffect } from 'react';
import {
  Home,
  Building2,
  Building,
  Newspaper,
  Megaphone,
  Phone,
  Heart,
  Menu,
  X,
  PlusCircle,
  KeyRound,
  HardHat,
  Calculator,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  wishlistCount: number;
  onOpenListProperty?: () => void;
  onOpenEMICalculator?: () => void;
}

const navLinks = [
  { id: 'home', label: 'Home', icon: Home, badge: '' },
  { id: 'news', label: 'News', icon: Newspaper, badge: '' },
  { id: 'residential', label: 'Residential', icon: Building, badge: '' },
  { id: 'commercial', label: 'Commercial', icon: Building2, badge: '' },
  { id: 'rent', label: 'Rental', icon: KeyRound, badge: '' },
  { id: 'construction', label: 'Construction', icon: HardHat, badge: '' },
  { id: 'pr-services', label: 'PR Services', icon: Megaphone, badge: '' },
  { id: 'contact', label: 'Contact Us', icon: Phone, badge: '' },
];

export default function Header({
  currentView,
  onNavigate,
  wishlistCount,
  onOpenListProperty,
  onOpenEMICalculator,
}: HeaderProps) {
  const [, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open on small devices
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#D61F26] shadow-xl border-b border-red-700/60">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-[68px] sm:h-[72px] gap-2">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 text-left cursor-pointer group py-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-[#D61F26] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Home className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="font-black text-[16px] sm:text-[18px] tracking-wide text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                THE MARS TV
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-white/85 tracking-widest uppercase font-bold">
                Real Estate Portal
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on XL screens 1280px+ to ensure zero overflow) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 flex-shrink">
            {navLinks.map((link) => {
              const active = currentView === link.id;
              const IconComp = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`
                    px-2.5 2xl:px-3 py-1.5 2xl:py-2 text-[12px] 2xl:text-[13px] font-bold transition-all duration-150 cursor-pointer rounded-xl flex items-center gap-1.5 text-white whitespace-nowrap flex-shrink-0
                    ${
                      active
                        ? 'bg-white text-[#D61F26] shadow-sm font-extrabold ring-1 ring-white/60'
                        : 'hover:bg-white/15 opacity-95 hover:opacity-100'
                    }
                  `}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <IconComp className={`w-3.5 h-3.5 2xl:w-4 2xl:h-4 flex-shrink-0 ${active ? 'text-[#D61F26]' : 'text-white'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* List Your Property Button (Always visible on sm+ screens) */}
            <button
              onClick={() => {
                onOpenListProperty?.();
                if (mobileOpen) setMobileOpen(false);
              }}
              className="bg-white hover:bg-gray-100 text-[#D61F26] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[12px] sm:text-[13px] font-black transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap border border-white"
              title="List Your Property on The Mars TV"
            >
              <PlusCircle className="w-4 h-4 text-[#D61F26] flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">List Your Property</span>
              <span className="inline xs:hidden">List</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`relative text-white hover:bg-white/15 p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center border border-white/30 cursor-pointer flex-shrink-0 ${
                currentView === 'wishlist' ? 'bg-white/20 ring-1 ring-white' : ''
              }`}
              title="Saved Wishlist"
              aria-label="View saved wishlist"
            >
              <Heart
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${
                  wishlistCount > 0 ? 'fill-white text-white' : 'text-white'
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#D61F26] text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Menu Button (Visible on screens < 1280px) */}
            <button
              className="xl:hidden p-2 text-white hover:bg-white/15 rounded-xl cursor-pointer transition-colors border border-white/25 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5.5 h-5.5 text-white" /> : <Menu className="w-5.5 h-5.5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Menu Overlay & Drawer */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[68px] sm:top-[72px] bottom-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200">
          <div className="bg-[#D61F26] border-t border-red-600/70 shadow-2xl max-h-[calc(100vh-72px)] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
            <div className="max-w-[800px] mx-auto p-4 sm:p-6 space-y-4">
              
              {/* Top Banner: Quick List Property CTA */}
              <div className="bg-white/10 rounded-2xl p-3 sm:p-4 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-[#D61F26] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      Free Verified Listing
                    </span>
                    <span className="text-white text-xs font-semibold">Developers &amp; Owners</span>
                  </div>
                  <p className="text-white/90 text-sm font-bold mt-1">
                    Have a property to sell or rent?
                  </p>
                </div>
                <button
                  onClick={() => {
                    onOpenListProperty?.();
                    setMobileOpen(false);
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#D61F26] px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-[#D61F26]" />
                  <span>List Property Now</span>
                </button>
              </div>

              {/* Navigation Grid (2-Columns on Mobile for clean alignment and no cutoff) */}
              <div>
                <p className="text-[11px] font-bold tracking-wider text-white/80 uppercase mb-2.5 px-1">
                  Explore Pages &amp; Categories
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {navLinks.map((link) => {
                    const active = currentView === link.id;
                    const IconComp = link.icon;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`
                          flex items-center justify-between p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer border
                          ${
                            active
                              ? 'bg-white text-[#D61F26] border-white shadow-md font-extrabold'
                              : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              active ? 'bg-red-50 text-[#D61F26]' : 'bg-white/15 text-white'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="text-[13px] sm:text-[14px] font-bold truncate">
                            {link.label}
                          </span>
                        </div>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 opacity-60 ${active ? 'text-[#D61F26]' : 'text-white'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Utility Quick Links */}
              <div className="pt-2 border-t border-red-600/70 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onOpenEMICalculator && (
                  <button
                    onClick={() => {
                      onOpenEMICalculator();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all"
                  >
                    <Calculator className="w-4 h-4 text-white" />
                    <span>Home Loan EMI Calculator</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('wishlist')}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-white" />
                    <span>Saved Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-white text-[#D61F26] px-2 py-0.5 rounded-full text-[10px] font-black">
                      {wishlistCount} Saved
                    </span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
