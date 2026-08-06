import { useState } from 'react';
import {
  HardHat,
  Palette,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Building,
  Ruler,
  Layers,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Clock,
  Send,
  Home,
  Check,
  Award,
  ChevronRight
} from 'lucide-react';
import { Lead } from '../../types';

interface ConstructionPageProps {
  onAddLead?: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
}

// Portfolio Image Items
const portfolioGallery = [
  {
    id: 'cg-1',
    category: 'Construction',
    title: 'Luxury 4BHK Turnkey Villa Construction',
    location: 'Vijay Nagar, Indore',
    area: '3,200 sq.ft',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1200&q=80',
    tag: 'Structural Civil'
  },
  {
    id: 'cg-2',
    category: 'Interior',
    title: 'Modern Italian Marble Living Room Interior',
    location: 'Super Corridor, Indore',
    area: '1,800 sq.ft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    tag: 'Living Room'
  },
  {
    id: 'cg-3',
    category: 'Interior',
    title: 'High-Gloss Modular Kitchen with Quartz Counter',
    location: 'Saket Nagar, Indore',
    area: '250 sq.ft',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    tag: 'Modular Kitchen'
  },
  {
    id: 'cg-4',
    category: 'Construction',
    title: 'Multi-Storey Commercial Glass Facade Building',
    location: 'Palasia, Indore',
    area: '12,500 sq.ft',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    tag: 'Commercial Structure'
  },
  {
    id: 'cg-5',
    category: 'Interior',
    title: 'Executive Corporate Office Workstations & Cabins',
    location: 'Vijay Nagar, Indore',
    area: '2,400 sq.ft',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    tag: 'Office Interior'
  },
  {
    id: 'cg-6',
    category: 'Interior',
    title: 'Warm Wooden Accent Bedroom Suite & Cove Lighting',
    location: 'MG Road, Indore',
    area: '450 sq.ft',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
    tag: 'Bedroom Interior'
  },
  {
    id: 'cg-7',
    category: 'Construction',
    title: 'RCC Frame Work & Quality Foundation Testing',
    location: 'Rau, Indore',
    area: '2,500 sq.ft',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
    tag: 'Civil Work'
  },
  {
    id: 'cg-8',
    category: 'Interior',
    title: 'Contemporary Dining & Designer False Ceiling',
    location: 'Bhopal',
    area: '1,200 sq.ft',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
    tag: 'False Ceiling'
  }
];

// Construction Packages
const constructionPackages = [
  {
    name: 'Basic Civil Package',
    pricePerSqFt: 1650,
    recommendedFor: 'Budget Individual Homes & Rental Floors',
    steel: 'Fe-500 Grade Steel (Tata Tiscon / Jindal Panther)',
    cement: 'UltraTech / ACC 53 Grade',
    flooring: 'Vitrified Tiles (2x2 ft - Somany/Kajaria)',
    fittings: 'Cera / Parryware Sanitaryware & CP Fittings',
    doors: 'Flush Doors with Teak Wood Frames',
    wiring: 'Finolex / Havells Fire-Resistant Wires',
    warranty: '5 Years Structural Warranty'
  },
  {
    name: 'Premium Deluxe Package',
    pricePerSqFt: 2150,
    isPopular: true,
    recommendedFor: 'Modern Independent Villas & Duplexes',
    steel: 'Fe-550D High Ductile Corrosion Resistant Steel',
    cement: 'UltraTech Super / Ambuja Power',
    flooring: 'Vitrified Premium Double Charged Tiles (4x2 ft)',
    fittings: 'Jaquar / Kohler Premium CP & Sanitary',
    doors: 'Teak Wood Main Door + Designer Flush Doors',
    wiring: 'Havells / Polycab Concealed Copper Wiring',
    warranty: '10 Years Structural Warranty'
  },
  {
    name: 'Ultra Luxury Package',
    pricePerSqFt: 2850,
    recommendedFor: 'High-End Luxury Bungalows & Mansions',
    steel: 'Tata Tiscon Super Ductile TMT',
    cement: 'UltraTech Weather Plus / ACC Concrete',
    flooring: 'Italian Marble / Premium Imported Quartz',
    fittings: 'Grohe / Kohler Touchless Smart Fittings',
    doors: 'Solid Teak Wood Doors & Smart Electronic Locks',
    wiring: 'Schneider / Legrand Smart Home Automation Ready',
    warranty: '15 Years Structural Warranty'
  }
];

// Interior Design Packages
const interiorPackages = [
  {
    name: 'Essential Interior',
    pricePerSqFt: 750,
    features: [
      'Modular Kitchen with MDF/HDF Shutters',
      'Bedroom Wardrobes with Commercial Ply & Laminate',
      'Basic POP False Ceiling with LED Downlights',
      'Emulsion Wall Paint & Accent Feature Wall',
      'Standard SS Handles & Soft-Close Hinges'
    ]
  },
  {
    name: 'Deluxe Interior',
    pricePerSqFt: 1250,
    isPopular: true,
    features: [
      'BWP Grade Waterproof Marine Ply Modular Kitchen',
      'High-Gloss Acrylic & PU Polish Wardrobes',
      'Designer Gypsum Board False Ceiling with Profile Lights',
      'Royale Luxury Emulsion Paint + Texture/Wallpaper',
      'Hettich / Hafele Soft-Close Hardware & Accessories',
      'Custom TV Unit, Crockery Unit & Shoe Rack'
    ]
  },
  {
    name: 'Royal Villa Interior',
    pricePerSqFt: 1850,
    features: [
      'Imported Quartz Countertop & Quartz Sink Kitchen',
      'Veneer & PU Lacquer Polish Wardrobes with Glass Doors',
      'Architectural Profile Lighting & Smart Automation Controls',
      'Italian Marble Feature Walls & Wall Paneling',
      'Blum Premium Soft-Touch Hardware Systems',
      'Customized Designer Sofas, Beds, Dining & Curtains'
    ]
  }
];

export default function ConstructionPage({ onAddLead }: ConstructionPageProps) {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'ESTIMATOR' | 'PACKAGES' | 'PORTFOLIO'>('SERVICES');
  const [galleryCategory, setGalleryCategory] = useState<'ALL' | 'Construction' | 'Interior'>('ALL');

  // Estimator State
  const [calcType, setCalcType] = useState<'CONSTRUCTION' | 'INTERIOR'>('CONSTRUCTION');
  const [builtArea, setBuiltArea] = useState<number>(1800);
  const [selectedQuality, setSelectedQuality] = useState<number>(2150);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Indore',
    serviceType: 'Turnkey Construction & Interior',
    area: '1800',
    budget: '₹30 Lakhs - ₹50 Lakhs',
    message: ''
  });

  const estimatedTotal = builtArea * selectedQuality;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (onAddLead) {
      onAddLead({
        name: formData.name,
        email: 'client@construction.in',
        phone: formData.phone,
        leadType: 'CONSTRUCTION_INQUIRY',
        source: 'Construction & Interior Page',
        message: `Service: ${formData.serviceType} | Area: ${formData.area} sq.ft | City: ${formData.city} | Budget: ${formData.budget} | Note: ${formData.message}`
      });
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        city: 'Indore',
        serviceType: 'Turnkey Construction & Interior',
        area: '1800',
        budget: '₹30 Lakhs - ₹50 Lakhs',
        message: ''
      });
    }, 4000);
  };

  const filteredGallery = galleryCategory === 'ALL'
    ? portfolioGallery
    : portfolioGallery.filter((item) => item.category === galleryCategory);

  return (
    <div className="pt-[72px] pb-16 min-h-screen bg-[#F8F9FA]">
      
      {/* Hero Banner */}
      <div className="bg-[#111111] text-white py-14 lg:py-20 px-4 relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1600&q=80')] bg-cover bg-center opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />

        <div className="max-w-[1320px] mx-auto px-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D61F26]/20 border border-[#D61F26]/50 text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <HardHat className="w-4 h-4 text-[#D61F26]" />
            <span>Turnkey Civil Construction & Interior Architecture</span>
          </div>

          <h1
            className="text-[32px] sm:text-[46px] lg:text-[52px] font-extrabold text-white tracking-tight leading-tight max-w-[900px]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Build Your Dream Home & Premium Interior Spaces
          </h1>

          <p className="text-gray-300 text-[15px] sm:text-[17px] mt-3 max-w-[720px] leading-relaxed">
            From structural foundation & civil engineering to high-end modular interior design. 100% transparent pricing, 3D architectural renderings, quality material testing & 10-year warranty.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 text-white">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-[24px] sm:text-[28px] font-extrabold text-[#D61F26]">180+</div>
              <div className="text-[12px] text-gray-300 font-semibold">Completed Projects</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-[24px] sm:text-[28px] font-extrabold text-[#D61F26]">100%</div>
              <div className="text-[12px] text-gray-300 font-semibold">On-Time Delivery</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-[24px] sm:text-[28px] font-extrabold text-[#D61F26]">10 Years</div>
              <div className="text-[12px] text-gray-300 font-semibold">Structural Warranty</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-[24px] sm:text-[28px] font-extrabold text-[#D61F26]">0% Penalty</div>
              <div className="text-[12px] text-gray-300 font-semibold">Guaranteed Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-[22px] p-2 sm:p-3 shadow-xl border border-gray-200/90 flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {[
            { id: 'SERVICES', label: 'Services Overview', icon: Layers },
            { id: 'ESTIMATOR', label: 'Cost Estimator Calculator', icon: Calculator },
            { id: 'PACKAGES', label: 'Pricing Packages', icon: Award },
            { id: 'PORTFOLIO', label: 'Portfolio Gallery', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[13.5px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D61F26] text-white shadow-md shadow-red-900/20 scale-102'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D61F26]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-10">

        {/* TAB 1: SERVICES OVERVIEW */}
        {activeTab === 'SERVICES' && (
          <div className="space-y-16">
            
            {/* SECTION A: CONSTRUCTION SERVICES */}
            <div>
              <div className="flex items-center gap-2 text-[#D61F26] text-xs font-bold uppercase tracking-widest mb-2">
                <HardHat className="w-4 h-4" />
                <span>Civil Engineering & Construction</span>
              </div>
              <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#222222] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                End-to-End Civil & Structural Construction Services
              </h2>
              <p className="text-gray-600 text-[14.5px] max-w-[800px] mb-8">
                We handle every stage of construction—from soil testing, structural layout design, foundation work, brickwork plaster, to elevation, waterproofing & final handover.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-red-50 text-[#D61F26] rounded-xl flex items-center justify-center mb-4">
                    <Home className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Turnkey House & Villa Construction
                  </h3>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">
                    Complete house construction from ground floor to multi-storey duplexes with certified architectural plans, 3D elevation, structural engineers, and high-quality material management.
                  </p>
                  <ul className="space-y-2 text-[12.5px] font-semibold text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> RERA & Municipal Plan Approvals</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Tata TMT & UltraTech Grade Cement</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Daily Site Progress Photo/Video Updates</li>
                  </ul>
                </div>

                <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-red-50 text-[#D61F26] rounded-xl flex items-center justify-center mb-4">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Commercial & Industrial Contracting
                  </h3>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">
                    Construction of corporate office buildings, retail showrooms, hospitals, schools, and heavy-duty industrial warehouses with specialized RCC flooring and fire safety standards.
                  </p>
                  <ul className="space-y-2 text-[12.5px] font-semibold text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Glass Facade & ACP Cladding Work</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Heavy Load Structural Design</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Firefighting & HVAC Pre-Installation</li>
                  </ul>
                </div>

                <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-red-50 text-[#D61F26] rounded-xl flex items-center justify-center mb-4">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Architectural 3D Design & Renovation
                  </h3>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">
                    Complete building makeover, structural floor additions, elevation remodeling, waterproofing treatment, and Vastu-compliant architectural floor plan drafting.
                  </p>
                  <ul className="space-y-2 text-[12.5px] font-semibold text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Photo-Realistic 3D Elevation Views</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Structural Renovation & Strengthening</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D61F26]" /> Anti-Dampness Chemical Treatment</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* SECTION B: INTERIOR DESIGN SERVICES */}
            <div className="pt-10 border-t border-gray-200">
              <div className="flex items-center gap-2 text-[#D61F26] text-xs font-bold uppercase tracking-widest mb-2">
                <Palette className="w-4 h-4" />
                <span>Interior Architecture & Space Planning</span>
              </div>
              <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#222222] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Bespoke Interior Design & Custom Furnishing
              </h2>
              <p className="text-gray-600 text-[14.5px] max-w-[800px] mb-8">
                Transform interior spaces into stunning functional art with personalized mood boards, 3D VR walkthroughs, custom furniture manufacturing, and premium lighting execution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm group">
                  <div className="h-[180px] overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                      alt="Living Room Interior"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      Living & Dining
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Luxury Living Room Interiors
                    </h3>
                    <p className="text-[12.5px] text-gray-600 leading-relaxed mb-3">
                      Italian marble flooring, custom TV backdrops, wooden fluted louvers, ambient cove lighting, and luxury couch styling.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm group">
                  <div className="h-[180px] overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
                      alt="Modular Kitchen Interior"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      Modular Kitchen
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Modular Kitchens & Islands
                    </h3>
                    <p className="text-[12.5px] text-gray-600 leading-relaxed mb-3">
                      BWP marine ply, acrylic & PU finishes, Blum soft-close tandem drawers, quartz countertops, and built-in appliances.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm group">
                  <div className="h-[180px] overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                      alt="Bedroom Wardrobe Interior"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      Bedroom Suites
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Master Bedrooms & Wardrobes
                    </h3>
                    <p className="text-[12.5px] text-gray-600 leading-relaxed mb-3">
                      Floor-to-ceiling glass sliding wardrobes, cushioned headboards, study nooks, and warm ambient profile illumination.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm group">
                  <div className="h-[180px] overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                      alt="Office Fitout Interior"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      Commercial Office
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Corporate Workspaces & Stores
                    </h3>
                    <p className="text-[12.5px] text-gray-600 leading-relaxed mb-3">
                      Ergonomic workstations, soundproof glass boardrooms, reception desks, and branded high-street retail interiors.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COST ESTIMATOR CALCULATOR */}
        {activeTab === 'ESTIMATOR' && (
          <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-gray-200 shadow-xl max-w-[1000px] mx-auto">
            <div className="text-center max-w-[650px] mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#D61F26] px-3.5 py-1 rounded-full text-xs font-bold mb-2">
                <Calculator className="w-4 h-4" />
                <span>Instant Cost Calculator</span>
              </div>
              <h2 className="text-[26px] sm:text-[34px] font-extrabold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Estimate Your Construction & Interior Budget
              </h2>
              <p className="text-gray-500 text-[14px] mt-1">
                Select your project type, adjust the plot or built-up area in sq.ft, choose quality tier, and get an immediate breakdown.
              </p>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <button
                onClick={() => {
                  setCalcType('CONSTRUCTION');
                  setSelectedQuality(2150);
                }}
                className={`px-6 py-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  calcType === 'CONSTRUCTION'
                    ? 'bg-[#D61F26] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <HardHat className="w-4 h-4" />
                <span>Civil Construction Cost</span>
              </button>
              <button
                onClick={() => {
                  setCalcType('INTERIOR');
                  setSelectedQuality(1250);
                }}
                className={`px-6 py-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  calcType === 'INTERIOR'
                    ? 'bg-[#D61F26] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Interior Design Cost</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 sm:p-8 rounded-[20px] border border-gray-200">
              {/* Controls Left */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[13.5px] font-bold text-gray-800 mb-2">
                    Enter Total Built-Up Area (in Sq. Ft.):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={builtArea}
                      onChange={(e) => setBuiltArea(Math.max(100, Number(e.target.value)))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[16px] font-bold text-gray-900 focus:border-[#D61F26] focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12.5px] font-bold text-gray-400">
                      sq.ft
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="10000"
                    step="100"
                    value={builtArea}
                    onChange={(e) => setBuiltArea(Number(e.target.value))}
                    className="w-full mt-3 accent-[#D61F26] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[13.5px] font-bold text-gray-800 mb-2">
                    Select Quality Package:
                  </label>
                  {calcType === 'CONSTRUCTION' ? (
                    <div className="space-y-2">
                      {[
                        { rate: 1650, label: 'Basic Package (₹1,650 / sq.ft)' },
                        { rate: 2150, label: 'Premium Deluxe (₹2,150 / sq.ft)' },
                        { rate: 2850, label: 'Ultra Luxury (₹2,850 / sq.ft)' },
                      ].map((pkg) => (
                        <button
                          key={pkg.rate}
                          onClick={() => setSelectedQuality(pkg.rate)}
                          className={`w-full text-left p-3.5 rounded-xl border text-[13.5px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                            selectedQuality === pkg.rate
                              ? 'bg-red-50/80 border-[#D61F26] text-[#D61F26]'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span>{pkg.label}</span>
                          {selectedQuality === pkg.rate && <CheckCircle2 className="w-4 h-4 text-[#D61F26]" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[
                        { rate: 750, label: 'Essential Interior (₹750 / sq.ft)' },
                        { rate: 1250, label: 'Deluxe Interior (₹1,250 / sq.ft)' },
                        { rate: 1850, label: 'Royal Villa Interior (₹1,850 / sq.ft)' },
                      ].map((pkg) => (
                        <button
                          key={pkg.rate}
                          onClick={() => setSelectedQuality(pkg.rate)}
                          className={`w-full text-left p-3.5 rounded-xl border text-[13.5px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                            selectedQuality === pkg.rate
                              ? 'bg-red-50/80 border-[#D61F26] text-[#D61F26]'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span>{pkg.label}</span>
                          {selectedQuality === pkg.rate && <CheckCircle2 className="w-4 h-4 text-[#D61F26]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Calculation Summary Right */}
              <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-[20px] shadow-lg flex flex-col justify-between h-full border border-gray-800">
                <div>
                  <div className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Estimated Investment Cost
                  </div>
                  <div className="text-[32px] sm:text-[38px] font-extrabold text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₹{(estimatedTotal / 100000).toFixed(2)} Lakhs
                  </div>
                  <div className="text-[13px] text-gray-300 font-medium mb-6">
                    Exact total: ₹{estimatedTotal.toLocaleString('en-IN')} (incl. materials & labor)
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/10 text-[12.5px] text-gray-300">
                    <div className="flex justify-between">
                      <span>Area Considered:</span>
                      <span className="font-bold text-white">{builtArea} sq.ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applied Quality Rate:</span>
                      <span className="font-bold text-white">₹{selectedQuality} / sq.ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Timeline:</span>
                      <span className="font-bold text-white">
                        {calcType === 'CONSTRUCTION' ? '6 to 9 Months' : '30 to 45 Days'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Architect 3D Renderings:</span>
                      <span className="font-bold text-emerald-400">INCLUDED FREE</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#quote-form"
                  className="mt-6 bg-[#D61F26] hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-center text-[13.5px] transition-all flex items-center justify-center gap-2"
                >
                  <span>Request Detailed Itemized BOQ</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING PACKAGES */}
        {activeTab === 'PACKAGES' && (
          <div className="space-y-14">
            
            {/* Construction Packages Grid */}
            <div>
              <div className="text-center max-w-[600px] mx-auto mb-8">
                <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Transparent Civil Construction Packages
                </h2>
                <p className="text-gray-500 text-[14px]">
                  Fixed per sq.ft rate with complete transparency on steel brands, cement grades, and sanitaryware.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {constructionPackages.map((pkg, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-[22px] p-6 border flex flex-col justify-between transition-all duration-300 relative ${
                      pkg.isPopular
                        ? 'border-[#D61F26] shadow-xl ring-2 ring-[#D61F26]/20'
                        : 'border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D61F26] text-white text-[10.5px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        Most Popular Choice
                      </span>
                    )}

                    <div>
                      <h3 className="text-[19px] font-bold text-[#222222] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {pkg.name}
                      </h3>
                      <p className="text-[12px] text-gray-500 mb-4">{pkg.recommendedFor}</p>

                      <div className="text-[28px] font-extrabold text-[#D61F26] mb-6 pb-4 border-b border-gray-100">
                        ₹{pkg.pricePerSqFt.toLocaleString('en-IN')}{' '}
                        <span className="text-[13px] font-medium text-gray-500">/ sq.ft</span>
                      </div>

                      <div className="space-y-3 text-[12.5px] text-gray-700">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D61F26] flex-shrink-0 mt-0.5" />
                          <span><strong>Steel:</strong> {pkg.steel}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D61F26] flex-shrink-0 mt-0.5" />
                          <span><strong>Cement:</strong> {pkg.cement}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D61F26] flex-shrink-0 mt-0.5" />
                          <span><strong>Flooring:</strong> {pkg.flooring}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D61F26] flex-shrink-0 mt-0.5" />
                          <span><strong>Fittings:</strong> {pkg.fittings}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D61F26] flex-shrink-0 mt-0.5" />
                          <span><strong>Wiring:</strong> {pkg.wiring}</span>
                        </div>
                        <div className="flex items-start gap-2 pt-2 text-[#D61F26] font-bold">
                          <Award className="w-4 h-4 flex-shrink-0" />
                          <span>{pkg.warranty}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href="#quote-form"
                      className="mt-8 bg-gray-900 hover:bg-[#D61F26] text-white font-bold py-3 px-4 rounded-xl text-center text-[13px] transition-colors"
                    >
                      Book Free Site Inspection
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Interior Packages Grid */}
            <div className="pt-10 border-t border-gray-200">
              <div className="text-center max-w-[600px] mx-auto mb-8">
                <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Interior Architecture Packages
                </h2>
                <p className="text-gray-500 text-[14px]">
                  Turnkey modular interior packages customized for 2BHK, 3BHK, Villas & Commercial Offices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {interiorPackages.map((pkg, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[22px] p-6 border border-gray-200 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-[19px] font-bold text-[#222222] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {pkg.name}
                      </h3>
                      <div className="text-[28px] font-extrabold text-[#D61F26] mb-6 pb-4 border-b border-gray-100">
                        ₹{pkg.pricePerSqFt.toLocaleString('en-IN')}{' '}
                        <span className="text-[13px] font-medium text-gray-500">/ sq.ft</span>
                      </div>

                      <div className="space-y-3 text-[12.5px] text-gray-700">
                        {pkg.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="#quote-form"
                      className="mt-8 bg-gray-900 hover:bg-[#D61F26] text-white font-bold py-3 px-4 rounded-xl text-center text-[13px] transition-colors"
                    >
                      Request Interior Mood Board
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PORTFOLIO GALLERY */}
        {activeTab === 'PORTFOLIO' && (
          <div className="space-y-8">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {[
                { id: 'ALL', label: 'All Projects Gallery' },
                { id: 'Construction', label: 'Civil Construction Sites' },
                { id: 'Interior', label: 'Interior Design Showcase' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setGalleryCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer transition-all ${
                    galleryCategory === cat.id
                      ? 'bg-[#D61F26] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-[210px] overflow-hidden relative bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      {item.tag}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14.5px] font-bold text-[#222222] line-clamp-2 mb-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11.5px] text-gray-500 font-semibold pt-2 border-t border-gray-100">
                      <span>{item.location}</span>
                      <span className="text-[#D61F26] font-bold">{item.area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: FREE SITE VISIT & INQUIRY FORM */}
        <div id="quote-form" className="mt-20 bg-white rounded-[26px] p-8 sm:p-12 border border-gray-200/90 shadow-xl max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#D61F26] px-3.5 py-1 rounded-full text-xs font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>Book Free Site Consultation</span>
              </div>

              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-[#222222] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Planning to Build or Renovate Your Property?
              </h2>

              <p className="text-gray-600 text-[14px] leading-relaxed">
                Connect directly with our senior civil structural engineers & interior architects. Get a complimentary 3D elevation preview and itemized cost estimate within 24 hours.
              </p>

              <div className="space-y-3 pt-2 text-[13.5px] font-semibold text-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#D61F26] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <span>Free Plot Inspection & Measurement</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#D61F26] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span>3D Architectural Floor Plan & Elevation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#D61F26] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span>Transparent Material BOQ & Bank Loan Assistance</span>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-gray-50 p-6 sm:p-8 rounded-[22px] border border-gray-200">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-[22px] font-bold text-gray-900">Inquiry Submitted Successfully!</h3>
                  <p className="text-[14px] text-gray-600 max-w-[400px] mx-auto">
                    Our Senior Construction Engineer will call you on <strong>{formData.phone}</strong> shortly to schedule a free site inspection.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  <h3 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Request Free Estimate & 3D Render
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Nilesh Sharma"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1">Select Required Service</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26] cursor-pointer"
                      >
                        <option>Turnkey Civil Construction & Interior</option>
                        <option>Civil Construction Only</option>
                        <option>Interior Design & Furnishing Only</option>
                        <option>Architectural 3D Elevation & Planning</option>
                        <option>Building Renovation & Remodeling</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1">Approx Plot / Built Area (Sq.Ft)</label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="e.g. 1500"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1">Project City / Location</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Vijay Nagar, Indore"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1">Estimated Budget Range</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26] cursor-pointer"
                      >
                        <option>Under ₹20 Lakhs</option>
                        <option>₹20 Lakhs - ₹35 Lakhs</option>
                        <option>₹35 Lakhs - ₹60 Lakhs</option>
                        <option>₹60 Lakhs - ₹1 Crore</option>
                        <option>Above ₹1 Crore</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1">Specific Requirements or Message</label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Looking to construct a 3-storey duplex with modern modular kitchen and Italian marble..."
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D61F26] hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-[14px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Get Free Consultation</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
