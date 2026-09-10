import { Property, Project, NewsItem, PRServiceItem, BrandPartner, Testimonial, Lead, ConstructionPackage, SiteSettings } from '../types';

// Default property list is empty: only admin-added properties from database are shown on all devices.
export const initialProperties: Property[] = [];

// Default projects list is empty: only admin-added exclusive projects from database are shown on all devices.
export const initialProjects: Project[] = [];

// Default news list is empty: only admin-added articles from database are shown on all devices.
export const initialNews: NewsItem[] = [];

export const initialPRServices: PRServiceItem[] = [
  { id: 'pr-1', title: 'Press Release Distribution', slug: 'press-release-distribution', description: 'Distribute your real estate press releases to top national news agencies, finance portals, and print publications.', icon: 'Newspaper', isActive: true, order: 1 },
  { id: 'pr-2', title: 'Media Coverage & Branding', slug: 'media-coverage-branding', description: 'Get featured in major real estate journals, television channels, and executive interview spots.', icon: 'Tv', isActive: true, order: 2 },
  { id: 'pr-3', title: 'Digital PR & Online Visibility', slug: 'digital-pr-online-visibility', description: 'Amplify search engine dominance, high-authority backlink profiles, and social media brand reach.', icon: 'Globe', isActive: true, order: 3 },
  { id: 'pr-4', title: 'Reputation Management', slug: 'reputation-management', description: 'Proactive online reputation monitoring, customer review curation, and brand trust building.', icon: 'Shield', isActive: true, order: 4 },
  { id: 'pr-5', title: 'Crisis Communication Support', slug: 'crisis-communication-support', description: '24/7 strategic crisis communication planning and corporate spokesperson assistance.', icon: 'AlertCircle', isActive: true, order: 5 },
  { id: 'pr-6', title: 'Event PR & Project Launch Events', slug: 'event-pr-sponsorship', description: 'Grand project launch press conferences, VIP inaugurations, and media coverage management.', icon: 'Calendar', isActive: true, order: 6 },
];

export const initialBrandPartners: BrandPartner[] = [
  { id: 'bp-1', name: 'HDFC Home Loans', logoText: 'HDFC BANK', category: 'Banking Partner' },
  { id: 'bp-2', name: 'ICICI Bank Home Loans', logoText: 'ICICI BANK', category: 'Banking Partner' },
  { id: 'bp-3', name: 'SBI Housing Finance', logoText: 'STATE BANK OF INDIA', category: 'Banking Partner' },
  { id: 'bp-4', name: 'Axis Bank Loans', logoText: 'AXIS BANK', category: 'Banking Partner' },
  { id: 'bp-5', name: 'L&T Realty', logoText: 'L&T REALTY', category: 'Developer Partner' },
  { id: 'bp-6', name: 'KEI Wires & Cables', logoText: 'KEI WIRES', category: 'Infra Partner' },
  { id: 'bp-7', name: 'DLF Group', logoText: 'DLF HOMES', category: 'Developer Partner' },
  { id: 'bp-8', name: 'Godrej Properties', logoText: 'GODREJ PROP', category: 'Developer Partner' },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rakesh Sharma',
    location: 'Indore, MP',
    rating: 5,
    message: 'The Mars TV made my villa buying journey completely smooth and transparent. From verified RERA documents to instant bank loan approval, their team guided me every step of the way!',
    avatar: 'RS',
    avatarBg: '#D61F26',
  },
  {
    id: 'test-2',
    name: 'Anjali Verma',
    location: 'Bhopal, MP',
    rating: 5,
    message: 'Finding a 3BHK flat in Bhopal with good amenities was daunting until I found The Mars TV. Their platform listed verified prices with no hidden agent markups. Highly recommended!',
    avatar: 'AV',
    avatarBg: '#1d4ed8',
  },
  {
    id: 'test-3',
    name: 'Vikas Malhotra',
    location: 'Indore, MP',
    rating: 5,
    message: 'We sold our commercial office space through The Mars TV in less than 3 weeks at market valuation. Excellent PR distribution and genuine qualified buyer leads!',
    avatar: 'VM',
    avatarBg: '#15803d',
  },
  {
    id: 'test-4',
    name: 'Priya Patel',
    location: 'Indore, MP',
    rating: 5,
    message: 'Top-class customer support and thorough legal verification. The EMI calculator helped us budget our dream penthouse perfectly!',
    avatar: 'PP',
    avatarBg: '#7e22ce',
  },
  {
    id: 'test-5',
    name: 'Suresh Kumar',
    location: 'Bhopal, MP',
    rating: 5,
    message: 'Professional team with immense market knowledge. Site visits were arranged conveniently in chauffeured vehicles. Outstanding service!',
    avatar: 'SK',
    avatarBg: '#b45309',
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Amitabh Sen',
    email: 'amitabh.sen@example.com',
    phone: '+91 98260 12345',
    message: 'Interested in booking a site visit for Premium 3BHK Apartment in Vijay Nagar this weekend.',
    leadType: 'PROPERTY_ENQUIRY',
    status: 'NEW',
    source: 'WEBSITE_HERO',
    propertyTitle: 'Premium 3BHK Apartment in Vijay Nagar',
    createdAt: '2026-07-29T11:20:00Z',
  },
  {
    id: 'lead-2',
    name: 'Meena Kulkarni',
    email: 'meena.k@example.com',
    phone: '+91 94250 67890',
    message: 'Looking for home loan consultation and layout plans for Luxury Villa in Rau.',
    leadType: 'CALLBACK',
    status: 'CONTACTED',
    source: 'PROPERTY_CARD',
    propertyTitle: 'Luxury 4BHK Villa with Private Garden',
    createdAt: '2026-07-28T09:45:00Z',
  },
  {
    id: 'lead-3',
    name: 'Rajesh Singhania',
    email: 'singhania.corp@example.com',
    phone: '+91 98930 44556',
    message: 'Inquiring about purchasing 2 floors of commercial office space in Business Square.',
    leadType: 'COMMERCIAL_ENQUIRY',
    status: 'QUALIFIED',
    source: 'COMMERCIAL_PAGE',
    propertyTitle: 'Grade-A Commercial Office Space in Business Square',
    createdAt: '2026-07-27T15:10:00Z',
  }
];

export const initialConstructionPackages: ConstructionPackage[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Standard Construction',
    ratePerSqFt: 1450,
    rateLabel: '₹1,450 / sq.ft',
    description: 'High-quality structural steel, Grade-A cement, standard vitrified flooring tiles, and branded bathroom fittings.',
    features: [
      'Structural Design & Approval',
      'Fe550 TMT Steel Bars',
      'Ultratech/Ambuja Cement',
      '2x2 ft Vitrified Floor Tiles',
      'Cera/Jaguar CP Fittings',
      'Concealed Anchor Electrical Wiring'
    ]
  },
  {
    id: 'pkg-[#D61F26]',
    name: 'Premium Deluxe Package',
    ratePerSqFt: 1850,
    rateLabel: '₹1,850 / sq.ft',
    badge: 'MOST POPULAR',
    isPopular: true,
    description: 'Italian marble look flooring, modular kitchen with chimney, teak wood doors, and false ceiling in living room.',
    features: [
      'Architectural 3D Front Elevation',
      'Large Format GVT Tiles',
      'Granite Kitchen Countertop',
      'Teak Wood Main Door Frame',
      'Kohlera/Jaguar Premium Fittings',
      'False Ceiling in Living & Dining',
      'Anti-Termite Treatment Guarantee'
    ]
  },
  {
    id: 'pkg-luxury',
    name: 'Ultra Luxury Villa Finish',
    ratePerSqFt: 2450,
    rateLabel: '₹2,450 / sq.ft',
    description: 'Bespoke architectural layout, imported Italian marble, automated smart home wiring, UPVC windows, and private terrace landscaping.',
    features: [
      'Full Architectural & Interior 3D Walkthrough',
      'Imported Italian Marble Flooring',
      'Fully Furnished Modular Kitchen',
      'Smart Home Automation Cabling',
      'Soundproof UPVC Windows',
      'Solar Water Heater & Underground Sump',
      '5-Year Full Structure Warranty'
    ]
  }
];

export const initialSiteSettings: SiteSettings = {
  siteName: 'The Mars TV',
  tagline: 'Real Estate & Media Network',
  heroHeadline: 'Discover Verified Residential & Commercial Properties',
  heroSubheadline: 'Explore 100% RERA registered homes, luxury villas, office spaces, and land corridors in Indore & Central India.',
  phonePrimary: '+91 98260 00000',
  phoneSecondary: '+91 731 4000000',
  emailContact: 'info-[#D61F26]tv.com',
  whatsappNumber: '+91 98260 00000',
  officeAddress: '101, Business Square, AB Road, Vijay Nagar, Indore, MP - 452010',
  reraRegistrationNo: 'RERA/MP/IND/2026/00821',
  aboutText: 'The Mars TV is Central India\'s premier property portal and real estate media channel. We bridge developers, homebuyers, commercial investors, and press channels with verified listings, market news, and end-to-end PR solutions.'
};
