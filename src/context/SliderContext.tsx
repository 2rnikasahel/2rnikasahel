import { createContext, useContext, ReactNode } from 'react';
import { useHistory } from './HistoryContext';

export interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  effect?: 'fade' | 'slide' | 'zoom' | 'kenburns' | 'flip' | 'rotate' | 'cube' | 'coverflow';
}

export interface SliderSettings {
  autoPlayDelay: number;
  transitionDuration: number;
}

interface SliderContextType {
  slides: Slide[];
  settings: SliderSettings;
  addSlide: (slide: Omit<Slide, 'id'>) => void;
  updateSlide: (id: number, data: Partial<Slide>) => void;
  deleteSlide: (id: number) => void;
  moveSlide: (id: number, direction: 'up' | 'down') => void;
  updateSettings: (data: Partial<SliderSettings>) => void;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1400&h=700&fit=crop',
    badge: 'فروشگاه درنیکا',
    title: 'سیستم‌های لوله‌کشی و اتصالات ساختمان',
    subtitle: 'انواع لوله و اتصالات پلی‌اتیلن، PVC و فلزی با ضمانت اصالت کالا',
    buttonText: 'مشاهده محصولات',
    buttonLink: '/shop',
    effect: 'kenburns',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&h=700&fit=crop',
    badge: 'تجهیزات استخر',
    title: 'لوازم و تجهیزات تخصصی استخر',
    subtitle: 'پمپ، فیلتر، گرم‌کن، ربات نظافتی و کلیه تجهیزات استخر و جکوزی',
    buttonText: 'مشاهده تجهیزات',
    buttonLink: '/shop',
    effect: 'zoom',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&h=700&fit=crop',
    badge: 'گرمایش و سرمایش',
    title: 'سیستم‌های گرمایشی و سرمایشی',
    subtitle: 'رادیاتور، پکیج، اسپلیت و سیستم‌های تهویه مطبوع با بهترین قیمت',
    buttonText: 'مشاهده سیستم‌ها',
    buttonLink: '/shop',
    effect: 'slide',
  },
];

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const defaultSliderState = {
  slides: defaultSlides,
  settings: { autoPlayDelay: 6000, transitionDuration: 1000 } as SliderSettings,
};

export const SliderProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const sliderState = state.slider || defaultSliderState;
  const slides: Slide[] = sliderState.slides || defaultSliderState.slides;
  const settings: SliderSettings = sliderState.settings || defaultSliderState.settings;

  const setSlides = (updater: (prev: Slide[]) => Slide[]) => {
    updateState('slider', { ...sliderState, slides: updater(slides) });
  };

  const addSlide = (slide: Omit<Slide, 'id'>) => {
    setSlides((prev) => [...prev, { ...slide, id: Date.now() }]);
  };

  const updateSlide = (id: number, data: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSlide = (id: number) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const moveSlide = (id: number, direction: 'up' | 'down') => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const newSlides = [...prev];
      [newSlides[idx], newSlides[newIdx]] = [newSlides[newIdx], newSlides[idx]];
      return newSlides;
    });
  };

  const updateSettings = (data: Partial<SliderSettings>) => {
    updateState('slider', { ...sliderState, settings: { ...settings, ...data } });
  };

  return (
    <SliderContext.Provider value={{ slides, settings, addSlide, updateSlide, deleteSlide, moveSlide, updateSettings }}>
      {children}
    </SliderContext.Provider>
  );
};

export const useSlider = () => {
  const ctx = useContext(SliderContext);
  if (!ctx) throw new Error('useSlider must be used within SliderProvider');
  return ctx;
};
