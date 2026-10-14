import React from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HardHat,
  Tv,
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (view: string) => void;
  onOpenListProperty?: () => void;
}

export default function AboutUsPage({ onNavigate, onOpenListProperty }: AboutUsPageProps) {
  const stats = [
    { value: '1,200+', label: 'Verified Properties', desc: 'Across Indore, Bhopal & Metro Corridors' },
    { value: '₹850+ Cr', label: 'Property Portfolio', desc: 'Handled with 100% legal clearance' },
    { value: '50,000+', label: 'Active Home Seekers', desc: 'Trusting our verified platform monthly' },
    { value: '100%', label: 'RERA Compliance', desc: 'Rigorous 3-tier legal document scrutiny' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Physically Verified',
      desc: 'Every villa, flat, plot, and commercial space is physically surveyed by our on-ground team before being published online.',
    },
    {
      icon: Tv,
      title: 'Media-First Transparency',
      desc: 'High-definition video walkthroughs, drone footage, and unbiased neighborhood analysis eliminate misleading listings.',
    },
    {
      icon: HardHat,
      title: 'Turnkey Construction & Interiors',
      desc: 'End-to-end architectural planning, structural construction, and luxury interior design backed by a 5-year guarantee.',
    },
    {
      icon: TrendingUp,
      title: 'PR & Real Estate Media Power',
      desc: 'National press release syndication, developer brand profiling, and investor roadshows that empower real estate visionaries.',
    },
  ];

  const values = [
    {
      title: 'Integrity & Zero Fake Ads',
      desc: 'No duplicate photos, expired prices, or phantom listings. What you see is available and legally verified.',
    },
    {
      title: 'Customer-First Advisory',
      desc: 'Our real estate consultants never pressure you. We provide market analytics, registry assistance, and fair price guidance.',
    },
    {
      title: 'Direct Developer Connect',
      desc: 'Zero middlemen hassle. Get transparent builder pricing, launch offers, and dedicated site-visit assistance.',
    },
    {
      title: 'Technological Excellence',
      desc: 'Seamless search, instant WhatsApp booking, and dynamic filter capabilities tailored for smart modern home buyers.',
    },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#111111]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 text-white overflow-hidden py-16 sm:py-24 border-b border-red-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D61F26_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#D61F26]/20 border border-[#D61F26]/40 text-red-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D61F26]" />
              About The Mars TV Platform
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Reinventing Real Estate Through <span className="text-[#D61F26]">Media & Trust</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
              The Mars TV is India’s foremost media-powered real estate ecosystem. Headquartered in Indore, Madhya Pradesh, we bridge the gap between discerning property buyers, visionary developers, and quality construction through 100% verified listings, video journalism, and transparent advisory.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('residential')}
                className="bg-[#D61F26] hover:bg-red-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Verified Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Contact Our Advisory</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1 text-center sm:text-left">
              <div
                className="text-2xl sm:text-4xl font-extrabold text-[#D61F26]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">{stat.label}</div>
              <div className="text-[11px] sm:text-xs text-gray-500 leading-snug">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission & Story */}
      <section className="max-w-[1320px] mx-auto px-4 lg:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D61F26] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              Our Story & Founding Vision
            </div>

            <h2
              className="text-2xl sm:text-4xl font-black text-gray-900 leading-snug"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Born to Eliminate Real Estate Uncertainty
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Finding a genuine dream home or commercial workspace in India has historically been fraught with misleading brokers, fake brochures, and opaque pricing.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              <strong className="text-gray-900">The Mars TV</strong> was founded with a singular mission: to bring institutional media standards to real estate. By integrating broadcast-grade digital video coverage, RERA legal audit, turnkey construction engineering, and national PR distribution under one roof, we empower buyers to purchase property with absolute certainty.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D61F26] flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  <strong>Strict RERA Auditing:</strong> Every listing is cross-checked with the MP RERA portal and regional master plans.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D61F26] flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  <strong>No Ghost Listings:</strong> Properties that are sold out or off-market are updated within 24 hours.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D61F26] flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  <strong>Transparent Direct Rates:</strong> Direct developer-approved rates with zero inflated quotes.
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="The Mars TV Modern Corporate Real Estate Tower"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Central India's Benchmark
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  101-104 The Mars TV Tower, Vijay Nagar Square
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Indore, Madhya Pradesh - The epicenter of Central India’s property revolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Pillars */}
      <section className="bg-white py-16 sm:py-20 border-y border-gray-200">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D61F26]">
              Our Foundation
            </span>
            <h2
              className="text-2xl sm:text-4xl font-black text-gray-900"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Why Discerning Investors Trust The Mars TV
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              We operate not as a mere classifieds aggregator, but as a full-service media production and certified real estate advisory house.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 hover:bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-[#D61F26]/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-100/80 group-hover:bg-[#D61F26] text-[#D61F26] group-hover:text-white flex items-center justify-center transition-colors mb-5 shadow-sm">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#D61F26] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="max-w-[1320px] mx-auto px-4 lg:px-6 py-16 sm:py-20">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-800">
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-400">
              Guiding Principles
            </span>
            <h2
              className="text-2xl sm:text-4xl font-black text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Our Operational Ethos
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Standard operating procedures designed to uphold client privacy, accuracy, and investment security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#D61F26] text-white flex items-center justify-center text-xs font-bold">
                    0{i + 1}
                  </div>
                  <h3 className="font-bold text-base text-white">{v.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-10">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Identity & RERA Info */}
      <section className="max-w-[1320px] mx-auto px-4 lg:px-6 pb-20">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D61F26]">
                Statutory & Compliance Disclosure
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                The Mars TV Media & Real Estate Platform
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Registered under the Companies Act and compliant with the Real Estate (Regulation and Development) Act (RERA). All property promotional materials conform to statutory regulatory disclosures.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">RERA Registration</span>
                  <span className="font-extrabold text-gray-900">MP/RERA/2024/0991</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Corporate Identity (CIN)</span>
                  <span className="font-extrabold text-gray-900">U70109MP2022PTC061234</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">GSTIN</span>
                  <span className="font-extrabold text-gray-900">23AABCP1234F1Z9</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Need Direct Real Estate Consultation?</h4>
              <p className="text-xs text-gray-600">
                Speak directly with our senior property advisors for project site visits or developer listing queries.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full bg-[#D61F26] hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Desk: +91 94074 04623</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
