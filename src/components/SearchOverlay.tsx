import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, Package, ChevronLeft } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Performance: Use ref to avoid re-attaching listener on every render
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Save to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
    
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    onClose();
  };

  const filteredProducts = query.length > 0 
    ? products.filter((p: any) => p.name.includes(query) || p.brand.includes(query) || p.tags?.some((t: string) => t.includes(query))).slice(0, 6)
    : [];

  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  return (
    <div
      className={`fixed inset-0 z-[150] bg-white/95 backdrop-blur-xl transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 pt-20 sm:pt-32 h-full flex flex-col">
        
        {/* Search Input Area */}
        <div className="relative mb-8">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="جستجوی نام محصول، برند یا دسته‌بندی..."
            className="w-full bg-light-bg border-2 border-border rounded-2xl py-4 pr-14 pl-14 text-lg focus:outline-none focus:border-accent transition-colors shadow-sm"
          />
          <button
            onClick={onClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-text-secondary hover:text-primary hover:bg-gray-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
          
          {/* When typing and has results */}
          {query.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-text-secondary flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  محصولات یافت شده ({filteredProducts.length.toLocaleString('fa-IR')})
                </h3>
                {filteredProducts.length > 0 && (
                  <button onClick={() => handleSearch(query)} className="text-xs text-accent hover:underline flex items-center gap-1">
                    مشاهده همه نتایج
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product: any) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex gap-4 p-3 rounded-2xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all group"
                    >
                      <div className="w-20 h-20 bg-light-bg rounded-xl overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-primary truncate mb-1 group-hover:text-accent transition-colors">{product.name}</h4>
                        <p className="text-xs text-text-secondary mb-2">{product.brand}</p>
                        <p className="text-sm font-black text-accent">{formatPrice(product.price)} <span className="text-[10px] font-normal text-text-secondary">ریال</span></p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-text-secondary/50" />
                  </div>
                  <p className="text-text-secondary text-sm">محصولی با عبارت "{query}" یافت نشد.</p>
                  <button onClick={() => handleSearch(query)} className="mt-4 text-accent text-sm font-bold hover:underline">
                    جستجو در تمام فروشگاه
                  </button>
                </div>
              )}
            </div>
          )}

          {/* When empty, show recent searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-bold text-text-secondary flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />
                جستجوهای اخیر
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(term); handleSearch(term); }}
                    className="px-4 py-2 bg-light-bg border border-border/50 rounded-xl text-sm text-primary hover:border-accent hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-3 h-3" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* When completely empty */}
          {query.length === 0 && recentSearches.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">چه چیزی نیاز دارید؟</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                نام محصول، برند یا دسته‌بندی مورد نظر خود را تایپ کنید تا سریعاً آن را پیدا کنید.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['لوله پلی‌اتیلن', 'شیرآلات', 'پکیج دیواری', 'رادیاتور'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setQuery(tag); handleSearch(tag); }}
                    className="px-4 py-2 bg-white border border-border rounded-full text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
