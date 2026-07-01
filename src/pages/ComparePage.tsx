import { Link } from 'react-router-dom';
import { GitCompare, ArrowLeft, X, Minus } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useProducts } from '../context/ProductsContext';
import OptimizedImage from '../components/OptimizedImage';

export function ComparePage() {
  const { compareList, removeFromCompare } = useComparison();
  const { products } = useProducts();

  const compareProducts = products.filter(p => compareList.includes(p.id));

  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <GitCompare className="w-10 h-10 text-text-secondary/50" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">لیست مقایسه خالی است</h2>
          <p className="text-text-secondary mb-8">محصولات مورد نظر خود را برای مقایسه اضافه کنید.</p>
          <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-colors inline-flex items-center gap-2">
            بازگشت به فروشگاه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Extract all unique spec keys for the table rows
  const allSpecKeys = new Set<string>();
  compareProducts.forEach(p => {
    p.specs?.forEach(s => allSpecKeys.add(s.key));
  });
  const specKeys = Array.from(allSpecKeys);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 mb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-3">
          <GitCompare className="w-8 h-8 text-accent" />
          مقایسه محصولات
          <span className="text-sm font-normal text-text-secondary bg-light-bg px-3 py-1 rounded-full mr-2">
            {compareProducts.length.toLocaleString('fa-IR')} محصول
          </span>
        </h1>
        <Link to="/shop" className="text-sm text-accent hover:text-accent-dark flex items-center gap-1 font-medium">
          بازگشت به فروشگاه
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-right">
          <thead>
            <tr className="border-b border-border/50">
              <th className="p-6 w-48 bg-light-bg/50 sticky right-0 z-10">ویژگی‌ها</th>
              {compareProducts.map((product) => (
                <th key={product.id} className="p-6 min-w-[200px] relative group">
                  <button 
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-2 left-2 p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="w-32 h-32 mx-auto mb-4 bg-light-bg rounded-2xl overflow-hidden border border-border/50">
                      <OptimizedImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-sm font-bold text-primary hover:text-accent transition-colors line-clamp-2 mb-2">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-black text-accent">{formatPrice(product.price)} <span className="text-xs font-normal text-text-secondary">ریال</span></p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {/* Brand */}
            <tr>
              <td className="p-4 font-medium text-text-secondary bg-light-bg/30 sticky right-0 z-10">برند</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 text-sm text-primary">{product.brand}</td>
              ))}
            </tr>
            
            {/* Rating */}
            <tr>
              <td className="p-4 font-medium text-text-secondary bg-light-bg/30 sticky right-0 z-10">امتیاز کاربران</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 text-sm text-primary flex items-center gap-1">
                  {product.rating} <span className="text-amber-400 text-xs">★</span>
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr>
              <td className="p-4 font-medium text-text-secondary bg-light-bg/30 sticky right-0 z-10">گارانتی</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 text-sm text-primary">{product.warranty || '-'}</td>
              ))}
            </tr>

            {/* Dynamic Specs */}
            {specKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 font-medium text-text-secondary bg-light-bg/30 sticky right-0 z-10">{key}</td>
                {compareProducts.map((product) => {
                  const spec = product.specs?.find(s => s.key === key);
                  return (
                    <td key={product.id} className="p-4 text-sm text-primary">
                      {spec ? spec.value : <Minus className="w-4 h-4 text-border" />}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Action */}
            <tr>
              <td className="p-6 font-medium text-text-secondary bg-light-bg/30 sticky right-0 z-10">عملیات</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-6">
                  <Link 
                    to={`/product/${product.id}`}
                    className="block w-full text-center bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-light transition-colors"
                  >
                    مشاهده محصول
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
