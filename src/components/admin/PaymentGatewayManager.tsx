import { useState } from 'react';
import { CreditCard, Shield, Bitcoin, Settings, Check, ChevronDown, Globe, Copy } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { PaymentGatewayType, GatewayConfig } from '../../types/PaymentGateway';

const gatewayIcons: Record<string, any> = {
  bank: Shield,
  payment_facilitator: CreditCard,
  crypto: Bitcoin,
};

const gatewayColors: Record<string, string> = {
  bank: 'bg-blue-100 text-blue-700 border-blue-200',
  payment_facilitator: 'bg-green-100 text-green-700 border-green-200',
  crypto: 'bg-purple-100 text-purple-700 border-purple-200',
};

const typeLabels: Record<string, string> = {
  bank: 'درگاه بانکی',
  payment_facilitator: 'پرداخت‌یار',
  crypto: 'ارز دیجیتال',
};

export default function PaymentGatewayManager() {
  const { settings, toggleGateway, updateGateway, setDefaultGateway, getEnabledGateways } = usePayment();
  const [expandedId, setExpandedId] = useState<PaymentGatewayType | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const callbackUrl = `${window.location.origin}/shop?payment=success`;

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enabledGateways = getEnabledGateways();
  const filteredGateways = settings.gateways.filter((g: any) => 
    filterType === 'all' ? true : g.type === filterType
  );

  const groupedGateways = {
    payment_facilitator: filteredGateways.filter((g: any) => g.type === 'payment_facilitator'),
    bank: filteredGateways.filter((g: any) => g.type === 'bank'),
    crypto: filteredGateways.filter((g: any) => g.type === 'crypto'),
  };

  const renderGatewayRow = (gateway: GatewayConfig) => {
    const Icon = gatewayIcons[gateway.type];
    const isExpanded = expandedId === gateway.id;
    const isDefault = settings.defaultGateway === gateway.id;

    return (
      <div key={gateway.id} className="border border-border/50 rounded-xl overflow-hidden mb-3 bg-white">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-light-bg/50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : gateway.id)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${gatewayColors[gateway.type]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-sm">{gateway.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${gatewayColors[gateway.type]}`}>
                  {typeLabels[gateway.type]}
                </span>
                {isDefault && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    پیش‌فرض
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{gateway.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle Switch */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway(gateway.id);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                gateway.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gateway.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            
            <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded Settings */}
        {isExpanded && (
          <div className="border-t border-border/50 p-4 bg-light-bg/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Merchant ID */}
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">Merchant ID / Terminal ID</label>
                <input
                  type="text"
                  value={gateway.merchantId}
                  onChange={(e) => updateGateway(gateway.id, { merchantId: e.target.value })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent dir-ltr text-left"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  dir="ltr"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">API Key / Secret Key</label>
                <input
                  type="password"
                  value={gateway.apiKey}
                  onChange={(e) => updateGateway(gateway.id, { apiKey: e.target.value })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent dir-ltr text-left"
                  placeholder="••••••••••••••••"
                  dir="ltr"
                />
              </div>

              {/* Callback URL */}
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">Callback URL</label>
                <input
                  type="text"
                  value={gateway.callbackUrl}
                  onChange={(e) => updateGateway(gateway.id, { callbackUrl: e.target.value })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent dir-ltr text-left"
                  placeholder="https://yoursite.com/payment/callback"
                  dir="ltr"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">کارمزد (%)</label>
                <input
                  type="number"
                  value={gateway.fee}
                  onChange={(e) => updateGateway(gateway.id, { fee: Number(e.target.value) })}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent dir-ltr text-left"
                  placeholder="0"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Sandbox Toggle */}
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-border/50">
              <div>
                <p className="text-sm font-medium text-primary">حالت تست (Sandbox)</p>
                <p className="text-xs text-text-secondary">برای تست بدون پرداخت واقعی</p>
              </div>
              <button
                onClick={() => updateGateway(gateway.id, { sandbox: !gateway.sandbox })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gateway.sandbox ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gateway.sandbox ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Set as Default */}
            {!isDefault && gateway.enabled && (
              <button
                onClick={() => setDefaultGateway(gateway.id)}
                className="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                تنظیم به عنوان درگاه پیش‌فرض
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Callback URL Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-sm mb-1">آدرس بازگشت (Callback URL)</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              این آدرس را در پنل درگاه پرداخت خود (زرین‌پال، ملت و...) وارد کنید. پس از پرداخت موفق، مشتری به این آدرس هدایت می‌شود.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-blue-200 p-2">
          <input 
            type="text" 
            value={callbackUrl} 
            readOnly 
            className="flex-1 bg-transparent border-none outline-none text-xs text-primary dir-ltr text-left font-mono"
            dir="ltr"
          />
          <button 
            onClick={handleCopyCallback}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'کپی شد' : 'کپی آدرس'}
          </button>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border/50 p-4">
          <p className="text-xs text-text-secondary mb-1">درگاه‌های فعال</p>
          <p className="text-2xl font-bold text-primary">{enabledGateways.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border/50 p-4">
          <p className="text-xs text-text-secondary mb-1">درگاه پیش‌فرض</p>
          <p className="text-lg font-bold text-accent">
            {settings.gateways.find((g: any) => g.id === settings.defaultGateway)?.name || 'تنظیم نشده'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border/50 p-4">
          <p className="text-xs text-text-secondary mb-1">کل درگاه‌ها</p>
          <p className="text-2xl font-bold text-primary">{settings.gateways.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto cart-scroll pb-2">
        {[
          { id: 'all', label: 'همه' },
          { id: 'payment_facilitator', label: 'پرداخت‌یار' },
          { id: 'bank', label: 'درگاه‌های بانکی' },
          { id: 'crypto', label: 'ارز دیجیتال' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === filter.id
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-secondary hover:bg-light-bg'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Gateway Groups */}
      {filterType === 'all' ? (
        <>
          {groupedGateways.payment_facilitator.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                پرداخت‌یارها
              </h3>
              {groupedGateways.payment_facilitator.map(renderGatewayRow)}
            </div>
          )}

          {groupedGateways.bank.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                درگاه‌های بانکی
              </h3>
              {groupedGateways.bank.map(renderGatewayRow)}
            </div>
          )}

          {groupedGateways.crypto.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <Bitcoin className="w-4 h-4 text-purple-600" />
                درگاه‌های ارز دیجیتال
              </h3>
              {groupedGateways.crypto.map(renderGatewayRow)}
            </div>
          )}
        </>
      ) : (
        filteredGateways.map(renderGatewayRow)
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          راهنمای راه‌اندازی
        </h4>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>ابتدا درگاه مورد نظر را فعال کنید (سوئیچ سبز)</li>
          <li>Merchant ID و API Key را از پنل درگاه دریافت و وارد کنید</li>
          <li>Callback URL را روی آدرس سایت خود تنظیم کنید</li>
          <li>یک درگاه را به عنوان پیش‌فرض انتخاب کنید</li>
          <li>برای اتصال واقعی به Backend نیاز به سرور دارید</li>
        </ul>
      </div>
    </div>
  );
}
