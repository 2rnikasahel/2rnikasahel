import { useState, useRef, useEffect } from 'react';
import { Bell, X, Trash2, Package, FileText, ShoppingCart, Settings } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';

export default function NotificationBell() {
  const { notifications, removeNotification, clearAll, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4 text-blue-500" />;
      case 'blog': return <FileText className="w-4 h-4 text-green-500" />;
      case 'order': return <ShoppingCart className="w-4 h-4 text-orange-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-light-bg transition-colors"
        aria-label="اعلان‌ها"
      >
        <Bell className="w-5 h-5 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-border/50 z-50 overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-light-bg/30">
            <h3 className="font-bold text-primary text-sm">اعلان‌ها</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-text-secondary hover:text-danger transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                پاک کردن همه
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>اعلان جدیدی وجود ندارد</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-light-bg/50 transition-colors group ${!notification.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-border/50 flex items-center justify-center flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-primary' : 'text-text-secondary'}`}>
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-text-secondary mt-1">{notification.timestamp}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-text-secondary hover:text-danger transition-all"
                        aria-label="حذف اعلان"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
