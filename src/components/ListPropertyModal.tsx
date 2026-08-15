import { useState, FormEvent, ChangeEvent } from 'react';
import {
  X,
  PlusCircle,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Phone,
  Mail,
  User,
  Briefcase,
  Home,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  FileCheck,
  Trash2,
  Eye,
  Check,
  ArrowRight,
  Lock,
  Compass,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { Property, PropertyType, ListingType, PropertyStatus, UserRole } from '../types';
import { INDIA_LOCATION_DATA, INTERNATIONAL_LOCATION_DATA } from '../data/locationHierarchy';

interface ListPropertyModalProps {
  onClose: () => void;
  onAddProperty: (property: Partial<Property>) => void;
  onNavigateToAdmin?: () => void;
}

const AMENITY_OPTIONS = [
  { id: 'Lift / Elevators', label: 'High-Speed Lift / Elevators', icon: '🛗' },
  { id: '24/7 Security & CCTV', label: '24/7 Security & CCTV Surveillance', icon: '🛡️' },
  { id: '100% Power Backup', label: '100% Power Backup (Full DG)', icon: '⚡' },
  { id: 'Reserved Covered Parking', label: 'Reserved Covered Car Parking', icon: '🚗' },
  { id: 'Modern Gymnasium', label: 'Modern Fitness Gym & Yoga Studio', icon: '🏋️' },
  { id: 'Swimming Pool', label: 'Swimming Pool & Kids Splash Deck', icon: '🏊' },
  { id: 'Landscaped Garden / Park', label: 'Landscaped Park & Walking Track', icon: '🌳' },
  { id: 'Smart Home Automation', label: 'Smart Home Automation & Video Door Phone', icon: '🏠' },
  { id: 'Fire Fighting Systems', label: 'Certified Fire Fighting Safety System', icon: '🧯' },
  { id: 'Grand Clubhouse', label: 'Grand Clubhouse & Banquet Hall', icon: '🏛️' },
  { id: 'EV Charging Station', label: 'Dedicated EV Vehicle Charging Bay', icon: '🔌' },
  { id: '24/7 Water Supply', label: '24/7 Water & Rainwater Harvesting', icon: '💧' },
];

const PRESET_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', label: 'Luxury Villa Exterior' },
  { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', label: 'Modern High-Rise Living' },
  { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', label: 'Apartment Tower' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', label: 'Grade-A Commercial Office' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', label: 'Architectural Mansion' },
  { url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80', label: 'Urban Penthouse' },
];

export default function ListPropertyModal({
  onClose,
  onAddProperty,
  onNavigateToAdmin,
}: ListPropertyModalProps) {
  // 1. User Role
  const [userRole, setUserRole] = useState<UserRole>('DEVELOPER');

  // 2. Basic Information
  const [title, setTitle] = useState('');
  const [listingType, setListingType] = useState<ListingType>('BUY');
  const [propertyCategory, setPropertyCategory] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [subCategory, setSubCategory] = useState('Luxury Apartment');

  // 3. Location Details
  const [selectedCity, setSelectedCity] = useState('Indore');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [coordinates, setCoordinates] = useState('22.7196° N, 75.8577° E (Central Prime)');

  // 4. Specifications & Pricing
  const [configuration, setConfiguration] = useState('3 BHK');
  const [area, setArea] = useState<number | ''>(1650);
  const [areaUnit, setAreaUnit] = useState<'sq.ft' | 'sq.yards' | 'acres'>('sq.ft');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [parking, setParking] = useState(1);
  const [price, setPrice] = useState<number | ''>(14500000);
  const [pricePerSqFt, setPricePerSqFt] = useState<number | ''>(8787);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number | ''>(3500);
  const [possessionStatus, setPossessionStatus] = useState<'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'NEW_LAUNCH'>('READY_TO_MOVE');
  const [possessionDate, setPossessionDate] = useState('Immediate / Ready');

  // 5. RERA & Legal Compliance
  const [reraNumber, setReraNumber] = useState('P-IND-26-4891');
  const [isReraVerified, setIsReraVerified] = useState(true);
  const [approvalAuthority, setApprovalAuthority] = useState('Town & Country Planning (T&CP) & IMC Approved');
  const [uploadedProofName, setUploadedProofName] = useState<string>('Sanctioned_Building_Plan_and_Registry.pdf');

  // 6. Media & Amenities
  const [selectedImages, setSelectedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift / Elevators',
    '24/7 Security & CCTV',
    '100% Power Backup',
    'Reserved Covered Parking',
    'Modern Gymnasium',
    'Grand Clubhouse',
  ]);
  const [description, setDescription] = useState('');

  // 7. Contact Details & OTP Simulation
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Submission State
  const [submittedSubmissionId, setSubmittedSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto calculate price per sq ft
  const handlePriceChange = (val: number | '') => {
    setPrice(val);
    if (val && typeof val === 'number' && area && typeof area === 'number' && area > 0) {
      setPricePerSqFt(Math.round(val / area));
    }
  };

  const handleAreaChange = (val: number | '') => {
    setArea(val);
    if (price && typeof price === 'number' && val && typeof val === 'number' && val > 0) {
      setPricePerSqFt(Math.round(price / val));
    }
  };

  // Helper for dynamic price label
  const getFormattedPriceLabel = (num: number | ''): string => {
    if (!num || typeof num !== 'number') return '₹ 0';
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(2)} L`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  // Toggle Amenity
  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId]
    );
  };

  // Toggle Image
  const handleAddCustomImage = () => {
    if (!customImageUrl.trim()) return;
    setSelectedImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSelectPresetImage = (url: string) => {
    if (selectedImages.includes(url)) {
      setSelectedImages((prev) => prev.filter((u) => u !== url));
    } else {
      setSelectedImages((prev) => [...prev, url]);
    }
  };

  // Simulate OTP Flow
  const handleSendOtp = () => {
    if (!contactPhone || contactPhone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setOtpError('');
    setOtpSent(true);
    setOtpCode('4829'); // Auto simulated hint for effortless verification
  };

  const handleVerifyOtp = () => {
    if (otpCode === '4829' || otpCode.length === 4) {
      setIsPhoneVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please enter 4829 or click Resend.');
    }
  };

  // File upload simulation
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedProofName(file.name);
    }
  };

  // Form Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a descriptive Property Title.');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      alert('Please enter Contact Person Name and Phone Number.');
      return;
    }

    setIsSubmitting(true);

    const submissionRefId = `MARS-PROP-${Math.floor(10000 + Math.random() * 90000)}`;

    const priceValue = typeof price === 'number' ? price : 10000000;
    const priceLabel = getFormattedPriceLabel(priceValue);

    const newProp: Partial<Property> = {
      id: `prop-${Date.now()}`,
      submissionId: submissionRefId,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description:
        description.trim() ||
        `${title} offered by ${agencyName || contactName}. Situated at prime ${locality || 'Sector'}, ${selectedCity}. Features ${configuration}, ${area || 1500} ${areaUnit} built-up space with ${selectedAmenities.length} modern amenities.`,
      price: priceValue,
      priceLabel,
      location: `${locality ? `${locality}, ` : ''}${selectedCity}`,
      city: selectedCity,
      locality: locality || 'Prime Zone',
      address: address || `${locality}, ${selectedCity}`,
      pincode: pincode || '452010',
      coordinates,
      area: typeof area === 'number' ? area : 1500,
      areaUnit,
      configuration,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 2,
      parking: Number(parking) || 1,
      pricePerSqFt: typeof pricePerSqFt === 'number' ? pricePerSqFt : 8500,
      maintenanceCharges: typeof maintenanceCharges === 'number' ? maintenanceCharges : 3000,
      possessionStatus,
      possessionDate,
      propertyType,
      subCategory,
      listingType,
      status: 'PENDING_APPROVAL' as PropertyStatus, // Directly routed into Admin Portal for review
      isSponsored: false,
      isFeatured: false,
      isVerified: false,
      isReraReg: Boolean(reraNumber),
      reraNumber,
      approvalAuthority,
      ownershipProofDoc: uploadedProofName,
      userRole,
      contactName,
      contactPhone,
      contactEmail,
      agencyName: agencyName || (userRole === 'OWNER' ? 'Direct Owner' : 'Verified Partner'),
      isPhoneVerified: isPhoneVerified || true,
      images:
        selectedImages.length > 0
          ? selectedImages.map((url, i) => ({ url, alt: title, isPrimary: i === 0 }))
          : [
              {
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                alt: title,
                isPrimary: true,
              },
            ],
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ['24/7 Security', 'Covered Parking', 'Lift'],
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onAddProperty(newProp);
      setIsSubmitting(false);
      setSubmittedSubmissionId(submissionRefId);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[24px] max-w-[960px] w-full shadow-2xl relative border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#111111] text-white px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D61F26] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] sm:text-[20px] font-extrabold text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  List Your Property on The Mars TV
                </h2>
                <span className="bg-[#D61F26] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider hidden sm:inline-block">
                  Verified Portal
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12.5px] text-gray-400">
                Reach verified high-intent buyers, NRI investors & commercial clients
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-grow space-y-8 bg-[#FAFAFA]">
          {submittedSubmissionId ? (
            /* Submission Success State */
            <div className="py-10 text-center space-y-6 max-w-[620px] mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <FileCheck className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-300">
                  Status: Pending Admin Approval
                </span>
                <h3 className="text-[24px] font-extrabold text-[#111111]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Listing Submitted for Verification!
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Thank you, <strong>{contactName || 'Valued Partner'}</strong>. Your property <strong>"{title}"</strong> has been successfully registered under Submission Reference:
                </p>
                <div className="mt-3 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl inline-block font-mono font-bold text-base text-[#D61F26]">
                  {submittedSubmissionId}
                </div>
              </div>

              {/* Verification Info Card */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>The Mars TV Verification Protocol</span>
                </div>
                <p className="leading-relaxed text-gray-700">
                  Our compliance desk will verify the RERA registration (<code>{reraNumber || 'Verified ID'}</code>) and ownership documentation within <strong>24–48 hours</strong>. You can inspect this listing in the <strong>Admin Control Portal</strong> under Pending Approvals.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    window.location.hash = '#/admin-secret';
                    if (onNavigateToAdmin) onNavigateToAdmin();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>View in Admin Portal (`/admin-secret`)</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Done & Back to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: USER ROLE SELECTION */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      Select Your Listing Role
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 1 of 8</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {[
                    {
                      id: 'DEVELOPER' as UserRole,
                      title: 'Real Estate Developer / Builder',
                      desc: 'Township, high-rise tower, or commercial project builder',
                      icon: Building2,
                    },
                    {
                      id: 'BROKER' as UserRole,
                      title: 'Licensed Broker / Channel Partner',
                      desc: 'RERA-registered agent listing certified inventory',
                      icon: Briefcase,
                    },
                    {
                      id: 'OWNER' as UserRole,
                      title: 'Individual Property Owner',
                      desc: 'Direct owner selling, renting or leasing personal property',
                      icon: User,
                    },
                  ].map((role) => {
                    const isSelected = userRole === role.id;
                    const IconComp = role.icon;
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => setUserRole(role.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#D61F26] bg-red-50/50 shadow-sm ring-1 ring-[#D61F26]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-2.5 rounded-xl ${
                              isSelected ? 'bg-[#D61F26] text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <input
                            type="radio"
                            name="userRole"
                            checked={isSelected}
                            onChange={() => setUserRole(role.id)}
                            className="text-[#D61F26] focus:ring-[#D61F26] h-4 w-4"
                          />
                        </div>
                        <div className="mt-3">
                          <h4 className="font-bold text-[13.5px] text-gray-900">{role.title}</h4>
                          <p className="text-[11.5px] text-gray-500 mt-1 leading-snug">{role.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* SECTION 2: BASIC PROPERTY INFORMATION */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      Basic Property Information
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 2 of 8</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Property Catchy Headline / Title <span className="text-[#D61F26]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Ultra-Luxury 3 BHK Penthouse with Private Terrace & Panoramic City View"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[13.5px] font-medium focus:outline-none focus:border-[#D61F26] focus:ring-1 focus:ring-[#D61F26] bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Listing Type */}
                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Listing Purpose <span className="text-[#D61F26]">*</span>
                      </label>
                      <select
                        value={listingType}
                        onChange={(e) => setListingType(e.target.value as ListingType)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                      >
                        <option value="BUY">For Sale (Direct Purchase)</option>
                        <option value="RENT">For Rent</option>
                        <option value="LEASE">For Long-Term Lease</option>
                        <option value="COMMERCIAL">Commercial Investment</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Category <span className="text-[#D61F26]">*</span>
                      </label>
                      <select
                        value={propertyCategory}
                        onChange={(e) => {
                          const cat = e.target.value as 'RESIDENTIAL' | 'COMMERCIAL';
                          setPropertyCategory(cat);
                          setPropertyType(cat === 'RESIDENTIAL' ? 'APARTMENT' : 'OFFICE');
                        }}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                      >
                        <option value="RESIDENTIAL">Residential Property</option>
                        <option value="COMMERCIAL">Commercial Property</option>
                      </select>
                    </div>

                    {/* Sub-Category / Type */}
                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Sub-Category Type <span className="text-[#D61F26]">*</span>
                      </label>
                      {propertyCategory === 'RESIDENTIAL' ? (
                        <select
                          value={propertyType}
                          onChange={(e) => {
                            const val = e.target.value as PropertyType;
                            setPropertyType(val);
                            setSubCategory(e.target.options[e.target.selectedIndex].text);
                          }}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                        >
                          <option value="APARTMENT">Apartment / High-rise Flat</option>
                          <option value="VILLA">Independent Villa / House</option>
                          <option value="PLOT">Residential Plot / Gated Land</option>
                          <option value="BUILDER_FLOOR">Builder Floor</option>
                          <option value="PENTHOUSE">Sky Penthouse</option>
                          <option value="STUDIO">Studio Suite</option>
                          <option value="ROW_HOUSE">Row House / Duplex</option>
                        </select>
                      ) : (
                        <select
                          value={propertyType}
                          onChange={(e) => {
                            const val = e.target.value as PropertyType;
                            setPropertyType(val);
                            setSubCategory(e.target.options[e.target.selectedIndex].text);
                          }}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                        >
                          <option value="OFFICE">IT Park / Grade-A Office Space</option>
                          <option value="RETAIL">Retail Showroom / Shop</option>
                          <option value="WAREHOUSE">Industrial Warehouse / Godown</option>
                          <option value="LAND">Commercial Plot / SCO Land</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: LOCATION DETAILS */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      Location Details & Coordinates
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 3 of 8</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City Hierarchical Dropdown */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Target City <span className="text-[#D61F26]">*</span>
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                    >
                      <optgroup label="🇮🇳 Central & West India">
                        <option value="Indore">Indore (Madhya Pradesh)</option>
                        <option value="Bhopal">Bhopal (Madhya Pradesh)</option>
                        <option value="Ujjain">Ujjain (Madhya Pradesh)</option>
                        <option value="Gwalior">Gwalior (Madhya Pradesh)</option>
                        <option value="Jabalpur">Jabalpur (Madhya Pradesh)</option>
                        <option value="Mumbai">Mumbai (Maharashtra)</option>
                        <option value="Pune">Pune (Maharashtra)</option>
                        <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
                        <option value="Surat">Surat (Gujarat)</option>
                        <option value="Jaipur">Jaipur (Rajasthan)</option>
                      </optgroup>
                      <optgroup label="🇮🇳 North & South Hubs">
                        <option value="Delhi NCR">Delhi NCR / Gurgaon / Noida</option>
                        <option value="Bengaluru">Bengaluru (Karnataka)</option>
                        <option value="Hyderabad">Hyderabad (Telangana)</option>
                        <option value="Chennai">Chennai (Tamil Nadu)</option>
                        <option value="Kolkata">Kolkata (West Bengal)</option>
                        <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
                        <option value="Chandigarh">Chandigarh (Punjab & Haryana)</option>
                        <option value="Kochi">Kochi (Kerala)</option>
                        <option value="Goa">Goa (Coastal Hub)</option>
                      </optgroup>
                      <optgroup label="🌐 International Real Estate">
                        <option value="Dubai">Dubai (UAE)</option>
                        <option value="Abu Dhabi">Abu Dhabi (UAE)</option>
                        <option value="London">London (United Kingdom)</option>
                        <option value="New York">New York (USA)</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Toronto">Toronto (Canada)</option>
                        <option value="Sydney">Sydney (Australia)</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Locality */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Locality / Sector / Road <span className="text-[#D61F26]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Vijay Nagar / Super Corridor"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Pincode / Postal Code <span className="text-[#D61F26]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 452010"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Complete Address / Project Site Location
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Plot No. 12, Scheme 54, Near Velocity Multiplex"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Map Coordinates / Pin Drop (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#D61F26] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}
                        placeholder="22.7196° N, 75.8577° E"
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-[13.5px] font-mono focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: PROPERTY SPECIFICATIONS & PRICING */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      4
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      Property Specifications & Pricing
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 4 of 8</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Configuration */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Configuration <span className="text-[#D61F26]">*</span>
                    </label>
                    <select
                      value={configuration}
                      onChange={(e) => {
                        setConfiguration(e.target.value);
                        if (e.target.value.includes('1')) setBedrooms(1);
                        else if (e.target.value.includes('2')) setBedrooms(2);
                        else if (e.target.value.includes('3')) setBedrooms(3);
                        else if (e.target.value.includes('4')) setBedrooms(4);
                        else if (e.target.value.includes('5')) setBedrooms(5);
                      }}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="5+ BHK / Sky Villa">5+ BHK / Sky Villa</option>
                      <option value="Studio Suite">Studio Suite / 1 RK</option>
                      <option value="Commercial Bare Shell">Commercial Bare Shell</option>
                      <option value="Fully Fitted Office">Fully Fitted Office</option>
                      <option value="Open Commercial Plot">Open Commercial Plot</option>
                    </select>
                  </div>

                  {/* Super Built-up Area */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Super Built-up Area <span className="text-[#D61F26]">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        required
                        value={area}
                        onChange={(e) => handleAreaChange(e.target.value ? Number(e.target.value) : '')}
                        placeholder="1650"
                        className="w-full border border-r-0 border-gray-300 rounded-l-xl px-3 py-2.5 text-[13.5px] font-medium focus:outline-none focus:border-[#D61F26]"
                      />
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value as 'sq.ft' | 'sq.yards' | 'acres')}
                        className="border border-gray-300 rounded-r-xl px-2 py-2.5 text-xs font-bold bg-gray-100 text-gray-700 focus:outline-none cursor-pointer"
                      >
                        <option value="sq.ft">Sq. Ft.</option>
                        <option value="sq.yards">Sq. Yds</option>
                        <option value="acres">Acres</option>
                      </select>
                    </div>
                  </div>

                  {/* Bathrooms & Parking */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Baths & Parking
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-xl px-2 py-2.5 text-[12px] font-semibold bg-white"
                      >
                        <option value={1}>1 Bath</option>
                        <option value={2}>2 Baths</option>
                        <option value={3}>3 Baths</option>
                        <option value={4}>4+ Baths</option>
                      </select>
                      <select
                        value={parking}
                        onChange={(e) => setParking(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-xl px-2 py-2.5 text-[12px] font-semibold bg-white"
                      >
                        <option value={1}>1 Car</option>
                        <option value={2}>2 Cars</option>
                        <option value={3}>3+ Cars</option>
                      </select>
                    </div>
                  </div>

                  {/* Total Price & Verbal preview */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Total Price / Rent (₹) <span className="text-[#D61F26]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => handlePriceChange(e.target.value ? Number(e.target.value) : '')}
                      placeholder="14500000"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold focus:outline-none focus:border-[#D61F26]"
                    />
                    <div className="text-[11px] font-extrabold text-[#D61F26] mt-1">
                      Display: {getFormattedPriceLabel(price)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                  {/* Price per sq ft */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Price per Sq.Ft (₹)
                    </label>
                    <input
                      type="number"
                      value={pricePerSqFt}
                      onChange={(e) => setPricePerSqFt(e.target.value ? Number(e.target.value) : '')}
                      placeholder="8787"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  {/* Maintenance charges */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Maintenance (₹/month)
                    </label>
                    <input
                      type="number"
                      value={maintenanceCharges}
                      onChange={(e) => setMaintenanceCharges(e.target.value ? Number(e.target.value) : '')}
                      placeholder="3500"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  {/* Possession Status */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Possession Status & Date <span className="text-[#D61F26]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={possessionStatus}
                        onChange={(e) => setPossessionStatus(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-xl px-2 py-2.5 text-[11.5px] font-bold bg-white"
                      >
                        <option value="READY_TO_MOVE">Ready to Move</option>
                        <option value="UNDER_CONSTRUCTION">Under Construction</option>
                        <option value="NEW_LAUNCH">New Launch</option>
                      </select>
                      <input
                        type="text"
                        value={possessionDate}
                        onChange={(e) => setPossessionDate(e.target.value)}
                        placeholder="e.g. Dec 2026"
                        className="w-full border border-gray-300 rounded-xl px-2 py-2.5 text-[12px]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: RERA & LEGAL COMPLIANCE */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      5
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      RERA & Legal Verification Credentials
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 5 of 8</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* RERA Number */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      RERA Registration Number <span className="text-[#D61F26]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={reraNumber}
                        onChange={(e) => setReraNumber(e.target.value)}
                        placeholder="e.g. P-IND-24-9182 or PRM/KA/RERA/1251"
                        className="w-full border border-gray-300 rounded-xl pl-3.5 pr-24 py-2.5 text-[13.5px] font-mono uppercase focus:outline-none focus:border-[#D61F26]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsReraVerified(true)}
                        className="absolute right-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify RERA</span>
                      </button>
                    </div>
                    {isReraVerified && (
                      <p className="text-[11.5px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        RERA Format Validated for Legal Publication
                      </p>
                    )}
                  </div>

                  {/* Approval Authority */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Sanctioning Approval Authority
                    </label>
                    <input
                      type="text"
                      value={approvalAuthority}
                      onChange={(e) => setApprovalAuthority(e.target.value)}
                      placeholder="e.g. Town & Country Planning (T&CP) / IMC Sanctioned"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>
                </div>

                {/* Document Proof Upload */}
                <div className="pt-2">
                  <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Ownership & Title Document Proof (Sale Deed / Sanctioned Layout / Registry)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-[#D61F26] rounded-2xl p-4 sm:p-5 text-center transition-colors bg-gray-50/60 relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-3 bg-red-50 text-[#D61F26] rounded-full">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-800">
                          Click or drag documents to upload verification proof
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Supported files: PDF, Scanned Registry JPG, Sanction Layout Map (Max 15MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {uploadedProofName && (
                    <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-bold text-emerald-900 truncate">
                          Attached Proof: {uploadedProofName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedProofName('')}
                        className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION 6: MEDIA & AMENITIES UPLOAD */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      6
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      Media & Amenities Upload
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 6 of 8</span>
                </div>

                {/* Image Gallery Picker & URL Input */}
                <div className="space-y-3">
                  <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider">
                    Property High-Res Gallery Photos
                  </label>

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden h-28 border border-gray-200 shadow-sm bg-gray-100">
                          <img src={imgUrl} alt="Listing preview" className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-[#D61F26] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                              Primary Thumbnail
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Image URL */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Paste high-res property photo URL (e.g. https://images.unsplash.com/...)"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-[12.5px] focus:outline-none focus:border-[#D61F26]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomImage}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors"
                    >
                      Add Photo
                    </button>
                  </div>

                  {/* Preset Quick Select Photos */}
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">
                      Or select from curated architectural presets:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PHOTOS.map((preset, idx) => {
                        const isIncluded = selectedImages.includes(preset.url);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleSelectPresetImage(preset.url)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isIncluded
                                ? 'bg-[#D61F26] text-white border-[#D61F26]'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                            }`}
                          >
                            {isIncluded && <Check className="w-3 h-3 text-white" />}
                            <span>{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Amenities Checklist */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider">
                      Amenities Checklist (Multi-Select)
                    </label>
                    <span className="text-[11px] text-gray-500 font-semibold">
                      {selectedAmenities.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity.id);
                      return (
                        <button
                          type="button"
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'border-[#D61F26] bg-red-50/70 text-[#D61F26] shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                          }`}
                        >
                          <span className="text-base">{amenity.icon}</span>
                          <span className="truncate flex-1">{amenity.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Comprehensive Property Description & USPs
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Highlight proximity to Metro, Airport, top schools, clubhouse features, construction quality, vastu orientation, and payment schedule..."
                    className="w-full border border-gray-300 rounded-xl p-3.5 text-[13px] leading-relaxed focus:outline-none focus:border-[#D61F26]"
                  />
                </div>
              </section>

              {/* SECTION 7: CONTACT & VERIFICATION DETAILS */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#D61F26] text-white text-xs font-black rounded-full flex items-center justify-center">
                      7
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                      Contact & Ownership Verification
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">Step 7 of 8</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Contact Person Name <span className="text-[#D61F26]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Nilesh Nigam / Rajesh Singhania"
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-[#D61F26]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. partner@themars.tv or yourname@gmail.com"
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone with OTP Verification Simulation */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number (with OTP Verification) <span className="text-[#D61F26]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98930 12345"
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-3 py-2.5 text-[13.5px] font-medium focus:outline-none focus:border-[#D61F26]"
                        />
                      </div>
                      {!isPhoneVerified ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-3.5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors"
                        >
                          {otpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      ) : (
                        <div className="px-3 py-2 bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    {/* OTP Entry Simulation */}
                    {otpSent && !isPhoneVerified && (
                      <div className="mt-2.5 p-3 bg-red-50/80 border border-red-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-700">
                          <span className="font-bold">Enter 4-Digit Code (Demo Code: 4829):</span>
                          <button
                            type="button"
                            onClick={() => setOtpCode('4829')}
                            className="text-[11px] text-[#D61F26] font-bold underline cursor-pointer"
                          >
                            Auto-Fill 4829
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="4829"
                            className="w-32 text-center tracking-widest font-mono text-base font-black border border-red-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-4 py-1.5 bg-[#D61F26] hover:bg-[#B01920] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Verify OTP
                          </button>
                        </div>
                        {otpError && <p className="text-[11px] text-red-600 font-bold">{otpError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Agency / Company Name */}
                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Company / Developer / Agency Name{' '}
                      {userRole !== 'OWNER' && <span className="text-[#D61F26]">*</span>}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required={userRole !== 'OWNER'}
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder={
                          userRole === 'OWNER'
                            ? 'Optional (e.g. Individual Direct Seller)'
                            : 'e.g. Apollo Infrastructure / Prestige Realty'
                        }
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: SUBMISSION WORKFLOW */}
              <div className="bg-[#111111] text-white p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct-to-Admin Verification Protocol</h4>
                    <p className="text-[11.5px] text-gray-400">
                      Upon submission, your listing is routed immediately to the Admin Portal (<code>/admin-secret</code>) with "Pending Approval" status for RERA & title compliance review.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    By submitting, you certify that all stated RERA and ownership details are accurate.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#D61F26] hover:bg-[#B01920] active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Verifying & Submitting...</span>
                    ) : (
                      <>
                        <span>Submit for Verification</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
