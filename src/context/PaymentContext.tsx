import { createContext, useContext, ReactNode } from 'react';
import { PaymentSettings, GatewayConfig, PaymentGatewayType, defaultPaymentSettings } from '../types/PaymentGateway';
import { useHistory } from './HistoryContext';

interface PaymentContextType {
  settings: PaymentSettings;
  updateSettings: (settings: Partial<PaymentSettings>) => void;
  toggleGateway: (id: PaymentGatewayType) => void;
  updateGateway: (id: PaymentGatewayType, data: Partial<GatewayConfig>) => void;
  setDefaultGateway: (id: PaymentGatewayType) => void;
  getEnabledGateways: () => GatewayConfig[];
  getGatewayById: (id: PaymentGatewayType) => GatewayConfig | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const settings: PaymentSettings = state.paymentSettings || defaultPaymentSettings;

  const setSettings = (updater: (prev: PaymentSettings) => PaymentSettings) => {
    updateState('paymentSettings', updater(settings));
  };

  const updateSettings = (newSettings: Partial<PaymentSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleGateway = (id: PaymentGatewayType) => {
    setSettings((prev) => ({
      ...prev,
      gateways: prev.gateways.map((g) =>
        g.id === id ? { ...g, enabled: !g.enabled } : g
      ),
    }));
  };

  const updateGateway = (id: PaymentGatewayType, data: Partial<GatewayConfig>) => {
    setSettings((prev) => ({
      ...prev,
      gateways: prev.gateways.map((g) =>
        g.id === id ? { ...g, ...data } : g
      ),
    }));
  };

  const setDefaultGateway = (id: PaymentGatewayType) => {
    updateSettings({ defaultGateway: id });
  };

  const getEnabledGateways = () => settings.gateways.filter((g) => g.enabled);
  const getGatewayById = (id: PaymentGatewayType) => settings.gateways.find((g) => g.id === id);

  return (
    <PaymentContext.Provider
      value={{
        settings,
        updateSettings,
        toggleGateway,
        updateGateway,
        setDefaultGateway,
        getEnabledGateways,
        getGatewayById,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within PaymentProvider');
  return context;
};
