import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useHistory } from './HistoryContext';
import api from '../services/api';

export interface ProductReview {
  id: number;
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type VariationType = 'size_inch' | 'size_mm' | 'length_m' | 'color' | 'material' | 'pressure' | 'power' | 'custom';

export const variationLabels: Record<VariationType, string> = {
  size_inch: 'سایز (اینچ)',
  size_mm: 'سایز (میلی‌متر)',
  length_m: 'طول (متر)',
  color: 'رنگ',
  material: 'جنس',
  pressure: 'فشار کاری',
  power: 'توان',
  custom: 'سفارشی',
};

export interface VariationOption {
  name: string;
  sku?: string;
  price?: number; // قیمت اختصاصی این گزینه (اختیاری)
}

export interface ProductVariation {
  id: number;
  type: VariationType;
  categoryId?: number; // اشاره به دسته‌بندی تنوع در پایگاه داده
  name: string;
  options: VariationOption[];
}

export type ProductStatus = 'draft' | 'published';

export interface Product {
  id: number;
  status: ProductStatus;
  name: string;
  brand: string;
  categories: string[]; // Changed from category: string to support multiple categories
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  shortDescription: string;
  description: string;
  features: string[];
  images: string[];
  colors?: ProductColor[];
  specs: ProductSpec[];
  warranty: string;
  shippingTime: string;
  tags: string[];
  reviews: ProductReview[];
  relatedIds: number[];
  variations?: ProductVariation[];
}

interface ProductsContextType {
  products: Product[];
  getProductById: (id: number) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, data: Partial<Omit<Product, 'id'>>) => void;
  removeProduct: (id: number) => void;
  bulkUpdatePrices: (priceMap: Record<string, number>) => void;
}

// Generate 50 products for testing
const generateProducts = (): Product[] => {
  const baseProducts: Product[] = [
    {
      id: 1,
      status: 'published',
      name: 'پمپ تصفیه استخر ۱.۵ اسب بخار استریم',
      brand: 'استریم',
      categories: ['تجهیزات استخر', 'پمپ استخر'],
      price: 7013500,
      originalPrice: 10300000,
      discount: 31,
      rating: 4.8,
      reviewsCount: 42,
      inStock: true,
      stockCount: 7,
      sku: 'DR-STR-PMP-15',
      shortDescription: 'پمپ تصفیه استخر با بدنه استیل ضد زنگ',
      description: 'پمپ تصفیه استخر ۱.۵ اسب بخار استریم با بدنه استیل ضد زنگ',
      features: ['قدرت موتور: ۱.۵ اسب بخار', 'بدنه استیل ضد زنگ'],
      images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&h=900&fit=crop'],
      specs: [{ key: 'برند', value: 'استریم' }],
      warranty: 'گارانتی ۲۴ ماهه',
      shippingTime: '۲ تا ۴ روز کاری',
      tags: ['استخر', 'پمپ'],
      reviews: [],
      relatedIds: [2, 3, 4],
    },
    {
      id: 2,
      status: 'published',
      name: 'لوله پنج لایه نیوپایپ سایز ۱۶ میلی‌متر',
      brand: 'نیوپایپ',
      categories: ['تأسیسات و لوله‌کشی', 'لوله‌ها'],
      price: 39150,
      originalPrice: 52000,
      discount: 25,
      rating: 4.5,
      reviewsCount: 87,
      inStock: true,
      stockCount: 120,
      sku: 'DR-NWP-16',
      shortDescription: 'لوله پنج لایه با مقاومت بالا',
      description: 'لوله پنج لایه نیوپایپ با ساختار پنج لایه‌ای',
      features: ['سایز: ۱۶ میلی‌متر', 'مقاومت دمایی تا ۹۵ درجه'],
      images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=900&h=900&fit=crop'],
      specs: [{ key: 'برند', value: 'نیوپایپ' }],
      warranty: 'گارانتی ۱۰ ساله',
      shippingTime: '۱ تا ۳ روز کاری',
      tags: ['لوله', 'تأسیسات'],
      reviews: [],
      relatedIds: [1, 3, 5],
    },
  ];

  const productNames = [
    'شیرآلات اهرمی روشویی مدل لوکس',
    'پکیج دیواری گرمایشی بوتان',
    'رادیاتور آلومینیومی ایران رادیاتور',
    'پمپ آب خانگی پنتاکس',
    'لوله پلی‌اتیلن گازرسانی',
    'اتصالات برنجی فشار قوی',
    'شیر توکار فلوش‌والو',
    'سیفون ظرفشویی استیل',
    'گرمکن برقی آب فوری',
    'کلکتور تقسیم حرارتی',
    'عایق لوله الاستومری',
    'شیر اطمینان بویلر',
    'منبع انبساط بسته',
    'پمپ سیرکولاتور گراندفوس',
    'شیر برقی گاز',
    'ترموستات دیجیتال',
    'لوله مسی نرم',
    'اتصالات فشار قوی',
    'شیر پروانه‌ای چدنی',
    'فلومتر دیجیتال',
    'پمپ کف‌کش شناور',
    'مخزن تحت فشار',
    'شیر یکطرفه فنری',
    'رادیاتور پنلی',
    'کنولکتور دیواری',
    'شیر مخلوط‌کن ترموستاتیک',
    'پکیج چگالشی',
    'مبدل حرارتی صفحه‌ای',
    'پمپ حرارتی',
    'سیستم خورشیدی',
    'لوله فاضلابی UPVC',
    'چاهک فاضلاب',
    'پمپ لجن‌کش',
    'شیر گازی توپی',
    'اتصالات پلی‌اتیلن',
    'شیر سوزنی',
    'گیج فشار',
    'ترموستات محیطی',
    'شیر رادیاتور ترموستاتیک',
    'پمپ booster',
    'منبع کویلی',
    'شیر سماوری',
    'سیفون زمینی',
    'شیر شلنگی',
    'اتصالات گالوانیزه',
    'لوله گالوانیزه',
    'شیر دروازه‌ای',
    'پمپ وکیوم',
  ];

  const brands = ['استریم', 'نیوپایپ', 'بوتان', 'ایران رادیاتور', 'پنتاکس', 'گراندفوس', 'تاسیساتی', 'صنعتی'];
  const categories = ['تأسیسات و لوله‌کشی', 'لوازم استخر', 'گرمایش', 'سرمایش', 'اتصالات', 'شیرآلات'];
  
  // 10 different Unsplash images for variety
  const images = [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1558618006-5f888b3b8b3f?w=900&h=900&fit=crop',
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0b6b?w=900&h=900&fit=crop',
  ];

  for (let i = 3; i <= 50; i++) {
    const price = Math.floor(Math.random() * 5000000) + 50000;
    
    // Products 3-12: With discount (10-30%)
    // Products 13-22: No discount (0%)
    // Products 23-50: Random (50% chance of discount)
    let discount = 0;
    if (i <= 12) {
      discount = Math.floor(Math.random() * 21) + 10; // 10-30%
    } else if (i <= 22) {
      discount = 0; // No discount
    } else {
      discount = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0;
    }
    
    const originalPrice = discount > 0 ? Math.floor(price / (1 - discount / 100)) : price;
    
    // Products 3-7: With variations
    const hasVariations = i >= 3 && i <= 7;
    
    let variations: ProductVariation[] | undefined = undefined;
    if (hasVariations) {
      variations = [
        {
          id: i * 100 + 1,
          type: 'size_mm',
          name: 'سایز (میلی‌متر)',
          options: [
            { name: '۱۶ میلی‌متر', sku: `PRD-${i}-16`, price: price },
            { name: '۲۰ میلی‌متر', sku: `PRD-${i}-20`, price: Math.floor(price * 1.2) },
            { name: '۲۵ میلی‌متر', sku: `PRD-${i}-25`, price: Math.floor(price * 1.4) },
            { name: '۳۲ میلی‌متر', sku: `PRD-${i}-32`, price: Math.floor(price * 1.6) },
          ],
        },
      ];
    }
    
    baseProducts.push({
      id: i,
      status: 'published',
      name: productNames[i - 3] || `محصول تستی ${i}`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      categories: [categories[Math.floor(Math.random() * categories.length)]],
      price,
      originalPrice,
      discount,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 100),
      inStock: Math.random() > 0.2,
      stockCount: Math.floor(Math.random() * 50) + 1,
      sku: `TEST-PRD-${i.toString().padStart(3, '0')}`,
      shortDescription: `توضیح کوتاه محصول ${i}`,
      description: `توضیحات کامل محصول ${i} با کیفیت بالا`,
      features: [`ویژگی ۱ محصول ${i}`, `ویژگی ۲ محصول ${i}`],
      images: [images[(i - 1) % images.length]],
      specs: [{ key: 'برند', value: brands[Math.floor(Math.random() * brands.length)] }],
      warranty: 'گارانتی ۱۲ ماهه',
      shippingTime: '۲ تا ۵ روز کاری',
      tags: ['تستی', 'محصول'],
      reviews: [],
      relatedIds: [],
      variations,
    });
  }

  return baseProducts;
};

export const defaultProducts: Product[] = generateProducts();

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const products: Product[] = state.products || defaultProducts;

  // Fetch products from backend API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Assuming the API returns { success: true, data: [...] } or just [...]
        // Adjust based on your Laravel BaseController response structure
        const response = await api.get('/products');
        const apiProducts = response.data.data || response.data;
        
        // Map API response to frontend Product interface if necessary
        // For now, assuming structure matches
        if (apiProducts && apiProducts.length > 0) {
          updateState('products', apiProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products from API, using default data:', error);
        // Fallback to defaultProducts is already handled by the line above
      }
    };

    // Only fetch if we don't have products in state yet (initial load)
    if (!state.products || state.products.length === 0) {
      fetchProducts();
    }
  }, [state.products, updateState]);

  const setProducts = (updater: (prev: Product[]) => Product[]) => {
    updateState('products', updater(products));
  };

  const getProductById = (id: number) => products.find((p) => p.id === id);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: Date.now() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: number, data: Partial<Omit<Product, 'id'>>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const bulkUpdatePrices = (priceMap: Record<string, number>) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        let updatedProduct = { ...product };
        let changed = false;

        // Update main product price if SKU matches
        if (product.sku && priceMap[product.sku] !== undefined) {
          updatedProduct.price = priceMap[product.sku];
          changed = true;
        }

        // Update variations if they exist
        if (product.variations) {
          const updatedVariations = product.variations.map((variation) => {
            const updatedOptions = variation.options.map((option) => {
              if (option.sku && priceMap[option.sku] !== undefined) {
                changed = true;
                return { ...option, price: priceMap[option.sku] };
              }
              return option;
            });
            return { ...variation, options: updatedOptions };
          });
          updatedProduct.variations = updatedVariations;
        }

        return changed ? updatedProduct : product;
      });
    });
  };

  return (
    <ProductsContext.Provider
      value={{ products, getProductById, addProduct, updateProduct, removeProduct, bulkUpdatePrices }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
