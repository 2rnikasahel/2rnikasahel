import { Mail, Phone, MapPin, Clock, Plus, Trash2, Inbox, Paperclip, CheckCircle2 } from 'lucide-react';
import { useContact } from '../../context/ContactContext';
import CollapsibleSection from './CollapsibleSection';

export default function ContactManager() {
  const {
    settings,
    updateSettings,
    addPhone,
    updatePhone,
    removePhone,
    messages,
    markAsRead,
    deleteMessage,
  } = useContact();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Phone className="w-5 h-5" />
          مدیریت تماس با ما
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          اطلاعات صفحه تماس با ما و صندوق دریافت پیام‌های کاربران را از اینجا مدیریت کنید.
        </p>
      </div>

      <CollapsibleSection title="متن‌های صفحه تماس با ما" icon={<Mail className="w-4 h-4" />} defaultOpen>
        <div className="pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">عنوان صفحه</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">زیرعنوان</label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => updateSettings({ subtitle: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              ساعات کاری
            </label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => updateSettings({ workingHours: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">متن نقشه</label>
            <input
              type="text"
              value={settings.mapTitle}
              onChange={(e) => updateSettings({ mapTitle: e.target.value })}
              className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={`شماره‌های تماس (${settings.phones.length})`} icon={<Phone className="w-4 h-4" />} defaultOpen>
        <div className="pt-4 space-y-3">
          {settings.phones.map((phone: any) => (
            <div key={phone.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 bg-light-bg/50 p-4 rounded-2xl border border-border/40">
              <input
                type="text"
                value={phone.label}
                onChange={(e) => updatePhone(phone.id, { label: e.target.value })}
                placeholder="مثلا: پشتیبانی فنی"
                className="bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                value={phone.number}
                onChange={(e) => updatePhone(phone.id, { number: e.target.value })}
                placeholder="021-12345678"
                dir="ltr"
                className="bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => removePhone(phone.id)}
                className="p-3 text-danger hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addPhone({ label: 'شماره جدید', number: '' })}
            className="w-full border-2 border-dashed border-accent/30 rounded-2xl py-3 text-sm font-medium text-accent hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            افزودن شماره تماس
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="ایمیل و آدرس" icon={<MapPin className="w-4 h-4" />} defaultOpen>
        <div className="pt-4 space-y-4">
          <input
            type="email"
            value={settings.email}
            onChange={(e) => updateSettings({ email: e.target.value })}
            placeholder="ایمیل"
            dir="ltr"
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
          <input
            type="text"
            value={settings.address}
            onChange={(e) => updateSettings({ address: e.target.value })}
            placeholder="آدرس"
            className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={`صندوق دریافت (${messages.length})`} icon={<Inbox className="w-4 h-4" />} defaultOpen>
        <div className="pt-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-10 bg-light-bg/50 rounded-2xl border border-dashed border-border text-text-secondary text-sm">
              هنوز پیامی دریافت نشده است.
            </div>
          ) : (
            messages.map((message: any) => (
              <div key={message.id} className="bg-white border border-border/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-primary">{message.name}</p>
                      {message.status === 'new' ? (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">جدید</span>
                      ) : (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">بررسی شده</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">{message.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    {message.status === 'new' && (
                      <button onClick={() => markAsRead(message.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteMessage(message.id)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-secondary">
                  <div>ایمیل: <span className="text-primary" dir="ltr">{message.email}</span></div>
                  <div>تلفن: <span className="text-primary" dir="ltr">{message.phone || 'ثبت نشده'}</span></div>
                </div>

                <div className="bg-light-bg/50 rounded-xl p-3 text-sm text-primary leading-relaxed">
                  {message.message}
                </div>

                {message.attachments.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-2">
                      <Paperclip className="w-3.5 h-3.5" />
                      فایل‌های پیوست ({message.attachments.length})
                    </div>
                    <div className="space-y-2">
                      {message.attachments.map((file: any) => (
                        <div key={file.id} className="bg-light-bg rounded-xl p-3 space-y-2">
                          {/* Image preview */}
                          {file.type.startsWith('image/') && (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="max-h-48 rounded-lg border border-border/50 object-contain"
                            />
                          )}
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate max-w-[220px] text-xs text-primary font-medium">{file.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-text-secondary">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                              <a
                                href={file.url}
                                download={file.name}
                                className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark bg-white border border-accent/20 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                دانلود
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}
