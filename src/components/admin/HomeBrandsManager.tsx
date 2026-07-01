import { useRef, useState } from 'react';
import {
  Plus, Trash2, Edit2, X, Save, Upload, AlertCircle,
  ArrowUp, ArrowDown, Eye, EyeOff, Building2, Link as LinkIcon
} from 'lucide-react';
import { useHome, Brand } from '../../context/HomeContext';

export default function HomeBrandsManager() {
  const { settings, addBrand, updateBrand, removeBrand, moveBrand, updateBrandsSection } = useHome();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Brand, 'id'>>({
    name: '',
    logo: '',
    link: '/shop',
    visible: true,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm({ name: '', logo: '', link: '/shop', visible: true });
    setAdding(false);
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('فقط فایل تصویری انتخاب کنید');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم لوگو نباید بیشتر از ۲ مگابایت باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm({ ...form, logo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert('نام برند را وارد کنید');
      return;
    }
    if (editingId) {
      updateBrand(editingId, form);
    } else {
      addBrand(form);
    }
    resetForm();
  };

  const startEdit = (brand: Brand) => {
    setForm({ name: brand.name, logo: brand.logo, link: brand.link, visible: brand.visible });
    setEditingId(brand.id);
    setAdding(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
        مدیریت برندها در صفحه اول. می‌توانید برند جدید اضافه کنید، لوگو آپلود کنید و نمایش هر برند را روشن/خاموش کنید.
      </div>

      {/* ویرایش متن‌های بخش برندها */}
      <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
        <h4 className="text-sm font-bold text-primary">متن‌های بخش برندها</h4>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5">عنوان</label>
          <input
            type="text"
            value={settings.brandsSection.title}
            onChange={(e) => updateBrandsSection({ title: e.target.value })}
            placeholder="برندهای ما"
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5">زیرعنوان (توضیح)</label>
          <input
            type="text"
            value={settings.brandsSection.subtitle}
            onChange={(e) => updateBrandsSection({ subtitle: e.target.value })}
            placeholder="نمایندگی رسمی برترین برندهای تأسیسات..."
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Brand List */}
      <div className="space-y-2">
        {settings.brands.map((brand: any, idx: number) => (
          <div
            key={brand.id}
            className={`bg-white rounded-2xl border border-border/60 p-3 flex items-center gap-3 transition-opacity ${
              brand.visible ? '' : 'opacity-60'
            }`}
          >
            {/* Logo Preview */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
              ) : (
                <Building2 className="w-5 h-5 text-text-secondary" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary truncate">{brand.name}</p>
              <p className="text-xs text-text-secondary truncate" dir="ltr">{brand.link}</p>
            </div>

            {/* Visibility */}
            <button
              onClick={() => updateBrand(brand.id, { visible: !brand.visible })}
              className={`relative inline-block w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                brand.visible ? 'bg-green-500' : 'bg-gray-300'
              }`}
              title={brand.visible ? 'مخفی کردن' : 'نمایش'}
            >
              <span
                className={`absolute top-0.5 ${brand.visible ? 'right-0.5' : 'right-5'} w-4 h-4 bg-white rounded-full shadow transition-all`}
              />
            </button>
            {brand.visible ? <Eye className="w-3.5 h-3.5 text-green-600" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}

            {/* Order */}
            <div className="flex flex-col">
              <button
                onClick={() => moveBrand(brand.id, 'up')}
                disabled={idx === 0}
                className="p-1 text-text-secondary hover:text-accent disabled:opacity-30"
                title="بالا"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveBrand(brand.id, 'down')}
                disabled={idx === settings.brands.length - 1}
                className="p-1 text-text-secondary hover:text-accent disabled:opacity-30"
                title="پایین"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={() => startEdit(brand)}
              className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
              title="ویرایش"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`برند «${brand.name}» حذف شود؟`)) removeBrand(brand.id);
              }}
              className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {adding ? (
        <div className="bg-accent/5 border border-accent/30 border-dashed rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-primary flex items-center gap-2">
            {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'ویرایش برند' : 'افزودن برند جدید'}
          </h4>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">لوگو برند</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.logo ? (
                  <img src={form.logo} alt="لوگو" className="w-full h-full object-contain p-1" />
                ) : (
                  <Building2 className="w-7 h-7 text-text-secondary" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-accent/10 text-accent border border-accent/30 border-dashed rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-accent/20 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  آپلود لوگو
                </button>
                {form.logo && (
                  <button
                    onClick={() => setForm({ ...form, logo: '' })}
                    className="w-full flex items-center justify-center gap-1.5 text-danger text-xs hover:bg-red-50 rounded-lg py-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف لوگو
                  </button>
                )}
                <p className="text-[11px] text-text-secondary">PNG, JPG, SVG | حداکثر ۲ مگابایت</p>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">نام برند</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: بوتان"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              لینک برند
            </label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="/shop یا https://..."
              dir="ltr"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Visibility */}
          <label className="flex items-center gap-3 bg-white rounded-xl p-3 cursor-pointer">
            <button
              type="button"
              onClick={() => setForm({ ...form, visible: !form.visible })}
              className={`relative inline-block w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                form.visible ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 ${form.visible ? 'right-0.5' : 'right-5'} w-4 h-4 bg-white rounded-full shadow transition-all`}
              />
            </button>
            <span className="text-sm text-primary">نمایش در سایت</span>
          </label>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!form.name.trim()}
              className="flex-1 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'ذخیره تغییرات' : 'افزودن برند'}
            </button>
            <button
              onClick={resetForm}
              className="bg-light-bg text-text-secondary px-4 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full border-2 border-dashed border-accent/40 text-accent py-3 rounded-2xl hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          افزودن برند جدید
        </button>
      )}

      {settings.brands.length === 0 && (
        <div className="bg-light-bg rounded-2xl p-8 text-center border border-border/50">
          <AlertCircle className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-sm text-text-secondary">هنوز برندی ثبت نشده است</p>
        </div>
      )}
    </div>
  );
}
