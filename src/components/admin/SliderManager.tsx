import { useState, useRef } from 'react';
import {
  Plus, Trash2, Edit2, X,
  AlertCircle, Save, Image as ImageIcon, ArrowUp, ArrowDown,
  Sparkles, Link as LinkIcon, Type, Monitor
} from 'lucide-react';
import { useSlider, Slide } from '../../context/SliderContext';

const effectOptions: { value: Slide['effect']; label: string; description: string }[] = [
  { value: 'fade', label: 'محو شدن (Fade)', description: 'تغییر نرم با محو شدن تصویر' },
  { value: 'slide', label: 'اسلاید (Slide)', description: 'حرکت افقی تصویر جدید' },
  { value: 'zoom', label: 'بزرگنمایی (Zoom)', description: 'زوم نرم روی تصویر' },
  { value: 'kenburns', label: 'کن برنز (Ken Burns)', description: 'زوم و حرکت آهسته سینمایی' },
  { value: 'flip', label: 'چرخش (Flip)', description: 'چرخش سه‌بعدی تصویر' },
  { value: 'rotate', label: 'چرخش زاویه‌ای (Rotate)', description: 'چرخش ملایم تصویر' },
  { value: 'cube', label: 'مکعبی (Cube)', description: 'افکت چرخش مکعبی سه‌بعدی' },
  { value: 'coverflow', label: 'کاور فلو (Coverflow)', description: 'افکت سه‌بعدی اپل' },
];

// Empty placeholder image (gray with Vazirmatn-like fallback text)
const emptyPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f1f5f9"/><text x="50%" y="50%" font-family="Vazirmatn, Arial" font-size="16" fill="#64748b" text-anchor="middle" dominant-baseline="middle">تصویری انتخاب نشده</text></svg>'
)}`;

export default function SliderManager() {
  const { slides, settings, addSlide, updateSlide, deleteSlide, moveSlide, updateSettings } = useSlider();
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New slide form
  const [newSlide, setNewSlide] = useState({
    image: '',
    badge: '',
    title: '',
    subtitle: '',
    buttonText: 'مشاهده محصولات',
    buttonLink: '/shop',
    effect: 'fade' as Slide['effect'],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویری انتخاب کنید');
      setIsUploading(false);
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۵ مگابایت باشد');
      setIsUploading(false);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (isEdit && editingSlide) {
        setPreviewImage(result);
      } else {
        setNewSlide({ ...newSlide, image: result });
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('خطا در خواندن فایل. لطفاً دوباره تلاش کنید.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlide = () => {
    if (!newSlide.title.trim() || !newSlide.image) {
      alert('لطفاً عنوان و تصویر را وارد کنید');
      return;
    }
    addSlide(newSlide);
    setNewSlide({
      image: '',
      badge: '',
      title: '',
      subtitle: '',
      buttonText: 'مشاهده محصولات',
      buttonLink: '/shop',
      effect: 'fade',
    });
    setPreviewImage(null);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditSave = () => {
    if (!editingSlide) return;
    if (!editingSlide.title.trim()) {
      alert('عنوان اسلاید نمی‌تواند خالی باشد');
      return;
    }
    updateSlide(editingSlide.id, {
      image: previewImage || editingSlide.image,
      badge: editingSlide.badge,
      title: editingSlide.title,
      subtitle: editingSlide.subtitle,
      buttonText: editingSlide.buttonText,
      buttonLink: editingSlide.buttonLink,
      effect: editingSlide.effect,
    });
    setEditingSlide(null);
    setPreviewImage(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const getImagePreview = () => {
    if (previewImage) return previewImage;
    if (newSlide.image) return newSlide.image;
    return emptyPlaceholder;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          مدیریت اسلایدر
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          اسلایدها را اضافه، ویرایش یا حذف کنید. رنگ متن به‌صورت خودکار بر اساس روشنایی تصویر تنظیم می‌شود.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">تعداد اسلایدها</p>
          <p className="text-2xl font-bold text-primary">{slides.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">افکت‌های استفاده شده</p>
          <p className="text-2xl font-bold text-accent">{new Set(slides.map((s: any) => s.effect)).size}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">اسلاید فعال</p>
          <p className="text-2xl font-bold text-green-600">{slides.filter((s: any) => s.title).length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">نوع افکت پیش‌فرض</p>
          <p className="text-sm font-bold text-primary mt-2">Fade</p>
        </div>
      </div>

      {/* Slider Timing Settings */}
      <div className="bg-white rounded-2xl p-5 border border-border/50">
        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          تنظیمات زمان‌بندی اسلایدر
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              زمان تغییر خودکار اسلایدها
            </label>
            <select
              value={settings.autoPlayDelay}
              onChange={(e) => updateSettings({ autoPlayDelay: Number(e.target.value) })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer font-['Vazirmatn']"
            >
              <option value={3000}>۳ ثانیه</option>
              <option value={4000}>۴ ثانیه</option>
              <option value={5000}>۵ ثانیه</option>
              <option value={6000}>۶ ثانیه</option>
              <option value={8000}>۸ ثانیه</option>
              <option value={10000}>۱۰ ثانیه</option>
              <option value={15000}>۱۵ ثانیه</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              سرعت افکت تغییر اسلاید
            </label>
            <select
              value={settings.transitionDuration}
              onChange={(e) => updateSettings({ transitionDuration: Number(e.target.value) })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer font-['Vazirmatn']"
            >
              <option value={400}>خیلی سریع - ۰.۴ ثانیه</option>
              <option value={700}>سریع - ۰.۷ ثانیه</option>
              <option value={1000}>نرمال - ۱ ثانیه</option>
              <option value={1300}>نرم - ۱.۳ ثانیه</option>
              <option value={1600}>لوکس - ۱.۶ ثانیه</option>
              <option value={2200}>سینمایی - ۲.۲ ثانیه</option>
            </select>
          </div>
          <div className="bg-light-bg rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">زمان تغییر خودکار:</p>
            <p className="text-lg font-bold text-primary">
              {(settings.autoPlayDelay / 1000).toLocaleString('fa-IR')} ثانیه
            </p>
          </div>
          <div className="bg-light-bg rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">سرعت افکت فعلی:</p>
            <p className="text-lg font-bold text-primary">
              {(settings.transitionDuration / 1000).toLocaleString('fa-IR')} ثانیه
            </p>
          </div>
        </div>
      </div>

      {/* Add New Slide Form */}
      <div className="bg-gradient-to-l from-accent/5 to-transparent rounded-2xl p-5 border-2 border-dashed border-accent/30">
        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-accent" />
          افزودن اسلاید جدید
        </h3>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            تصویر اسلاید <span className="text-danger">*</span>
          </label>
          <div className="relative border-2 border-dashed border-border rounded-xl overflow-hidden bg-light-bg">
            {/* Preview Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={getImagePreview()}
                alt="پیش‌نمایش اسلاید"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = emptyPlaceholder;
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <ImageIcon className="w-10 h-10 text-white mb-2" />
                <span className="text-white text-sm font-medium">تغییر تصویر</span>
              </div>
              {/* Remove button if image exists */}
              {(newSlide.image || previewImage) && (
                <button
                  onClick={() => {
                    setNewSlide({ ...newSlide, image: '' });
                    setPreviewImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 left-2 w-8 h-8 bg-danger text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  title="حذف تصویر"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {/* Uploading indicator */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {/* Click to upload area (when no image) */}
            {!newSlide.image && !previewImage && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-6 text-center cursor-pointer hover:bg-accent/5 transition-colors"
              >
                <ImageIcon className="w-10 h-10 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary font-['Vazirmatn']">
                  کلیک کنید یا تصویر را اینجا بکشید
                </p>
                <p className="text-xs text-text-secondary/70 mt-1 font-['Vazirmatn']">
                  فرمت‌های مجاز: JPG, PNG, WebP | حداکثر ۵ مگابایت
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              عنوان اسلاید <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              placeholder="مثال: سیستم‌های لوله‌کشی ساختمان"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">برچسب (Badge)</label>
            <input
              type="text"
              value={newSlide.badge}
              onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
              placeholder="مثال: فروشگاه درنیکا"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary mb-1.5">توضیحات</label>
            <textarea
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              rows={2}
              placeholder="توضیح کوتاه درباره این اسلاید..."
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none font-['Vazirmatn']"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              متن دکمه
            </label>
            <input
              type="text"
              value={newSlide.buttonText}
              onChange={(e) => setNewSlide({ ...newSlide, buttonText: e.target.value })}
              placeholder="مشاهده محصولات"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              لینک دکمه
            </label>
            <input
              type="text"
              value={newSlide.buttonLink}
              onChange={(e) => setNewSlide({ ...newSlide, buttonLink: e.target.value })}
              placeholder="/shop"
              dir="ltr"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              افکت تغییر تصویر
            </label>
            <select
              value={newSlide.effect}
              onChange={(e) => setNewSlide({ ...newSlide, effect: e.target.value as Slide['effect'] })}
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer font-['Vazirmatn']"
            >
              {effectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddSlide}
          disabled={!newSlide.title.trim() || !newSlide.image || isUploading}
          className="mt-4 w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          افزودن اسلاید
        </button>
      </div>

      {/* Slides List */}
      <div className="space-y-3">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          اسلایدهای موجود ({slides.length})
        </h3>

        {slides.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-border/50 text-center">
            <AlertCircle className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary font-['Vazirmatn']">هیچ اسلایدی ثبت نشده است</p>
          </div>
        ) : (
          slides.map((slide, idx) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image Preview */}
                <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0 bg-light-bg relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = emptyPlaceholder;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-white text-xs font-medium font-['Vazirmatn']">
                      {effectOptions.find((e) => e.value === slide.effect)?.label.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                          #{idx + 1}
                        </span>
                        {slide.badge && (
                          <span className="text-xs bg-light-bg text-text-secondary px-2 py-0.5 rounded font-['Vazirmatn']">
                            {slide.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-primary truncate font-['Vazirmatn']">{slide.title}</h4>
                      {slide.subtitle && (
                        <p className="text-xs text-text-secondary mt-1 line-clamp-1 font-['Vazirmatn']">{slide.subtitle}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-text-secondary">
                        {slide.buttonText && (
                          <span className="flex items-center gap-1 font-['Vazirmatn']">
                            <Type className="w-3 h-3" />
                            دکمه: {slide.buttonText}
                          </span>
                        )}
                        {slide.buttonLink && (
                          <span className="flex items-center gap-1" dir="ltr">
                            <LinkIcon className="w-3 h-3" />
                            {slide.buttonLink}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex flex-col mr-2">
                        <button
                          onClick={() => moveSlide(slide.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-text-secondary hover:text-accent disabled:opacity-30"
                          title="جابجایی به بالا"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSlide(slide.id, 'down')}
                          disabled={idx === slides.length - 1}
                          className="p-1 text-text-secondary hover:text-accent disabled:opacity-30"
                          title="جابجایی به پایین"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setPreviewImage(null);
                        }}
                        className="p-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`اسلاید «${slide.title}» حذف شود؟`)) {
                            deleteSlide(slide.id);
                          }
                        }}
                        className="p-2 text-text-secondary hover:bg-red-50 hover:text-danger rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Help Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 font-['Vazirmatn']">
          <p className="font-bold mb-1">راهنما:</p>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• <b>تشخیص خودکار رنگ متن:</b> بر اساس روشنایی تصویر، رنگ متن بین سفید و تیره تغییر می‌کند.</li>
            <li>• <b>دکمه شیشه‌ای:</b> دکمه روی اسلاید به‌صورت شیشه‌ای (Glassmorphism) نمایش داده می‌شود.</li>
            <li>• <b>افکت‌های لوکس:</b> ۸ افکت حرفه‌ای شامل کن برنز، مکعبی، کاور فلو و ...</li>
            <li>• <b>متن غیرقابل انتخاب:</b> متن روی اسلایدر توسط کاربر قابل انتخاب نیست.</li>
          </ul>
        </div>
      </div>

      {/* ============== EDIT DRAWER ============== */}
      {editingSlide && (
        <EditSlideDrawer
          slide={editingSlide}
          previewImage={previewImage}
          onClose={() => {
            setEditingSlide(null);
            setPreviewImage(null);
          }}
          onSave={handleEditSave}
          onUpdate={(data) => setEditingSlide({ ...editingSlide, ...data })}
          onImageUpload={(e) => handleImageUpload(e, true)}
          fileInputRef={editFileInputRef}
          emptyPlaceholder={emptyPlaceholder}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}

// ============ Edit Slide Drawer ============
interface EditSlideDrawerProps {
  slide: Slide;
  previewImage: string | null;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (data: Partial<Slide>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  emptyPlaceholder: string;
  isUploading: boolean;
}

function EditSlideDrawer({
  slide,
  previewImage,
  onClose,
  onSave,
  onUpdate,
  onImageUpload,
  fileInputRef,
  emptyPlaceholder,
  isUploading,
}: EditSlideDrawerProps) {
  const displayImage = previewImage || slide.image || emptyPlaceholder;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right" dir="rtl">
        <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-primary flex items-center gap-2 font-['Vazirmatn']">
            <Edit2 className="w-5 h-5 text-accent" />
            ویرایش اسلاید
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-light-bg rounded-lg transition-colors" aria-label="بستن">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5 font-['Vazirmatn']">
              <ImageIcon className="w-4 h-4" />
              تصویر اسلاید
            </label>
            <div className="relative border-2 border-dashed border-border rounded-xl overflow-hidden bg-light-bg h-48">
              <img
                src={displayImage}
                alt="پیش‌نمایش"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = emptyPlaceholder;
                }}
              />
              {/* Overlay for change */}
              <div 
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <ImageIcon className="w-8 h-8 text-white mb-2" />
                <span className="text-white text-sm font-medium font-['Vazirmatn']">تغییر تصویر</span>
              </div>
              {/* Uploading indicator */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-2 font-['Vazirmatn']">
              روی تصویر کلیک کنید تا تصویر جدید آپلود شود
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 font-['Vazirmatn']">برچسب (Badge)</label>
            <input
              type="text"
              value={slide.badge}
              onChange={(e) => onUpdate({ badge: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5 font-['Vazirmatn']">
              <Type className="w-3.5 h-3.5" />
              عنوان اسلاید <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={slide.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 font-['Vazirmatn']">توضیحات</label>
            <textarea
              value={slide.subtitle}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              rows={2}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none font-['Vazirmatn']"
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5 font-['Vazirmatn']">
              <Type className="w-3.5 h-3.5" />
              متن دکمه
            </label>
            <input
              type="text"
              value={slide.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent font-['Vazirmatn']"
            />
          </div>

          {/* Button Link */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5 font-['Vazirmatn']">
              <LinkIcon className="w-3.5 h-3.5" />
              لینک دکمه
            </label>
            <input
              type="text"
              value={slide.buttonLink}
              onChange={(e) => onUpdate({ buttonLink: e.target.value })}
              dir="ltr"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Effect */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5 font-['Vazirmatn']">
              <Sparkles className="w-3.5 h-3.5" />
              افکت تغییر تصویر
            </label>
            <select
              value={slide.effect || 'fade'}
              onChange={(e) => onUpdate({ effect: e.target.value as Slide['effect'] })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer font-['Vazirmatn']"
            >
              {effectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.description}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <button
              onClick={onSave}
              disabled={!slide.title.trim() || isUploading}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              ذخیره تغییرات
            </button>
            <button
              onClick={onClose}
              className="px-5 bg-light-bg text-text-secondary rounded-xl hover:bg-gray-200 transition-colors font-['Vazirmatn']"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
