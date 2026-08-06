import { useState } from 'react';
import { Property } from '../../types';
import {
  Heart,
  MapPin,
  BedDouble,
  Car,
  Maximize2,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Building,
  Building2,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Home,
  Briefcase
} from 'lucide-react';

interface RentPageProps {
  properties: Property[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenListProperty?: () => void;
}

export default function RentPage({
  properties,
  wishlist,
  onToggleWishlist,
  onSelectProperty,
  onOpenListProperty
}: RentPageProps) {
  // Filter only RENT properties OR properties explicitly flagged for rent
  const rentalProperties = properties.filter(
    (p) => p.listingType === 'RENT' || p.priceLabel.toLowerCase().includes('/ mo') || p.priceLabel.toLowerCase().includes('mo')
  );

  const [search, setSearch] = useState('');
  const [categoryTab, setCategoryTab] = useState<'ALL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'STUDIO' | 'PENTHOUSE'>('ALL');
  const [budgetFilter, setBudgetFilter] = useState<'ALL' | 'UNDER_25K' | '25K_50K' | '50K_1L' | 'ABOVE_1L'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'RENT_LOW' | 'RENT_HIGH'>('NEWEST');

  // Extract unique cities
  const cities = Array.from(new Set(rentalProperties.map((p) => p.city)));

  const filtered = rentalProperties
    .filter((p) => {
      // Search
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.propertyType.toLowerCase().includes(search.toLowerCase());

      // Category tab
      let matchesCategory = true;
      if (categoryTab === 'RESIDENTIAL') {
        matchesCategory = ['APARTMENT', 'VILLA', 'PLOT'].includes(p.propertyType);
      } else if (categoryTab === 'COMMERCIAL') {
        matchesCategory = ['OFFICE', 'RETAIL', 'WAREHOUSE'].includes(p.propertyType);
      } else if (categoryTab === 'STUDIO') {
        matchesCategory = p.propertyType === 'STUDIO';
      } else if (categoryTab === 'PENTHOUSE') {
        matchesCategory = p.propertyType === 'PENTHOUSE';
      }

      // Budget filter
      let matchesBudget = true;
      if (budgetFilter === 'UNDER_25K') matchesBudget = p.price <= 25000;
      else if (budgetFilter === '25K_50K') matchesBudget = p.price > 25000 && p.price <= 50000;
      else if (budgetFilter === '50K_1L') matchesBudget = p.price > 50000 && p.price <= 100000;
      else if (budgetFilter === 'ABOVE_1L') matchesBudget = p.price > 100000;

      // City
      const matchesCity = cityFilter === 'ALL' || p.city.toLowerCase() === cityFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesBudget && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === 'RENT_LOW') return a.price - b.price;
      if (sortBy === 'RENT_HIGH') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="pt-[72px] pb-16 min-h-screen bg-[#F8F9FA]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-12 lg:py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D61F26_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-[1320px] mx-auto px-2 relative z-10">
          <div className="flex items-center gap-2 text-[#D61F26] text-xs font-bold uppercase tracking-widest mb-3">
            <KeyRound className="w-4 h-4" />
            <span>Verified Rental & Lease Portfolios</span>
          </div>

          <h1 className="text-[30px] sm:text-[42px] font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Properties for Rent & Lease Across All Categories
          </h1>

          <p className="text-gray-300 text-[14.5px] sm:text-[16px] mt-2 max-w-[700px] leading-relaxed">
            Discover fully furnished residential flats, luxury villas, executive studio suites, corporate office spaces, high-street retail shops & warehouses for rent with zero hassle.
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-6 pt-6 border-t border-white/10 text-white/90 text-[13px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D61F26]" />
              <span>{rentalProperties.length}+ Verified Rental Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Owner & Agent Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Immediate Move-In Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Content Area */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6 relative z-20">
        
        {/* Category Navigation Bar */}
        <div className="bg-white rounded-[22px] p-4 sm:p-5 shadow-xl border border-gray-200/90 space-y-4">
          
          {/* Top Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Rentals', icon: KeyRound, count: rentalProperties.length },
              { id: 'RESIDENTIAL', label: 'Residential Flats & Villas', icon: Home, count: rentalProperties.filter(p => ['APARTMENT', 'VILLA', 'PLOT'].includes(p.propertyType)).length },
              { id: 'COMMERCIAL', label: 'Offices & Shops', icon: Briefcase, count: rentalProperties.filter(p => ['OFFICE', 'RETAIL', 'WAREHOUSE'].includes(p.propertyType)).length },
              { id: 'STUDIO', label: 'Studio Suites', icon: Building, count: rentalProperties.filter(p => p.propertyType === 'STUDIO').length },
              { id: 'PENTHOUSE', label: 'Penthouses', icon: Building2, count: rentalProperties.filter(p => p.propertyType === 'PENTHOUSE').length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = categoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D61F26] text-white shadow-md shadow-red-900/20 scale-102'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D61F26]'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-gray-100" />

          {/* Secondary Controls Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search locality, city, furnished status..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] focus:outline-none focus:border-[#D61F26] bg-gray-50/50"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Rent Budget Range */}
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value as any)}
                className="bg-gray-100 border border-gray-200 text-gray-700 text-[13px] font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#D61F26] cursor-pointer flex-1 sm:flex-none"
              >
                <option value="ALL">All Rent Budgets</option>
                <option value="UNDER_25K">Under ₹25,000 / mo</option>
                <option value="25K_50K">₹25,000 - ₹50,000 / mo</option>
                <option value="50K_1L">₹50,000 - ₹1,00,000 / mo</option>
                <option value="ABOVE_1L">Above ₹1,00,000 / mo</option>
              </select>

              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-gray-100 border border-gray-200 text-gray-700 text-[13px] font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#D61F26] cursor-pointer flex-1 sm:flex-none"
              >
                <option value="ALL">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-100 border border-gray-200 text-gray-700 text-[13px] font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#D61F26] cursor-pointer flex-1 sm:flex-none"
              >
                <option value="NEWEST">Newest Listings</option>
                <option value="RENT_LOW">Rent: Low to High</option>
                <option value="RENT_HIGH">Rent: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <div>
            <p className="text-[15px] font-bold text-gray-800">
              Showing <span className="text-[#D61F26] font-extrabold">{filtered.length}</span> Rented & Lease Properties
            </p>
            <p className="text-[12.5px] text-gray-500">
              Verified rentals with zero brokerage options available
            </p>
          </div>

          {onOpenListProperty && (
            <button
              onClick={onOpenListProperty}
              className="hidden sm:flex items-center gap-2 bg-[#D61F26] text-white hover:bg-red-700 px-4 py-2 rounded-xl text-[13px] font-bold transition-all shadow-md cursor-pointer"
            >
              <span>List Rental Property Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Grid Display */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 my-8 shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-[19px] font-bold text-gray-800">No rental properties matched your filter criteria</h3>
            <p className="text-[13.5px] text-gray-500 mt-1 max-w-[450px] mx-auto">
              Try adjusting your search terms, city filter, or rent budget range to see available options.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategoryTab('ALL');
                setBudgetFilter('ALL');
                setCityFilter('ALL');
              }}
              className="mt-4 bg-[#D61F26] text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-red-700 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {filtered.map((property) => {
              const isSaved = wishlist.includes(property.id);
              const primaryImg = property.images.find((i) => i.isPrimary)?.url || property.images[0]?.url;

              return (
                <div
                  key={property.id}
                  onClick={() => onSelectProperty(property)}
                  className="bg-white rounded-[20px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-[220px] overflow-hidden bg-gray-100">
                    <img
                      src={primaryImg}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category & Rent Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                        {property.propertyType}
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> FOR RENT
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(property.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#D61F26] transition-all cursor-pointer"
                    >
                      <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
                    </button>

                    {/* City Location Tag */}
                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-md text-white text-[11px] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D61F26]" />
                      <span>{property.city}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price / Rent Tag */}
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[20px] font-extrabold text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {property.priceLabel}
                        </span>
                        {property.isVerified && (
                          <span className="text-[10px] font-bold bg-green-50 text-emerald-700 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> RERA Verified
                          </span>
                        )}
                      </div>

                      {/* Property Title */}
                      <h3
                        className="text-[15px] font-bold text-[#222222] mb-2 leading-snug line-clamp-2 group-hover:text-[#D61F26] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.title}
                      </h3>

                      {/* Locality Address */}
                      <p className="text-[12.5px] text-gray-500 mb-3.5 flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{property.location}</span>
                      </p>

                      {/* Key Features Chips */}
                      <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-gray-100 text-[11.5px] font-semibold text-gray-600 mb-3">
                        {property.bedrooms !== undefined && property.bedrooms > 0 ? (
                          <div className="flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                            <span>{property.bedrooms} BHK</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            <span>Commercial</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                          <span>{property.area} {property.areaUnit || 'sq.ft'}</span>
                        </div>

                        {property.parking ? (
                          <div className="flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-gray-400" />
                            <span>{property.parking} Parking</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                            <span>Furnished</span>
                          </div>
                        )}
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-bold self-center">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#D61F26] group-hover:underline flex items-center gap-1">
                        View Rental Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProperty(property);
                        }}
                        className="bg-gray-100 hover:bg-[#D61F26] hover:text-white text-gray-800 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Contact Owner / Agent"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner for Renting out a Property */}
        <div className="mt-14 bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] rounded-[24px] p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[#D61F26] text-[11px] font-extrabold uppercase tracking-widest bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full inline-block">
              For Property Owners & Landlords
            </span>
            <h3 className="text-[22px] sm:text-[28px] font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Want to Rent Out Your Apartment, Office or House?
            </h3>
            <p className="text-gray-300 text-[14px] max-w-[620px]">
              Post your rental property on THE MARS TV for free and connect with 100% verified corporate tenants & families in 48 hours.
            </p>
          </div>

          {onOpenListProperty && (
            <button
              onClick={onOpenListProperty}
              className="bg-[#D61F26] hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl text-[14px] transition-all shadow-lg flex items-center gap-2 flex-shrink-0 cursor-pointer active:scale-95"
            >
              <span>Post Rental Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
