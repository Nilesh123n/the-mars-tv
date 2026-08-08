import { useState } from 'react';
import { Property } from '../../types';
import { Heart, MapPin, Building2, Maximize2, Search, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface CommercialPageProps {
  properties: Property[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export default function CommercialPage({
  properties = [],
  wishlist = [],
  onToggleWishlist = () => {},
  onSelectProperty = () => {},
}: CommercialPageProps) {
  const commercialProperties = properties.filter((p) => p.listingType === 'COMMERCIAL' || p.propertyType === 'OFFICE' || p.propertyType === 'RETAIL' || p.propertyType === 'WAREHOUSE');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'OFFICE' | 'RETAIL' | 'WAREHOUSE'>('ALL');

  const filtered = commercialProperties.filter((p) => {
    const matchesSearch = (p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.location || '').toLowerCase().includes(search.toLowerCase()) || (p.city || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.propertyType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="pt-[90px] pb-16 min-h-screen bg-[#F5F5F5]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-12 px-4 border-b border-gray-800">
        <div className="max-w-[1320px] mx-auto px-2">
          <span className="text-[#D61F26] text-xs font-bold uppercase tracking-widest block mb-2">Corporate & Retail Spaces</span>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Commercial Workspaces & Retail Outlets
          </h1>
          <p className="text-gray-400 text-[14.5px] mt-1 max-w-[600px]">
            Grade-A IT office spaces, high footfall main-road showrooms, and logistics warehousing across prime business hubs.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6">
        <div className="bg-white rounded-[20px] p-5 shadow-xl border border-gray-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commercial hub, AB Road, Vijay Nagar..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] focus:outline-none focus:border-[#D61F26]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {[
              { id: 'ALL', label: 'All Commercial' },
              { id: 'OFFICE', label: 'IT & Office Space' },
              { id: 'RETAIL', label: 'Retail Showrooms' },
              { id: 'WAREHOUSE', label: 'Warehouses' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  typeFilter === f.id ? 'bg-[#D61F26] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Grid Results */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] font-bold text-gray-700">
            Showing <span className="text-[#D61F26] font-extrabold">{filtered.length}</span> Commercial Spaces
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 my-8">
            <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-[18px] font-bold text-gray-800">No commercial properties found</h3>
            <p className="text-[13px] text-gray-500 mt-1">Try resetting search keywords or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((property) => {
              const isSaved = wishlist?.includes(property.id) ?? false;
              const primaryImg = property.images.find((i) => i.isPrimary)?.url || property.images[0]?.url;

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-[20px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-[220px] overflow-hidden bg-gray-100">
                    <img src={primaryImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                        Commercial {property.propertyType}
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleWishlist(property.id); }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#D61F26] transition-all cursor-pointer"
                    >
                      <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-[16px] font-bold text-[#222222] mb-1.5 line-clamp-1 group-hover:text-[#D61F26] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-gray-500 mb-3 text-[13px]">
                        <MapPin className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <p
                        className="text-[20px] font-extrabold text-[#D61F26] mb-3"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {property.priceLabel}
                      </p>

                      <div className="flex items-center justify-between text-[12px] text-gray-600 py-2.5 border-t border-b border-gray-100 mb-4 bg-gray-50 rounded-lg px-3">
                        <span className="font-semibold flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
                          {property.area} Sq.Ft Area
                        </span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Grade-A Facility
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProperty(property)}
                      className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white text-[13.5px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer shadow-md shadow-red-900/20"
                    >
                      Inquire Workspaces
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
