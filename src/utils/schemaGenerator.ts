import { Property, NewsItem, PRServiceItem, ConstructionPackage, SiteSettings } from '../types';

/**
 * Utility to strip markdown or HTML tags for clean schema text descriptions
 */
function cleanText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/[#*`_~[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Helper to get safe base URL
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'https://themarstv.com';
}

/**
 * 1. Global Organization & RealEstateAgent Schema
 */
export function generateOrganizationSchema(siteSettings?: Partial<SiteSettings>) {
  const baseUrl = getBaseUrl();
  const phone = siteSettings?.phonePrimary || '+91 98260 00000';
  const email = siteSettings?.emailContact || 'info@themarstv.com';
  const address = siteSettings?.officeAddress || '101, Business Square, AB Road, Vijay Nagar, Indore, Madhya Pradesh - 452010';

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'RealEstateAgent'],
    '@id': `${baseUrl}/#organization`,
    name: siteSettings?.siteName || 'The Mars TV',
    legalName: 'The Mars TV Media & Real Estate Platform',
    alternateName: ['The Mars TV', 'TheMarsTV', 'Mars TV Real Estate'],
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/mars_tv_logo.jpg`,
      width: 512,
      height: 512,
      caption: 'The Mars TV Logo',
    },
    image: `${baseUrl}/mars_tv_logo.jpg`,
    description:
      siteSettings?.aboutText ||
      'The Mars TV is India’s premier real estate media and property portal featuring 100% verified residential villas, luxury apartments, commercial office spaces, industrial corridors, turnkey construction packages, and national real estate PR distribution services.',
    telephone: phone,
    email: email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452010',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.7533,
      longitude: 75.8937,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '20:00',
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      { '@type': 'City', name: 'Indore' },
      { '@type': 'City', name: 'Bhopal' },
      { '@type': 'City', name: 'Ujjain' },
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Bengaluru' },
      { '@type': 'City', name: 'Delhi NCR' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'City', name: 'Dubai' },
    ],
    sameAs: [
      'https://www.youtube.com/@TheMarsTV',
      'https://www.facebook.com',
      'https://www.instagram.com',
      'https://www.linkedin.com',
    ],
    knowsAbout: [
      'Real Estate in India',
      'Residential Properties',
      'Commercial Real Estate',
      'Turnkey Construction Services',
      'Luxury Interior Designing',
      'Press Release & Real Estate PR Distribution',
      'RERA Compliance and Property Legal Verification',
    ],
  };
}

/**
 * 2. WebSite Schema with SearchAction
 */
export function generateWebSiteSchema(siteSettings?: Partial<SiteSettings>) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: siteSettings?.siteName || 'The Mars TV - Real Estate Platform',
    alternateName: ['The Mars TV', 'TheMarsTV Portal'],
    url: baseUrl,
    description:
      siteSettings?.tagline ||
      'Premier real estate portal to buy, sell, and rent verified residential and commercial properties in India.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  };
}

/**
 * 3. BreadcrumbList Schema for navigation states
 */
export function generateBreadcrumbSchema(
  currentView: string,
  selectedProperty?: Property | null,
  selectedNews?: NewsItem | null
) {
  const baseUrl = getBaseUrl();
  const items: Array<{ name: string; url: string }> = [{ name: 'Home', url: `${baseUrl}/` }];

  if (selectedProperty) {
    let parentName = 'Residential';
    let parentView = 'residential';
    if (selectedProperty.listingType === 'COMMERCIAL' || selectedProperty.propertyType === 'OFFICE' || selectedProperty.propertyType === 'RETAIL') {
      parentName = 'Commercial';
      parentView = 'commercial';
    } else if (selectedProperty.listingType === 'RENT') {
      parentName = 'Rent';
      parentView = 'rent';
    }
    items.push({ name: parentName, url: `${baseUrl}/#${parentView}` });
    items.push({ name: selectedProperty.title, url: `${baseUrl}/#property-${selectedProperty.id}` });
  } else if (selectedNews) {
    items.push({ name: 'Real Estate News', url: `${baseUrl}/#news` });
    items.push({ name: selectedNews.title, url: `${baseUrl}/#news-${selectedNews.id}` });
  } else {
    switch (currentView) {
      case 'residential':
        items.push({ name: 'Residential Properties', url: `${baseUrl}/#residential` });
        break;
      case 'commercial':
        items.push({ name: 'Commercial Properties & Offices', url: `${baseUrl}/#commercial` });
        break;
      case 'rent':
        items.push({ name: 'Properties for Rent', url: `${baseUrl}/#rent` });
        break;
      case 'construction':
        items.push({ name: 'Construction & Interior Services', url: `${baseUrl}/#construction` });
        break;
      case 'pr-services':
        items.push({ name: 'Real Estate PR & Media Distribution', url: `${baseUrl}/#pr-services` });
        break;
      case 'news':
        items.push({ name: 'Real Estate News & Market Trends', url: `${baseUrl}/#news` });
        break;
      case 'contact':
        items.push({ name: 'Contact Us', url: `${baseUrl}/#contact` });
        break;
      case 'wishlist':
        items.push({ name: 'Saved Properties', url: `${baseUrl}/#wishlist` });
        break;
      case 'admin-secret':
        items.push({ name: 'Admin Dashboard', url: `${baseUrl}/#admin-secret` });
        break;
      default:
        break;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 4. Page-Specific WebPage / CollectionPage / ContactPage Schema
 */
export function generatePageSchema(currentView: string, siteSettings?: Partial<SiteSettings>) {
  const baseUrl = getBaseUrl();

  const pageDetails: Record<
    string,
    { type: string; name: string; description: string; path: string }
  > = {
    home: {
      type: 'WebPage',
      name: 'The Mars TV - Verified Real Estate & Media Platform',
      description:
        'Explore verified luxury residential apartments, villas, commercial office spaces, plots, turnkey construction, and national real estate PR distribution.',
      path: '/',
    },
    residential: {
      type: 'CollectionPage',
      name: 'Residential Properties in India | Luxury Villas, Flats & Apartments',
      description:
        'Browse 100% RERA verified residential flats, penthouses, villas, and township plots in Indore, Bhopal, and prime metro corridors.',
      path: '/#residential',
    },
    commercial: {
      type: 'CollectionPage',
      name: 'Commercial Properties in India | Grade-A Offices, Retail & Showrooms',
      description:
        'Find verified commercial office spaces, retail shops, business hubs, and industrial plots for sale and long-term lease.',
      path: '/#commercial',
    },
    rent: {
      type: 'CollectionPage',
      name: 'Verified Rental Properties | Furnished Flats, Villas & Commercial Spaces',
      description:
        'Verified houses, luxury apartments, and commercial workspaces available for immediate rent with zero hidden fees.',
      path: '/#rent',
    },
    construction: {
      type: 'WebPage',
      name: 'Turnkey Construction & Luxury Interior Design Services | The Mars TV',
      description:
        'Comprehensive residential and commercial construction packages, architectural 3D elevation, Italian marble flooring, and modular interiors with 5-year warranty.',
      path: '/#construction',
    },
    'pr-services': {
      type: 'WebPage',
      name: 'Real Estate PR & Media Distribution Services | The Mars TV',
      description:
        'National press release distribution, television news broadcast, builder executive branding, and RERA reputation management for real estate developers.',
      path: '/#pr-services',
    },
    news: {
      type: 'CollectionPage',
      name: 'Real Estate News, Infrastructure Updates & Market Analysis | The Mars TV',
      description:
        'Daily updates on RERA regulations, property market trends, home loan interest rates, master plans, and infrastructure developments in India and internationally.',
      path: '/#news',
    },
    contact: {
      type: 'ContactPage',
      name: 'Contact The Mars TV | Real Estate Advisory & Support Desk',
      description:
        'Connect with verified real estate consultants, schedule physical site visits, or inquire about property listing and PR services.',
      path: '/#contact',
    },
  };

  const details = pageDetails[currentView] || pageDetails.home;

  return {
    '@context': 'https://schema.org',
    '@type': details.type,
    '@id': `${baseUrl}${details.path}#webpage`,
    url: `${baseUrl}${details.path}`,
    name: details.name,
    description: details.description,
    inLanguage: 'en-IN',
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    about: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}

/**
 * 5. ALL ARTICLES SCHEMA (NewsArticle / BlogPosting)
 * Generates an ItemList of NewsArticle schemas for all articles, plus standalone detailed NewsArticle
 */
export function generateArticleSchema(article: NewsItem) {
  const baseUrl = getBaseUrl();
  const articleUrl = `${baseUrl}/#news-${article.id}`;
  const cleanBody = cleanText(article.content || article.excerpt);
  const cleanExcerpt = cleanText(article.excerpt || article.content).slice(0, 200);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${articleUrl}#article`,
    isPartOf: {
      '@type': 'CollectionPage',
      '@id': `${baseUrl}/#news`,
      name: 'The Mars TV Real Estate News Desk',
    },
    headline: article.title,
    name: article.title,
    description: cleanExcerpt,
    articleBody: cleanBody,
    image: [article.image || `${baseUrl}/mars_tv_logo.jpg`],
    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified: article.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || 'The Mars TV Editorial Desk',
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'Real Estate Market Trends',
    inLanguage: 'en-IN',
    contentLocation: {
      '@type': 'Place',
      name: article.city
        ? `${article.city}, ${article.state || 'India'}`
        : article.state || article.region || 'India',
    },
  };
}

/**
 * Generates an ItemList of all news articles for Google News/Article carousel indexing
 */
export function generateAllArticlesListSchema(newsItems: NewsItem[]) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Real Estate News & Industry Reports',
    description: 'Latest real estate news articles, market analysis, and policy updates from The Mars TV.',
    url: `${baseUrl}/#news`,
    numberOfItems: newsItems.length,
    itemListElement: newsItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateArticleSchema(item),
    })),
  };
}

/**
 * 6. ALL SERVICES SCHEMA (PR Services + Turnkey Construction & Interiors)
 */
export function generateAllServicesSchema(
  prServices: PRServiceItem[],
  constructionPackages: ConstructionPackage[],
  siteSettings?: Partial<SiteSettings>
) {
  const baseUrl = getBaseUrl();
  const providerRef = { '@id': `${baseUrl}/#organization` };

  // A. PR Services Offer Catalog
  const prServiceCatalog = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#service-pr-strategy`,
    name: 'Real Estate Public Relations & Brand Strategy',
    serviceType: 'Public Relations and Media Outreach',
    provider: providerRef,
    url: `${baseUrl}/#pr-services`,
    description:
      'High-impact media coverage, national press release distribution, television panel features, and executive branding for builders, property developers, and architectural firms.',
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'The Mars TV Real Estate PR Packages',
      itemListElement: prServices.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          serviceType: 'Real Estate Media PR',
          provider: providerRef,
        },
      })),
    },
  };

  // B. Turnkey Construction & Interior Design Service
  const constructionServiceCatalog = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#service-construction-interiors`,
    name: 'Turnkey Civil Construction & Luxury Interior Design Services',
    serviceType: 'Building Construction and Interior Decoration',
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'The Mars TV Construction & Interiors',
      url: `${baseUrl}/#construction`,
      telephone: siteSettings?.phonePrimary || '+91 98260 00000',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Indore',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
    url: `${baseUrl}/#construction`,
    description:
      'End-to-end turnkey residential and commercial civil construction, structural 3D design, Italian marble laying, and bespoke modular kitchen interiors with standard 5-year structural guarantee.',
    areaServed: [
      { '@type': 'City', name: 'Indore' },
      { '@type': 'City', name: 'Bhopal' },
      { '@type': 'City', name: 'Ujjain' },
      { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction Packages & Rates',
      itemListElement: constructionPackages.map((pkg) => ({
        '@type': 'Offer',
        name: pkg.name,
        description: pkg.description,
        price: pkg.ratePerSqFt,
        priceCurrency: 'INR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: pkg.ratePerSqFt,
          priceCurrency: 'INR',
          unitText: 'per square foot',
        },
        itemOffered: {
          '@type': 'Service',
          name: pkg.name,
          description: pkg.description,
          serviceOutput: pkg.features.join(', '),
        },
      })),
    },
  };

  return [prServiceCatalog, constructionServiceCatalog];
}

/**
 * 7. PROPERTY SCHEMA (SingleFamilyResidence, Apartment, CommercialProperty, RealEstateListing)
 */
export function generatePropertySchema(prop: Property) {
  const baseUrl = getBaseUrl();
  const propertyUrl = `${baseUrl}/#property-${prop.id}`;

  // Determine specific Schema.org Accommodation type
  let schemaType = 'SingleFamilyResidence';
  if (prop.propertyType === 'APARTMENT' || prop.propertyType === 'PENTHOUSE' || prop.propertyType === 'STUDIO') {
    schemaType = 'Apartment';
  } else if (prop.propertyType === 'OFFICE' || prop.propertyType === 'RETAIL' || prop.propertyType === 'WAREHOUSE') {
    schemaType = 'CommercialProperty';
  } else if (prop.propertyType === 'PLOT' || prop.propertyType === 'LAND' || prop.propertyType === 'AGRICULTURE_LAND') {
    schemaType = 'Landform';
  }

  const images = (prop.images && prop.images.length > 0)
    ? prop.images.map((img) => img.url)
    : [`${baseUrl}/mars_tv_logo.jpg`];

  const cleanDesc = cleanText(prop.description || `${prop.title} in ${prop.location}, ${prop.city}`);

  return {
    '@context': 'https://schema.org',
    '@type': [schemaType, 'RealEstateListing'],
    '@id': `${propertyUrl}#listing`,
    name: prop.title,
    description: cleanDesc,
    url: propertyUrl,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: prop.address || prop.location,
      addressLocality: prop.city || 'Indore',
      addressRegion: prop.state || 'Madhya Pradesh',
      addressCountry: prop.region === 'International' ? 'AE' : 'IN',
      postalCode: prop.pincode,
    },
    ...(prop.lat && prop.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: prop.lat,
            longitude: prop.lng,
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: prop.price,
      priceCurrency: 'INR',
      availability: prop.status === 'ACTIVE' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      validFrom: prop.createdAt || new Date().toISOString(),
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: prop.price,
        priceCurrency: 'INR',
        unitText: prop.listingType === 'RENT' ? 'MONTH' : undefined,
      },
    },
    numberOfBedrooms: prop.bedrooms,
    numberOfBathroomsTotal: prop.bathrooms,
    ...(prop.area
      ? {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: prop.area,
            unitCode: 'FTK', // Square Foot
          },
        }
      : {}),
    amenityFeature: (prop.amenities || []).map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
  };
}

/**
 * Generates an ItemList of properties for property catalog pages
 */
export function generatePropertyListSchema(properties: Property[], pageTitle: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    url: pageUrl,
    numberOfItems: properties.length,
    itemListElement: properties.slice(0, 30).map((prop, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: generatePropertySchema(prop),
    })),
  };
}

/**
 * 8. MASTER GRAPH SCHEMA BUILDER
 * Assembles all schemas into an interconnected, valid Schema.org @graph
 */
export function generateMasterSchemaGraph(params: {
  currentView: string;
  selectedProperty?: Property | null;
  selectedNews?: NewsItem | null;
  properties: Property[];
  newsItems: NewsItem[];
  prServices: PRServiceItem[];
  constructionPackages: ConstructionPackage[];
  siteSettings?: Partial<SiteSettings>;
}) {
  const {
    currentView,
    selectedProperty,
    selectedNews,
    properties,
    newsItems,
    prServices,
    constructionPackages,
    siteSettings,
  } = params;

  const baseUrl = getBaseUrl();

  // Core entities
  const organization = generateOrganizationSchema(siteSettings);
  const website = generateWebSiteSchema(siteSettings);
  const breadcrumb = generateBreadcrumbSchema(currentView, selectedProperty, selectedNews);
  const webpage = generatePageSchema(currentView, siteSettings);

  const graph: any[] = [organization, website, breadcrumb, webpage];

  // Specific entity when modal is open
  if (selectedProperty) {
    graph.push(generatePropertySchema(selectedProperty));
  }

  if (selectedNews) {
    graph.push(generateArticleSchema(selectedNews));
  }

  // PR & Construction Services
  const services = generateAllServicesSchema(prServices, constructionPackages, siteSettings);
  graph.push(...services);

  // All Articles list on News page or Home
  if (currentView === 'news' || currentView === 'home') {
    if (newsItems.length > 0) {
      graph.push(generateAllArticlesListSchema(newsItems));
    }
  }

  // Properties listings for property views
  if (currentView === 'residential') {
    const resProps = properties.filter((p) => p.propertyCategory !== 'COMMERCIAL' && p.listingType !== 'RENT');
    if (resProps.length > 0) {
      graph.push(generatePropertyListSchema(resProps, 'Residential Properties for Sale', `${baseUrl}/#residential`));
    }
  } else if (currentView === 'commercial') {
    const commProps = properties.filter((p) => p.propertyCategory === 'COMMERCIAL' || p.listingType === 'COMMERCIAL' || p.propertyType === 'OFFICE' || p.propertyType === 'RETAIL');
    if (commProps.length > 0) {
      graph.push(generatePropertyListSchema(commProps, 'Commercial Real Estate & Office Spaces', `${baseUrl}/#commercial`));
    }
  } else if (currentView === 'rent') {
    const rentProps = properties.filter((p) => p.listingType === 'RENT');
    if (rentProps.length > 0) {
      graph.push(generatePropertyListSchema(rentProps, 'Verified Rental Properties & Flats', `${baseUrl}/#rent`));
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
