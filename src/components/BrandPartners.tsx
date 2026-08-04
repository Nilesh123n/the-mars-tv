import { BrandPartner } from '../types';
import { Building } from 'lucide-react';

interface BrandPartnersProps {
  partners: BrandPartner[];
}

export default function BrandPartners({ partners }: BrandPartnersProps) {
  const doubledPartners = [...partners, ...partners];

  return (
    <section className="py-14 bg-[#F5F5F5] overflow-hidden border-b border-gray-200/80">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2
              className="text-[22px] sm:text-[24px] font-extrabold text-[#222222] tracking-tight flex items-center gap-2.5"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Building className="w-6 h-6 text-[#D61F26]" />
              OUR BRAND PARTNERS & BANKING ALLIANCES
            </h2>
            <span className="w-12 h-[3.5px] bg-[#D61F26] rounded-full block" />
          </div>

          <span className="text-[12.5px] text-gray-500 font-medium hidden sm:block">
            Pre-Approved Home Loan & Construction Partners
          </span>
        </div>

        {/* Continuous Marquee Slider */}
        <div className="relative overflow-hidden py-2">
          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee hover:[animation-play-state:paused] w-max gap-4">
            {doubledPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 bg-white border border-gray-200/90 rounded-[16px] px-6 py-4 flex flex-col items-center justify-center min-w-[180px] h-[86px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(214,31,38,0.12)] hover:border-[#D61F26]/40 transition-all duration-300"
              >
                <span
                  className="text-[14px] font-extrabold text-[#222222] text-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {partner.name}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                  {partner.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
