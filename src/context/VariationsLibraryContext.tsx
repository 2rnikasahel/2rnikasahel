import { createContext, ReactNode, useContext, useState } from 'react';

export interface VariationCategory {
  id: number;
  name: string;
  values: string[]; // مقادیر از پیش تعریف شده
}

interface VariationsLibraryContextType {
  categories: VariationCategory[];
  addCategoryValue: (categoryId: number, value: string) => void;
}

const defaultVariationsLibrary: VariationCategory[] = [
  {
    id: 1,
    name: 'سایز (اینچ)',
    values: ['۱/۲ اینچ', '۳/۴ اینچ', '۱ اینچ', '۱.۱/۴ اینچ', '۱.۱/۲ اینچ', '۲ اینچ', '۲.۱/۲ اینچ', '۳ اینچ', '۴ اینچ'],
  },
  {
    id: 2,
    name: 'سایز (میلی‌متر)',
    values: ['۱۶ میلی‌متر', '۲۰ میلی‌متر', '۲۵ میلی‌متر', '۳۲ میلی‌متر', '۴۰ میلی‌متر', '۵۰ میلی‌متر', '۶۳ میلی‌متر', '۷۵ میلی‌متر', '۹۰ میلی‌متر', '۱۱۰ میلی‌متر'],
  },
  {
    id: 3,
    name: 'طول شاخه (متر)',
    values: ['۱ متر', '۲ متر', '۳ متر', '۴ متر', '۵ متر', '۶ متر', '۱۲ متر', '۱۰۰ متر (رول)', '۲۰۰ متر (رول)'],
  },
  {
    id: 4,
    name: 'رنگ',
    values: ['سفید', 'مشکی', 'آبی', 'قرمز', 'سبز', 'زرد', 'خاکستری', 'نقره‌ای', 'طلایی', 'کرومی', 'استیل'],
  },
  {
    id: 5,
    name: 'جنس',
    values: ['برنج', 'استیل', 'پلی‌اتیلن (PE)', 'پلی پروپیلن (PP)', 'PVC', 'CPVC', 'فولاد گالوانیزه', 'مس', 'چدن', 'آلومینیوم', 'پنج لایه'],
  },
  {
    id: 6,
    name: 'فشار کاری',
    values: ['۶ بار (PN6)', '۱۰ بار (PN10)', '۱۶ بار (PN16)', '۲۰ بار (PN20)', '۲۵ بار (PN25)'],
  },
  {
    id: 7,
    name: 'توان (وات)',
    values: ['۲۵۰ وات', '۵۰۰ وات', '۷۵۰ وات', '۱۰۰۰ وات', '۱۵۰۰ وات', '۲۰۰۰ وات', '۳۰۰۰ وات', '۵۰۰۰ وات'],
  },
  {
    id: 8,
    name: 'قدرت موتور (اسب بخار)',
    values: ['۰.۵ اسب', '۰.۷۵ اسب', '۱ اسب', '۱.۵ اسب', '۲ اسب', '۳ اسب', '۵ اسب', '۷.۵ اسب', '۱۰ اسب'],
  },
  {
    id: 9,
    name: 'ولتاژ',
    values: ['۲۲۰ ولت تکفاز', '۳۸۰ ولت سه‌فاز', '۱۲ ولت DC', '۲۴ ولت DC'],
  },
  {
    id: 10,
    name: 'دمای کاری',
    values: ['تا ۴۰ درجه', 'تا ۶۰ درجه', 'تا ۸۰ درجه', 'تا ۹۵ درجه', 'تا ۱۲۰ درجه'],
  },
];

const VariationsLibraryContext = createContext<VariationsLibraryContextType | undefined>(undefined);

export const VariationsLibraryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<VariationCategory[]>(defaultVariationsLibrary);

  const addCategoryValue = (categoryId: number, value: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId && !cat.values.includes(value)
          ? { ...cat, values: [...cat.values, value] }
          : cat
      )
    );
  };

  return (
    <VariationsLibraryContext.Provider value={{ categories, addCategoryValue }}>
      {children}
    </VariationsLibraryContext.Provider>
  );
};

export const useVariationsLibrary = () => {
  const ctx = useContext(VariationsLibraryContext);
  if (!ctx) throw new Error('useVariationsLibrary must be used within VariationsLibraryProvider');
  return ctx;
};
