import { useState, useEffect } from 'react';
import { Save, Key, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GoogleOAuthSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  is_enabled: boolean;
}

export default function GoogleOAuthManager() {
  const [settings, setSettings] = useState<GoogleOAuthSettings>({
    client_id: '',
    client_secret: '',
    redirect_uri: `${window.location.origin}/api/auth/google/callback`,
    is_enabled: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load existing settings from localStorage or API
    const saved = localStorage.getItem('google_oauth_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    if (!settings.client_id || !settings.client_secret) {
      setMessage({ type: 'error', text: 'لطفاً Client ID و Client Secret را وارد کنید' });
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage (in production, this should be saved to backend API)
      localStorage.setItem('google_oauth_settings', JSON.stringify(settings));
      
      // In production, you would call:
      // await api.put('/admin/settings/google_oauth', settings);
      
      setMessage({ type: 'success', text: 'تنظیمات گوگل OAuth با موفقیت ذخیره شد' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'خطا در ذخیره تنظیمات' });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'آدرس کپی شد!' });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Key className="w-6 h-6 text-accent" />
          تنظیمات Google OAuth
        </h2>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          راهنمای دریافت Client ID و Secret
        </h4>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>به <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google Cloud Console</a> بروید</li>
          <li>یک پروژه جدید بسازید یا پروژه موجود را انتخاب کنید</li>
          <li>به بخش APIs & Services → Credentials بروید</li>
          <li>روی Create Credentials → OAuth client ID کلیک کنید</li>
          <li>نوع Application را Web application انتخاب کنید</li>
          <li>در بخش Authorized JavaScript origins آدرس سایت خود را وارد کنید (مثلاً: https://2rnika.ir)</li>
          <li>در بخش Authorized redirect URIs آدرس زیر را وارد کنید:</li>
        </ol>
        <div className="mt-2 bg-white rounded-lg p-2 border border-blue-200 flex items-center justify-between">
          <code className="text-xs text-blue-900 font-mono" dir="ltr">{settings.redirect_uri}</code>
          <button 
            onClick={() => copyToClipboard(settings.redirect_uri)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1"
          >
            کپی
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-2xl border border-border/50 p-6 space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-light-bg rounded-xl">
          <div>
            <p className="text-sm font-medium text-primary">فعال‌سازی ورود با گوگل</p>
            <p className="text-xs text-text-secondary mt-1">کاربران می‌توانند با حساب گوگل خود وارد شوند</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, is_enabled: !settings.is_enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.is_enabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.is_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Google Client ID
          </label>
          <input
            type="text"
            value={settings.client_id}
            onChange={(e) => setSettings({ ...settings, client_id: e.target.value })}
            placeholder="xxxxx.apps.googleusercontent.com"
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent dir-ltr text-left font-mono"
            dir="ltr"
          />
          <p className="text-xs text-text-secondary mt-1">این مقدار را از Google Cloud Console کپی کنید</p>
        </div>

        {/* Client Secret */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Google Client Secret
          </label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={settings.client_secret}
              onChange={(e) => setSettings({ ...settings, client_secret: e.target.value })}
              placeholder="GOCSPX-xxxxxxxxxxxx"
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent dir-ltr text-left font-mono pr-20"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-accent hover:text-accent-dark font-medium px-2 py-1"
            >
              {showSecret ? 'مخفی' : 'نمایش'}
            </button>
          </div>
          <p className="text-xs text-text-secondary mt-1">این مقدار محرمانه است و نباید با کسی به اشتراک گذاشته شود</p>
        </div>

        {/* Redirect URI (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Authorized Redirect URI (فقط خواندنی)
          </label>
          <input
            type="text"
            value={settings.redirect_uri}
            readOnly
            className="w-full bg-gray-100 border border-border rounded-xl px-4 py-3 text-sm text-text-secondary dir-ltr text-left font-mono cursor-not-allowed"
            dir="ltr"
          />
          <p className="text-xs text-text-secondary mt-1">این آدرس را در Google Cloud Console وارد کنید</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </div>

      {/* Status Info */}
      {settings.is_enabled && settings.client_id && settings.client_secret && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-800">Google OAuth فعال است</p>
            <p className="text-xs text-green-700 mt-1">
              کاربران می‌توانند با حساب گوگل خود وارد سایت شوند. مطمئن شوید Client ID و Secret صحیح هستند.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
