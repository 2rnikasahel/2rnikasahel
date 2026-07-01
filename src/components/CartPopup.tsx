import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Minus, Plus, ShoppingBag, CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPopup({ isOpen, onClose }: CartPopupProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in flex items-center justify-center p-4"
        onClick={onClose}
        aria-hidden="true"
      >
        {/* Glassmorphism Popup */}
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-popup-title"
          className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/50 backdrop-blur-md border-b border-white/30 p-5 flex items-center justify-between z-10">
            <h3 id="cart-popup-title" className="font-bold text-primary text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent" />
              </div>
              سبد خرید ({items.length} محصول)
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-xl transition-colors" aria-label="بستن سبد خرید">
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-light-bg/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/50">
                  <ShoppingBag className="w-12 h-12 text-text-secondary/50" />
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">سبد خرید خالی است</h4>
                <p className="text-sm text-text-secondary mb-6">محصولات مورد علاقه خود را اضافه کنید</p>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-light transition-all shadow-lg hover:shadow-xl"
                >
                  مشاهده فروشگاه
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3 mb-6">
                  {items.map((item: any) => (
                    <div key={item.id} className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-3 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-border/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-primary truncate mb-1">{item.name}</h4>
                          {item.variations && item.variations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {item.variations.map((v: any, i: number) => (
                                <span key={i} className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                                  {v.variationName}: {v.optionName}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm font-bold text-accent">{formatPrice(item.price)} ریال</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white/80 border border-border/50 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
                              aria-label={`کاهش تعداد ${item.name}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center text-primary" aria-live="polite">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
                              aria-label={`افزایش تعداد ${item.name}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-text-secondary hover:text-danger hover:bg-red-50/50 rounded-xl transition-colors"
                            aria-label={`حذف ${item.name} از سبد خرید`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-xs text-danger hover:underline mb-6 block"
                >
                  پاک کردن سبد خرید
                </button>

                {/* Summary */}
                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-5 mb-6 shadow-sm">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-text-secondary">مجموع ({items.length} کالا):</span>
                    <span className="text-primary font-medium">{formatPrice(totalPrice)} ریال</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-text-secondary">هزینه ارسال:</span>
                    <span className="text-green-600 font-medium">رایگان</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-lg">
                    <span className="text-primary">مبلغ قابل پرداخت:</span>
                    <span className="text-accent">{formatPrice(totalPrice)} ریال</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-primary-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  تکمیل سفارش و پرداخت
                </Link>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-secondary">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  پرداخت امن و مطمئن با درگاه بانکی
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
