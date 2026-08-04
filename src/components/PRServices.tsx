import type { ComponentType } from 'react';
import { PRServiceItem } from '../types';
import { Newspaper, Tv, Globe, Shield, AlertCircle, Calendar, ArrowRight, Megaphone } from 'lucide-react';

interface PRServicesProps {
  services: PRServiceItem[];
  onSelectService: (service: PRServiceItem) => void;
  onViewAllServices: () => void;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Newspaper,
  Tv,
  Globe,
  Shield,
  AlertCircle,
  Calendar,
};

export default function PRServices({
  services,
  onSelectService,
  onViewAllServices,
}: PRServicesProps) {
  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2
              className="text-[22px] sm:text-[24px] font-extrabold text-[#222222] tracking-tight flex items-center gap-2.5"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Megaphone className="w-6 h-6 text-[#D61F26]" />
              REAL ESTATE PR SERVICES
            </h2>
            <span className="w-12 h-[3.5px] bg-[#D61F26] rounded-full block" />
          </div>

          <button
            onClick={onViewAllServices}
            className="text-[#D61F26] text-[13.5px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            All PR Solutions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Newspaper;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-white rounded-[18px] p-6 border border-gray-200/90 shadow-[0_4px_18px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(214,31,38,0.14)] hover:border-[#D61F26] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Red Soft Icon Container */}
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#D61F26] group-hover:bg-[#D61F26] group-hover:text-white transition-all duration-300 mb-4 shadow-sm">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3
                  className="text-[14px] font-bold text-[#222222] leading-snug group-hover:text-[#D61F26] transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {service.title}
                </h3>

                <p className="text-[11.5px] text-gray-500 mt-2 line-clamp-2 leading-relaxed hidden sm:block">
                  {service.description}
                </p>

                <div className="mt-3 text-[12px] font-bold text-[#D61F26] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Enquire</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
