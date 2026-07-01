import { createContext, ReactNode, useContext } from 'react';
import { useHistory } from './HistoryContext';

export interface FooterPhone {
  id: number;
  label: string;
  number: string;
}

export interface SocialNetwork {
  id: number;
  name: string;
  url: string;
  icon: string; // data URL یا URL تصویر
}

export interface EnamadSettings {
  code: string; // کد رسمی اینماد
  enabled: boolean;
}

export interface FooterSettings {
  description: string;
  phones: FooterPhone[];
  email: string;
  address: string;
  copyrightText: string;
  followText: string;
  socialNetworks: SocialNetwork[];
  enamad: EnamadSettings;
  trustLogos: { enabled: boolean; image?: string }[];
}

interface FooterContextType {
  settings: FooterSettings;
  updateSettings: (data: Partial<FooterSettings>) => void;
  addPhone: (phone: Omit<FooterPhone, 'id'>) => void;
  updatePhone: (id: number, data: Partial<Omit<FooterPhone, 'id'>>) => void;
  removePhone: (id: number) => void;
  addSocialNetwork: (network: Omit<SocialNetwork, 'id'>) => void;
  updateSocialNetwork: (id: number, data: Partial<Omit<SocialNetwork, 'id'>>) => void;
  removeSocialNetwork: (id: number) => void;
  updateEnamad: (data: Partial<EnamadSettings>) => void;
}

export const defaultFooterSettings: FooterSettings = {
  description:
    'فروشگاه درنیکا، مرجع تخصصی تأمین تجهیزات تأسیسات لوله‌کشی ساختمان، استخر و لوازم استخری، سیستم‌های گرمایش و سرمایش، انواع لوله و اتصالات با ضمانت اصالت و بهترین قیمت.',
  phones: [
    { id: 1, label: 'پشتیبانی فنی', number: '021-12345678' },
    { id: 2, label: 'واحد فروش', number: '021-87654321' },
  ],
  email: 'info@dornika.com',
  address: 'تهران، خیابان نمونه، پلاک ۱۲۳',
  copyrightText: 'تمامی حقوق این وبسایت متعلق به فروشگاه درنیکا می‌باشد.',
  followText: 'ما را دنبال کنید:',
  socialNetworks: [
    { id: 1, name: 'اینستاگرام', url: '#', icon: '' },
    { id: 2, name: 'تلگرام', url: '#', icon: '' },
    { id: 3, name: 'واتساپ', url: '#', icon: '' },
  ],
  enamad: { code: '', enabled: false },
  trustLogos: [{ enabled: true }],
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const stored = (state.footer as Partial<FooterSettings> | undefined) || {};
  const settings: FooterSettings = {
    ...defaultFooterSettings,
    ...stored,
    phones: stored.phones || defaultFooterSettings.phones,
  };

  const updateSettings = (data: Partial<FooterSettings>) => {
    updateState('footer', { ...settings, ...data });
  };

  const addPhone = (phone: Omit<FooterPhone, 'id'>) => {
    updateSettings({ phones: [...settings.phones, { ...phone, id: Date.now() }] });
  };

  const updatePhone = (id: number, data: Partial<Omit<FooterPhone, 'id'>>) => {
    updateSettings({
      phones: settings.phones.map((p) => (p.id === id ? { ...p, ...data } : p)),
    });
  };

  const removePhone = (id: number) => {
    updateSettings({ phones: settings.phones.filter((p) => p.id !== id) });
  };

  const addSocialNetwork = (network: Omit<SocialNetwork, 'id'>) => {
    updateSettings({ socialNetworks: [...settings.socialNetworks, { ...network, id: Date.now() }] });
  };

  const updateSocialNetwork = (id: number, data: Partial<Omit<SocialNetwork, 'id'>>) => {
    updateSettings({
      socialNetworks: settings.socialNetworks.map((n) => (n.id === id ? { ...n, ...data } : n)),
    });
  };

  const removeSocialNetwork = (id: number) => {
    updateSettings({ socialNetworks: settings.socialNetworks.filter((n) => n.id !== id) });
  };

  const updateEnamad = (data: Partial<EnamadSettings>) => {
    updateSettings({ enamad: { ...settings.enamad, ...data } });
  };

  return (
    <FooterContext.Provider
      value={{
        settings,
        updateSettings,
        addPhone,
        updatePhone,
        removePhone,
        addSocialNetwork,
        updateSocialNetwork,
        removeSocialNetwork,
        updateEnamad,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const ctx = useContext(FooterContext);
  if (!ctx) throw new Error('useFooter must be used within FooterProvider');
  return ctx;
};
