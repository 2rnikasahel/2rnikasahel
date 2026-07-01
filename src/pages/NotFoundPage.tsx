import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Big 404 Text */}
        <h1 className="text-[120px] sm:text-[180px] font-black text-primary/5 leading-none mb-[-20px] sm:mb-[-40px] select-none">
          ۴۰۴
        </h1>
        
        <div className="relative z-10 bg-white rounded-3xl shadow-xl border border-border/50 p-8 sm:p-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-accent" />
          </div>
          
          <h2 className="text-3xl font-bold text-primary mb-4">صفحه مورد نظر یافت نشد!</h2>
          <p className="text-text-secondary mb-8 text-lg">
            متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا آدرس آن تغییر کرده است.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              بازگشت به صفحه اصلی
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-light-bg text-primary border border-border px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              مشاهده فروشگاه
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
