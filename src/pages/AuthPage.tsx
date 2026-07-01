import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Phone, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    password_confirmation: '',
    otp: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await api.get('/auth/google/redirect');
      if (res.data.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err) {
      setError('خطا در اتصال به گوگل. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      
      if (res.data.data?.requires_verification) {
        setStep('otp');
        setSuccessMsg('کد تایید به شماره موبایل شما ارسال شد.');
      } else {
        // Direct login if no OTP needed
        localStorage.setItem('auth_token', res.data.data.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ثبت‌نام. شماره تکراری است یا اطلاعات ناقص است.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', {
        phone: formData.phone,
        password: formData.password,
      });
      
      localStorage.setItem('auth_token', res.data.data.token);
      navigate('/');
      window.location.reload(); // Refresh to update header state
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.requires_verification) {
        setStep('otp');
        setSuccessMsg('حساب شما نیاز به تایید دارد. کد ارسال شده را وارد کنید.');
      } else {
        setError(err.response?.data?.message || 'شماره موبایل یا رمز عبور اشتباه است.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-phone', {
        phone: formData.phone,
        code: formData.otp,
      });
      
      localStorage.setItem('auth_token', res.data.data.token);
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'کد وارد شده اشتباه یا منقضی شده است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-light-bg">
      <div className="bg-white rounded-3xl shadow-xl border border-border/50 w-full max-w-md overflow-hidden">
        
        {/* Header Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => { setActiveTab('login'); setStep('form'); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === 'login' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-text-secondary hover:text-primary'
            }`}
          >
            ورود به حساب
          </button>
          <button
            onClick={() => { setActiveTab('register'); setStep('form'); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === 'register' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-text-secondary hover:text-primary'
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {successMsg && step === 'otp' && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs rounded-xl flex items-center gap-2 border border-green-100">
              <CheckCircle2 className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary">تایید شماره موبایل</h3>
                <p className="text-xs text-text-secondary mt-1">کد ۵ رقمی ارسال شده به {formData.phone} را وارد کنید</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">کد تایید</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="12345"
                  maxLength={5}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dir-ltr"
                  dir="ltr"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-light transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? 'در حال بررسی...' : 'تایید و ورود'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-text-secondary text-xs hover:text-primary transition-colors"
              >
                بازگشت و ویرایش شماره
              </button>
            </form>
          ) : (
            /* Login / Register Form */
            <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-4">
              
              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-primary mb-1.5">نام و نام خانوادگی</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-light-bg border border-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="مثال: علی محمدی"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">شماره موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-light-bg border border-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dir-ltr"
                    placeholder="09123456789"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">رمز عبور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-light-bg border border-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dir-ltr"
                    placeholder="••••••••"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-primary mb-1.5">تکرار رمز عبور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      className="w-full bg-light-bg border border-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dir-ltr"
                      placeholder="••••••••"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'لطفاً صبر کنید...' : (activeTab === 'login' ? 'ورود به حساب' : 'ثبت‌نام')}
                {!loading && <ArrowLeft className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Divider */}
          {step === 'form' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-text-secondary">یا</span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-border text-primary py-3 rounded-xl font-medium hover:bg-light-bg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                ورود با حساب گوگل
              </button>
            </>
          )}
        </div>
        
        {/* Footer Link */}
        <div className="bg-light-bg p-4 text-center text-xs text-text-secondary border-t border-border">
          با ورود یا ثبت‌نام، <Link to="/terms" className="text-accent hover:underline">قوانین و مقررات</Link> درنیکا را می‌پذیرید.
        </div>
      </div>
    </div>
  );
}
