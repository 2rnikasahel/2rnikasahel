import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HeroSliderProps } from '../../types/slider';
import { HeroSlide } from './HeroSlide';
import { SliderArrows } from './SliderArrows';
import { SliderDots } from './SliderDots';
import { useMotionSafe } from '../../lib/motion';

export const HeroSlider = ({
  slides,
  autoplayDelay = 5000,
  showArrows = true,
  showDots = true,
}: HeroSliderProps) => {
  const isRTL = typeof document !== 'undefined' ? document.documentElement.dir === 'rtl' : true;
  const { shouldReduceMotion } = useMotionSafe();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      direction: isRTL ? 'rtl' : 'ltr',
      align: 'start',
      containScroll: 'trimSnaps',
      duration: shouldReduceMotion ? 0 : 30
    },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section 
      className={`relative w-full max-w-7xl mx-auto px-4 mt-4 mb-10 overflow-hidden group aspect-video`}
      role="region"
      aria-label="اسلایدر اصلی صفحه"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden h-full rounded-[2.5rem] shadow-2xl border border-border/10 bg-slate-950" ref={emblaRef}>
        <div className="flex h-full will-change-transform gap-0">
          {slides.map((slide, index) => (
            <HeroSlide 
              key={slide.id} 
              data={slide} 
              isActive={selectedIndex === index}
              priority={index === 0}
            />
          ))}
        </div>
      </div>

      {showArrows && isHovered && !shouldReduceMotion && (
        <SliderArrows 
          isRTL={isRTL} 
          onPrev={() => emblaApi?.scrollPrev()} 
          onNext={() => emblaApi?.scrollNext()} 
        />
      )}

      {showDots && slides.length > 1 && (
        <SliderDots 
          count={slides.length} 
          current={selectedIndex} 
          onSelect={(idx) => emblaApi?.scrollTo(idx)} 
        />
      )}
    </section>
  );
};

export default HeroSlider;
