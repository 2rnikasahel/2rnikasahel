import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useSlider } from '../context/SliderContext';
import OptimizedImage from './OptimizedImage';

const effects: Record<string, string> = {
  fade: 'transition-opacity duration-1000',
  slide: 'transition-transform duration-1000 ease-in-out',
  zoom: 'transition-all duration-1200 ease-out',
  kenburns: 'transition-all duration-[8000ms] ease-out',
  flip: 'transition-all duration-1000 ease-in-out',
  rotate: 'transition-all duration-1000 ease-in-out',
  cube: 'transition-all duration-1000 ease-in-out',
  coverflow: 'transition-all duration-1000 ease-in-out',
};

// Brightness detection using canvas
function getImageBrightness(url: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(128); return; }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let sum = 0;
      const count = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        sum += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }
      resolve(sum / count);
    };
    img.onerror = () => resolve(128);
    img.src = url;
  });
}

export default function HeroSlider() {
  const { slides, settings } = useSlider();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brightness, setBrightness] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const dragRef = useRef({ active: false, startX: 0, moved: false });

  const safeSlides = slides.length > 0 ? slides : [];
  const current = safeSlides[currentSlide] || null;

  // Calculate brightness for all slides
  useEffect(() => {
    Promise.all(safeSlides.map((slide: any) => getImageBrightness(slide.image))).then(setBrightness);
  }, [safeSlides]);

  const currentBrightness = brightness[currentSlide] ?? 128;
  const isDark = currentBrightness < 100;
  const transitionMs = settings.transitionDuration;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % Math.max(safeSlides.length, 1));
      }
    }, settings.autoPlayDelay);
  }, [isTransitioning, safeSlides.length, settings.autoPlayDelay]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  useEffect(() => {
    if (currentSlide >= safeSlides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, safeSlides.length]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    resetTimer();
    setTimeout(() => setIsTransitioning(false), transitionMs + 100);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % Math.max(safeSlides.length, 1));
  const prevSlide = () => goToSlide((currentSlide - 1 + safeSlides.length) % Math.max(safeSlides.length, 1));

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(dominantDelta) < 35 || wheelLockRef.current) return;
    wheelLockRef.current = true;
    dominantDelta > 0 ? nextSlide() : prevSlide();
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, Math.max(transitionMs, 600) + 100);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current;
    if (Math.abs(deltaX) > 45) {
      deltaX < 0 ? nextSlide() : prevSlide();
    }
    touchStartXRef.current = null;
  };

  // Drag to slide (mouse)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (safeSlides.length <= 1) return;
    dragRef.current = { active: true, startX: e.clientX, moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 10) dragRef.current.moved = true;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (dragRef.current.moved) {
      const dx = e.clientX - dragRef.current.startX;
      if (dx < -45) nextSlide();
      else if (dx > 45) prevSlide();
    }
    dragRef.current.moved = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  const effect = current?.effect || 'fade';

  if (safeSlides.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-4 mb-6" aria-label="اسلایدر اصلی" role="region">
      <div
        className="relative rounded-2xl overflow-hidden bg-slate-950 h-[240px] min-[420px]:h-[285px] sm:h-[350px] md:h-[420px] lg:h-[500px] group select-none touch-pan-y cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {safeSlides.map((slide: any, index: number) => {
          const isActive = index === currentSlide;
          const slideEffect = effects[slide.effect || 'fade'];
          const slideBrightness = brightness[index] ?? 128;
          const slideIsDark = slideBrightness < 100;
          const slideTextColor = slideIsDark ? 'text-white' : 'text-slate-900';
          const slideMutedColor = slideIsDark ? 'text-gray-300' : 'text-slate-600';
          const slideBadgeBg = slideIsDark
            ? 'bg-white/15 backdrop-blur-md text-white'
            : 'bg-slate-900/10 backdrop-blur-md text-slate-900';
          const slideOverlayColor = slideIsDark
            ? 'bg-gradient-to-l from-slate-900/90 via-slate-900/40 to-transparent'
            : 'bg-gradient-to-l from-white/90 via-white/50 to-transparent';

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-slate-950 will-change-transform ${slideEffect} ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
              style={{
                transitionDuration: `${transitionMs}ms`,
                transform: isActive
                  ? effect === 'zoom'
                    ? 'scale(1)'
                    : effect === 'kenburns'
                    ? 'scale(1.1) translate(-1%, -1%)'
                    : effect === 'flip'
                    ? 'perspective(1000px) rotateY(0deg)'
                    : effect === 'rotate'
                    ? 'rotate(0deg)'
                    : 'translateX(0)'
                  : effect === 'slide'
                  ? 'translateX(100%)'
                  : effect === 'flip'
                  ? 'perspective(1000px) rotateY(90deg)'
                  : effect === 'rotate'
                  ? 'rotate(5deg)'
                  : effect === 'cube'
                  ? 'translateX(50%) rotateY(-30deg)'
                  : effect === 'coverflow'
                  ? 'translateX(30%) scale(0.85) rotateY(-15deg)'
                  : 'translateX(0)',
              }}
              aria-hidden={!isActive}
            >
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
              <div className={`absolute inset-0 ${slideOverlayColor}`}></div>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex justify-start">
                  {isActive && (
                    <div className="animate-fade-in-up max-w-[88%] sm:max-w-xl lg:max-w-2xl text-right" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                      {slide.badge && (
                        <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium mb-2 sm:mb-4 ${slideBadgeBg}`}>
                          {slide.badge}
                        </span>
                      )}
                      <h2
                        className={`text-xl min-[420px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4 leading-tight whitespace-pre-line drop-shadow-lg ${slideTextColor}`}
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      >
                        {slide.title}
                      </h2>
                      {slide.subtitle && (
                        <p
                          className={`text-xs min-[420px]:text-sm sm:text-base md:text-lg mb-4 sm:mb-8 leading-relaxed max-w-lg drop-shadow ${slideMutedColor}`}
                          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.buttonText && (
                        <a
                          href={slide.buttonLink || '/shop'}
                          className={`inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                            slideIsDark
                              ? 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'
                              : 'bg-slate-900/20 backdrop-blur-md text-slate-900 border border-slate-900/30 hover:bg-slate-900/30'
                          }`}
                          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                          {slide.buttonText}
                          <ArrowLeft className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 ${
            isDark
              ? 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30'
              : 'bg-slate-900/20 backdrop-blur-md text-slate-900 hover:bg-slate-900/30 border border-slate-900/30'
          }`}
          aria-label="اسلاید قبلی"
          disabled={isTransitioning}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 ${
            isDark
              ? 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30'
              : 'bg-slate-900/20 backdrop-blur-md text-slate-900 hover:bg-slate-900/30 border border-slate-900/30'
          }`}
          aria-label="اسلاید بعدی"
          disabled={isTransitioning}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {safeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 h-2.5 bg-white shadow-lg'
                  : `w-2.5 h-2.5 ${isDark ? 'bg-white/40 hover:bg-white/60' : 'bg-slate-900/30 hover:bg-slate-900/50'}`
              }`}
              aria-label={`اسلاید ${index + 1}`}
              aria-current={index === currentSlide}
              disabled={isTransitioning}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${
          isDark ? 'bg-white/15 text-white' : 'bg-slate-900/10 text-slate-900'
        }`}>
          {currentSlide + 1} / {safeSlides.length}
        </div>
      </div>
    </section>
  );
}
