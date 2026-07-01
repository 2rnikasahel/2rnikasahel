import { useState, useRef } from 'react';
import {
  Phone, Mail, MapPin, Type, Plus, Trash2, Camera,
  Shield, Upload, Link as LinkIcon
} from 'lucide-react';
import { useFooter } from '../../context/FooterContext';
import CollapsibleSection from './CollapsibleSection';

export default function FooterManager() {
  const {
    settings,
    updateSettings,
    addPhone,
    updatePhone,
    removePhone,
    addSocialNetwork,
    updateSocialNetwork,
    removeSocialNetwork,
    updateEnamad,
  } = useFooter();

  const [editingNetworkId, setEditingNetworkId] = useState<number | null>(null);
  const [networkForm, setNetworkForm] = useState<{ name: string; url: string; icon: string }>({
    name: '',
    url: '',
    icon: '',
  });
  const iconFileRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, networkId?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const iconData = ev.target?.result as string;
      if (networkId) {
        updateSocialNetwork(networkId, { icon: iconData });
      } else {
        setNetworkForm({ ...networkForm, icon: iconData });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddNetwork = () => {
    if (!networkForm.name.trim()) return;
    addSocialNetwork(networkForm);
    setNetworkForm({ name: '', url: '', icon: '' });
    setEditingNetworkId(null);
  };

  const startEditNetwork = (network: any) => {
    setNetworkForm({ name: network.name, url: network.url, icon: network.icon });
    setEditingNetworkId(network.id);
  };

  return (
    <div className="space-y-4">
      {/* شبکه‌های اجتماعی */}
      <CollapsibleSection title={`شبکه‌های اجتماعی (${settings.socialNetworks.length})`} icon={<Camera className="w-4 h-4" />} defaultOpen>
        <div className="space-y-3 pt-4">
          {settings.socialNetworks.map((network: any) => (
            <div key={network.id} className="bg-light-bg rounded-2xl border border-border/40 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {network.icon ? (
                    <img src={network.icon} alt={network.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <Camera className="w-5 h-5 text-text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{network.name}</p>
                  <p className="text-xs text-text-secondary truncate" dir="ltr">
                    {network.url || 'لینک وارد نشده'}
                  </p>
                </div>
                <button
                  onClick={() => startEditNetwork(network)}
                  className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  title="ویرایش"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`شبکه «${network.name}» حذف شود؟`)) removeSocialNetwork(network.id);
                  }}
                  className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add/Edit Form */}
          {editingNetworkId !== null ? (
            <div className="bg-accent/5 border border-accent/30 border-dashed rounded-2xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-primary">
                {editingNetworkId ? 'ویرایش شبکه اجتماعی' : 'افزودن شبکه جدید'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-text-secondary mb-1">نام شبکه</label>
                  <input
                    type="text"
                    value={networkForm.name}
                    onChange={(e) => setNetworkForm({ ...networkForm, name: e.target.value })}
                    placeholder="مثال: اینستاگرام"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-text-secondary mb-1">لینک</label>
                  <input
                    type="text"
                    value={networkForm.url}
                    onChange={(e) => setNetworkForm({ ...networkForm, url: e.target.value })}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-text-secondary mb-1">آیکون (اختیاری)</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden">
                    {networkForm.icon ? (
                      <img src={networkForm.icon} alt="آیکون" className="w-6 h-6 object-contain" />
                    ) : (
                      <Camera className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <button
                    onClick={() => iconFileRef.current?.click()}
                    className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-xs hover:bg-light-bg transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    آپلود آیکون
                  </button>
                  {networkForm.icon && (
                    <button
                      onClick={() => setNetworkForm({ ...networkForm, icon: '' })}
                      className="text-xs text-danger hover:underline"
                    >
                      حذف
                    </button>
                  )}
                  <input ref={iconFileRef} type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddNetwork}
                  disabled={!networkForm.name.trim()}
                  className="flex-1 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                >
                  {editingNetworkId ? 'ذخیره تغییرات' : 'افزودن'}
                </button>
                <button
                  onClick={() => {
                    setNetworkForm({ name: '', url: '', icon: '' });
                    setEditingNetworkId(null);
                  }}
                  className="bg-light-bg text-text-secondary px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingNetworkId(0)}
              className="w-full border-2 border-dashed border-accent/40 text-accent py-3 rounded-2xl hover:bg-accent/5 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              افزودن شبکه اجتماعی جدید
            </button>
          )}
        </div>
      </CollapsibleSection>

      {/* اینماد */}
      <CollapsibleSection title="تنظیمات اینماد" icon={<Shield className="w-4 h-4" />} defaultOpen>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between p-4 bg-light-bg rounded-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-primary">فعال‌سازی اینماد</p>
                <p className="text-xs text-text-secondary">نمایش نماد اعتماد الکترونیکی در فوتر</p>
              </div>
            </div>
            <button
              onClick={() => updateEnamad({ enabled: !settings.enamad.enabled })}
              className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                settings.enamad.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 ${settings.enamad.enabled ? 'right-0.5' : 'right-6'} w-5 h-5 bg-white rounded-full shadow transition-all`}
              />
            </button>
          </div>

          {settings.enamad.enabled && (
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                کد رسمی اینماد (از سایت enamad.ir دریافت کنید)
              </label>
              <textarea
                value={settings.enamad.code}
                onChange={(e) => updateEnamad({ code: e.target.value })}
                rows={6}
                placeholder='<script src="https://enamad.ir/..." ...></script>'
                dir="ltr"
                className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-accent"
              />
              <p className="text-[11px] text-text-secondary mt-2">
                کد جاوااسکریپت یا HTML را از پنل اینماد خود کپی کرده و اینجا وارد کنید. این کد به‌صورت خودکار در فوتر نمایش داده می‌شود و قابل کلیک خواهد بود.
              </p>
            </div>
          )}

          {!settings.enamad.enabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
              <p className="font-bold mb-1">راهنما:</p>
              <p className="text-xs text-blue-800">
                برای دریافت کد اینماد، به سایت{' '}
                <a href="https://enamad.ir" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  enamad.ir
                </a>{' '}
                مراجعه کرده و پس از ثبت‌نام، کد نمایش نماد را دریافت کنید.
              </p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* سایر تنظیمات فوتر */}
      <CollapsibleSection title="اطلاعات تماس" icon={<Phone className="w-4 h-4" />}>
        <div className="pt-4 space-y-3">
          {settings.phones.map((phone: any) => (
            <div key={phone.id} className="bg-light-bg rounded-2xl border border-border/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-text-secondary mb-1">عنوان</label>
                <input
                  type="text"
                  value={phone.label}
                  onChange={(e) => updatePhone(phone.id, { label: e.target.value })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-secondary mb-1">شماره تماس</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phone.number}
                    onChange={(e) => updatePhone(phone.id, { number: e.target.value })}
                    placeholder="021-12345678"
                    dir="ltr"
                    className="flex-1 bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => {
                      if (confirm(`شماره «${phone.label}» حذف شود؟`)) removePhone(phone.id);
                    }}
                    className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addPhone({ label: 'پشتیبانی جدید', number: '021-00000000' })}
            className="w-full border-2 border-dashed border-accent/40 text-accent py-3 rounded-2xl hover:bg-accent/5 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            افزودن شماره جدید
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="ایمیل و آدرس" icon={<Mail className="w-4 h-4" />}>
        <div className="pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              ایمیل
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSettings({ email: e.target.value })}
              placeholder="info@example.com"
              dir="ltr"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              آدرس
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => updateSettings({ address: e.target.value })}
              placeholder="تهران، خیابان نمونه، پلاک ۱۲۳"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="متن توضیحات زیر لوگو" icon={<Type className="w-4 h-4" />}>
        <div className="pt-4">
          <label className="block text-sm font-medium text-primary mb-1.5">متن توضیح فوتر</label>
          <textarea
            value={settings.description}
            onChange={(e) => updateSettings({ description: e.target.value })}
            rows={4}
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="متن کپی‌رایت" icon={<Type className="w-4 h-4" />}>
        <div className="pt-4">
          <label className="block text-sm font-medium text-primary mb-1.5">متن کپی‌رایت</label>
          <input
            type="text"
            value={settings.copyrightText}
            onChange={(e) => updateSettings({ copyrightText: e.target.value })}
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
          <p className="text-[11px] text-text-secondary mt-1.5">
            کلمه «درنیکا» در این متن، خودکار با نام برند تنظیم‌شده در تب هدر جایگزین می‌شود.
          </p>
        </div>
      </CollapsibleSection>
    </div>
  );
}
