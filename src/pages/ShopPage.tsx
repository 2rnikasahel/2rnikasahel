import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Filter, Search, SlidersHorizontal, ChevronDown, X, CheckCircle2, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts, Product } from '../context/ProductsContext';
import { useCategories, Category, SubCategory, SubSubCategory } from '../context/CategoriesContext';

type AnyNode = Category | SubCategory | SubSubCategory;

function SidebarCategoryItem({
  node,
  level,
  activeCategory,
  onSelect,
}: {
  node: AnyNode;
  level: number;
  activeCategory: string | null;
  onSelect: (name: string) => void;
}) {
  const children = (node.children || []) as AnyNode[];
  const hasChildren = children.length > 0;
  const isActive = activeCategory === node.name;
  
  // باز بودن خودکار اگر یکی از فرزندان فعال باشد
  const isChildActive = (n: AnyNode): boolean => {
    if (n.name === activeCategory) return true;
    if (n.children) {
      return (n.children as AnyNode[]).some(isChildActive);
    }
    return false;
  };

  const [isOpen, setIsOpen] = useState(() => level < 1 || isChildActive(node));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group">
        <button
          onClick={() => onSelect(node.name)}
          className={`flex-1 text-right text-sm py-1.5 transition-colors ${
            isActive ? 'text-accent font-bold' : 'text-text-primary hover:text-accent'
          } ${level > 0 ? 'pr-4 text-xs' : ''}`}
        >
          {level > 0 && <span className="text-text-secondary/40 ml-1.5">—</span>}
          {node.name}
        </button>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-light-bg rounded-lg transition-colors text-text-secondary"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="space-y-0.5 mt-1 border-r-2 border-border/50 mr-2 pr-1">
          {children.map((child: any) => (
            <SidebarCategoryItem
              key={child.id}
              node={child}
              level={level + 1}
              activeCategory={activeCategory}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { categories } = useCategories();
  
  const categoryFilter = searchParams.get('category');
  const sortFilter = searchParams.get('sort') || 'newest';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const dragStartX = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const diff = dragStartX.current - e.clientX;
    // Threshold for swipe (60px)
    // In RTL: Swipe Right (diff < -60) = Next Page, Swipe Left (diff > 60) = Prev Page
    if (diff < -60) {
      // Swiped Right -> Next Page
      if (currentPage < totalPages) setCurrentPage(p => p + 1);
    } else if (diff > 60) {
      // Swiped Left -> Prev Page
      if (currentPage > 1) setCurrentPage(p => p - 1);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Check for payment status param (success or failed)
  useEffect(() => {
    const status = searchParams.get('payment');
    if (status === 'success') {
      setPaymentStatus('success');
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    } else if (status === 'failed') {
      setPaymentStatus('failed');
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleCategorySelect = (name: string) => {
    if (categoryFilter === name) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', name);
    }
    setSearchParams(searchParams);
    setShowMobileFilters(false);
  };

  const handleSortChange = (sort: string) => {
    searchParams.set('sort', sort);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    navigate('/shop');
    setSearchTerm('');
    setInStockOnly(false);
    setShowMobileFilters(false);
  };

  // 1. فیلتر کردن
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      // فقط محصولات منتشر شده
      if (p.status !== 'published') return false;

      // فیلتر جستجو
      if (searchTerm && !p.name.includes(searchTerm)) return false;

      // فیلتر دسته‌بندی
      if (categoryFilter && !p.categories?.includes(categoryFilter)) return false;

      // فیلتر موجودی
      if (inStockOnly && !p.inStock) return false;

      return true;
    });
  }, [products, searchTerm, categoryFilter, inStockOnly]);

  // 2. مرتب‌سازی
  const sortedProducts = useMemo(() => {
    const getActualPrice = (p: Product) => {
      if (p.variations && p.variations.length > 0) {
        const prices = p.variations.flatMap(v => v.options).map(o => o.price || 0).filter(pr => pr > 0);
        return prices.length > 0 ? Math.min(...prices) : p.price;
      }
      return p.price;
    };

    return [...filteredProducts].sort((a, b) => {
      switch (sortFilter) {
        case 'price-asc':
          return getActualPrice(a) - getActualPrice(b);
        case 'price-desc':
          return getActualPrice(b) - getActualPrice(a);
        case 'discount':
          return b.discount - a.discount;
        case 'newest':
        default:
          return (b.id as any) - (a.id as any);
      }
    });
  }, [filteredProducts, sortFilter]);

  // 3. صفحه‌بندی
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // برگشت به صفحه ۱ وقتی فیلتر/جستجو/مرتب‌سازی تغییر می‌کند
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortFilter, inStockOnly]);

  return (
    <>
      <Helmet>
        <title>فروشگاه محصولات تأسیساتی و ساختمانی | درنیکا</title>
        <meta name="description" content="مشاهده و خرید آنلاین انواع محصولات تأسیساتی، لوله و اتصالات، شیرآلات، گرمایش و سرمایش ساختمان در فروشگاه درنیکا." />
        <meta property="og:title" content="فروشگاه محصولات تأسیساتی و ساختمانی | درنیکا" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-secondary mb-6" aria-label="مسیر">
        <Link to="/" className="hover:text-accent transition-colors">خانه</Link>
        <span>/</span>
        <span className="text-primary font-bold">فروشگاه</span>
        {categoryFilter && (
          <>
            <span>/</span>
            <span className="text-accent font-bold">{categoryFilter}</span>
          </>
        )}
      </nav>

      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">محصولات فروشگاه</h1>
          <p className="text-sm text-text-secondary">
            {sortedProducts.length.toLocaleString('fa-IR')} محصول یافت شد
          </p>
        </div>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-light-bg transition-colors shadow-sm"
        >
          <Filter className="w-4 h-4" />
          فیلترها
        </button>
      </div>

      <div className="flex flex-row gap-8 items-start">
        
        {/* Sidebar Filters - Always Visible in Desktop Layout */}
        <aside className="w-72 flex-shrink-0 block sticky top-[160px]">
          <div className="p-5 lg:p-0 min-h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b border-border/50">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent" />
                فیلتر محصولات
              </h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-light-bg rounded-xl text-text-secondary hover:text-danger">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="lg:sticky lg:top-[160px] space-y-6">
              
              {/* Search */}
              <div className="bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 shadow-sm border border-border/50 lg:border-none lg:shadow-none">
                <h3 className="font-bold text-primary mb-3">جستجو</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="نام محصول..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 pr-10 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                </div>
              </div>

              {/* Categories Tree */}
              <div className="bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 shadow-sm border border-border/50 lg:border-none lg:shadow-none">
                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  دسته‌بندی‌ها
                </h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto cart-scroll pr-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-right text-sm py-1.5 transition-colors ${
                      !categoryFilter ? 'text-accent font-bold' : 'text-text-primary hover:text-accent'
                    }`}
                  >
                    همه محصولات
                  </button>
                  {categories.filter(c => c.visible).map((cat: any) => (
                    <SidebarCategoryItem
                      key={cat.id}
                      node={cat}
                      level={0}
                      activeCategory={categoryFilter}
                      onSelect={handleCategorySelect}
                    />
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 shadow-sm border border-border/50 lg:border-none lg:shadow-none space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors">فقط کالاهای موجود</span>
                  <div className={`relative inline-block w-11 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-green-500' : 'bg-border'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${inStockOnly ? 'right-1 translate-x-0' : 'right-6'}`} />
                  </div>
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="hidden" />
                </label>
              </div>

              {/* Clear Filters */}
              {(categoryFilter || searchTerm || inStockOnly) && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 bg-red-50 text-danger rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                >
                  حذف همه فیلترها
                </button>
              )}

              {/* Mobile apply button */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="lg:hidden w-full py-4 bg-primary text-white rounded-xl text-base font-bold shadow-lg mt-8"
              >
                مشاهده {sortedProducts.length.toLocaleString('fa-IR')} محصول
              </button>

            </div>
          </div>
        </aside>

        {/* Main Content (Products) */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Toolbar (Sorting) */}
          <div className="bg-white rounded-2xl border border-border/50 p-3 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 overflow-x-auto cart-scroll pb-1 sm:pb-0">
              <span className="text-sm text-text-secondary font-medium whitespace-nowrap">مرتب‌سازی:</span>
              {[
                { id: 'newest', label: 'جدیدترین' },
                { id: 'price-asc', label: 'ارزان‌ترین' },
                { id: 'price-desc', label: 'گران‌ترین' },
                { id: 'discount', label: 'بیشترین تخفیف' },
              ].map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => handleSortChange(sort.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    sortFilter === sort.id
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-light-bg text-text-secondary hover:bg-gray-200 hover:text-primary'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid - 4 Columns x 3 Rows = 12 Products */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-border/50 p-12 text-center shadow-sm">
              <Search className="w-16 h-16 text-text-secondary/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">محصولی یافت نشد!</h3>
              <p className="text-sm text-text-secondary mb-6">با فیلترهای انتخابی شما هیچ محصولی پیدا نشد.</p>
              <button onClick={clearFilters} className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <>
              <div
                className="select-none touch-pan-y"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <div 
                  key={currentPage}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-6 animate-fade-in-scale"
                >
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.images[0]}
                        rating={product.rating}
                        discount={product.discount}
                        badge={product.discount >= 20 ? 'تخفیف ویژه' : product.discount > 0 ? 'فروش ویژه' : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Numbers */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 mb-4">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-light-bg"
                  >
                    قبلی
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-border text-text-secondary hover:bg-light-bg'
                      }`}
                    >
                      {page.toLocaleString('fa-IR')}
                    </button>
                  ))}

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-light-bg"
                  >
                    بعدی
                  </button>
                </div>
              )}
              
              <p className="text-center text-xs text-text-secondary mt-2">
                برای ورق زدن محصولات را به چپ یا راست بکشید
              </p>
            </>
          )}

        </div>
      </div>

      {/* Payment Status Popups */}
      {paymentStatus === 'success' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in relative">
            <button 
              onClick={() => setPaymentStatus(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-danger transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">پرداخت با موفقیت انجام شد!</h2>
            <p className="text-text-secondary mb-6">
              از اعتماد شما به فروشگاه درنیکا سپاسگزاریم. سفارش شما ثبت شد و به زودی پردازش خواهد شد.
            </p>
            <button 
              onClick={() => setPaymentStatus(null)}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition-colors"
            >
              ادامه خرید
            </button>
          </div>
        </div>
      )}

      {/* Failed Payment Popup */}
      {paymentStatus === 'failed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in relative">
            <button 
              onClick={() => setPaymentStatus(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-danger transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">تراکنش ناموفق بود!</h2>
            <p className="text-text-secondary mb-6">
              متاسفانه پرداخت شما انجام نشد. لطفاً اطلاعات کارت خود را بررسی کرده و مجدداً تلاش کنید.
            </p>
            <button 
              onClick={() => { setPaymentStatus(null); navigate('/cart'); }}
              className="w-full bg-danger text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              بازگشت به سبد خرید و پرداخت مجدد
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
