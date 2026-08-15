import { useState } from 'react';
import { Property } from '../types';
import { Heart, BedDouble, Car, Maximize2, MapPin, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface SponsoredPropertiesProps {
  properties: Property[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onSelectProperty?: (property: Property) => void;
  onViewAll?: () => void;
}

export default function SponsoredProperties({
  properties = [],
  wishlist = [],
  onToggleWishlist = () => {},
  onSelectProperty = () => {},
  onViewAll = () => {},
}: SponsoredPropertiesProps) {
  const sponsoredList = properties.filter(
    (p) =>
      p.isSponsored &&
      p.status !== 'PENDING_APPROVAL' &&
      p.status !== 'REJECTED' &&
      p.status !== 'INACTIVE'
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, sponsoredList.length - 1) : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= sponsoredList.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2
              className="text-[22px] sm:text-[24px] font-extrabold text-[#222222] tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              SPONSORED PROPERTIES
            </h2>
            <span className="w-12 h-[3.5px] bg-[#D61F26] rounded-full block" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewAll}
              className="text-[#D61F26] text-[13.5px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View All Sponsored
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#D61F26] hover:border-[#D61F26] hover:text-white transition-all text-gray-700 cursor-pointer shadow-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#D61F26] hover:border-[#D61F26] hover:text-white transition-all text-gray-700 cursor-pointer shadow-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Property Grid Cards - 4 columns on desktop & desktop site mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {sponsoredList.slice(currentIndex, currentIndex + 4).concat(
            sponsoredList.slice(0, Math.max(0, 4 - (sponsoredList.length - currentIndex)))
          ).slice(0, 4).map((property) => {
            const isSaved = wishlist?.includes(property.id) ?? false;
            const primaryImg = property.images.find(img => img.isPrimary)?.url || property.images[0]?.url;

            return (
              <div
                key={property.id}
                className="bg-white rounded-[18px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative h-[210px] overflow-hidden bg-gray-100">
                  <img
                    src={primaryImg}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#D61F26] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-md">
                      Sponsored
                    </span>
                    {property.isReraReg && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        RERA
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(property.id); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#D61F26] transition-all cursor-pointer"
                    aria-label="Save Property"
                  >
                    <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-semibold">
                    {property.propertyType}
                  </div>
                </div>

                {/* Details */}
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

                    {/* Specs Icons */}
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

                  {/* View Details CTA */}
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white text-[13.5px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer shadow-md shadow-red-900/20 active:scale-98"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
