import { useState, FormEvent } from 'react';
import { Property } from '../types';
import { X, MapPin, BedDouble, Car, Maximize2, ShieldCheck, Check, Phone, Mail, Calendar, Share2, Heart, Send } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSubmitLead: (lead: { name: string; phone: string; email: string; message: string; propertyTitle: string }) => void;
}

export default function PropertyDetailModal({
  property,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onSubmitLead,
}: PropertyDetailModalProps) {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Hi, I am interested in ${property.title} listed on The Mars TV. Please send more details.`);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmitLead({
      name,
      phone,
      email,
      message,
      propertyTitle: property.title,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-[24px] max-w-[1000px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#D61F26] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase">
              {property.listingType}
            </span>
            <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase">
              {property.propertyType}
            </span>
            {property.isVerified && (
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Listing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(property.id)}
              className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer"
              title="Save Property"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#D61F26] text-[#D61F26]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Main Gallery */}
          <div>
            <div className="relative h-[340px] sm:h-[440px] rounded-[20px] overflow-hidden bg-gray-100 shadow-inner">
              <img
                src={property.images[activeImageIndex]?.url || property.images[0]?.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg">
                Photo {activeImageIndex + 1} of {property.images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#D61F26] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Price */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <h1
                className="text-[24px] sm:text-[28px] font-extrabold text-[#222222] leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mt-2 text-[14px]">
                <MapPin className="w-4 h-4 text-[#D61F26] flex-shrink-0" />
                <span>{property.location}, {property.city}</span>
              </div>
            </div>

            <div className="text-left md:text-right bg-red-50/60 border border-red-100 p-4 rounded-2xl min-w-[200px]">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Target Valuation</span>
              <p className="text-[28px] font-black text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {property.priceLabel}
              </p>
              <span className="text-[12px] text-gray-500">
                ~ ₹{Math.round(property.price / property.area).toLocaleString('en-IN')}/sq.ft
              </span>
            </div>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
            <div className="p-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Bedrooms</span>
              <span className="text-[16px] font-extrabold text-gray-800 flex items-center justify-center gap-1.5 mt-0.5">
                <BedDouble className="w-4.5 h-4.5 text-[#D61F26]" />
                {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
              </span>
            </div>

            <div className="p-2 border-l border-gray-200">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Super Built-up Area</span>
              <span className="text-[16px] font-extrabold text-gray-800 flex items-center justify-center gap-1.5 mt-0.5">
                <Maximize2 className="w-4.5 h-4.5 text-[#D61F26]" />
                {property.area} {property.areaUnit || 'sq.ft'}
              </span>
            </div>

            <div className="p-2 border-l border-gray-200">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Parking Slots</span>
              <span className="text-[16px] font-extrabold text-gray-800 flex items-center justify-center gap-1.5 mt-0.5">
                <Car className="w-4.5 h-4.5 text-[#D61F26]" />
                {property.parking ?? 1} Dedicated
              </span>
            </div>

            <div className="p-2 border-l border-gray-200">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">RERA Status</span>
              <span className="text-[14px] font-extrabold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {property.isReraReg ? 'Registered' : 'Verified'}
              </span>
            </div>
          </div>

          {/* Details & Contact Form Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Description & Amenities Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Property Overview
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed font-normal">
                  {property.description}
                </p>
              </div>

              {/* Amenities List */}
              {property.amenities.length > 0 && (
                <div>
                  <h3 className="text-[18px] font-bold text-[#222222] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Amenities & Features
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {property.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-[13px] text-gray-700 font-medium">
                        <Check className="w-4 h-4 text-[#D61F26]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RERA Certificate Info */}
              {property.reraNumber && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-[14px] font-bold text-emerald-900">RERA Compliant Listing</h4>
                    <p className="text-[12px] text-emerald-700">Official RERA Registration Number: <strong>{property.reraNumber}</strong></p>
                  </div>
                </div>
              )}
            </div>

            {/* Inquire Form Column */}
            <div className="lg:col-span-5">
              <div className="bg-[#111111] text-white rounded-[22px] p-6 shadow-xl border border-gray-800">
                <h3 className="text-[18px] font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Book Site Visit & Inquiry
                </h3>
                <p className="text-[12.5px] text-gray-400 mb-5">
                  Direct connection with authorized The Mars TV sales partner.
                </p>

                {submitted ? (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-2">
                    <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-[16px] font-bold text-emerald-300">Inquiry Submitted!</h4>
                    <p className="text-[12.5px] text-emerald-200">
                      Our Senior Advisor will call you shortly at <strong>{phone}</strong>.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 text-xs text-emerald-400 underline font-semibold cursor-pointer"
                    >
                      Send another query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Verma"
                        className="w-full bg-white/10 border border-gray-700 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98260 00000"
                        className="w-full bg-white/10 border border-gray-700 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-white/10 border border-gray-700 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder-gray-500 focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Note / Query
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white/10 border border-gray-700 rounded-xl px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-[14px] py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-red-900/40 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Request Immediate Callback</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
