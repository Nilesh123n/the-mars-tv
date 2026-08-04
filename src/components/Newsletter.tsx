import { useState, FormEvent } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NewsletterProps {
  onSubscribe: (email: string) => void;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    onSubscribe(email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-12 bg-[#D61F26] text-white">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Text Left */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3
                className="text-white text-[20px] sm:text-[22px] font-extrabold leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Get Latest Property & Investment Alerts
              </h3>
              <p
                className="text-white/80 text-[13.5px] mt-0.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Subscribe to our newsletter for exclusive off-market listings, price drops & market news.
              </p>
            </div>
          </div>

          {/* Form Right */}
          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="bg-white/20 backdrop-blur-md px-6 py-3.5 rounded-[14px] flex items-center gap-2 text-white font-bold text-[14px]">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Thank you! You are subscribed to The Mars TV updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full sm:w-[320px] px-5 py-3.5 rounded-[14px] text-[14px] text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-white/40 shadow-lg"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#111111] hover:bg-black text-white font-bold text-[14px] px-7 py-3.5 rounded-[14px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg active:scale-98"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
