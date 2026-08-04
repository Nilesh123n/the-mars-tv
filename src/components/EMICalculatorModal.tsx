import { useState } from 'react';
import { X, Calculator, DollarSign, Percent, Calendar, CheckCircle2 } from 'lucide-react';

interface EMICalculatorModalProps {
  initialAmount?: number;
  onClose: () => void;
}

export default function EMICalculatorModal({
  initialAmount = 10000000,
  onClose,
}: EMICalculatorModalProps) {
  const [amount, setAmount] = useState(initialAmount || 10000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEMI = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    monthlyEMI =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = Math.max(0, totalPayment - amount);

  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercentage = 100 - interestPercentage;

  const formatLakhsCrores = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[24px] max-w-[820px] w-full shadow-2xl relative border border-gray-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D61F26] rounded-xl flex items-center justify-center shadow-md">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Home Loan EMI Calculator
              </h2>
              <p className="text-[12px] text-gray-400">Estimate monthly payments and loan schedule</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Loan Amount Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12.5px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#D61F26]" />
                  Loan Amount
                </label>
                <span className="text-[16px] font-extrabold text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {formatLakhsCrores(amount)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={50000000}
                step={250000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D61F26]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                <span>₹5 Lakhs</span>
                <span>₹5 Crores</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12.5px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-[#D61F26]" />
                  Interest Rate (% p.a.)
                </label>
                <span className="text-[16px] font-extrabold text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D61F26]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12.5px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D61F26]" />
                  Loan Tenure (Years)
                </label>
                <span className="text-[16px] font-extrabold text-[#D61F26]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {tenureYears} Years ({tenureYears * 12} Mos)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D61F26]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>

            <div className="bg-red-50/70 border border-red-100 p-3.5 rounded-xl text-[12px] text-gray-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Pre-approved home loans available from HDFC, SBI, ICICI & Axis Bank.</span>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-5 bg-gray-50 border border-gray-200 p-6 rounded-[20px] flex flex-col justify-between space-y-5">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Monthly EMI</span>
              <p className="text-[32px] font-black text-[#D61F26] mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ₹{Math.round(monthlyEMI).toLocaleString('en-IN')}
                <span className="text-[13px] font-semibold text-gray-500">/mo</span>
              </p>

              <div className="space-y-3 pt-4 border-t border-gray-200 mt-4 text-[13px]">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Principal Loan Amount:</span>
                  <strong className="font-bold">{formatLakhsCrores(amount)}</strong>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Total Interest Payable:</span>
                  <strong className="font-bold text-amber-700">{formatLakhsCrores(totalInterest)}</strong>
                </div>
                <div className="flex justify-between items-center text-gray-900 pt-2 border-t border-gray-200 font-extrabold text-[14px]">
                  <span>Total Amount Payable:</span>
                  <strong className="text-[#D61F26]">{formatLakhsCrores(totalPayment)}</strong>
                </div>
              </div>

              {/* Progress Proportion Bar */}
              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-bold mb-1.5 flex justify-between">
                  <span>Principal ({principalPercentage.toFixed(1)}%)</span>
                  <span>Interest ({interestPercentage.toFixed(1)}%)</span>
                </div>
                <div className="h-3 w-full bg-amber-400 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#D61F26]" style={{ width: `${principalPercentage}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#111111] hover:bg-black text-white text-[13.5px] font-bold py-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Apply for Bank Approval
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
