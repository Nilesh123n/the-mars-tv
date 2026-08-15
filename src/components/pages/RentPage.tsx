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
  Sparkles,
  ArrowRight,
  PhoneCall,
  Home,
  Briefcase
} from 'lucide-react';
import LocationFilterBar, { LocationFilterSelection } from '../common/LocationFilterBar';
import { checkLocationMatch } from '../../data/locationHierarchy';

interface RentPageProps {
  properties: Property[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onSelectProperty?: (property: Property) => void;
  onOpenListProperty?: () => void;
}

export default function RentPage({
  properties = [],
  wishlist = [],
  onToggleWishlist = () => {},
  onSelectProperty = () => {},
  onOpenListProperty = () => {}
}: RentPageProps) {
  // Filter only RENT properties OR properties explicitly flagged for rent
  const rentalProperties = properties.filter(
    (p) => p.listingType === 'RENT' || (p.priceLabel || '').toLowerCase().includes('/ mo') || (p.priceLabel || '').toLowerCase().includes('mo')
  );

  const [search, setSearch] = useState('');
  const [categoryTab, setCategoryTab] = useState<'ALL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'STUDIO' | 'PENTHOUSE'>('ALL');
  const [budgetFilter, setBudgetFilter] = useState<'ALL' | 'UNDER_25K' | '25K_50K' | '50K_1L' | 'ABOVE_1L'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'RENT_LOW' | 'RENT_HIGH'>('NEWEST');
  const [locationSelection, setLocationSelection] = useState<LocationFilterSelection>({
    region: 'ALL',
    stateId: null,
    stateName: null,
    cityId: null,
    cityName: null
  });

  const filtered = rentalProperties
    .filter((p) => {
      // Location matching
      const matchesLocation = checkLocationMatch(
        p,
        locationSelection.region,
        locationSelection.stateId,
        locationSelection.cityId
      );

      // Search
      const matchesSearch =
        (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.city || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.propertyType || '').toLowerCase().includes(search.toLowerCase());

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

      return matchesLocation && matchesSearch && matchesCategory && matchesBudget;
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
            Discover fully furnished residential flats, luxury villas, executive studio suites, corporate office spaces, high-street retail shops & warehouses across Indian States and International Hubs.
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
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6 relative z-20 space-y-6">
        
        {/* India & International State/City Navigation Bar */}
        <LocationFilterBar
          selection={locationSelection}
          onChange={setLocationSelection}
          resultCount={filtered.length}
          itemTypeLabel="Rental Properties"
        />

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
              {locationSelection.cityName ? ` in ${locationSelection.cityName}` : locationSelection.stateName ? ` in ${locationSelection.stateName}` : ''}
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
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 my-8 shadow-xs">
            <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-[18px] font-bold text-gray-800">
              No rental properties found {locationSelection.cityName ? `in ${locationSelection.cityName}` : ''}
            </h3>
            <p className="text-[13px] text-gray-500 mt-1 max-w-md mx-auto">
              Looking for a rental in this area? Connect with our verified leasing concierge team or reset location filters.
            </p>
            <button
              onClick={() => setLocationSelection({ region: 'ALL', stateId: null, stateName: null, cityId: null, cityName: null })}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              View All Locations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {filtered.map((property) => {
              const isSaved = wishlist?.includes(property.id) ?? false;
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
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                        FOR RENT
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(property.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#D61F26] transition-all cursor-pointer"
                      title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
                    >
                      <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
                    </button>

                    {/* City Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-semibold border border-white/20">
                      {property.city}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price / Rent per Month */}
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span
                          className="text-[21px] font-extrabold text-[#D61F26] leading-none"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          ₹{property.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[12.5px] font-semibold text-gray-500">
                          {property.priceLabel || '/ month'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-[15px] font-bold text-[#222222] mb-1.5 line-clamp-1 group-hover:text-[#D61F26] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-gray-500 mb-3 text-[12.5px]">
                        <MapPin className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      {/* Specs Tags */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-[12px] text-gray-600 mb-4">
                        {(property.bedrooms ?? 0) > 0 && (
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                            <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                            {property.bedrooms} BHK
                          </span>
                        )}
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                          <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                          {property.area} {property.areaUnit || 'sqft'}
                        </span>
                        {(property.parking ?? 0) > 0 && (
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                            <Car className="w-3.5 h-3.5 text-gray-400" />
                            {property.parking}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Contact Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[11.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
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
