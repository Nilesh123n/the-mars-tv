import { useState } from 'react';
import type { ComponentType, FormEvent } from 'react';
import { PRServiceItem } from '../../types';
import { Megaphone, Newspaper, Tv, Globe, Shield, AlertCircle, Calendar, Send, CheckCircle2 } from 'lucide-react';

interface PRServicesPageProps {
  services: PRServiceItem[];
  onSubmitLead: (lead: { name: string; phone: string; email: string; message: string; leadType: string }) => void;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Newspaper,
  Tv,
  Globe,
  Shield,
  AlertCircle,
  Calendar,
};

export default function PRServicesPage({ services, onSubmitLead }: PRServicesPageProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('Press Release Distribution');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmitLead({
      name,
      phone,
      email,
      message: `PR Enquiry for ${selectedService} (${company || 'Individual'}). ${message}`,
      leadType: 'PR_SERVICES_ENQUIRY',
    });
    setSubmitted(true);
  };

  return (
    <div className="pt-[90px] pb-16 min-h-screen bg-[#F5F5F5]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-14 px-4 border-b border-gray-800">
        <div className="max-w-[1320px] mx-auto text-center max-w-[800px]">
          <span className="bg-[#D61F26] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Real Estate PR & Brand Strategy
          </span>
          <h1 className="text-[34px] sm:text-[44px] font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Elevate Developer & Project Visibility
          </h1>
          <p className="text-gray-300 text-[16px] mt-2 leading-relaxed">
            National press release distribution, major publication features, executive branding, and crisis management for real estate leaders.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-12 space-y-12">
        
        {/* Services Grid - 4 columns on desktop & desktop site mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service) => {
            const IconComp = iconMap[service.icon] || Newspaper;

            return (
              <div
                key={service.id}
                className="bg-white rounded-[22px] p-7 border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_36px_rgba(214,31,38,0.12)] hover:border-[#D61F26]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-red-50 text-[#D61F26] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                    <IconComp className="w-7 h-7" />
                  </div>

                  <h3
                    className="text-[18px] font-bold text-[#222222] mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {service.title}
                  </h3>

                  <p className="text-[13.5px] text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-[12.5px] text-[#D61F26] font-bold">
                  <span>Guaranteed Media Outlets</span>
                  <span>100% Reach</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PR Inquiry Form Box */}
        <div className="bg-[#111111] text-white rounded-[28px] p-8 sm:p-12 shadow-2xl border border-gray-800 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="w-12 h-12 bg-[#D61F26] rounded-2xl flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-[28px] font-extrabold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Request Custom PR Proposal
            </h2>
            <p className="text-gray-300 text-[14px] leading-relaxed">
              Launch your upcoming project with maximum media buzz. Connect with our senior real estate PR strategists.
            </p>
            <div className="space-y-2.5 pt-4 text-[13px] text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D61F26]" />
                <span>Features on Economic Times, Business Standard, Moneycontrol</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D61F26]" />
                <span>TV Interviews & Press Conference Management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D61F26]" />
                <span>Executive Reputation & Social PR Monitoring</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500/40 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-[22px] font-bold text-emerald-300">PR Request Received!</h3>
                <p className="text-[14px] text-emerald-200">
                  Our Media Director will contact <strong>{name}</strong> shortly to discuss media distribution plans.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-emerald-400 underline font-bold cursor-pointer"
                >
                  Submit another PR request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Your Name / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand Sharma (MD)"
                      className="w-full bg-white/10 border border-gray-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Developer / Brand Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Sharma Infra Developers"
                      className="w-full bg-white/10 border border-gray-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98260 00000"
                      className="w-full bg-white/10 border border-gray-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@brand.com"
                      className="w-full bg-white/10 border border-gray-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Select PR Solution
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-[#222222] border border-gray-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#D61F26] cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Brief Launch Details / Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe project location, launch timelines, target news outlets..."
                    className="w-full bg-white/10 border border-gray-700 rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-[#D61F26]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>Request PR Strategy Call</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
