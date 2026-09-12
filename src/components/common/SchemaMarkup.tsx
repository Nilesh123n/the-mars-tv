import { useEffect } from 'react';
import { Property, NewsItem, PRServiceItem, ConstructionPackage, SiteSettings } from '../../types';
import { generateMasterSchemaGraph } from '../../utils/schemaGenerator';

interface SchemaMarkupProps {
  currentView: string;
  selectedProperty?: Property | null;
  selectedNews?: NewsItem | null;
  properties: Property[];
  newsItems: NewsItem[];
  prServices: PRServiceItem[];
  constructionPackages: ConstructionPackage[];
  siteSettings?: Partial<SiteSettings>;
}

export default function SchemaMarkup({
  currentView,
  selectedProperty,
  selectedNews,
  properties,
  newsItems,
  prServices,
  constructionPackages,
  siteSettings,
}: SchemaMarkupProps) {
  useEffect(() => {
    // 1. Generate full Schema.org @graph
    const schemaData = generateMasterSchemaGraph({
      currentView,
      selectedProperty,
      selectedNews,
      properties,
      newsItems,
      prServices,
      constructionPackages,
      siteSettings,
    });

    const jsonLdString = JSON.stringify(schemaData, null, 2);

    // 2. Inject or update the dynamic <script type="application/ld+json"> in <head>
    let scriptTag = document.getElementById('mars-schema-dynamic') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'mars-schema-dynamic';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = jsonLdString;

    // 3. Dynamically update document title & meta tags for enhanced SEO
    let dynamicTitle = 'The Mars TV - Real Estate Platform';
    let dynamicDescription =
      'Premier real estate portal to buy, sell, and rent verified residential and commercial properties in India.';
    let dynamicImage = `${window.location.origin}/mars_tv_logo.jpg`;

    if (selectedProperty) {
      dynamicTitle = `${selectedProperty.title} | ${selectedProperty.city} - The Mars TV`;
      dynamicDescription = (
        selectedProperty.description ||
        `Verified ${selectedProperty.propertyType} in ${selectedProperty.location}, ${selectedProperty.city}. Price: ${selectedProperty.priceLabel}.`
      ).slice(0, 160);
      if (selectedProperty.images?.[0]?.url) {
        dynamicImage = selectedProperty.images[0].url;
      }
    } else if (selectedNews) {
      dynamicTitle = `${selectedNews.title} | Real Estate News - The Mars TV`;
      dynamicDescription = (selectedNews.excerpt || selectedNews.content || dynamicDescription).slice(0, 160);
      if (selectedNews.image) {
        dynamicImage = selectedNews.image;
      }
    } else {
      switch (currentView) {
        case 'residential':
          dynamicTitle = 'Residential Properties for Sale | Villas & Flats - The Mars TV';
          dynamicDescription =
            'Explore 100% verified luxury apartments, villas, and residential plots with RERA approval in India.';
          break;
        case 'commercial':
          dynamicTitle = 'Commercial Real Estate & Office Spaces - The Mars TV';
          dynamicDescription =
            'Find prime grade-A commercial offices, retail shops, and commercial land plots for sale and lease.';
          break;
        case 'rent':
          dynamicTitle = 'Verified Properties for Rent | Houses & Flats - The Mars TV';
          dynamicDescription =
            'Search verified rental homes, furnished apartments, and commercial office rentals.';
          break;
        case 'construction':
          dynamicTitle = 'Turnkey Construction & Luxury Interior Services - The Mars TV';
          dynamicDescription =
            'Turnkey civil home construction, 3D architectural elevations, and luxury interior design packages starting from ₹1,450/sq.ft.';
          break;
        case 'pr-services':
          dynamicTitle = 'Real Estate PR & Media Distribution Services - The Mars TV';
          dynamicDescription =
            'High-impact press release distribution, television media interviews, and executive branding for real estate developers.';
          break;
        case 'news':
          dynamicTitle = 'Real Estate News, Market Trends & RERA Updates - The Mars TV';
          dynamicDescription =
            'Latest real estate news, policy updates, price trends, and infrastructure developments in India and Dubai.';
          break;
        case 'contact':
          dynamicTitle = 'Contact Us | The Mars TV Real Estate';
          dynamicDescription =
            'Get in touch with verified real estate advisors for site visits, project listing, and media inquiries.';
          break;
        case 'admin-secret':
          dynamicTitle = 'Admin Portal | The Mars TV';
          break;
        default:
          break;
      }
    }

    document.title = dynamicTitle;

    // Helper to safely set meta attribute
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) meta.setAttribute('property', propName);
        } else if (selector.includes('name=')) {
          const nameValue = selector.match(/name="([^"]+)"/)?.[1];
          if (nameValue) meta.setAttribute('name', nameValue);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', dynamicDescription);
    setMetaTag('meta[property="og:title"]', 'content', dynamicTitle);
    setMetaTag('meta[property="og:description"]', 'content', dynamicDescription);
    setMetaTag('meta[property="og:image"]', 'content', dynamicImage);
    setMetaTag('meta[property="og:url"]', 'content', window.location.href);

    // Cleanup on unmount
    return () => {
      // Keep script in head for crawler consistency
    };
  }, [
    currentView,
    selectedProperty,
    selectedNews,
    properties,
    newsItems,
    prServices,
    constructionPackages,
    siteSettings,
  ]);

  // Headless component - operates strictly on document.head
  return null;
}
