import { useEffect } from 'react';
import { User, Mail, Calendar, Package, LogOut, X, ChevronLeft } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock user data (in production, fetch this from API /api/user)
const mockUser = {
  name: 'کاربر مهمان',
  phone: '09123456789',
  email: 'user@example.com',
  joinDate: '1402/10/01',
  ordersCount: 3,
};

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
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
        className="relative bg-white rounded-3xl shadow-2xl border border-border/50 w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 text-text-secondary hover:text-primary hover:bg-light-bg rounded-xl transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-primary p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border-2 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 id="profile-modal-title" className="text-xl font-bold">{mockUser.name}</h2>
            <p className="text-xs text-white/70 mt-1 dir-ltr">{mockUser.phone}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-light-bg p-4 rounded-2xl border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-text-secondary">ایمیل</p>
                <p className="text-sm font-medium text-primary truncate dir-ltr text-left">{mockUser.email}</p>
              </div>
            </div>
            <div className="bg-light-bg p-4 rounded-2xl border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">تاریخ عضویت</p>
                <p className="text-sm font-medium text-primary">{mockUser.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Orders Summary */}
          <div className="bg-light-bg p-4 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                <Package className="w-4 h-4 text-accent" />
                سفارشات اخیر
              </h3>
              <button className="text-xs text-accent hover:text-accent-dark flex items-center gap-1">
                مشاهده همه
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary">سفارش #123{i}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">1402/10/0{i} • 3 محصول</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold">
                    تحویل شده
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              خروج از حساب کاربری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
