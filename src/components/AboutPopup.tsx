import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useAbout } from '../context/AboutContext';
import OptimizedImage from './OptimizedImage';

interface AboutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutPopup({ isOpen, onClose }: AboutPopupProps) {
  const { settings } = useAbout();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Popup Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-fade-in-up"
      >
        <div className="bg-primary text-white relative aspect-video min-h-[220px] sm:min-h-[450px] overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 z-30 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all active:scale-95"
            aria-label="بستن"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-accent/10 blur-[60px] sm:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 blur-[60px] sm:blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 h-full items-center overflow-hidden">
            {/* Content Side */}
            <div 
              className="flex flex-col justify-center h-full text-right overflow-hidden"
              style={{ padding: 'clamp(1rem, 5vw, 5rem)' }}
            >
              <h2 
                className="font-black mb-2 sm:mb-8 leading-tight"
                style={{ fontSize: 'clamp(0.9rem, 4vw, 3.5rem)' }}
              >
                {settings.title}
              </h2>
              <p 
                className="text-gray-300 leading-relaxed mb-3 sm:mb-12 line-clamp-2 sm:line-clamp-none opacity-90"
                style={{ fontSize: 'clamp(0.6rem, 1.3vw, 1.125rem)' }}
              >
                {settings.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-8">
                {settings.stats.map((stat: any) => (
                  <div key={stat.id} className="text-right">
                    <p 
                      className={`font-black leading-none mb-0.5 sm:mb-2 ${stat.color}`}
                      style={{ fontSize: 'clamp(0.85rem, 3.5vw, 2.75rem)' }}
                    >
                      {stat.value}
                    </p>
                    <p 
                      className="text-gray-400 font-bold uppercase tracking-tighter"
                      style={{ fontSize: 'clamp(0.45rem, 1.1vw, 0.875rem)' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side */}
            <div className="relative h-full overflow-hidden group">
              <OptimizedImage
                src={settings.image}
                alt={settings.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
