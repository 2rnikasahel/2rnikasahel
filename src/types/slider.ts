export interface SlideData {
  id: string | number;
  image: string;
  mobileImage?: string;
  alt: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaPrimary?: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
  align?: 'right' | 'left' | 'center';
  colorScheme?: 'light' | 'dark';
}

export interface HeroSliderProps {
  slides: SlideData[];
  autoplayDelay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'full';
}
