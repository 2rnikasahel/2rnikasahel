import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl p-12 border border-border/50">
          <div className="w-24 h-24 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">سبد خرید شما خالی است</h2>
          <p className="text-text-secondary mb-6">محصولات مورد علاقه خود را به سبد خرید اضافه کنید</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-light transition-colors">
            مشاهده فروشگاه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link to="/" className="hover:text-accent">خانه</Link>
        <span>/</span>
        <span className="text-primary font-medium">سبد خرید</span>
      </nav>

      <h1 className="text-2xl font-bold text-primary mb-6">سبد خرید ({items.length} محصول)</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-border/50 p-4 flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-light-bg">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-primary mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-lg font-bold text-primary">{formatPrice(item.price)} ریال</p>
                {item.originalPrice && (
                  <p className="text-xs text-text-secondary line-through">{formatPrice(item.originalPrice)} ریال</p>
                )}
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="p-2 text-text-secondary hover:text-danger transition-colors" aria-label="حذف">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-light-bg transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-light-bg transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-danger hover:underline">پاک کردن سبد خرید</button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border/50 p-6 sticky top-24">
            <h3 className="font-bold text-primary mb-4">خلاصه سفارش</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">مجموع ({items.length} کالا):</span>
                <span className="text-primary">{formatPrice(totalPrice)} ریال</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">تخفیف:</span>
                <span className="text-danger">۰ ریال</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">هزینه ارسال:</span>
                <span className="text-green-600">رایگان</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span className="text-primary">مبلغ قابل پرداخت:</span>
                <span className="text-primary">{formatPrice(totalPrice)} ریال</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/payment')}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <CreditCard className="w-4 h-4" />
              پرداخت و تکمیل سفارش
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              پرداخت امن و مطمئن
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
