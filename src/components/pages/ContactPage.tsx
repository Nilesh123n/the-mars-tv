import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Building2 } from 'lucide-react';

interface ContactPageProps {
  onSubmitLead: (lead: { name: string; phone: string; email: string; message: string; leadType: string }) => void;
}

export default function ContactPage({ onSubmitLead }: ContactPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSelectedSubject] = useState('Property Buying Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmitLead({
      name,
      phone,
      email,
      message: `[${subject}] ${message}`,
      leadType: 'CONTACT_FORM',
    });
    setSubmitted(true);
  };

  return (
    <div className="pt-[90px] pb-16 min-h-screen bg-[#F5F5F5]">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-14 px-4 border-b border-gray-800">
        <div className="max-w-[1320px] mx-auto text-center max-w-[700px]">
          <span className="text-[#D61F26] text-xs font-bold uppercase tracking-widest block mb-2">Customer Assistance</span>
          <h1 className="text-[34px] sm:text-[44px] font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get in Touch with The Mars TV
          </h1>
          <p className="text-gray-400 text-[15px] mt-1">
            Our property advisors, legal experts, and home loan partners are available 7 days a week to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Contact Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="bg-white rounded-[22px] p-6 border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 text-[#D61F26] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Headquarters
                  </h3>
                  <p className="text-[13.5px] text-gray-600 mt-1 leading-relaxed">
                    101-104 The Mars TV Tower, Vijay Nagar Square, AB Road, Indore, MP 452001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-red-50 text-[#D61F26] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Phone Helpline
                  </h3>
                  <p className="text-[13.5px] text-gray-600 mt-1 font-semibold">
                    +91 123 456 7890 / +91 98260 11223
                  </p>
                  <span className="text-[11.5px] text-gray-400">Mon - Sun: 9:00 AM - 8:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-red-50 text-[#D61F26] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Email Support
                  </h3>
                  <p className="text-[13.5px] text-gray-600 mt-1 font-medium">
                    support@themarstv.in / leads@themarstv.in
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="bg-[#111111] text-white rounded-[22px] p-6 shadow-xl border border-gray-800 text-center space-y-2">
              <Building2 className="w-10 h-10 text-[#D61F26] mx-auto" />
              <h4 className="text-[16px] font-bold text-white">Central Regional Branch</h4>
              <p className="text-[12.5px] text-gray-400">Kolar Road, Bhopal Office: +91 755 490 8877</p>
            </div>

          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[22px] p-8 sm:p-10 shadow-xl border border-gray-200/90">
              <h2 className="text-[24px] font-extrabold text-[#222222] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Send Us a Message
              </h2>
              <p className="text-[13.5px] text-gray-500 mb-6">
                Fill in your details below and our regional desk will respond within 30 minutes.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-[20px] font-bold text-emerald-900">Message Delivered!</h3>
                  <p className="text-[14px] text-emerald-700">
                    Thank you <strong>{name}</strong>! Your inquiry has been dispatched to our sales desk.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs text-emerald-800 underline font-bold cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98260 00000"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#D61F26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#D61F26] bg-white cursor-pointer"
                      >
                        <option value="Property Buying Inquiry">Property Buying Inquiry</option>
                        <option value="Selling / Listing Property">Selling / Listing Property</option>
                        <option value="Commercial Office / Retail">Commercial Office / Retail</option>
                        <option value="Home Loan & Banking">Home Loan & Banking</option>
                        <option value="PR Services & Media">PR Services & Media</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Message / Requirement Details
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please specify locality preference, budget, BHK requirements..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#D61F26]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
