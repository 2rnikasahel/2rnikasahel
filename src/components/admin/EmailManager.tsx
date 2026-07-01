import { useState } from 'react';
import { Inbox, Send, FileText, Trash2, Star, Plus, Search, ChevronLeft, Paperclip, X } from 'lucide-react';

// Mock Data
const mockEmails = [
  { id: 1, from: 'ali@example.com', subject: 'سفارش جدید #1234', preview: 'سلام، سفارش شما ثبت شد و در حال پردازش است...', date: '10:30', read: false, starred: false, folder: 'inbox' },
  { id: 2, from: 'sara@test.com', subject: 'درخواست بازگشت کالا', preview: 'می‌خواهم کالای خریداری شده را برگردانم...', date: 'دیروز', read: true, starred: true, folder: 'inbox' },
  { id: 3, from: 'noreply@dornika.com', subject: 'خوش آمدید به درنیکا', preview: 'ثبت‌نام شما با موفقیت انجام شد...', date: '2 روز پیش', read: true, starred: false, folder: 'sent' },
  { id: 4, from: 'support@shop.ir', subject: 'پیشنهاد همکاری', preview: 'ما می‌خواهیم با فروشگاه شما همکاری کنیم...', date: '3 روز پیش', read: false, starred: false, folder: 'inbox' },
];

const folders = [
  { id: 'inbox', label: 'صندوق ورودی', icon: Inbox, count: 2 },
  { id: 'sent', label: 'ارسال شده', icon: Send, count: 0 },
  { id: 'drafts', label: 'پیش‌نویس‌ها', icon: FileText, count: 0 },
  { id: 'trash', label: 'سطل زباله', icon: Trash2, count: 0 },
];

export default function EmailManager() {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [emails] = useState(mockEmails);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '' });

  const filteredEmails = emails.filter(e => e.folder === selectedFolder);
  const selectedEmailData = emails.find(e => e.id === selectedEmail);

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm flex">
      
      {/* Sidebar (Gmail Style) */}
      <div className="w-64 bg-light-bg border-l border-border/50 flex-shrink-0 flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full bg-accent text-white py-3 rounded-2xl font-bold hover:bg-accent-dark transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            نوشتن
          </button>
        </div>
        
        <nav className="flex-1 px-2 space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => { setSelectedFolder(folder.id); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-r-full text-sm font-medium transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-text-secondary hover:bg-gray-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <folder.icon className="w-5 h-5" />
                <span>{folder.label}</span>
              </div>
              {folder.count > 0 && (
                <span className="text-xs font-bold">{folder.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Email List */}
      <div className={`${selectedEmail ? 'hidden lg:block lg:w-96' : 'flex-1'} border-l border-border/50 flex flex-col`}>
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="جستجو در ایمیل‌ها..."
              className="w-full bg-light-bg border border-border rounded-full py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className={`p-4 border-b border-border/50 cursor-pointer hover:bg-light-bg transition-colors ${
                selectedEmail === email.id ? 'bg-blue-50/50 border-l-4 border-l-accent' : ''
              } ${!email.read ? 'bg-blue-50/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {!email.read && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                  <span className={`text-sm ${!email.read ? 'font-bold text-primary' : 'text-text-secondary'}`}>
                    {email.from}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">{email.date}</span>
              </div>
              <div className={`text-sm mb-1 ${!email.read ? 'font-bold text-primary' : 'text-text-primary'}`}>
                {email.subject}
              </div>
              <div className="text-xs text-text-secondary truncate">{email.preview}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      {selectedEmailData && (
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <button onClick={() => setSelectedEmail(null)} className="lg:hidden p-2 hover:bg-light-bg rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-primary text-lg flex-1 text-center lg:text-right">{selectedEmailData.subject}</h3>
            <button className="p-2 hover:bg-light-bg rounded-full text-text-secondary">
              <Star className={`w-5 h-5 ${selectedEmailData.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                {selectedEmailData.from.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-sm text-primary">{selectedEmailData.from}</div>
                <div className="text-xs text-text-secondary">به: من</div>
              </div>
            </div>
            <div className="text-text-primary leading-relaxed text-sm">
              {selectedEmailData.preview}
              <p className="mt-4">با احترام،<br/>تیم پشتیبانی درنیکا</p>
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal (Gmail Style) */}
      {showCompose && (
        <div className="fixed bottom-0 right-4 lg:right-20 w-full max-w-2xl bg-white rounded-t-2xl shadow-2xl border border-border z-50 flex flex-col max-h-[600px]">
          <div className="bg-[#0f172a] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <span className="font-bold text-sm">پیام جدید</span>
            <button onClick={() => setShowCompose(false)} className="p-1 hover:bg-white/10 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <input
              type="text"
              placeholder="گیرندگان"
              value={composeForm.to}
              onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
              className="w-full border-b border-border py-2 text-sm focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="موضوع"
              value={composeForm.subject}
              onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
              className="w-full border-b border-border py-2 text-sm focus:outline-none focus:border-accent"
            />
            <textarea
              placeholder="متن ایمیل..."
              value={composeForm.body}
              onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
              rows={8}
              className="w-full text-sm focus:outline-none resize-none mt-2"
            />
          </div>
          <div className="p-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="bg-accent text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-accent-dark transition-colors">
                ارسال
              </button>
              <button className="p-2 hover:bg-light-bg rounded-full text-text-secondary">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <button onClick={() => setShowCompose(false)} className="p-2 hover:bg-light-bg rounded-full text-text-secondary">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
