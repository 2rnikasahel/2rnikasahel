import { useMemo, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Paperclip } from 'lucide-react';
import { useContact } from '../../context/ContactContext';

interface ContactContentProps {
  compact?: boolean;
}

export default function ContactContent({ compact = false }: ContactContentProps) {
  const { settings, submitMessage } = useContact();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSizeMB = useMemo(() => files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024), [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await submitMessage({ ...formData, files });
    if (!result.success) {
      setError(result.error || 'ارسال پیام با خطا مواجه شد.');
      return;
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setFiles([]);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const nextFiles = [...files, ...Array.from(selectedFiles)];
    const totalSize = nextFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      setError('مجموع حجم فایل‌ها نباید بیشتر از ۵۰ مگابایت باشد.');
      return;
    }
    setFiles(nextFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {submitted && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="bg-white text-primary rounded-2xl shadow-2xl border border-border/50 px-6 py-5 text-center max-w-sm mx-4 pointer-events-auto">
            <p className="font-bold mb-1">کاربر گرامی پیام شما دریافت شد</p>
            <p className="text-sm text-text-secondary">
              پس از بررسی کارشناسان ما با شما تماس برقرار می‌کنند.
            </p>
          </div>
        </div>
      )}

      <div className={`grid ${compact ? 'lg:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
        {/* Contact Info */}
        <div>
          <div className="bg-white rounded-2xl p-6 border border-border/50 mb-6">
            <h2 className="text-lg font-bold text-primary mb-4">اطلاعات تماس</h2>
            <div className="space-y-4">
              {settings.phones.map((phone: any) => (
                <div key={phone.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{phone.label}</p>
                    <p className="text-sm text-text-secondary" dir="ltr">{phone.number}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">ایمیل</p>
                  <p className="text-sm text-text-secondary">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">آدرس</p>
                  <p className="text-sm text-text-secondary">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">ساعات کاری</p>
                  <p className="text-sm text-text-secondary">{settings.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-border/50 h-64">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">{settings.mapTitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 border border-border/50">
          <h2 className="text-lg font-bold text-primary mb-4">ارسال پیام</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">ایمیل</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">شماره تماس</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">پیام شما</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                فایل یا تصویر پیوست (حداکثر مجموع ۵۰ مگابایت)
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => addFiles(e.target.files)}
                className="block w-full text-sm text-text-secondary file:bg-accent/10 file:text-accent file:border-0 file:px-4 file:py-2 file:rounded-xl file:ml-3 file:cursor-pointer"
              />
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-text-secondary">{files.length} فایل انتخاب شده • {totalSizeMB.toFixed(1)} MB</div>
                  {files.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between bg-light-bg rounded-xl px-3 py-2 text-xs">
                      <span className="truncate max-w-[220px]">{file.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-text-secondary">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-danger hover:underline">حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              ارسال پیام
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
