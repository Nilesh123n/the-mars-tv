import { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 animate-slide-up max-w-[380px]">
      <CheckCircle2 className="w-5 h-5 text-[#D61F26] flex-shrink-0" />
      <span className="text-[13.5px] font-semibold text-gray-100 flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white p-1 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
