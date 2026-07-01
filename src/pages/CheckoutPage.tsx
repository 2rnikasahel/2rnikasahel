import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AddressManager from '../components/AddressManager';

interface Address {
  id: number;
  title: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  phone: string;
}

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const shippingCost = 50000; // Fixed shipping for demo
  const finalTotal = totalPrice + (totalPrice > 0 ? shippingCost : 0);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('لطفاً یک آدرس برای ارسال انتخاب کنید.');
      return;
    }
    if (items.length === 0) {
      alert('سبد خرید شما خالی است.');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      clearCart();
      navigate('/payment?status=success'); // Redirect to payment simulation
    }, 1500);
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">سبد خرید خالی است</h2>
          <p className="text-text-secondary mb-6">برای تکمیل خرید ابتدا محصولی اضافه کنید.</p>
          <button onClick={() => navigate('/shop')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-light transition-colors">
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-black text-primary mb-8 flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-accent" />
        تکمیل سفارش و پرداخت
      </h1>

      <div className="grid grid-cols-3 gap-8">
        
        {/* Right Column: Address & Info */}
        <div className="col-span-2 space-y-8">
          {/* Address Section */}
          <div className="bg-white rounded-3xl border border-border/50 p-6 shadow-sm">
            <AddressManager onSelect={setSelectedAddress as any} selectedId={selectedAddress?.id} />
          </div>

          {/* Delivery Method (Mock) */}
          <div className="bg-white rounded-3xl border border-border/50 p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-accent" />
              روش ارسال
            </h3>
            <div className="p-4 border-2 border-accent bg-accent/5 rounded-2xl flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-primary">پست پیشتاز (پیش‌فرض)</p>
                  <p className="text-xs text-text-secondary mt-0.5">تحویل ۲ تا ۴ روز کاری</p>
                </div>
              </div>
              <span className="font-bold text-primary text-sm">{shippingCost.toLocaleString('fa-IR')} ریال</span>
            </div>
          </div>
        </div>

        {/* Left Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-border/50 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-primary mb-6 pb-4 border-b border-border">خلاصه سفارش</h3>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-light-bg rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">{item.name}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">تعداد: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{(item.price * item.quantity).toLocaleString('fa-IR')}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-sm mb-6 pt-4 border-t border-border/50">
              <div className="flex justify-between text-text-secondary">
                <span>مجموع کالاها</span>
                <span className="text-primary font-medium">{totalPrice.toLocaleString('fa-IR')} ریال</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>هزینه ارسال</span>
                <span className="text-primary font-medium">{shippingCost.toLocaleString('fa-IR')} ریال</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>تخفیف</span>
                <span className="text-green-600 font-medium">۰ ریال</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex justify-between items-center mb-6 pt-4 border-t-2 border-border">
              <span className="font-bold text-lg text-primary">مبلغ قابل پرداخت</span>
              <span className="font-black text-xl text-accent">{finalTotal.toLocaleString('fa-IR')} <span className="text-xs font-normal text-text-secondary">ریال</span></span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">در حال ثبت سفارش...</span>
              ) : (
                <>
                  ثبت نهایی و پرداخت
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              پرداخت امن و مطمئن با درگاه بانکی
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
