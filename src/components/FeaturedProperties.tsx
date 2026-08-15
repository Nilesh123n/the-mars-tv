import { useState } from 'react';
import { Property } from '../types';
import { Heart, BedDouble, Car, Maximize2, MapPin, CheckCircle } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onSelectProperty?: (property: Property) => void;
  onViewAll?: () => void;
}

export default function FeaturedProperties({
  properties = [],
  wishlist = [],
  onToggleWishlist = () => {},
  onSelectProperty = () => {},
  onViewAll = () => {},
}: FeaturedPropertiesProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'PLOT'>('ALL');

  const featuredList = properties.filter(
    (p) =>
      p.isFeatured &&
      p.status !== 'PENDING_APPROVAL' &&
      p.status !== 'REJECTED' &&
      p.status !== 'INACTIVE'
  );

  const filteredProperties = featuredList.filter((p) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'COMMERCIAL') return p.listingType === 'COMMERCIAL' || p.propertyType === 'OFFICE' || p.propertyType === 'RETAIL';
    return p.propertyType === activeFilter;
  });

  return (
    <section className="py-14 bg-[#F5F5F5]">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2
              className="text-[22px] sm:text-[24px] font-extrabold text-[#222222] tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              FEATURED PROPERTIES
            </h2>
            <span className="w-12 h-[3.5px] bg-[#D61F26] rounded-full block" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {(
              [
                { id: 'ALL', label: 'All Featured' },
                { id: 'APARTMENT', label: 'Apartments' },
                { id: 'VILLA', label: 'Villas' },
                { id: 'COMMERCIAL', label: 'Commercial' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-[#D61F26] text-white shadow-md shadow-red-900/20'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards - 4 columns on desktop & desktop site mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {filteredProperties.slice(0, 8).map((property) => {
            const isSaved = wishlist?.includes(property.id) ?? false;
            const primaryImg = property.images.find((img) => img.isPrimary)?.url || property.images[0]?.url;

            return (
              <div
                key={property.id}
                className="bg-white rounded-[18px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-[210px] overflow-hidden bg-gray-100">
                  <img
                    src={primaryImg}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#FF8C00] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                      Featured
                    </span>
                    {property.isVerified && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(property.id); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#D61F26] transition-all cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-semibold">
                    {property.city}
                  </div>
                </div>

                {/* Content */}
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

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer text-center shadow-md shadow-red-900/20"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Properties Bar */}
        <div className="mt-10 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#D61F26] text-[#D61F26] hover:text-white border-2 border-[#D61F26] font-bold text-[14px] px-8 py-3.5 rounded-[14px] transition-all duration-200 shadow-md cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore All Properties
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7M3 12h18" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
