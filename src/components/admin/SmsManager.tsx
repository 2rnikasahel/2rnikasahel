import { useState } from 'react';
import { Send, Settings, History, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react';

// Mock Data
const mockProviders = [
  { id: 1, name: 'kavenegar', display_name: 'کاوه نگار', is_active: true, priority: 1, credentials: { api_key: '****', sender: '3000500' } },
  { id: 2, name: 'melipayamak', display_name: 'ملی پیامک', is_active: false, priority: 2, credentials: {} },
  { id: 3, name: 'smsir', display_name: 'اس ام اس دات آی آر', is_active: false, priority: 3, credentials: {} },
];

const mockLogs = [
  { id: 1, recipient: '09123456789', message: 'کد تایید: 12345', provider: 'kavenegar', status: 'sent', created_at: '1402/10/01 10:30' },
  { id: 2, recipient: '09129876543', message: 'سفارش شما ثبت شد', provider: 'kavenegar', status: 'delivered', created_at: '1402/10/01 11:15' },
  { id: 3, recipient: '09121112233', message: 'کد تایید: 67890', provider: 'kavenegar', status: 'failed', created_at: '1402/10/02 09:00' },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  sent: { label: 'ارسال شده', color: 'bg-blue-100 text-blue-700', icon: Send },
  delivered: { label: 'تحویل داده شده', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  failed: { label: 'ناموفق', color: 'bg-red-100 text-red-700', icon: XCircle },
  pending: { label: 'در انتظار', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function SmsManager() {
  const [activeTab, setActiveTab] = useState<'providers' | 'logs' | 'send'>('providers');
  const [providers] = useState(mockProviders);
  const [logs] = useState(mockLogs);
  const [testForm, setTestForm] = useState({ phone: '', message: '' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Send className="w-6 h-6 text-accent" />
          مدیریت پیامک
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'providers', label: 'اپراتورها', icon: Settings },
          { id: 'logs', label: 'تاریخچه ارسال', icon: History },
          { id: 'send', label: 'ارسال تست', icon: Send },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary text-lg">{provider.display_name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  provider.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {provider.is_active ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-text-secondary mb-4">
                <div className="flex justify-between">
                  <span>اولویت:</span>
                  <span className="font-medium text-primary">{provider.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span>شناسه:</span>
                  <span className="font-mono text-xs">{provider.name}</span>
                </div>
              </div>
              <button className="w-full bg-light-bg border border-border rounded-xl py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
                تنظیمات و ویرایش
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-right">
            <thead className="bg-light-bg border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary">شماره گیرنده</th>
                <th className="px-6 py-4 font-medium text-text-secondary">متن پیام</th>
                <th className="px-6 py-4 font-medium text-text-secondary">اپراتور</th>
                <th className="px-6 py-4 font-medium text-text-secondary">وضعیت</th>
                <th className="px-6 py-4 font-medium text-text-secondary">زمان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.map((log) => {
                const status = statusConfig[log.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={log.id} className="hover:bg-light-bg/50">
                    <td className="px-6 py-4 font-mono text-xs dir-ltr text-left">{log.recipient}</td>
                    <td className="px-6 py-4 text-text-secondary max-w-xs truncate">{log.message}</td>
                    <td className="px-6 py-4 text-xs">{log.provider}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{log.created_at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Send Test Tab */}
      {activeTab === 'send' && (
        <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm max-w-2xl">
          <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            ارسال پیامک تست
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">شماره موبایل</label>
              <input
                type="text"
                value={testForm.phone}
                onChange={(e) => setTestForm({ ...testForm, phone: e.target.value })}
                placeholder="09123456789"
                className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent dir-ltr text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">متن پیام</label>
              <textarea
                value={testForm.message}
                onChange={(e) => setTestForm({ ...testForm, message: e.target.value })}
                rows={4}
                placeholder="متن پیامک تست..."
                className="w-full bg-light-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <button className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              ارسال پیامک تست
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
