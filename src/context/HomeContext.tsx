import { createContext, ReactNode, useContext } from 'react';
import { useHistory } from './HistoryContext';

export interface HomeCategorySettings {
  selectedCategoryIds: number[];
  selectedSubCategoryIds: number[];
  selectedSubSubCategoryIds: number[];
  categoryIcons: Record<number, string>;
}

export interface Brand {
  id: number;
  name: string;
  logo: string; // data URL یا URL تصویر
  link: string;
  visible: boolean;
}

export interface BrandsSectionSettings {
  title: string;
  subtitle: string;
}

export interface HomeSettings {
  categorySection: HomeCategorySettings;
  brands: Brand[];
  brandsSection: BrandsSectionSettings;
}

interface HomeContextType {
  settings: HomeSettings;
  updateSettings: (data: Partial<HomeSettings>) => void;
  updateCategorySection: (data: Partial<HomeCategorySettings>) => void;
  updateBrandsSection: (data: Partial<BrandsSectionSettings>) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: number, data: Partial<Omit<Brand, 'id'>>) => void;
  removeBrand: (id: number) => void;
  moveBrand: (id: number, direction: 'up' | 'down') => void;
}

const defaultBrands: Brand[] = [
  { id: 1, name: 'سمنان', logo: '', link: '/shop', visible: true },
  { id: 2, name: 'ایران رادیاتور', logo: '', link: '/shop', visible: true },
  { id: 3, name: 'بوتان', logo: '', link: '/shop', visible: true },
  { id: 4, name: 'هایوارد', logo: '', link: '/shop', visible: true },
];

export const defaultHomeSettings: HomeSettings = {
  categorySection: {
    selectedCategoryIds: [1, 2, 3, 4],
    selectedSubCategoryIds: [11, 12, 13, 21, 22, 23, 31, 32, 41, 42],
    selectedSubSubCategoryIds: [111, 112, 113, 121, 122, 211, 212, 311, 312, 321, 322],
    categoryIcons: {},
  },
  brands: defaultBrands,
  brandsSection: {
    title: 'برندهای ما',
    subtitle: 'نمایندگی رسمی برترین برندهای تأسیسات، استخر و تجهیزات ساختمان',
  },
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const settings: HomeSettings = {
    ...defaultHomeSettings,
    ...(state.home || {}),
    categorySection: {
      ...defaultHomeSettings.categorySection,
      ...((state.home || {}).categorySection || {}),
    },
    brands: (state.home || {}).brands || defaultHomeSettings.brands,
    brandsSection: {
      ...defaultHomeSettings.brandsSection,
      ...((state.home || {}).brandsSection || {}),
    },
  };

  const updateSettings = (data: Partial<HomeSettings>) => {
    updateState('home', { ...settings, ...data });
  };

  const updateCategorySection = (data: Partial<HomeCategorySettings>) => {
    updateSettings({
      categorySection: { ...settings.categorySection, ...data },
    });
  };

  const updateBrandsSection = (data: Partial<BrandsSectionSettings>) => {
    updateSettings({
      brandsSection: { ...settings.brandsSection, ...data },
    });
  };

  const addBrand = (brand: Omit<Brand, 'id'>) => {
    updateSettings({
      brands: [...settings.brands, { ...brand, id: Date.now() }],
    });
  };

  const updateBrand = (id: number, data: Partial<Omit<Brand, 'id'>>) => {
    updateSettings({
      brands: settings.brands.map((b) => (b.id === id ? { ...b, ...data } : b)),
    });
  };

  const removeBrand = (id: number) => {
    updateSettings({
      brands: settings.brands.filter((b) => b.id !== id),
    });
  };

  const moveBrand = (id: number, direction: 'up' | 'down') => {
    const idx = settings.brands.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= settings.brands.length) return;
    const next = [...settings.brands];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    updateSettings({ brands: next });
  };

  return (
    <HomeContext.Provider
      value={{
        settings,
        updateSettings,
        updateCategorySection,
        updateBrandsSection,
        addBrand,
        updateBrand,
        removeBrand,
        moveBrand,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHome must be used within HomeProvider');
  return ctx;
};
