import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state on close
      setTimeout(() => {
        setStep('identifier');
        setIdentifier('');
        setOtp('');
        setError('');
        setSuccessMsg('');
      }, 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Security: Sanitize input to prevent XSS
  const sanitizeInput = (input: string) => input.replace(/[<>]/g, '').trim();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const cleanIdentifier = sanitizeInput(identifier);

    // Strict Validation
    if (method === 'sms' && !/^09\d{9}$/.test(cleanIdentifier)) {
      setError('شماره موبایل معتبر نیست (مثال: 09123456789)');
      setLoading(false);
      return;
    }
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanIdentifier)) {
      setError('ایمیل وارد شده معتبر نیست');
      setLoading(false);
      return;
    }

    // Mock API call (using sanitized data)
    setTimeout(() => {
      setStep('otp');
      setSuccessMsg(`کد تایید به ${method === 'sms' ? 'موبایل' : 'ایمیل'} شما ارسال شد.`);
      setLoading(false);
    }, 1200);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock verification for preview
    setTimeout(() => {
      if (otp.length === 5) {
        localStorage.setItem('auth_token', 'demo-otp-token');
        onClose();
        window.location.reload();
      } else {
        setError('کد وارد شده اشتباه است.');
        setLoading(false);
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('auth_token', 'demo-google-token');
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-border/50 w-full max-w-md overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 text-text-secondary hover:text-primary hover:bg-light-bg rounded-xl transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Method Tabs */}
        {step === 'identifier' && (
          <div className="flex border-b border-border">
            <button
              onClick={() => { setMethod('sms'); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                method === 'sms' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-text-secondary hover:text-primary'
              }`}
            >
              <Phone className="w-4 h-4" />
              ورود با پیامک
            </button>
            <button
              onClick={() => { setMethod('email'); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                method === 'email' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-text-secondary hover:text-primary'
              }`}
            >
              <Mail className="w-4 h-4" />
              ورود با ایمیل
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs rounded-xl flex items-center gap-2 border border-green-100">
              <CheckCircle2 className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {/* Step 1: Enter Identifier */}
          {step === 'identifier' && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {method === 'sms' ? <Phone className="w-8 h-8 text-accent" /> : <Mail className="w-8 h-8 text-accent" />}
                </div>
                <h3 className="text-lg font-bold text-primary">ورود / ثبت‌نام سریع</h3>
                <p className="text-xs text-text-secondary mt-1">
                  {method === 'sms' ? 'شماره موبایل خود را وارد کنید' : 'ایمیل خود را وارد کنید'}
                </p>
              </div>
              
              <div>
                <input
                  type={method === 'sms' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={method === 'sms' ? '09123456789' : 'example@mail.com'}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dir-ltr text-center text-lg tracking-wide"
                  dir="ltr"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
                {!loading && <ArrowLeft className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-primary">تایید هویت</h3>
                <p className="text-xs text-text-secondary mt-1">کد ۵ رقمی ارسال شده را وارد کنید</p>
              </div>
              
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="12345"
                  maxLength={5}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dir-ltr"
                  dir="ltr"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 5}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? 'در حال بررسی...' : 'تایید و ورود'}
                {!loading && <ArrowLeft className="w-4 h-4" />}
              </button>
              
              <button
                type="button"
                onClick={() => { setStep('identifier'); setOtp(''); setError(''); setSuccessMsg(''); }}
                className="w-full text-text-secondary text-xs hover:text-primary transition-colors py-2"
              >
                تغییر شماره / ایمیل
              </button>
            </form>
          )}

          {/* Divider & Google Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-text-secondary">یا ورود با</span>
            </div>
          </div>

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
            حساب گوگل
          </button>
        </div>
        
        {/* Footer Link */}
        <div className="bg-light-bg p-4 text-center text-xs text-text-secondary border-t border-border">
          با ورود یا ثبت‌نام، <Link to="/terms" className="text-accent hover:underline">قوانین و مقررات</Link> درنیکا را می‌پذیرید.
        </div>
      </div>
    </div>
  );
}
