import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Server,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (view: string) => void;
}

export default function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const [activeSection, setActiveSection] = useState('collection');

  const sections = [
    { id: 'introduction', label: '1. Introduction & Scope' },
    { id: 'collection', label: '2. Information We Collect' },
    { id: 'usage', label: '3. How We Use Your Data' },
    { id: 'sharing', label: '4. Sharing & Disclosures' },
    { id: 'analytics', label: '5. Cookies & Analytics' },
    { id: 'security', label: '6. Data Security & Storage' },
    { id: 'rights', label: '7. Your Privacy Rights' },
    { id: 'retention', label: '8. Data Retention' },
    { id: 'grievance', label: '9. Grievance Officer' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#111111]">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-gray-950 via-gray-900 to-red-950 text-white py-12 sm:py-16 border-b border-red-900/40">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#D61F26]/20 border border-[#D61F26]/40 text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D61F26]" />
              Compliance & Legal Transparency
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Privacy Policy
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              At The Mars TV, we take your trust seriously. This Privacy Policy details how we collect, store, safeguard, and process your personal and transactional information across our real estate media portal and related advisory services.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                Last Updated: October 2024
              </span>
              <span>•</span>
              <span className="text-gray-300 font-medium">DPDP Act 2023 & IT Act Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Table of Contents (Desktop) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D61F26]" />
                Policy Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-red-50 text-[#D61F26] border-l-4 border-[#D61F26]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>{sec.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 text-[11px] space-y-1.5 text-gray-600">
                  <span className="font-bold text-gray-900 block">Questions about your data?</span>
                  <p>Email our designated Data Protection desk:</p>
                  <a
                    href="mailto:info.themmarstv@gmail.com"
                    className="text-[#D61F26] font-bold hover:underline block truncate"
                  >
                    info.themmarstv@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Clauses & Details */}
          <div className="lg:col-span-3 space-y-10">
            {/* 1. Introduction */}
            <section id="introduction" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">1</span>
                Introduction & Scope
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Welcome to <strong>The Mars TV</strong> (“we,” “our,” or “us”), operated by The Mars TV Media & Real Estate Platform (registered office: 101-104 The Mars TV Tower, Vijay Nagar Square, Indore, Madhya Pradesh - 452001). This Privacy Policy applies to our website (www.themarstv.com), mobile-optimized applications, lead intake portals, media channels, and offline advisory sessions.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                By accessing, browsing, submitting inquiries, or booking property site visits on our portal, you acknowledge having read and understood this Privacy Policy and consent to the collection, storage, and processing of your personal information in accordance with India’s <em>Digital Personal Data Protection Act, 2023 (DPDP)</em>, the <em>Information Technology Act, 2000</em>, and applicable <em>RERA</em> data norms.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="collection" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">2</span>
                Information We Collect
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We collect personal information directly when you interact with our platform, as well as automatic device telemetry:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#D61F26]" />
                    Directly Provided Information
                  </h3>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>Full Name, Contact Phone/WhatsApp number, Email Address</li>
                    <li>Property preferences (budget, configuration, city, preferred locality)</li>
                    <li>Site visit booking requests and preferred appointment time slots</li>
                    <li>Property listing seller submissions (property deeds, RERA numbers, photographs, floor plans)</li>
                    <li>PR service or construction quotation requirements</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#D61F26]" />
                    Automatically Collected Data
                  </h3>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>IP address, browser type, device operating system</li>
                    <li>Pages viewed, time spent on property listings, search filters applied</li>
                    <li>Referring URL and navigation paths across our real estate categories</li>
                    <li>Google Analytics telemetry (via Google Tag G-CZW3GNDCTB)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Data */}
            <section id="usage" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">3</span>
                How We Use Your Data
              </h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>We use the collected information for specific, lawful real estate facilitation purposes:</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-[#D61F26] rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Facilitating Site Visits & Enquiries:</strong> Connecting you directly with verified developers or our dedicated on-ground property managers for scheduled physical site tours.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-[#D61F26] rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Legal & RERA Validation:</strong> Verifying property ownership, approvals, and credentials before listing verification on our platform.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-[#D61F26] rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Turnkey Construction Quotations:</strong> Generating architectural 3D plans, per sq.ft material cost estimates, and interior site evaluations.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-[#D61F26] rounded-full mt-2 flex-shrink-0" />
                    <span><strong>PR & Media Distribution:</strong> Conducting developer interviews, video showcase distribution, and news editorial publishing.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-[#D61F26] rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Security & Fraud Prevention:</strong> Preventing duplicate or spam property submissions, identity spoofing, and unauthorized data scraping.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Sharing & Disclosures */}
            <section id="sharing" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">4</span>
                Sharing & Disclosures
              </h2>
              <div className="bg-red-50 border-l-4 border-[#D61F26] p-4 rounded-r-xl text-xs sm:text-sm text-red-900 font-semibold mb-3">
                Zero Selling of Personal Data: We never sell, rent, trade, or monetize your contact details to third-party telemarketers or unrelated advertisers.
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data is only shared under strict confidentiality in the following scenarios:
              </p>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc pl-5 leading-relaxed">
                <li><strong>Verified Real Estate Builders/Developers:</strong> When you submit an explicit enquiry for a specific project or request a developer call back.</li>
                <li><strong>Statutory Authorities:</strong> If required by judicial orders, the Madhya Pradesh Real Estate Regulatory Authority (MP RERA), or government investigative agencies.</li>
                <li><strong>Turnkey Service Providers:</strong> Vetted civil engineers, interior architects, and logistics coordinators assigned to fulfill your requested construction package.</li>
              </ul>
            </section>

            {/* 5. Cookies & Analytics */}
            <section id="analytics" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">5</span>
                Cookies & Web Analytics
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use standard HTTP cookies, local storage, and Google Analytics (Measurement ID: <code>G-CZW3GNDCTB</code>) to understand how visitors engage with property listings, filter selections, and market reports. This allows us to optimize load times and surface relevant properties.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                You can configure your browser to decline cookies or alert you when cookies are sent; however, certain portal functions (such as saved property wishlists) may not operate at peak efficiency without local cache storage.
              </p>
            </section>

            {/* 6. Data Security & Storage */}
            <section id="security" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">6</span>
                Data Security & Storage
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We implement robust physical, administrative, and technological security controls including HTTPS SSL 256-bit encryption in transit, firewalled database storage, multi-factor authentication for administrative personnel, and strict access isolation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-center">
                  <Lock className="w-5 h-5 text-[#D61F26] mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-gray-900 block">End-to-End SSL</span>
                  <span className="text-[11px] text-gray-500">256-bit encrypted data transit</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-center">
                  <Server className="w-5 h-5 text-[#D61F26] mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-gray-900 block">Secure Storage</span>
                  <span className="text-[11px] text-gray-500">Encrypted Indian Cloud Centers</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-center">
                  <ShieldCheck className="w-5 h-5 text-[#D61F26] mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-gray-900 block">Restricted Access</span>
                  <span className="text-[11px] text-gray-500">Authorized personnel only</span>
                </div>
              </div>
            </section>

            {/* 7. Your Privacy Rights */}
            <section id="rights" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">7</span>
                Your Privacy Rights (DPDP Act 2023)
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Under the Indian Digital Personal Data Protection Act, 2023, you are endowed with distinct rights as a Data Principal:
              </p>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc pl-5 leading-relaxed">
                <li><strong>Right of Access & Summary:</strong> You can request a summary of the personal data we hold about you and the processing activities undertaken.</li>
                <li><strong>Right to Correction & Erasure:</strong> You may request the update of inaccurate records or the deletion of data when no longer required for statutory or contractual purposes.</li>
                <li><strong>Right to Withdraw Consent:</strong> You may unsubscribe from our property news updates, WhatsApp alerts, or marketing communications at any time.</li>
                <li><strong>Right of Grievance Redressal:</strong> You have the right to register concerns with our designated Grievance Officer before escalating to the Data Protection Board of India.</li>
              </ul>
            </section>

            {/* 8. Data Retention */}
            <section id="retention" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">8</span>
                Data Retention
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We retain client personal data only for as long as is necessary to satisfy the objectives detailed herein, comply with applicable RERA records retention requirements (typically 5 to 7 years for property transactions), resolve legal disputes, and enforce contractual commitments.
              </p>
            </section>

            {/* 9. Grievance Officer & Contact Information */}
            <section id="grievance" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-[#D61F26] flex items-center justify-center text-sm font-bold">9</span>
                Grievance Officer & Contact Information
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and DPDP regulations, our Grievance Officer details are published below:
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3">
                <div className="font-extrabold text-base text-gray-900">
                  Data Protection & Grievance Cell
                </div>
                <div className="text-xs text-gray-700 font-bold uppercase tracking-wider">
                  The Mars TV Media & Real Estate Platform
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700 pt-1">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#D61F26] flex-shrink-0" />
                    <span><strong>Email:</strong> info.themmarstv@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#D61F26] flex-shrink-0" />
                    <span><strong>Phone / Helpline:</strong> +91 94074 04623</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#D61F26] flex-shrink-0 mt-0.5" />
                    <span><strong>Address:</strong> 101-104 The Mars TV Tower, Vijay Nagar Square, AB Road, Indore, Madhya Pradesh - 452001, India</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-200">
                  We acknowledge grievances within 24 hours and endeavor to resolve them within 15 working days from receipt.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
