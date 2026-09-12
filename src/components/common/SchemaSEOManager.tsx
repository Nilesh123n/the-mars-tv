import { useState } from 'react';
import { Property, NewsItem, PRServiceItem, ConstructionPackage, SiteSettings } from '../../types';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generatePageSchema,
  generateArticleSchema,
  generateAllArticlesListSchema,
  generateAllServicesSchema,
  generatePropertySchema,
  generateMasterSchemaGraph,
} from '../../utils/schemaGenerator';
import {
  Code,
  Copy,
  Check,
  Globe,
  FileText,
  Briefcase,
  Home,
  CheckCircle2,
  ExternalLink,
  Download,
  Sparkles,
  Layers,
} from 'lucide-react';

interface SchemaSEOManagerProps {
  properties: Property[];
  newsItems: NewsItem[];
  prServices: PRServiceItem[];
  constructionPackages: ConstructionPackage[];
  siteSettings: SiteSettings;
  showToast: (msg: string) => void;
}

type SchemaCategory = 'all' | 'pages' | 'articles' | 'services' | 'properties' | 'organization';

export default function SchemaSEOManager({
  properties,
  newsItems,
  prServices,
  constructionPackages,
  siteSettings,
  showToast,
}: SchemaSEOManagerProps) {
  const [activeCategory, setActiveCategory] = useState<SchemaCategory>('all');
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(newsItems[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Schema markup copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  // 1. Full Combined Graph
  const masterGraph = generateMasterSchemaGraph({
    currentView: selectedPage,
    properties,
    newsItems,
    prServices,
    constructionPackages,
    siteSettings,
  });

  // 2. Organization & Website
  const orgSchema = generateOrganizationSchema(siteSettings);
  const websiteSchema = generateWebSiteSchema(siteSettings);

  // 3. Pages List
  const pageKeys = [
    { key: 'home', label: 'Home Page', desc: 'Main real estate portal & search action schema' },
    { key: 'residential', label: 'Residential Properties', desc: 'CollectionPage + ItemList of luxury flats & villas' },
    { key: 'commercial', label: 'Commercial Real Estate', desc: 'CollectionPage + ItemList of offices & retail hubs' },
    { key: 'rent', label: 'Rent Properties', desc: 'Rental listings with UnitPriceSpecification' },
    { key: 'construction', label: 'Construction & Interiors', desc: 'GeneralContractor + construction package offers' },
    { key: 'pr-services', label: 'Real Estate PR Services', desc: 'Media distribution & PR Service offer catalog' },
    { key: 'news', label: 'Real Estate News', desc: 'NewsMediaOrganization + ItemList of NewsArticles' },
    { key: 'contact', label: 'Contact Us', desc: 'ContactPage + LocalBusiness coordinates & desk' },
  ];

  const currentPageSchema = generatePageSchema(selectedPage, siteSettings);
  const currentBreadcrumb = generateBreadcrumbSchema(selectedPage);

  // 4. Articles
  const allArticlesList = generateAllArticlesListSchema(newsItems);
  const activeArticle = newsItems.find((n) => n.id === selectedArticleId) || newsItems[0];
  const activeArticleSchema = activeArticle ? generateArticleSchema(activeArticle) : null;

  // 5. Services
  const servicesSchemas = generateAllServicesSchema(prServices, constructionPackages, siteSettings);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-6 shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#D61F26] text-white text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">
              Google SEO & Rich Snippets
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Valid JSON-LD
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Structured Data & Schema Markup Engine
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Automatic Schema.org JSON-LD structured data is injected into all pages, articles, PR services, construction packages, and property listings for maximum Google Search & rich snippet dominance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Google Rich Results Test
          </a>
          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Schema.org Validator
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#D61F26] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Master Graph (All In One)
        </button>

        <button
          onClick={() => setActiveCategory('pages')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCategory === 'pages'
              ? 'bg-[#D61F26] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          All Pages ({pageKeys.length})
        </button>

        <button
          onClick={() => setActiveCategory('articles')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCategory === 'articles'
              ? 'bg-[#D61F26] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          All Articles ({newsItems.length})
        </button>

        <button
          onClick={() => setActiveCategory('services')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCategory === 'services'
              ? 'bg-[#D61F26] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          All Services (PR & Construction)
        </button>

        <button
          onClick={() => setActiveCategory('properties')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCategory === 'properties'
              ? 'bg-[#D61F26] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Home className="w-4 h-4" />
          Properties ({properties.length})
        </button>

        <button
          onClick={() => setActiveCategory('organization')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCategory === 'organization'
              ? 'bg-[#D61F26] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Code className="w-4 h-4" />
          Organization & WebSite
        </button>
      </div>

      {/* Content Area */}
      {activeCategory === 'all' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Complete Master Schema.org Graph</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Automatically rendered on the site with RealEstateAgent, WebSite, Breadcrumbs, Pages, Articles, and Services interconnected via @graph.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(JSON.stringify(masterGraph, null, 2), 'master')}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {copiedKey === 'master' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'master' ? 'Copied!' : 'Copy JSON-LD'}
              </button>
              <button
                onClick={() => handleDownload(masterGraph, 'themarstv-schema-graph.json')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed border border-gray-800">
              {JSON.stringify(masterGraph, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {activeCategory === 'pages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {pageKeys.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPage(p.key)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedPage === p.key
                    ? 'bg-red-50/80 border-[#D61F26] shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold text-gray-900">{p.label}</div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#D61F26] uppercase tracking-wider">Page Schema</span>
                <h4 className="text-base font-bold text-gray-900 mt-0.5">
                  {pageKeys.find((p) => p.key === selectedPage)?.label}
                </h4>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify({ '@context': 'https://schema.org', ...currentPageSchema, breadcrumbs: currentBreadcrumb }, null, 2),
                    `page-${selectedPage}`
                  )
                }
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === `page-${selectedPage}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === `page-${selectedPage}` ? 'Copied!' : 'Copy Page Schema'}
              </button>
            </div>

            <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[400px] leading-relaxed border border-gray-800">
              {JSON.stringify(
                {
                  '@context': 'https://schema.org',
                  ...currentPageSchema,
                  breadcrumb: currentBreadcrumb,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {activeCategory === 'articles' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">All Articles Schema.org (NewsArticle)</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete structured data for Google News indexing, carousel snippets, author bylines, and location tagging.
                </p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(allArticlesList, null, 2), 'all-articles')}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copiedKey === 'all-articles' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'all-articles' ? 'Copied!' : 'Copy All Articles List Schema'}
              </button>
            </div>

            {/* Individual Article Selector */}
            {newsItems.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 block">Inspect Specific Article Schema:</label>
                <select
                  value={selectedArticleId}
                  onChange={(e) => setSelectedArticleId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#D61F26]"
                >
                  {newsItems.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.title} ({article.category})
                    </option>
                  ))}
                </select>

                {activeArticleSchema && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600">
                        {activeArticle?.title}
                      </span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(activeArticleSchema, null, 2), 'single-article')}
                        className="text-xs font-bold text-[#D61F26] hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'single-article' ? 'Copied!' : 'Copy this article JSON'}
                      </button>
                    </div>
                    <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] leading-relaxed border border-gray-800">
                      {JSON.stringify(activeArticleSchema, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeCategory === 'services' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">All Services Schema (PR & Construction)</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rich Schema.org `Service` & `OfferCatalog` objects for PR media distribution packages and turnkey civil construction per sq.ft offers.
                </p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(servicesSchemas, null, 2), 'all-services')}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'all-services' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'all-services' ? 'Copied!' : 'Copy Services Schemas'}
              </button>
            </div>

            <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[480px] leading-relaxed border border-gray-800">
              {JSON.stringify(servicesSchemas, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {activeCategory === 'properties' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">All Properties Schema (RealEstateListing)</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Google-compliant SingleFamilyResidence, Apartment, and CommercialProperty schemas with prices, amenities, and locations.
                </p>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      properties.map((p) => generatePropertySchema(p)),
                      null,
                      2
                    ),
                    'all-props'
                  )
                }
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'all-props' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'all-props' ? 'Copied!' : 'Copy All Properties'}
              </button>
            </div>

            {properties.length > 0 ? (
              <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[480px] leading-relaxed border border-gray-800">
                {JSON.stringify(
                  properties.slice(0, 5).map((p) => generatePropertySchema(p)),
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="text-center py-8 text-gray-500 text-xs">
                No active properties found in the database.
              </div>
            )}
          </div>
        </div>
      )}

      {activeCategory === 'organization' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Organization & RealEstateAgent</h4>
              <button
                onClick={() => handleCopy(JSON.stringify(orgSchema, null, 2), 'org')}
                className="text-xs font-bold text-[#D61F26] hover:underline flex items-center gap-1"
              >
                {copiedKey === 'org' ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[350px] leading-relaxed border border-gray-800">
              {JSON.stringify(orgSchema, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">WebSite & SearchAction</h4>
              <button
                onClick={() => handleCopy(JSON.stringify(websiteSchema, null, 2), 'website')}
                className="text-xs font-bold text-[#D61F26] hover:underline flex items-center gap-1"
              >
                {copiedKey === 'website' ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[350px] leading-relaxed border border-gray-800">
              {JSON.stringify(websiteSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
