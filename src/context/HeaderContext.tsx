import { createContext, useContext, ReactNode } from 'react';
import { useHistory } from './HistoryContext';

export interface NavItem {
  id: number;
  label: string;
  path: string;
  isExternal?: boolean; // اگر true باشه، در تب جدید باز میشه
}

export interface HeaderSettings {
  topBarRightText: string;
  topBarLeftText: string;
  topBarEnabled: boolean;
  supportPhone: string;
  logoImage: string; // آدرس لوگوی آپلود شده (data URL یا URL). خالی = استفاده از لوگوی پیش‌فرض
  logoTitle: string; // متن اصلی کنار لوگو (مثلا: درنیکا)
  logoSubtitle: string; // متن زیرین کنار لوگو (مثلا: تأسیسات و تجهیزات ساختمان)
  navItems: NavItem[]; // آیتم‌های منوی افقی
}

interface HeaderContextType {
  settings: HeaderSettings;
  updateSettings: (data: Partial<HeaderSettings>) => void;
  addNavItem: (item: Omit<NavItem, 'id'>) => void;
  updateNavItem: (id: number, data: Partial<Omit<NavItem, 'id'>>) => void;
  removeNavItem: (id: number) => void;
  moveNavItem: (id: number, direction: 'up' | 'down') => void;
}

const defaultNavItems: NavItem[] = [
  { id: 1, label: 'فروشگاه', path: '/shop', isExternal: false },
  { id: 2, label: 'بلاگ', path: '/blog', isExternal: false },
  { id: 3, label: 'درباره ما', path: '/about', isExternal: false },
  { id: 4, label: 'تماس با ما', path: '/contact', isExternal: false },
];

export const defaultHeaderSettings: HeaderSettings = {
  topBarRightText: 'درنیکا؛ مرجع تخصصی تأسیسات ساختمان و استخر',
  topBarLeftText: 'ارسال رایگان برای خرید بالای ۵ میلیون تومان',
  topBarEnabled: true,
  supportPhone: '021-12345678',
  logoImage: '',
  logoTitle: 'درنیکا',
  logoSubtitle: 'تأسیسات و تجهیزات ساختمان',
  navItems: defaultNavItems,
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const settings: HeaderSettings = state.header || defaultHeaderSettings;

  const setSettings = (updater: (prev: HeaderSettings) => HeaderSettings) => {
    updateState('header', updater(settings));
  };

  const updateSettings = (data: Partial<HeaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  };

  const addNavItem = (item: Omit<NavItem, 'id'>) => {
    setSettings((prev) => ({
      ...prev,
      navItems: [...prev.navItems, { ...item, id: Date.now() }],
    }));
  };

  const updateNavItem = (id: number, data: Partial<Omit<NavItem, 'id'>>) => {
    setSettings((prev) => ({
      ...prev,
      navItems: prev.navItems.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
  };

  const removeNavItem = (id: number) => {
    setSettings((prev) => ({
      ...prev,
      navItems: prev.navItems.filter((item) => item.id !== id),
    }));
  };

  const moveNavItem = (id: number, direction: 'up' | 'down') => {
    setSettings((prev) => {
      const idx = prev.navItems.findIndex((item) => item.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.navItems.length) return prev;
      const newItems = [...prev.navItems];
      [newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]];
      return { ...prev, navItems: newItems };
    });
  };

  return (
    <HeaderContext.Provider
      value={{
        settings,
        updateSettings,
        addNavItem,
        updateNavItem,
        removeNavItem,
        moveNavItem,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider');
  return ctx;
};
