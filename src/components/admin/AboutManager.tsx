import { useRef } from 'react';
import { LayoutGrid, Type, BarChart3, Upload } from 'lucide-react';
import { useAbout, AboutStat } from '../../context/AboutContext';
import CollapsibleSection from './CollapsibleSection';

export default function AboutManager() {
  const { settings, updateSettings } = useAbout();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSettings({ image: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const updateStat = (id: number, data: Partial<AboutStat>) => {
    const nextStats = settings.stats.map((s: any) => (s.id === id ? { ...s, ...data } : s));
    updateSettings({ stats: nextStats });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" />
          مدیریت بخش درباره ما
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          محتوا و آمار بخش درباره ما در صفحه اصلی را ویرایش کنید.
        </p>
      </div>

      <CollapsibleSection title="محتوای متنی و تصویر" icon={<Type className="w-4 h-4" />} defaultOpen>
        <div className="space-y-5 pt-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">تصویر بخش درباره ما</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-xl border border-border bg-light-bg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={settings.image} alt="درباره ما" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-accent/10 text-accent border border-accent/30 border-dashed rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-accent/20 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  تغییر تصویر
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">عنوان اصلی</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">توضیحات</label>
            <textarea
              value={settings.description}
              onChange={(e) => updateSettings({ description: e.target.value })}
              rows={4}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none leading-relaxed"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="آمار و ارقام (Stats)" icon={<BarChart3 className="w-4 h-4" />} defaultOpen>
        <div className="space-y-4 pt-4">
          {settings.stats.map((stat: any) => (
            <div key={stat.id} className="p-4 bg-light-bg rounded-2xl border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-text-secondary mb-1">عنوان (مثلا: سال تجربه)</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(stat.id, { label: e.target.value })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-secondary mb-1">مقدار (مثلا: +۱۰)</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(stat.id, { value: e.target.value })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
