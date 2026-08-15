import { useState } from 'react';
import { Property } from '../../types';
import { Heart, MapPin, BedDouble, Car, Maximize2, Search, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import LocationFilterBar, { LocationFilterSelection } from '../common/LocationFilterBar';
import { checkLocationMatch } from '../../data/locationHierarchy';

interface ResidentialPageProps {
  properties: Property[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export default function ResidentialPage({
  properties = [],
  wishlist = [],
  onToggleWishlist = () => {},
  onSelectProperty = () => {},
}: ResidentialPageProps) {
  const residentialProperties = properties.filter((p) => p.listingType !== 'COMMERCIAL');

  const [search, setSearch] = useState('');
  const [bhkFilter, setBhkFilter] = useState<number | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'APARTMENT' | 'VILLA' | 'PLOT' | 'PENTHOUSE'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH'>('NEWEST');
  const [locationSelection, setLocationSelection] = useState<LocationFilterSelection>({
    region: 'ALL',
    stateId: null,
    stateName: null,
    cityId: null,
    cityName: null
  });

  const filtered = residentialProperties.filter((p) => {
    const matchesLocation = checkLocationMatch(
      p,
      locationSelection.region,
      locationSelection.stateId,
      locationSelection.cityId
    );
    const matchesSearch =
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(search.toLowerCase());
    const matchesBhk = bhkFilter === 'ALL' || p.bedrooms === bhkFilter;
    const matchesType = typeFilter === 'ALL' || p.propertyType === typeFilter;
    return matchesLocation && matchesSearch && matchesBhk && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.price - b.price;
    if (sortBy === 'PRICE_HIGH') return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="pt-[90px] pb-16 min-h-screen bg-[#F5F5F5]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-12 px-4 border-b border-gray-800">
        <div className="max-w-[1320px] mx-auto px-2">
          <span className="text-[#D61F26] text-xs font-bold uppercase tracking-widest block mb-2">Verified Housing Portfolios</span>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Residential Properties for Sale & Rent
          </h1>
          <p className="text-gray-400 text-[14.5px] mt-1 max-w-[600px]">
            Explore luxury apartments, independent villas, penthouses, and RERA residential plots across Indian States & Global Cities.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6 space-y-6">
        
        {/* India & International State/City Navigation Bar */}
        <LocationFilterBar
          selection={locationSelection}
          onChange={setLocationSelection}
          resultCount={filtered.length}
          itemTypeLabel="Residential Properties"
        />

        {/* Filter Toolbar */}
        <div className="bg-white rounded-[20px] p-5 shadow-xl border border-gray-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locality, city, project..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] focus:outline-none focus:border-[#D61F26]"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* BHK Filter */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {[
                { id: 'ALL', label: 'All BHK' },
                { id: 2, label: '2 BHK' },
                { id: 3, label: '3 BHK' },
                { id: 4, label: '4+ BHK' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setBhkFilter(item.id as number | 'ALL')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    bhkFilter === item.id ? 'bg-[#D61F26] text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-gray-100 border border-gray-200 text-gray-700 text-[13px] font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D61F26] cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="APARTMENT">Apartments</option>
              <option value="VILLA">Villas</option>
              <option value="PENTHOUSE">Penthouses</option>
              <option value="PLOT">Residential Plots</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-100 border border-gray-200 text-gray-700 text-[13px] font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D61F26] cursor-pointer"
            >
              <option value="NEWEST">Newest First</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid Results */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] font-bold text-gray-700">
            Showing <span className="text-[#D61F26] font-extrabold">{filtered.length}</span> Residential Properties
            {locationSelection.cityName ? ` in ${locationSelection.cityName}` : locationSelection.stateName ? ` in ${locationSelection.stateName}` : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 my-8 shadow-xs">
            <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-[18px] font-bold text-gray-800">
              No residential properties found {locationSelection.cityName ? `in ${locationSelection.cityName}` : ''}
            </h3>
            <p className="text-[13px] text-gray-500 mt-1 max-w-md mx-auto">
              We are continually onboarding verified RERA developers across this region. You can reset filters or request direct broker assistance.
            </p>
            <button
              onClick={() => setLocationSelection({ region: 'ALL', stateId: null, stateName: null, cityId: null, cityName: null })}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              View All Locations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((property) => {
              const isSaved = wishlist?.includes(property.id) ?? false;
              const primaryImg = property.images.find((i) => i.isPrimary)?.url || property.images[0]?.url;

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-[18px] overflow-hidden border border-gray-200/90 shadow-[0_4px_18px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-[210px] overflow-hidden bg-gray-100">
                    <img src={primaryImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-[#D61F26] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                        {property.propertyType}
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleWishlist(property.id); }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#D61F26] transition-all cursor-pointer"
                    >
                      <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-semibold">
                      {property.city}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-[15.5px] font-bold text-[#222222] mb-1.5 line-clamp-1 group-hover:text-[#D61F26] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-gray-500 mb-2.5 text-[12.5px]">
                        <MapPin className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <p
                        className="text-[19px] font-extrabold text-[#D61F26] mb-3"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.priceLabel}
                      </p>

                      <div className="grid grid-cols-3 gap-1 text-[11.5px] text-gray-600 py-2.5 border-t border-b border-gray-100 mb-4 bg-gray-50/70 rounded-lg px-2 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-gray-400 text-[10px] uppercase">Bedrooms</span>
                          <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-gray-500" />
                            {property.bedrooms ? `${property.bedrooms} BHK` : '—'}
                          </span>
                        </div>
                        <div className="flex flex-col items-center border-l border-r border-gray-200 px-1">
                          <span className="text-gray-400 text-[10px] uppercase">Area</span>
                          <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
                            {property.area} Sq.Ft
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-gray-400 text-[10px] uppercase">Parking</span>
                          <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-gray-500" />
                            {property.parking ?? 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProperty(property)}
                      className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer shadow-md shadow-red-900/20"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
