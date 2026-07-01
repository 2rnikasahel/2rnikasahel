import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onIndexChange: (idx: number) => void;
}

export default function GalleryModal({
  isOpen,
  onClose,
  images,
  activeIndex,
  onIndexChange,
}: GalleryModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'ArrowLeft') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Lock background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, activeIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    onIndexChange((activeIndex + 1) % images.length);
  };

  const handlePrev = () => {
    onIndexChange((activeIndex - 1 + images.length) % images.length);
  };

  // Drag to navigate
  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { active: true, startX: e.clientX, moved: false };
    setIsDragging(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 10) {
      dragState.current.moved = true;
      setIsDragging(true);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setIsDragging(false);

    if (dragState.current.moved) {
      const dx = e.clientX - dragState.current.startX;
      if (dx > 50) {
        // Dragged right → previous image (RTL)
        handlePrev();
      } else if (dx < -50) {
        // Dragged left → next image (RTL)
        handleNext();
      }
    }
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="گالری تصاویر محصول"
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Glassmorphism Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 backdrop-blur-2xl" />
      
      {/* Decorative glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
        <span className="text-sm font-bold text-white/80 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full shadow-lg" dir="rtl">
          {(activeIndex + 1).toLocaleString('fa-IR')} از {images.length.toLocaleString('fa-IR')}
        </span>
        <button
          onClick={onClose}
          className="w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
          aria-label="بستن گالری"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Slider Area - Draggable */}
      <div 
        className="relative w-full flex-1 flex items-center justify-center px-4 md:px-16 py-16 z-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ touchAction: 'pan-y', userSelect: 'none' }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer z-10"
          aria-label="تصویر قبلی"
          style={{ pointerEvents: 'auto' }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Big Zoomed Image */}
        <div 
          className={`relative max-w-full max-h-[70vh] flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
        >
          <img
            src={images[activeIndex]}
            alt={`تصویر بزرگنمایی ${activeIndex + 1}`}
            className="max-w-full max-h-[70vh] object-contain rounded-3xl shadow-2xl animate-fade-in border border-white/10"
            draggable={false}
            style={{ pointerEvents: 'none' }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer z-10"
          aria-label="تصویر بعدی"
          style={{ pointerEvents: 'auto' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div 
        className="w-full bg-white/5 border-t border-white/10 backdrop-blur-2xl p-4 flex justify-center gap-2.5 overflow-x-auto select-none z-10"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-300 flex-shrink-0 ${
                activeIndex === idx 
                  ? 'border-accent ring-4 ring-accent/40 scale-95 shadow-xl bg-white/10' 
                  : 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <img 
                src={img} 
                alt={`بندانگشتی پاپ‌آپ ${idx + 1}`} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${activeIndex === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
