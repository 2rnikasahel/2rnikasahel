import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Calendar, ShieldCheck, AlertCircle, Wallet, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePayment } from '../context/PaymentContext';

export function PaymentPage() {
  const navigate = useNavigate();
  const { totalPrice, items, clearCart } = useCart();
  const { getEnabledGateways } = usePayment();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cvv2: '',
    expiryDate: '',
    password: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);

  const enabledGateways = getEnabledGateways();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // فرمت‌دهی شماره کارت (۴ رقم ۴ رقم)
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    // فرمت‌دهی تاریخ انقضا (MM/YY)
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی ساده
    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      setError('شماره کارت باید ۱۶ رقم باشد.');
      return;
    }
    if (formData.cvv2.length < 3) {
      setError('CVV2 نامعتبر است.');
      return;
    }
    if (formData.password.length < 4) {
      setError('رمز پویا باید حداقل ۴ رقم باشد.');
      return;
    }

    setIsProcessing(true);

    // شبیه‌سازی ارتباط با بانک (۲ ثانیه تاخیر)
    setTimeout(() => {
      setIsProcessing(false);
      clearCart(); // خالی کردن سبد خرید
      navigate('/shop?payment=success');
    }, 2500);
  };

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handleGatewaySelect = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedGateway) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 justify-center">
          <button onClick={() => navigate('/cart')} className="hover:text-accent">سبد خرید</button>
          <span>/</span>
          <span className="text-primary font-medium">انتخاب درگاه پرداخت</span>
        </nav>

        <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">انتخاب درگاه پرداخت</h2>
          <p className="text-text-secondary mb-8">لطفاً یکی از درگاه‌های پرداخت زیر را انتخاب کنید</p>

          {enabledGateways.length === 0 ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-600">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="font-bold">هیچ درگاه پرداختی فعال نیست!</p>
              <p className="text-sm mt-1">لطفاً از ادمین پنل至少 یک درگاه پرداخت را فعال کنید.</p>
              <button onClick={() => navigate('/admin')} className="mt-4 bg-primary text-white px-6 py-2 rounded-xl text-sm hover:bg-primary-light transition-colors">
                رفتن به ادمین پنل
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
              {enabledGateways.map((gateway: any) => (
                <button
                  key={gateway.id}
                  onClick={() => handleGatewaySelect(gateway.id)}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      gateway.type === 'bank' ? 'bg-blue-100 text-blue-600' :
                      gateway.type === 'crypto' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {gateway.type === 'bank' ? <ShieldCheck className="w-5 h-5" /> :
                       gateway.type === 'crypto' ? <Wallet className="w-5 h-5" /> :
                       <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-primary group-hover:text-accent transition-colors">{gateway.name}</p>
                      <p className="text-[10px] text-text-secondary">
                        {gateway.type === 'bank' ? 'درگاه بانکی مستقیم' : 
                         gateway.type === 'crypto' ? 'پرداخت با ارز دیجیتال' : 'پرداخت‌یار امن'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentGateway = enabledGateways.find(g => g.id === selectedGateway);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8" aria-label="مسیر">
        <button onClick={() => setSelectedGateway(null)} className="hover:text-accent flex items-center gap-1">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </button>
        <span>/</span>
        <span className="text-primary font-medium">{currentGateway?.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            <div className="bg-[#0f172a] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">پرداخت از طریق {currentGateway?.name}</h1>
                  <p className="text-xs text-gray-400">اتصال امن به شبکه شتاب</p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-400">مبلغ قابل پرداخت</p>
                <p className="text-xl font-bold text-accent">{formatPrice(totalPrice)} <span className="text-xs text-gray-400 font-normal">ریال</span></p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-text-secondary" />
                    شماره کارت
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-left dir-ltr text-lg tracking-widest font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">CVV2</label>
                    <input
                      type="text"
                      name="cvv2"
                      value={formData.cvv2}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-left dir-ltr font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-secondary" />
                      تاریخ انقضا
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-left dir-ltr font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-text-secondary" />
                      رمز پویا (یکبار مصرف)
                    </span>
                    <button type="button" className="text-xs text-accent hover:underline">درخواست رمز پویا</button>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="****"
                    maxLength={8}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-left dir-ltr font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1e293b] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال اتصال به {currentGateway?.name}...
                    </>
                  ) : (
                    `پرداخت ${formatPrice(totalPrice)} ریال از طریق ${currentGateway?.name}`
                  )}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/shop?payment=failed')}
                    className="text-xs text-red-500 hover:text-red-700 underline transition-colors"
                  >
                    شبیه‌سازی پرداخت ناموفق (برای تست کالبک)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-primary mb-4 text-lg">خلاصه سفارش</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg bg-light-bg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                    <p className="text-xs text-text-secondary">{item.quantity.toLocaleString('fa-IR')} عدد</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-text-secondary">
                <span>مجموع سبد خرید</span>
                <span>{formatPrice(totalPrice)} ریال</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>هزینه ارسال</span>
                <span className="text-green-600">رایگان</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-border/50 mt-2">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatPrice(totalPrice)} ریال</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
