import { createContext, ReactNode, useContext } from 'react';
import { useHistory } from './HistoryContext';

export interface AboutStat {
  id: number;
  label: string;
  value: string;
  color: string;
}

export interface AboutSettings {
  title: string;
  description: string;
  image: string;
  stats: AboutStat[];
}

interface AboutContextType {
  settings: AboutSettings;
  updateSettings: (data: Partial<AboutSettings>) => void;
}

export const defaultAboutSettings: AboutSettings = {
  title: 'درباره فروشگاه درنیکا',
  description: 'فروشگاه درنیکا، مرجع تخصصی تأمین تجهیزات تأسیسات لوله‌کشی ساختمان، استخر و لوازم استخری، سیستم‌های گرمایش و سرمایش، انواع لوله و اتصالات با ضمانت اصالت و بهترین قیمت.',
  image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=800&fit=crop',
  stats: [
    { id: 1, label: 'سال تجربه', value: '+۱۰', color: 'text-accent' },
    { id: 2, label: 'مشتری راضی', value: '+۵۰۰۰', color: 'text-green-500' },
    { id: 3, label: 'محصول متنوع', value: '+۲۰۰۰', color: 'text-orange-500' },
  ],
};

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export const AboutProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const settings: AboutSettings = state.about || defaultAboutSettings;

  const updateSettings = (data: Partial<AboutSettings>) => {
    updateState('about', { ...settings, ...data });
  };

  return (
    <AboutContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AboutContext.Provider>
  );
};

export const useAbout = () => {
  const ctx = useContext(AboutContext);
  if (!ctx) throw new Error('useAbout must be used within AboutProvider');
  return ctx;
};
