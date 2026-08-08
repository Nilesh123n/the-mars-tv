import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SponsoredProperties from './components/SponsoredProperties';
import FeaturedProperties from './components/FeaturedProperties';
import ExclusiveProjects from './components/ExclusiveProjects';
import LatestNews from './components/LatestNews';
import PRServices from './components/PRServices';
import BrandPartners from './components/BrandPartners';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

// Pages
import ResidentialPage from './components/pages/ResidentialPage';
import CommercialPage from './components/pages/CommercialPage';
import RentPage from './components/pages/RentPage';
import ConstructionPage from './components/pages/ConstructionPage';
import NewsPage from './components/pages/NewsPage';
import PRServicesPage from './components/pages/PRServicesPage';
import ContactPage from './components/pages/ContactPage';
import AdminSecretPage from './components/pages/AdminSecretPage';

// Modals
import PropertyDetailModal from './components/PropertyDetailModal';
import EMICalculatorModal from './components/EMICalculatorModal';
import ListPropertyModal from './components/ListPropertyModal';
import NewsDetailModal from './components/NewsDetailModal';
import Toast from './components/Toast';

// Mock Data Defaults
import {
  initialProperties,
  initialProjects,
  initialNews,
  initialPRServices,
  initialBrandPartners,
  initialTestimonials,
  initialLeads,
  initialConstructionPackages,
  initialSiteSettings,
} from './data/mockData';

import { DataService } from './lib/dataService';
import { Property, Project, NewsItem, PRServiceItem, Lead, ConstructionPackage, SiteSettings } from './types';

export default function App() {
  // Navigation View with Hash check
  const [currentView, setCurrentView] = useState<string>(() => {
    if (window.location.hash === '#/admin-secret') {
      return 'admin-secret';
    }
    return 'home';
  });

  // State Collections with Fast DataService Caching
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);
  const [prServices, setPRServices] = useState<PRServiceItem[]>(initialPRServices);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [constructionPackages, setConstructionPackages] = useState<ConstructionPackage[]>(initialConstructionPackages);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);

  const [brandPartners] = useState(initialBrandPartners);
  const [testimonials] = useState(initialTestimonials);

  // Load Initial Data from Cache / Supabase ONCE on Mount (No Loops, No Egress Spam)
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [pData, nData, prData, lData, pkgData, settingsData, projData] = await Promise.all([
          DataService.getProperties(),
          DataService.getNews(),
          DataService.getPRServices(),
          DataService.getLeads(),
          DataService.getConstructionPackages(),
          DataService.getSiteSettings(),
          DataService.getProjects(),
        ]);

        if (isMounted) {
          if (pData?.length) setProperties(pData);
          if (nData?.length) setNewsItems(nData);
          if (prData?.length) setPRServices(prData);
          if (lData?.length) setLeads(lData);
          if (pkgData?.length) setConstructionPackages(pkgData);
          if (settingsData) setSiteSettings(settingsData);
          if (projData?.length) setProjects(projData);
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Hash Navigation Sync
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin-secret') {
        setCurrentView('admin-secret');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset to original default data
  const handleResetDefaultData = () => {
    DataService.resetAllLocalCache();
    setProperties(initialProperties);
    setNewsItems(initialNews);
    setPRServices(initialPRServices);
    setLeads(initialLeads);
    setConstructionPackages(initialConstructionPackages);
    setSiteSettings(initialSiteSettings);
    setProjects(initialProjects);
    showToast('All content reset to original defaults.');
  };

  // User Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prop-1', 'prop-2']);

  // Modals & Drawers
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [emiAmount, setEmiAmount] = useState(12500000);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Toggle Wishlist
  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        showToast('Property removed from saved wishlist.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Property added to saved wishlist!');
        return [...prev, id];
      }
    });
  };

  // Lead Submission
  const handleAddLead = async (leadData: { name: string; phone: string; email?: string; message?: string; propertyTitle?: string; leadType?: string }) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name,
      email: leadData.email || '',
      phone: leadData.phone,
      message: leadData.message || '',
      leadType: leadData.leadType || 'PROPERTY_ENQUIRY',
      status: 'NEW',
      source: 'WEBSITE',
      propertyTitle: leadData.propertyTitle,
      createdAt: new Date().toISOString(),
    };

    const updated = await DataService.saveLead(newLead);
    setLeads(updated);
    showToast('Inquiry submitted! Our representative will call you shortly.');
  };

  // Property Actions (Admin / User)
  const handleAddProperty = async (newProp: Partial<Property>) => {
    const fullProp = newProp as Property;
    fullProp.id = `prop-${Date.now()}`;
    const updated = await DataService.saveProperty(fullProp);
    setProperties(updated);
    showToast(`Property "${fullProp.title}" published successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] font-sans antialiased selection:bg-[#D61F26] selection:text-white flex flex-col justify-between">
      {/* Header Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        wishlistCount={wishlist.length}
        onOpenListProperty={() => setShowListPropertyModal(true)}
        onOpenEMICalculator={() => setShowEMICalculator(true)}
      />

      <main className="flex-grow pt-[72px]">
        {currentView === 'home' && (
          <>
            <Hero onSearch={() => setCurrentView('residential')} />

            <LatestNews
              newsItems={newsItems}
              onSelectNews={(item) => setSelectedNews(item)}
              onViewAllNews={() => setCurrentView('news')}
            />

            <SponsoredProperties
              properties={properties.filter((p) => p.isSponsored)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onViewAll={() => setCurrentView('residential')}
            />

            <FeaturedProperties
              properties={properties}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onViewAll={() => setCurrentView('residential')}
            />

            <ExclusiveProjects
              projects={projects}
              onSelectProject={(proj) => {
                showToast(`Viewing ${proj.title}`);
                setSelectedProperty({
                  id: proj.id,
                  title: proj.title,
                  slug: proj.slug,
                  description: proj.description,
                  price: proj.price,
                  priceLabel: proj.priceLabel,
                  location: proj.location,
                  city: proj.city,
                  area: 3000,
                  propertyType: proj.projectType === 'COMMERCIAL' ? 'OFFICE' : 'APARTMENT',
                  listingType: proj.projectType === 'COMMERCIAL' ? 'COMMERCIAL' : 'BUY',
                  status: 'ACTIVE',
                  isSponsored: true,
                  isFeatured: true,
                  isVerified: true,
                  isReraReg: true,
                  reraNumber: proj.reraNumber,
                  images: [{ url: proj.image, isPrimary: true, alt: proj.title }],
                  amenities: proj.amenities,
                  createdAt: proj.createdAt,
                });
              }}
              onViewAllProjects={() => setCurrentView('residential')}
            />

            <PRServices
              services={prServices}
              onSelectService={(service) => {
                setCurrentView('pr-services');
                showToast(`PR Service: ${service.title}`);
              }}
              onViewAllServices={() => setCurrentView('pr-services')}
            />

            <BrandPartners partners={brandPartners} />

            <Testimonials
              testimonials={testimonials}
              onViewAllTestimonials={() => showToast('Displaying 5-star customer ratings!')}
            />

            <Newsletter
              onSubscribe={(email) => handleAddLead({ name: 'Subscriber', phone: 'N/A', email, leadType: 'NEWSLETTER' })}
            />
          </>
        )}

        {currentView === 'residential' && (
          <ResidentialPage
            properties={properties}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}

        {currentView === 'commercial' && (
          <CommercialPage
            properties={properties}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}

        {currentView === 'rent' && (
          <RentPage
            properties={properties}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenListProperty={() => setShowListPropertyModal(true)}
          />
        )}

        {currentView === 'construction' && (
          <ConstructionPage
            onAddLead={handleAddLead}
          />
        )}

        {currentView === 'news' && (
          <NewsPage
            newsItems={newsItems}
            onSelectNews={(item) => setSelectedNews(item)}
          />
        )}

        {currentView === 'pr-services' && (
          <PRServicesPage
            services={prServices}
            onSubmitLead={handleAddLead}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage onSubmitLead={handleAddLead} />
        )}

        {currentView === 'wishlist' && (
          <ResidentialPage
            properties={properties.filter((p) => wishlist.includes(p.id))}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}

        {currentView === 'admin-secret' && (
          <AdminSecretPage
            properties={properties}
            setProperties={setProperties}
            newsItems={newsItems}
            setNewsItems={setNewsItems}
            prServices={prServices}
            setPRServices={setPRServices}
            leads={leads}
            setLeads={setLeads}
            constructionPackages={constructionPackages}
            setConstructionPackages={setConstructionPackages}
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            onNavigateHome={() => {
              window.location.hash = '';
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showToast={showToast}
            onResetData={handleResetDefaultData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isWishlisted={wishlist.includes(selectedProperty.id)}
          onToggleWishlist={handleToggleWishlist}
          onOpenEMICalculator={(amt) => {
            setEmiAmount(amt);
            setShowEMICalculator(true);
          }}
          onSubmitLead={(lead) => handleAddLead(lead)}
        />
      )}

      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {showEMICalculator && (
        <EMICalculatorModal
          initialAmount={emiAmount}
          onClose={() => setShowEMICalculator(false)}
        />
      )}

      {showListPropertyModal && (
        <ListPropertyModal
          onClose={() => setShowListPropertyModal(false)}
          onAddProperty={handleAddProperty}
        />
      )}

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}
