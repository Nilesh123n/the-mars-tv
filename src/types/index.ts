export type PropertyType = 'APARTMENT' | 'VILLA' | 'PLOT' | 'ROW_HOUSE' | 'OFFICE' | 'RETAIL' | 'WAREHOUSE' | 'PENTHOUSE' | 'STUDIO' | 'BUILDER_FLOOR' | 'LAND';

export type ListingType = 'BUY' | 'SELL' | 'RENT' | 'LEASE' | 'COMMERCIAL';

export type PropertyStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SOLD' | 'RENTED' | 'INACTIVE' | 'REJECTED';

export type UserRole = 'DEVELOPER' | 'BROKER' | 'OWNER';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceLabel: string;
  location: string;
  city: string;
  area: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  isSponsored: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isReraReg: boolean;
  reraNumber?: string;
  images: { url: string; alt?: string; isPrimary?: boolean }[];
  amenities: string[];
  lat?: number;
  lng?: number;
  createdAt: string;

  // Detailed Verification & Listing Submission Fields
  userRole?: UserRole;
  subCategory?: string;
  locality?: string;
  address?: string;
  pincode?: string;
  coordinates?: string;
  configuration?: string;
  pricePerSqFt?: number;
  maintenanceCharges?: number;
  possessionStatus?: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'NEW_LAUNCH';
  possessionDate?: string;
  ownershipProofDoc?: string;
  approvalAuthority?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  agencyName?: string;
  isPhoneVerified?: boolean;
  submissionId?: string;
}

export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'EXCLUSIVE' | 'MIXED_USE';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  builder: string;
  price: number;
  priceLabel: string;
  location: string;
  city: string;
  projectType: ProjectType;
  status: string;
  possession: string;
  reraNumber?: string;
  configurations: string[];
  amenities: string[];
  image: string;
  isExclusive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  region?: 'India' | 'International';
  image: string;
  author: string;
  publishedAt: string;
  isFeatured: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  viewCount: number;
}

export interface PRServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface BrandPartner {
  id: string;
  name: string;
  logoText: string;
  website?: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  avatar: string;
  avatarBg: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  leadType: string;
  status: LeadStatus;
  source: string;
  propertyTitle?: string;
  createdAt: string;
}

export interface ConstructionPackage {
  id: string;
  name: string;
  ratePerSqFt: number;
  rateLabel: string;
  badge?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  phonePrimary: string;
  phoneSecondary: string;
  emailContact: string;
  whatsappNumber: string;
  officeAddress: string;
  reraRegistrationNo: string;
  aboutText: string;
  activePromotionalBanner?: string;
  adminPasscode?: string;
}
