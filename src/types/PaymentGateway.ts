export type PaymentGatewayType = 'bank' | 'payment_facilitator' | 'crypto' | 'zarinpal' | 'idpay' | 'mellat' | 'saman' | 'parsian' | 'pasargad' | 'nextpay' | 'payir' | 'zibal';

export interface GatewayConfig {
  id: PaymentGatewayType;
  type: 'bank' | 'payment_facilitator' | 'crypto';
  name: string;
  description: string;
  merchantId: string;
  apiKey: string;
  callbackUrl: string;
  enabled: boolean;
  sandbox: boolean;
  fee: number;
}

export interface PaymentSettings {
  gateways: GatewayConfig[];
  defaultGateway: PaymentGatewayType;
}

export const defaultPaymentSettings: PaymentSettings = {
  defaultGateway: 'zarinpal',
  gateways: [
    {
      id: 'zarinpal',
      type: 'payment_facilitator',
      name: 'زرین‌پال',
      description: 'پرداخت امن با کلیه کارت‌های عضو شتاب',
      merchantId: '',
      apiKey: '',
      callbackUrl: '',
      enabled: true,
      sandbox: true,
      fee: 1,
    },
    {
      id: 'idpay',
      type: 'payment_facilitator',
      name: 'آیدی‌پِی',
      description: 'درگاه پرداخت مستقیم و شخصی',
      merchantId: '',
      apiKey: '',
      callbackUrl: '',
      enabled: false,
      sandbox: false,
      fee: 1.1,
    },
    {
      id: 'mellat',
      type: 'bank',
      name: 'بانک ملت (به‌پرداخت)',
      description: 'درگاه مستقیم بانکی با پایداری بالا',
      merchantId: '',
      apiKey: '',
      callbackUrl: '',
      enabled: false,
      sandbox: false,
      fee: 0,
    },
  ],
};
