import { useState, FormEvent } from 'react';
import { X, PlusCircle, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { Property, PropertyType, ListingType } from '../types';

interface ListPropertyModalProps {
  onClose: () => void;
  onAddProperty: (property: Partial<Property>) => void;
}

export default function ListPropertyModal({ onClose, onAddProperty }: ListPropertyModalProps) {
  const [title, setTitle] = useState('');
  const [listingType, setListingType] = useState<ListingType>('BUY');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [price, setPrice] = useState(12000000);
  const [priceLabel, setPriceLabel] = useState('₹1.20 Cr');
  const [city, setCity] = useState('Indore');
  const [location, setLocation] = useState('Vijay Nagar');
  const [area, setArea] = useState(1500);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !price || !location) return;

    const newProp: Partial<Property> = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || `${title} located in prime ${location}, ${city}. Excellent connectivity and top facilities.`,
      price: Number(price),
      priceLabel: priceLabel || `₹${(Number(price) / 100000).toFixed(2)} L`,
      location: `${location}, ${city}`,
      city,
      area: Number(area),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      parking: 1,
      propertyType,
      listingType,
      status: 'ACTIVE',
      isSponsored: false,
      isFeatured: true,
      isVerified: true,
      isReraReg: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', isPrimary: true, alt: title }
      ],
      amenities: ['24/7 Security', 'Car Parking', 'Power Backup', 'Water Supply'],
      createdAt: new Date().toISOString(),
    };

    onAddProperty(newProp);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[24px] max-w-[760px] w-full shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between sticky top-0 z-20 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D61F26] rounded-xl flex items-center justify-center shadow-md">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Post Property Free
              </h2>
              <p className="text-[12px] text-gray-400">List your flat, villa, plot or office on The Mars TV</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-[22px] font-extrabold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Property Published Successfully!
              </h3>
              <p className="text-[14px] text-gray-600 max-w-[440px] mx-auto">
                Your listing <strong>"{title}"</strong> is now live on The Mars TV! Verified buyers can inspect details and contact you.
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-[#D61F26] text-white font-bold px-8 py-3 rounded-xl shadow-md cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title & Listing Type */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Luxurious 3BHK Flat near Vijay Nagar Metro"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                  >
                    <option value="BUY">For Sale</option>
                    <option value="RENT">For Rent</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="VILLA">Villa</option>
                    <option value="PLOT">Plot</option>
                    <option value="OFFICE">Office Space</option>
                    <option value="RETAIL">Retail Shop</option>
                    <option value="PENTHOUSE">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      setPrice(num);
                      if (num >= 10000000) setPriceLabel(`₹${(num / 10000000).toFixed(2)} Cr`);
                      else setPriceLabel(`₹${(num / 100000).toFixed(2)} L`);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Price Label
                  </label>
                  <input
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              {/* City, Locality, Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Locality / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Area (Sq.Ft)
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              {/* BHK & Baths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Bedrooms (BHK)
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                    <option value={5}>5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Bathrooms
                  </label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4+</option>
                  </select>
                </div>
              </div>

              {/* Owner Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Seller / Agent Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-red-900/30"
              >
                Publish Property Listing Free
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
