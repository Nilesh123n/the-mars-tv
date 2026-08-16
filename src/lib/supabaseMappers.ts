import { Property, PropertyType, ListingType, PropertyStatus, UserRole, NewsItem, PRServiceItem, Lead, ConstructionPackage, SiteSettings, Project, ProjectType } from '../types';

// ============================================================================
// 1. PROPERTY MAPPERS
// ============================================================================

export function fromSupabaseRow(row: any): Property {
  // Parse images if stored as JSONB, string, or array
  let images: { url: string; alt?: string; isPrimary?: boolean }[] = [];
  if (Array.isArray(row.images)) {
    images = row.images.map((img: any) => {
      if (typeof img === 'string') {
        return { url: img, isPrimary: false };
      }
      return {
        url: img.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        alt: img.alt || 'Property image',
        isPrimary: Boolean(img.isPrimary || img.is_primary),
      };
    });
  } else if (typeof row.images === 'string') {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) {
        images = parsed.map((img: any) => {
          if (typeof img === 'string') return { url: img, isPrimary: false };
          return {
            url: img.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
            alt: img.alt || 'Property image',
            isPrimary: Boolean(img.isPrimary || img.is_primary),
          };
        });
      }
    } catch {
      images = [{ url: row.images, isPrimary: true, alt: 'Property image' }];
    }
  }

  // Ensure at least one image exists
  if (images.length === 0) {
    images = [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        alt: row.title || 'Property image',
        isPrimary: true,
      },
    ];
  }

  // Parse amenities
  let amenities: string[] = [];
  if (Array.isArray(row.amenities)) {
    amenities = row.amenities.map(String);
  } else if (typeof row.amenities === 'string') {
    try {
      const parsed = JSON.parse(row.amenities);
      amenities = Array.isArray(parsed) ? parsed.map(String) : [row.amenities];
    } catch {
      amenities = row.amenities
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  // Parse status
  let status: PropertyStatus = 'PENDING_APPROVAL';
  const rawStatus = (row.status || '').toUpperCase();
  if (['ACTIVE', 'PENDING_APPROVAL', 'SOLD', 'RENTED', 'INACTIVE', 'REJECTED'].includes(rawStatus)) {
    status = rawStatus as PropertyStatus;
  }

  // Price formatting
  const rawPrice = Number(row.price) || 0;
  const formattedPrice =
    row.priceLabel ||
    row.price_label ||
    (rawPrice >= 10000000
      ? `₹ ${(rawPrice / 10000000).toFixed(2)} Cr`
      : rawPrice >= 100000
      ? `₹ ${(rawPrice / 100000).toFixed(2)} L`
      : `₹ ${rawPrice.toLocaleString('en-IN')}`);

  return {
    id: String(row.id),
    submissionId: row.submissionId || row.submission_id || undefined,
    title: row.title || 'Untitled Property',
    slug: row.slug || (row.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: row.description || '',
    price: rawPrice,
    priceLabel: formattedPrice,
    location: row.location || row.locality || row.city || 'Indore',
    city: row.city || 'Indore',
    locality: row.locality || '',
    address: row.address || '',
    pincode: row.pincode || '',
    coordinates: row.coordinates || '',
    lat: row.lat !== null && row.lat !== undefined ? Number(row.lat) : undefined,
    lng: row.lng !== null && row.lng !== undefined ? Number(row.lng) : undefined,
    area: Number(row.area) || 0,
    areaUnit: row.areaUnit || row.area_unit || 'sq.ft',
    configuration: row.configuration || '',
    bedrooms: Number(row.bedrooms) || 1,
    bathrooms: Number(row.bathrooms) || 1,
    parking: Number(row.parking) || 0,
    pricePerSqFt:
      row.pricePerSqFt !== undefined && row.pricePerSqFt !== null
        ? Number(row.pricePerSqFt)
        : row.price_per_sq_ft !== undefined && row.price_per_sq_ft !== null
        ? Number(row.price_per_sq_ft)
        : undefined,
    maintenanceCharges:
      row.maintenanceCharges !== undefined && row.maintenanceCharges !== null
        ? Number(row.maintenanceCharges)
        : row.maintenance_charges !== undefined && row.maintenance_charges !== null
        ? Number(row.maintenance_charges)
        : undefined,
    possessionStatus: row.possessionStatus || row.possession_status || 'READY_TO_MOVE',
    possessionDate: row.possessionDate || row.possession_date || 'Immediate',
    propertyType: (row.propertyType || row.property_type || 'APARTMENT') as PropertyType,
    subCategory: row.subCategory || row.sub_category || '',
    listingType: (row.listingType || row.listing_type || 'BUY') as ListingType,
    status,
    isSponsored: Boolean(row.isSponsored ?? row.is_sponsored ?? false),
    isFeatured: Boolean(row.isFeatured ?? row.is_featured ?? false),
    isVerified: Boolean(row.isVerified ?? row.is_verified ?? false),
    isReraReg: Boolean(row.isReraReg ?? row.is_rera_reg ?? false),
    reraNumber: row.reraNumber || row.rera_number || '',
    approvalAuthority: row.approvalAuthority || row.approval_authority || '',
    ownershipProofDoc: row.ownershipProofDoc || row.ownership_proof_doc || '',
    userRole: (row.userRole || row.user_role || 'DEVELOPER') as UserRole,
    contactName: row.contactName || row.contact_name || '',
    contactPhone: row.contactPhone || row.contact_phone || '',
    contactEmail: row.contactEmail || row.contact_email || '',
    agencyName: row.agencyName || row.agency_name || '',
    isPhoneVerified: Boolean(row.isPhoneVerified ?? row.is_phone_verified ?? false),
    images,
    amenities,
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

export function toSupabaseRow(property: Property): Record<string, any> {
  const images = Array.isArray(property.images) ? property.images : [];
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return {
    id: property.id,
    submission_id: property.submissionId || null,
    title: property.title || 'Untitled Property',
    slug: property.slug || (property.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: property.description || '',
    price: Number(property.price) || 0,
    price_label: property.priceLabel || '',
    location: property.location || '',
    city: property.city || 'Indore',
    locality: property.locality || null,
    address: property.address || null,
    pincode: property.pincode || null,
    coordinates: property.coordinates || null,
    lat: property.lat !== undefined ? Number(property.lat) : null,
    lng: property.lng !== undefined ? Number(property.lng) : null,
    area: Number(property.area) || 0,
    area_unit: property.areaUnit || 'sq.ft',
    configuration: property.configuration || '',
    bedrooms: Number(property.bedrooms) || 1,
    bathrooms: Number(property.bathrooms) || 1,
    parking: Number(property.parking) || 0,
    price_per_sq_ft: property.pricePerSqFt !== undefined ? Number(property.pricePerSqFt) : null,
    maintenance_charges: property.maintenanceCharges !== undefined ? Number(property.maintenanceCharges) : null,
    possession_status: property.possessionStatus || 'READY_TO_MOVE',
    possession_date: property.possessionDate || 'Immediate',
    property_type: property.propertyType || 'APARTMENT',
    sub_category: property.subCategory || null,
    listing_type: property.listingType || 'BUY',
    status: property.status || 'PENDING_APPROVAL',
    is_sponsored: Boolean(property.isSponsored),
    is_featured: Boolean(property.isFeatured),
    is_verified: Boolean(property.isVerified),
    is_rera_reg: Boolean(property.isReraReg),
    rera_number: property.reraNumber || null,
    approval_authority: property.approvalAuthority || null,
    ownership_proof_doc: property.ownershipProofDoc || null,
    user_role: property.userRole || 'DEVELOPER',
    contact_name: property.contactName || null,
    contact_phone: property.contactPhone || null,
    contact_email: property.contactEmail || null,
    agency_name: property.agencyName || null,
    is_phone_verified: Boolean(property.isPhoneVerified),
    images: images,
    amenities: amenities,
    created_at: property.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ============================================================================
// 2. NEWS ITEM MAPPERS
// ============================================================================

export function fromSupabaseNewsRow(row: any): NewsItem {
  return {
    id: String(row.id),
    title: row.title || 'Untitled News',
    slug: row.slug || (row.title || 'news').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: row.excerpt || '',
    content: row.content || '',
    category: row.category || 'Indore Real Estate',
    region: row.region === 'International' ? 'International' : 'India',
    image: row.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    author: row.author || 'The Mars TV News Desk',
    publishedAt: row.publishedAt || row.published_at || new Date().toISOString(),
    isFeatured: Boolean(row.isFeatured ?? row.is_featured ?? false),
    status: (row.status || 'PUBLISHED') as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    viewCount: Number(row.viewCount ?? row.view_count ?? 120),
  };
}

export function toSupabaseNewsRow(item: NewsItem): Record<string, any> {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: item.excerpt || '',
    content: item.content || '',
    category: item.category,
    region: item.region || 'India',
    image: item.image,
    author: item.author || 'The Mars TV News Desk',
    published_at: item.publishedAt || new Date().toISOString(),
    publishedAt: item.publishedAt || new Date().toISOString(),
    is_featured: Boolean(item.isFeatured),
    isFeatured: Boolean(item.isFeatured),
    status: item.status || 'PUBLISHED',
    view_count: Number(item.viewCount || 100),
    viewCount: Number(item.viewCount || 100),
  };
}

// ============================================================================
// 3. PR SERVICE MAPPERS
// ============================================================================

export function fromSupabasePRServiceRow(row: any): PRServiceItem {
  return {
    id: String(row.id),
    title: row.title || 'PR Service',
    slug: row.slug || (row.title || 'pr-service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: row.description || '',
    icon: row.icon || row.iconName || row.icon_name || 'Megaphone',
    isActive: Boolean(row.isActive ?? row.is_active ?? true),
    order: Number(row.order || 1),
  };
}

export function toSupabasePRServiceRow(service: PRServiceItem): Record<string, any> {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: service.description || '',
    icon: service.icon,
    icon_name: service.icon,
    iconName: service.icon,
    is_active: Boolean(service.isActive),
    isActive: Boolean(service.isActive),
    order: Number(service.order || 1),
  };
}

// ============================================================================
// 4. LEAD MAPPERS
// ============================================================================

export function fromSupabaseLeadRow(row: any): Lead {
  return {
    id: String(row.id),
    name: row.name || 'Anonymous User',
    email: row.email || '',
    phone: row.phone || '',
    message: row.message || '',
    leadType: row.leadType || row.lead_type || 'PROPERTY_ENQUIRY',
    status: row.status || 'NEW',
    source: row.source || 'WEBSITE',
    propertyTitle: row.propertyTitle || row.property_title || undefined,
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

export function toSupabaseLeadRow(lead: Lead): Record<string, any> {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email || '',
    phone: lead.phone,
    message: lead.message || '',
    lead_type: lead.leadType,
    leadType: lead.leadType,
    status: lead.status || 'NEW',
    source: lead.source || 'WEBSITE',
    property_title: lead.propertyTitle || null,
    propertyTitle: lead.propertyTitle || null,
    created_at: lead.createdAt || new Date().toISOString(),
    createdAt: lead.createdAt || new Date().toISOString(),
  };
}

// ============================================================================
// 5. CONSTRUCTION PACKAGE MAPPERS
// ============================================================================

export function fromSupabaseConstructionRow(row: any): ConstructionPackage {
  let features: string[] = [];
  if (Array.isArray(row.features)) {
    features = row.features.map(String);
  } else if (typeof row.features === 'string') {
    try {
      const p = JSON.parse(row.features);
      features = Array.isArray(p) ? p.map(String) : [row.features];
    } catch {
      features = row.features.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  const ratePerSqFt = Number(row.ratePerSqFt ?? row.rate_per_sq_ft ?? row.pricePerSqFt ?? row.price_per_sq_ft ?? 1650);

  return {
    id: String(row.id),
    name: row.name || 'Construction Package',
    ratePerSqFt,
    rateLabel: row.rateLabel || row.rate_label || `₹${ratePerSqFt}/sq.ft`,
    badge: row.badge || '',
    description: row.description || '',
    features,
    isPopular: Boolean(row.isPopular ?? row.is_popular ?? false),
  };
}

export function toSupabaseConstructionRow(pkg: ConstructionPackage): Record<string, any> {
  return {
    id: pkg.id,
    name: pkg.name,
    rate_per_sq_ft: Number(pkg.ratePerSqFt),
    ratePerSqFt: Number(pkg.ratePerSqFt),
    rate_label: pkg.rateLabel,
    rateLabel: pkg.rateLabel,
    badge: pkg.badge || null,
    description: pkg.description || '',
    features: pkg.features || [],
    is_popular: Boolean(pkg.isPopular),
    isPopular: Boolean(pkg.isPopular),
  };
}

// ============================================================================
// 6. SITE SETTINGS MAPPERS
// ============================================================================

export function fromSupabaseSiteSettingsRow(row: any): SiteSettings {
  return {
    siteName: row.siteName || row.site_name || 'The Mars TV',
    tagline: row.tagline || 'Central India’s Premier Real Estate Portal',
    heroHeadline: row.heroHeadline || row.hero_headline || 'Discover Verified Real Estate',
    heroSubheadline: row.heroSubheadline || row.hero_subheadline || 'Explore luxury properties and developments in Indore',
    phonePrimary: row.phonePrimary || row.phone_primary || '+91 123 456 7890',
    phoneSecondary: row.phoneSecondary || row.phone_secondary || '',
    emailContact: row.emailContact || row.email_contact || row.contactEmail || row.contact_email || 'support@themarstv.in',
    whatsappNumber: row.whatsappNumber || row.whatsapp_number || '+91 123 456 7890',
    officeAddress: row.officeAddress || row.office_address || '101-104 The Mars TV Tower, Vijay Nagar Square, Indore, MP 452001',
    reraRegistrationNo: row.reraRegistrationNo || row.rera_registration_no || row.reraRegNo || row.rera_reg_no || 'RERA/MP/IND/2024/09912',
    aboutText: row.aboutText || row.about_text || '',
    activePromotionalBanner: row.activePromotionalBanner || row.active_promotional_banner || '',
    adminPasscode: row.adminPasscode || row.admin_passcode || undefined,
  };
}

export function toSupabaseSiteSettingsRow(settings: SiteSettings): Record<string, any> {
  return {
    id: 'main_settings',
    site_name: settings.siteName,
    siteName: settings.siteName,
    tagline: settings.tagline,
    hero_headline: settings.heroHeadline,
    heroHeadline: settings.heroHeadline,
    hero_subheadline: settings.heroSubheadline,
    heroSubheadline: settings.heroSubheadline,
    phone_primary: settings.phonePrimary,
    phonePrimary: settings.phonePrimary,
    phone_secondary: settings.phoneSecondary,
    phoneSecondary: settings.phoneSecondary,
    email_contact: settings.emailContact,
    emailContact: settings.emailContact,
    whatsapp_number: settings.whatsappNumber,
    whatsappNumber: settings.whatsappNumber,
    office_address: settings.officeAddress,
    officeAddress: settings.officeAddress,
    rera_registration_no: settings.reraRegistrationNo,
    reraRegistrationNo: settings.reraRegistrationNo,
    about_text: settings.aboutText,
    aboutText: settings.aboutText,
    active_promotional_banner: settings.activePromotionalBanner || null,
    activePromotionalBanner: settings.activePromotionalBanner || null,
  };
}

// ============================================================================
// 7. PROJECT MAPPERS
// ============================================================================

export function fromSupabaseProjectRow(row: any): Project {
  let amenities: string[] = [];
  if (Array.isArray(row.amenities)) {
    amenities = row.amenities.map(String);
  } else if (typeof row.amenities === 'string') {
    try {
      const p = JSON.parse(row.amenities);
      amenities = Array.isArray(p) ? p.map(String) : [row.amenities];
    } catch {
      amenities = row.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  let configurations: string[] = [];
  if (Array.isArray(row.configurations)) {
    configurations = row.configurations.map(String);
  } else if (typeof row.configurations === 'string') {
    try {
      const p = JSON.parse(row.configurations);
      configurations = Array.isArray(p) ? p.map(String) : [row.configurations];
    } catch {
      configurations = row.configurations.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  const rawPrice = Number(row.price) || 0;
  const formattedPrice =
    row.priceLabel ||
    row.price_label ||
    (rawPrice >= 10000000 ? `₹ ${(rawPrice / 10000000).toFixed(2)} Cr` : `₹ ${(rawPrice / 100000).toFixed(2)} L`);

  return {
    id: String(row.id),
    title: row.title || 'Exclusive Project',
    slug: row.slug || (row.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: row.description || '',
    builder: row.builder || row.developer || 'Reputed Builder',
    price: rawPrice,
    priceLabel: formattedPrice,
    location: row.location || 'Indore',
    city: row.city || 'Indore',
    projectType: (row.projectType || row.project_type || 'RESIDENTIAL') as ProjectType,
    status: row.status || 'Under Construction',
    possession: row.possession || row.possessionDate || row.possession_date || 'Dec 2026',
    reraNumber: row.reraNumber || row.rera_number || '',
    configurations: configurations.length > 0 ? configurations : ['2 BHK', '3 BHK', '4 BHK'],
    amenities,
    image: row.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    isExclusive: Boolean(row.isExclusive ?? row.is_exclusive ?? true),
    isFeatured: Boolean(row.isFeatured ?? row.is_featured ?? true),
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

export function toSupabaseProjectRow(project: Project): Record<string, any> {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: project.description || '',
    builder: project.builder,
    developer: project.builder,
    price: Number(project.price || 0),
    price_label: project.priceLabel,
    priceLabel: project.priceLabel,
    location: project.location,
    city: project.city || 'Indore',
    project_type: project.projectType,
    projectType: project.projectType,
    status: project.status,
    possession: project.possession,
    possession_date: project.possession,
    rera_number: project.reraNumber || null,
    reraNumber: project.reraNumber || null,
    configurations: project.configurations || [],
    amenities: project.amenities || [],
    image: project.image,
    is_exclusive: Boolean(project.isExclusive),
    isExclusive: Boolean(project.isExclusive),
    is_featured: Boolean(project.isFeatured),
    isFeatured: Boolean(project.isFeatured),
    created_at: project.createdAt || new Date().toISOString(),
    createdAt: project.createdAt || new Date().toISOString(),
  };
}
