import { useState, useRef } from 'react';
import {
  LayoutPanelTop, Eye, EyeOff, Phone, AlertCircle,
  Image as ImageIcon, Upload, Trash2, Type, Plus,
  ArrowUp, ArrowDown, Menu,
} from 'lucide-react';
import { useHeader } from '../../context/HeaderContext';
import CollapsibleSection from './CollapsibleSection';

// لوگوی پیش‌فرض SVG برای پیش‌نمایش
function DefaultLogoPreview() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
      <rect width="48" height="48" rx="8" fill="#0f172a" />
      <path d="M12 16l12-6 12 6v12l-12 6-12-6V16z" stroke="white" strokeWidth="2" fill="none" />
      <path d="M12 16l12 6 12-6" stroke="white" strokeWidth="2" />
      <path d="M24 22v12" stroke="white" strokeWidth="2" />
      <path d="M12 28l12 6 12-6" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export default function HeaderManager() {
  const { settings, updateSettings, addNavItem, updateNavItem, removeNavItem, moveNavItem } = useHeader();
  const [addingNav, setAddingNav] = useState(false);
  const [newNavItem, setNewNavItem] = useState({ label: '', path: '', isExternal: false });
  const [editingNavId, setEditingNavId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویری انتخاب کنید');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم لوگو نباید بیشتر از ۲ مگابایت باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSettings({ logoImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAddNavItem = () => {
    if (!newNavItem.label.trim() || !newNavItem.path.trim()) return;
    addNavItem(newNavItem);
    setNewNavItem({ label: '', path: '', isExternal: false });
    setAddingNav(false);
  };

  const handleUpdateNavItem = (id: number) => {
    if (!newNavItem.label.trim() || !newNavItem.path.trim()) return;
    updateNavItem(id, newNavItem);
    setNewNavItem({ label: '', path: '', isExternal: false });
    setEditingNavId(null);
  };

  const startEditingNav = (item: { id: number; label: string; path: string; isExternal?: boolean }) => {
    setNewNavItem({ label: item.label, path: item.path, isExternal: item.isExternal || false });
    setEditingNavId(item.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <LayoutPanelTop className="w-5 h-5" />
          تنظیمات هدر سایت
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          روی هر بخش کلیک کنید تا باز شود. تمام تغییرات به‌صورت خودکار ذخیره می‌شوند.
        </p>
      </div>

      {/* ===== Logo Section ===== */}
      <CollapsibleSection
        title="لوگو و نام برند"
        icon={<ImageIcon className="w-4 h-4" />}
        defaultOpen
      >
        <div className="space-y-5 pt-4">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              لوگو (آیکون هدر و فوتر)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border border-border bg-light-bg flex items-center justify-center overflow-hidden flex-shrink-0">
                {settings.logoImage ? (
                  <img src={settings.logoImage} alt="لوگو" className="w-full h-full object-contain" />
                ) : (
                  <DefaultLogoPreview />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-accent/10 text-accent border border-accent/30 border-dashed rounded-xl px-4 py-3 text-sm font-medium hover:bg-accent/20 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  آپلود لوگوی جدید
                </button>
                {settings.logoImage && (
                  <button
                    onClick={() => updateSettings({ logoImage: '' })}
                    className="w-full flex items-center justify-center gap-2 text-danger text-xs hover:bg-red-50 rounded-lg py-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف لوگو و بازگشت به لوگوی پیش‌فرض
                  </button>
                )}
                <p className="text-[11px] text-text-secondary">
                  فرمت‌های مجاز: PNG, JPG, SVG | حداکثر ۲ مگابایت | ترجیحاً مربعی
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Logo Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              متن اصلی کنار لوگو
            </label>
            <input
              type="text"
              value={settings.logoTitle}
              onChange={(e) => updateSettings({ logoTitle: e.target.value })}
              placeholder="درنیکا"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>

          {/* Logo Subtitle */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              متن زیرین کنار لوگو
            </label>
            <input
              type="text"
              value={settings.logoSubtitle}
              onChange={(e) => updateSettings({ logoSubtitle: e.target.value })}
              placeholder="تأسیسات و تجهیزات ساختمان"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ===== Navigation Menu Section ===== */}
      <CollapsibleSection
        title="منوی افقی زیر هدر"
        icon={<Menu className="w-4 h-4" />}
        badge={`${settings.navItems.length} دکمه`}
      >
        <div className="space-y-4 pt-4">
          {/* Nav Items List */}
          <div className="space-y-2">
            {settings.navItems.map((item: any, idx: number) => (
              <div key={item.id} className="bg-light-bg rounded-xl p-3 flex items-center gap-3">
                {editingNavId === item.id ? (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newNavItem.label}
                      onChange={(e) => setNewNavItem({ ...newNavItem, label: e.target.value })}
                      placeholder="نام دکمه"
                      className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    />
                    <input
                      type="text"
                      value={newNavItem.path}
                      onChange={(e) => setNewNavItem({ ...newNavItem, path: e.target.value })}
                      placeholder="/shop یا https://..."
                      className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                      dir="ltr"
                    />
                    <label className="flex items-center gap-2 text-xs text-text-secondary sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={newNavItem.isExternal}
                        onChange={(e) => setNewNavItem({ ...newNavItem, isExternal: e.target.checked })}
                        className="rounded"
                      />
                      لینک خارجی (در تب جدید باز شود)
                    </label>
                    <div className="flex gap-2 sm:col-span-2">
                      <button
                        onClick={() => handleUpdateNavItem(item.id)}
                        className="bg-accent text-white px-3 py-1.5 rounded-lg text-xs hover:bg-accent-dark transition-colors"
                      >
                        ذخیره
                      </button>
                      <button
                        onClick={() => { setEditingNavId(null); setNewNavItem({ label: '', path: '', isExternal: false }); }}
                        className="bg-light-bg text-text-secondary px-3 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary">{item.label}</p>
                      <p className="text-xs text-text-secondary truncate" dir="ltr">{item.path}</p>
                      {item.isExternal && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">خارجی</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveNavItem(item.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-text-secondary hover:text-accent disabled:opacity-30"
                        title="بالا"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveNavItem(item.id, 'down')}
                        disabled={idx === settings.navItems.length - 1}
                        className="p-1 text-text-secondary hover:text-accent disabled:opacity-30"
                        title="پایین"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => startEditingNav(item)}
                      className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <Type className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeNavItem(item.id)}
                      className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Nav Item */}
          {addingNav ? (
            <div className="bg-accent/5 border border-accent/30 border-dashed rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-primary">افزودن دکمه جدید</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">نام دکمه</label>
                  <input
                    type="text"
                    value={newNavItem.label}
                    onChange={(e) => setNewNavItem({ ...newNavItem, label: e.target.value })}
                    placeholder="مثال: محصولات جدید"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">لینک</label>
                  <input
                    type="text"
                    value={newNavItem.path}
                    onChange={(e) => setNewNavItem({ ...newNavItem, path: e.target.value })}
                    placeholder="/shop یا https://example.com"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    dir="ltr"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={newNavItem.isExternal}
                  onChange={(e) => setNewNavItem({ ...newNavItem, isExternal: e.target.checked })}
                  className="rounded"
                />
                لینک خارجی (در تب جدید باز شود)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleAddNavItem}
                  disabled={!newNavItem.label.trim() || !newNavItem.path.trim()}
                  className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                >
                  افزودن
                </button>
                <button
                  onClick={() => { setAddingNav(false); setNewNavItem({ label: '', path: '', isExternal: false }); }}
                  className="bg-light-bg text-text-secondary px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingNav(true)}
              className="w-full border-2 border-dashed border-accent/40 text-accent py-3 rounded-xl hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              افزودن دکمه جدید
            </button>
          )}
        </div>
      </CollapsibleSection>

      {/* ===== Top Bar Section ===== */}
      <CollapsibleSection
        title="نوار بالایی هدر"
        icon={<LayoutPanelTop className="w-4 h-4" />}
      >
        <div className="space-y-5 pt-4">
          {/* Live Preview */}
          <div className="bg-light-bg rounded-xl p-3 border border-border/50">
            <p className="text-xs text-text-secondary mb-2 font-medium">پیش‌نمایش:</p>
            {settings.topBarEnabled ? (
              <div className="bg-primary text-white text-xs py-2 px-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span>{settings.topBarRightText || 'متن سمت راست'}</span>
                </div>
                <span>{settings.topBarLeftText || 'متن سمت چپ'}</span>
              </div>
            ) : (
              <div className="text-center text-xs text-text-secondary py-2">نوار بالایی غیرفعال است</div>
            )}
          </div>

          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-light-bg rounded-xl">
            <div className="flex items-center gap-2">
              {settings.topBarEnabled ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-primary">نمایش نوار بالایی هدر</p>
                <p className="text-xs text-text-secondary">روشن/خاموش کردن نوار بالای هدر</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ topBarEnabled: !settings.topBarEnabled })}
              className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                settings.topBarEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
              aria-label="فعال/غیرفعال کردن نوار بالایی"
            >
              <span
                className={`absolute top-0.5 ${settings.topBarEnabled ? 'right-0.5' : 'right-6'} w-5 h-5 bg-white rounded-full transition-all shadow`}
              />
            </button>
          </div>

          {/* Right Text */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              متن سمت راست نوار بالایی
            </label>
            <input
              type="text"
              value={settings.topBarRightText}
              onChange={(e) => updateSettings({ topBarRightText: e.target.value })}
              placeholder="درنیکا؛ مرجع تخصصی تأسیسات ساختمان و استخر"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>

          {/* Left Text */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              متن سمت چپ نوار بالایی
            </label>
            <input
              type="text"
              value={settings.topBarLeftText}
              onChange={(e) => updateSettings({ topBarLeftText: e.target.value })}
              placeholder="ارسال رایگان برای خرید بالای ۵ میلیون تومان"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              شماره پشتیبانی
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => updateSettings({ supportPhone: e.target.value })}
              placeholder="021-12345678"
              dir="ltr"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Help Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-bold mb-1">راهنما:</p>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• تمام تغییرات به‌صورت خودکار ذخیره می‌شوند (نیازی به دکمه ذخیره نیست).</li>
            <li>• با دکمه‌های بازگردانی/انجام مجدد بالای صفحه می‌توانید تغییرات را عقب/جلو ببرید.</li>
            <li>• میانبر: Ctrl+Z برای بازگردانی و Ctrl+Y برای انجام مجدد.</li>
            <li>• روی عنوان هر بخش کلیک کنید تا باز یا بسته شود.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
