import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import { useTheme } from '../context/ThemeContext';
import OptimizedImage from './OptimizedImage';

export default function Brands() {
  const { isDark } = useTheme();
  const { settings } = useHome();
  const visibleBrands = settings.brands.filter((b: any) => b.visible);
  const { title, subtitle } = settings.brandsSection;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (visibleBrands.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % visibleBrands.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [visibleBrands.length, isPaused]);

  if (visibleBrands.length === 0) return null;

  const getCardStyle = (index: number) => {
    const total = visibleBrands.length;
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const isActive = offset === 0;

    // استفاده از مقیاس نسبی به عرض ظرف برای جلوگیری از بیرون زدگی
    const translateX = offset * 105; // استفاده از درصد یا واحد نسبی در دسکتاپ بهتر است
    const scale = isActive ? 1 : absOffset === 1 ? 0.75 : 0.55;
    const opacity = absOffset > 2 ? 0 : isActive ? 1 : absOffset === 1 ? 0.6 : 0.2;
    const rotateY = offset * -12;
    const zIndex = total - absOffset;

    return {
      transform: `translateX(${translateX}%) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <section className="section-spacing select-none overflow-hidden" aria-label="برندهای ما" role="region">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] border transition-all duration-300 aspect-video min-h-[200px] sm:min-h-[450px] ${
            isDark ? 'border-slate-800 bg-slate-950/20 backdrop-blur-xl' : 'border-border/40 bg-slate-100 shadow-sm'
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative z-10 p-4 sm:p-16 h-full flex flex-col justify-center items-center">
            <div className="text-center mb-4 sm:mb-12">
              <h2 className={`font-black ${isDark ? 'text-white' : 'text-primary'}`} style={{ fontSize: 'clamp(1rem, 3.5vw, 2.5rem)' }}>{title}</h2>
              <p className={`mt-1 sm:mt-2 ${isDark ? 'text-slate-400' : 'text-text-secondary'}`} style={{ fontSize: 'clamp(0.65rem, 1.3vw, 1rem)' }}>{subtitle}</p>
            </div>

            <div 
              className="relative w-full flex-1 flex items-center justify-center overflow-visible min-h-[120px] sm:min-h-[280px]"
              style={{ transform: 'translateX(0)' }} // Ensure base centering
            >
              {visibleBrands.map((brand: any, index: number) => {
                const style = getCardStyle(index);
                const isActive = index === activeIndex;

                return (
                  <div
                    key={brand.id}
                    className="absolute transition-all duration-700 ease-out"
                    style={style}
                  >
                    <div
                      className={`relative rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-8 flex flex-col items-center justify-center transition-all duration-700 border ${
                        isActive
                          ? isDark ? 'bg-slate-900 border-slate-700 shadow-2xl' : 'bg-white shadow-xl border-border/50'
                          : isDark ? 'bg-slate-950/40 border-white/5' : 'bg-white/40 border-border/30'
                      }`}
                      style={{ 
                        width: 'clamp(100px, 15vw, 180px)', 
                        height: 'clamp(120px, 18vw, 220px)' 
                      }}
                    >
                      <div
                        className={`relative rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-700 ${
                          isActive 
                            ? isDark ? 'bg-slate-950 shadow-inner' : 'bg-light-bg shadow-inner'
                            : 'bg-transparent'
                        }`}
                        style={{ width: 'clamp(3rem, 7vw, 6rem)', height: 'clamp(3rem, 7vw, 6rem)' }}
                      >
                        {brand.logo ? (
                          <OptimizedImage
                            src={brand.logo}
                            alt={brand.name}
                            className={`w-full h-full object-contain p-1.5 transition-all duration-700 ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-60'}`}
                          />
                        ) : (
                          <Building2 className={`${isActive ? 'w-8 h-8' : 'w-5 h-5'} ${isDark ? 'text-slate-500' : 'text-text-secondary'}`} />
                        )}
                      </div>
                      <span className={`mt-2 sm:mt-4 font-black text-center truncate w-full transition-all ${
                        isActive ? 'text-primary' : 'text-text-secondary opacity-50'
                      }`} style={{ fontSize: 'clamp(0.6rem, 1.1vw, 1rem)' }}>
                        {brand.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-10">
              {visibleBrands.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'w-6 sm:w-8 h-1 sm:h-2 bg-accent shadow-lg shadow-accent/20' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-border hover:bg-text-secondary'
                  }`}
                  aria-label={`برند ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
