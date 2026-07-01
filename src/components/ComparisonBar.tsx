import { Link } from 'react-router-dom';
import { GitCompare, X, Trash2 } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useProducts } from '../context/ProductsContext';

export default function ComparisonBar() {
  const { compareList, clearCompare, removeFromCompare } = useComparison();
  const { products } = useProducts();

  if (compareList.length === 0) return null;

  const compareProducts = products.filter((p: any) => compareList.includes(p.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar flex-1 pl-4">
          <div className="flex items-center gap-2 text-primary font-bold flex-shrink-0">
            <GitCompare className="w-5 h-5 text-accent" />
            <span className="hidden sm:inline">مقایسه محصولات</span>
            <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full">{compareList.length.toLocaleString('fa-IR')}</span>
          </div>
          
          <div className="flex gap-3">
            {compareProducts.map((product: any) => (
              <div key={product.id} className="relative group flex-shrink-0">
                <div className="w-12 h-12 bg-light-bg rounded-lg border border-border/50 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(product.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 hover:scale-110 transition-transform shadow-sm"
                  aria-label="حذف از مقایسه"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={clearCompare}
            className="text-text-secondary hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">پاک کردن</span>
          </button>
          <Link 
            to="/compare"
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-light transition-colors flex items-center gap-2"
          >
            مشاهده مقایسه
            <GitCompare className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
