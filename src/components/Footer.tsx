import { Home, Facebook, Instagram, Linkedin, Youtube, Twitter, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#D61F26] text-white border-t border-red-700/60">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left cursor-pointer group bg-white text-[#D61F26] p-2.5 sm:p-3 rounded-2xl shadow-lg hover:bg-gray-50 transition-all inline-flex border border-red-100"
            >
              <img
                src="/mars_tv_logo.jpg"
                alt="The Mars TV Logo"
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md border border-amber-400/60 flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-[17px] sm:text-[19px] text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  THE MARS TV
                </span>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">
                  Real Estate Media &amp; Listings
                </span>
                <a
                  href="https://www.themarstv.com"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-red-700 hover:text-red-900 font-bold mt-1 inline-flex items-center gap-1 hover:underline"
                >
                  🌐 www.themarstv.com
                </a>
              </div>
            </button>

            <p
              className="text-white/90 text-[13.5px] leading-relaxed max-w-[320px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Central India's leading verified real estate marketplace. Connecting property buyers, investors, and developers with complete transparency.
            </p>

            <div className="space-y-2.5 pt-2 text-white">
              <a
                href="mailto:info.themmarstv@gmail.com"
                className="flex items-center gap-2.5 text-white hover:underline text-[13px] font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <span>info.themmarstv@gmail.com</span>
              </a>

              <a
                href="https://wa.me/919407404623"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-white hover:underline text-[13px] font-medium transition-colors group/wa"
              >
                <MessageCircle className="w-4 h-4 text-white group-hover/wa:text-green-300 transition-colors flex-shrink-0" />
                <span>WhatsApp: <strong className="font-bold tracking-wide">+91 94074 04623</strong></span>
              </a>

              <a
                href="tel:+919407404623"
                className="flex items-center gap-2.5 text-white hover:underline text-[13px] font-medium transition-colors"
              >
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <span>Call Helpline: +91 94074 04623</span>
              </a>

              <div className="flex items-start gap-2.5 text-white text-[13px] font-medium">
                <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span>101-104 The Mars TV Tower, Vijay Nagar Square, Indore, MP 452001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 bg-white text-[#D61F26] hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md"
                >
                  <social.icon className="w-4.5 h-4.5 text-[#D61F26]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white font-extrabold text-[14px] mb-4 uppercase tracking-wider border-b border-white/30 pb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Explore Portfolios
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  onClick={() => onNavigate('residential')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  Residential Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('commercial')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  Commercial Workspaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rent')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  Rent & Lease Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('construction')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  Construction & Interior
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  Real Estate News Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pr-services')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  PR & Branding Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#D61F26] rounded-full" />
                  Contact Office
                </button>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4
              className="text-white font-extrabold text-[14px] mb-4 uppercase tracking-wider border-b border-white/30 pb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Top Categories
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li className="text-white font-medium hover:underline cursor-pointer">Luxury Apartments</li>
              <li className="text-white font-medium hover:underline cursor-pointer">Independent Villas</li>
              <li className="text-white font-medium hover:underline cursor-pointer">Grade-A Office Space</li>
              <li className="text-white font-medium hover:underline cursor-pointer">Retail Showrooms</li>
              <li className="text-white font-medium hover:underline cursor-pointer">Approved Plots</li>
              <li className="text-white font-medium hover:underline cursor-pointer">RERA Townships</li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h4
              className="text-white font-extrabold text-[14px] mb-4 uppercase tracking-wider border-b border-white/30 pb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              RERA Compliance
            </h4>
            <div className="space-y-3">
              <p className="text-[12.5px] text-white/90">
                100% verified listings compliant with Madhya Pradesh Real Estate Regulatory Authority standards.
              </p>
              <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 text-[11.5px] text-white space-y-1.5">
                <p><strong className="text-white font-bold">RERA Registration:</strong> MP/RERA/2024/0991</p>
                <p><strong className="text-white font-bold">GSTIN:</strong> 23AABCP1234F1Z9</p>
                <p><strong className="text-white font-bold">CIN:</strong> U70109MP2022PTC061234</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-red-800 bg-red-900/40">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-white">
          <p>© {new Date().getFullYear()} The Mars TV. All rights reserved. Built for trust and excellence.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer text-white font-medium">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer text-white font-medium">Terms of Service</span>
            <span>•</span>
            <button
              onClick={() => {
                window.location.hash = '#/admin-secret';
                onNavigate('admin-secret');
              }}
              className="bg-white text-[#D61F26] hover:bg-gray-100 px-3 py-1 rounded-lg text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Protected Admin Portal"
            >
              🔒 Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
