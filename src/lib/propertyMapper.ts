import { Property, PropertyStatus, PropertyType, ListingType, UserRole } from '../types';

/**
 * Normalizes any Supabase row (handling snake_case, camelCase, JSON, arrays, nulls)
 * into a typed Property object.
 */
export function fromSupabaseRow(row: any): Property {
  if (!row) {
    throw new Error('fromSupabaseRow received null or undefined row');
  }

  // Safe parsing of images
  let images: { url: string; alt?: string; isPrimary?: boolean }[] = [];
  if (Array.isArray(row.images)) {
    images = row.images.map((img: any, idx: number) => {
      if (typeof img === 'string') {
        return { url: img, alt: row.title || 'Property Image', isPrimary: idx === 0 };
      }
      return {
        url: img.url || '',
        alt: img.alt || row.title || 'Property Image',
        isPrimary: Boolean(img.isPrimary ?? idx === 0),
      };
    });
  } else if (typeof row.images === 'string') {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) {
        images = parsed.map((img: any, idx: number) => {
          if (typeof img === 'string') {
            return { url: img, alt: row.title || 'Property Image', isPrimary: idx === 0 };
          }
          return {
            url: img.url || '',
            alt: img.alt || row.title || 'Property Image',
            isPrimary: Boolean(img.isPrimary ?? idx === 0),
          };
        });
      }
    } catch (e) {
      if (row.images.trim().startsWith('http')) {
        images = [{ url: row.images.trim(), alt: row.title || 'Property Image', isPrimary: true }];
      }
    }
  }

  if (images.length === 0) {
    images = [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        alt: row.title || 'Property',
        isPrimary: true,
      },
    ];
  }

  // Safe parsing of amenities
  let amenities: string[] = [];
  if (Array.isArray(row.amenities)) {
    amenities = row.amenities.map(String);
  } else if (typeof row.amenities === 'string') {
    try {
      const parsed = JSON.parse(row.amenities);
      if (Array.isArray(parsed)) {
        amenities = parsed.map(String);
      } else {
        amenities = row.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    } catch (e) {
      amenities = row.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  const rawPrice = Number(row.price) || 0;
  const formattedPrice =
    row.priceLabel ||
    row.price_label ||
    (rawPrice >= 10000000
      ? `₹ ${(rawPrice / 10000000).toFixed(2)} Cr`
      : rawPrice >= 100000
      ? `₹ ${(rawPrice / 100000).toFixed(2)} L`
      : `₹ ${rawPrice.toLocaleString('en-IN')}`);

  const rawStatus = (row.status || 'PENDING_APPROVAL').toString().toUpperCase().trim();
  const status: PropertyStatus = [
    'PENDING_APPROVAL',
    'ACTIVE',
    'SOLD',
    'RENTED',
    'INACTIVE',
    'REJECTED',
  ].includes(rawStatus)
    ? (rawStatus as PropertyStatus)
    : 'PENDING_APPROVAL';

  return {
    id: String(row.id),
    submissionId: row.submissionId || row.submission_id || '',
    title: row.title || 'Untitled Property',
    slug: row.slug || (row.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: row.description || '',
    price: rawPrice,
    priceLabel: formattedPrice,
    location: row.location || `${row.locality ? `${row.locality}, ` : ''}${row.city || 'Indore'}`,
    city: row.city || 'Indore',
    locality: row.locality || '',
    address: row.address || `${row.locality || ''}, ${row.city || 'Indore'}`,
    pincode: row.pincode || '',
    coordinates: row.coordinates || '',
    lat: row.lat !== undefined && row.lat !== null ? Number(row.lat) : undefined,
    lng: row.lng !== undefined && row.lng !== null ? Number(row.lng) : undefined,
    area: Number(row.area) || 0,
    areaUnit: row.areaUnit || row.area_unit || 'sq.ft',
    configuration: row.configuration || '',
    bedrooms: row.bedrooms !== undefined && row.bedrooms !== null ? Number(row.bedrooms) : 1,
    bathrooms: row.bathrooms !== undefined && row.bathrooms !== null ? Number(row.bathrooms) : 1,
    parking: row.parking !== undefined && row.parking !== null ? Number(row.parking) : 0,
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

/**
 * Converts a Property object to a Supabase-compatible row object.
 * Provides snake_case keys (standard PostgreSQL) and populates all columns.
 */
export function toSupabaseRow(prop: Property): Record<string, any> {
  const priceVal = typeof prop.price === 'number' ? prop.price : Number(prop.price) || 0;
  
  return {
    id: prop.id,
    submission_id: prop.submissionId || null,
    title: prop.title || '',
    slug: prop.slug || (prop.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: prop.description || '',
    price: priceVal,
    price_label: prop.priceLabel || '',
    location: prop.location || '',
    city: prop.city || 'Indore',
    locality: prop.locality || '',
    address: prop.address || '',
    pincode: prop.pincode || '',
    coordinates: prop.coordinates || '',
    lat: prop.lat ?? null,
    lng: prop.lng ?? null,
    area: typeof prop.area === 'number' ? prop.area : Number(prop.area) || 0,
    area_unit: prop.areaUnit || 'sq.ft',
    configuration: prop.configuration || '',
    bedrooms: prop.bedrooms ?? 1,
    bathrooms: prop.bathrooms ?? 1,
    parking: prop.parking ?? 0,
    price_per_sq_ft: prop.pricePerSqFt ?? null,
    maintenance_charges: prop.maintenanceCharges ?? null,
    possession_status: prop.possessionStatus || 'READY_TO_MOVE',
    possession_date: prop.possessionDate || 'Immediate',
    property_type: prop.propertyType || 'APARTMENT',
    sub_category: prop.subCategory || '',
    listing_type: prop.listingType || 'BUY',
    status: prop.status || 'PENDING_APPROVAL',
    is_sponsored: Boolean(prop.isSponsored),
    is_featured: Boolean(prop.isFeatured),
    is_verified: Boolean(prop.isVerified),
    is_rera_reg: Boolean(prop.isReraReg),
    rera_number: prop.reraNumber || null,
    approval_authority: prop.approvalAuthority || null,
    ownership_proof_doc: prop.ownershipProofDoc || null,
    user_role: prop.userRole || 'DEVELOPER',
    contact_name: prop.contactName || null,
    contact_phone: prop.contactPhone || null,
    contact_email: prop.contactEmail || null,
    agency_name: prop.agencyName || null,
    is_phone_verified: Boolean(prop.isPhoneVerified),
    images: prop.images || [],
    amenities: prop.amenities || [],
    created_at: prop.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
