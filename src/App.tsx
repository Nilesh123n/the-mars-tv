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

// Mock Data
import {
  initialProperties,
  initialProjects,
  initialNews,
  initialPRServices,
  initialBrandPartners,
  initialTestimonials,
  initialLeads,
} from './data/mockData';

import { Property, Project, NewsItem, PRServiceItem, Lead, LeadStatus } from './types';

export default function App() {
  // Navigation View with Hash check
  const [currentView, setCurrentView] = useState<string>(() => {
    if (window.location.hash === '#/admin-secret') {
      return 'admin-secret';
    }
    return 'home';
  });

  // State Collections with LocalStorage Persistence
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('pr_properties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialProperties;
  });

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('pr_news');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialNews;
  });

  const [prServices, setPRServices] = useState<PRServiceItem[]>(() => {
    const saved = localStorage.getItem('pr_services');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialPRServices;
  });

  const [brandPartners] = useState(initialBrandPartners);
  const [testimonials] = useState(initialTestimonials);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pr_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('pr_news', JSON.stringify(newsItems));
  }, [newsItems]);

  useEffect(() => {
    localStorage.setItem('pr_services', JSON.stringify(prServices));
  }, [prServices]);

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
    localStorage.removeItem('pr_properties');
    localStorage.removeItem('pr_news');
    localStorage.removeItem('pr_services');
    setProperties(initialProperties);
    setNewsItems(initialNews);
    setPRServices(initialPRServices);
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
  const handleAddLead = (leadData: { name: string; phone: string; email?: string; message?: string; propertyTitle?: string; leadType?: string }) => {
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

    setLeads((prev) => [newLead, ...prev]);
    showToast('Inquiry submitted! Our representative will call you shortly.');
  };

  // Property Actions (Admin / User)
  const handleAddProperty = (newProp: Partial<Property>) => {
    const fullProp = newProp as Property;
    fullProp.id = `prop-${Date.now()}`;
    setProperties((prev) => [fullProp, ...prev]);
    showToast(`Property "${fullProp.title}" published successfully!`);
  };

  const handleToggleSponsored = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSponsored: !p.isSponsored } : p))
    );
    showToast('Sponsored status updated.');
  };

  const handleToggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    showToast('Featured placement updated.');
  };

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast('Property removed from database.');
  };

  // Lead Status Update
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    showToast(`Lead status updated to ${status}`);
  };

  // News Actions
  const handleToggleNewsStatus = (newsId: string) => {
    setNewsItems((prev) =>
      prev.map((n) =>
        n.id === newsId
          ? { ...n, status: n.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }
          : n
      )
    );
    showToast('Article publish status updated.');
  };

  const handleDeleteNews = (newsId: string) => {
    setNewsItems((prev) => prev.filter((n) => n.id !== newsId));
    showToast('Article deleted.');
  };

  const handleAddNews = (item: Partial<NewsItem>) => {
    const fullItem = item as NewsItem;
    fullItem.id = `news-${Date.now()}`;
    setNewsItems((prev) => [fullItem, ...prev]);
    showToast('Article published to News Hub.');
  };

  // Project Actions
  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    showToast('Project deleted.');
  };

  const handleAddProject = (project: Partial<Project>) => {
    const fullProj = project as Project;
    fullProj.id = `proj-${Date.now()}`;
    setProjects((prev) => [fullProj, ...prev]);
    showToast('Project added to portfolio.');
  };

  // Client Portal Views
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#D61F26] selection:text-white">
      
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        wishlistCount={wishlist.length}
        onOpenListProperty={() => setShowListPropertyModal(true)}
        onOpenEMICalculator={() => {
          setEmiAmount(12500000);
          setShowEMICalculator(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onSearch={(criteria) => {
                if (criteria.propertyCategory === 'Commercial') {
                  setCurrentView('commercial');
                } else {
                  setCurrentView('residential');
                }
                const categoryText = criteria.propertyCategory ? ` (${criteria.propertyCategory})` : '';
                showToast(`Filtered properties for ${criteria.location || criteria.tab}${categoryText}`);
              }}
            />

            <LatestNews
              newsItems={newsItems}
              onSelectNews={(news) => setSelectedNews(news)}
              onViewAllNews={() => setCurrentView('news')}
            />

            <SponsoredProperties
              properties={properties}
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
