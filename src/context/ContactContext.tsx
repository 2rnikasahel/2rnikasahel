import { createContext, ReactNode, useContext, useState } from 'react';
import { useHistory } from './HistoryContext';

export interface ContactPhone {
  id: number;
  label: string;
  number: string;
}

export interface ContactSettings {
  title: string;
  subtitle: string;
  phones: ContactPhone[];
  email: string;
  address: string;
  workingHours: string;
  mapTitle: string;
}

export interface ContactAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  attachments: ContactAttachment[];
  createdAt: string;
  status: 'new' | 'read';
}

interface ContactContextType {
  settings: ContactSettings;
  updateSettings: (data: Partial<ContactSettings>) => void;
  addPhone: (phone: Omit<ContactPhone, 'id'>) => void;
  updatePhone: (id: number, data: Partial<Omit<ContactPhone, 'id'>>) => void;
  removePhone: (id: number) => void;
  messages: ContactMessage[];
  submitMessage: (payload: {
    name: string;
    email: string;
    phone: string;
    message: string;
    files: File[];
  }) => Promise<{ success: boolean; error?: string }>;
  markAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
}

export const defaultContactSettings: ContactSettings = {
  title: 'تماس با ما',
  subtitle: 'ما آماده پاسخگویی به سوالات و مشاوره تخصصی شما هستیم',
  phones: [
    { id: 1, label: 'تلفن تماس', number: '021-12345678' },
    { id: 2, label: 'پشتیبانی فنی', number: '021-87654321' },
  ],
  email: 'info@dornika.com',
  address: 'تهران، خیابان نمونه، پلاک ۱۲۳',
  workingHours: 'شنبه تا پنجشنبه: ۹ صبح تا ۸ شب',
  mapTitle: 'نقشه فروشگاه درنیکا',
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const settings: ContactSettings = {
    ...defaultContactSettings,
    ...((state.contact as Partial<ContactSettings>) || {}),
    phones: ((state.contact as Partial<ContactSettings>)?.phones) || defaultContactSettings.phones,
  };

  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const updateSettings = (data: Partial<ContactSettings>) => {
    updateState('contact', { ...settings, ...data });
  };

  const addPhone = (phone: Omit<ContactPhone, 'id'>) => {
    updateSettings({ phones: [...settings.phones, { ...phone, id: Date.now() }] });
  };

  const updatePhone = (id: number, data: Partial<Omit<ContactPhone, 'id'>>) => {
    updateSettings({ phones: settings.phones.map((p) => (p.id === id ? { ...p, ...data } : p)) });
  };

  const removePhone = (id: number) => {
    updateSettings({ phones: settings.phones.filter((p) => p.id !== id) });
  };

  const submitMessage = (payload: {
    name: string;
    email: string;
    phone: string;
    message: string;
    files: File[];
  }): Promise<{ success: boolean; error?: string }> => {
    const totalSize = payload.files.reduce((sum, file) => sum + file.size, 0);
    const limit = 50 * 1024 * 1024;
    if (totalSize > limit) {
      return Promise.resolve({ success: false, error: 'مجموع حجم فایل‌ها نباید بیشتر از ۵۰ مگابایت باشد.' });
    }

    // Convert files to base64 data URLs so they persist in memory
    const filePromises = payload.files.map(
      (file) =>
        new Promise<ContactAttachment>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            resolve({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: ev.target?.result as string, // base64 data URL
            });
          };
          reader.readAsDataURL(file);
        })
    );

    return Promise.all(filePromises).then((attachments) => {
      const newMessage: ContactMessage = {
        id: `${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        attachments,
        createdAt: new Date().toLocaleString('fa-IR'),
        status: 'new',
      };

      setMessages((prev) => [newMessage, ...prev]);
      return { success: true };
    });
  };

  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => {
      const target = prev.find((m) => m.id === id);
      target?.attachments.forEach((file) => URL.revokeObjectURL(file.url));
      return prev.filter((m) => m.id !== id);
    });
  };

  return (
    <ContactContext.Provider
      value={{
        settings,
        updateSettings,
        addPhone,
        updatePhone,
        removePhone,
        messages,
        submitMessage,
        markAsRead,
        deleteMessage,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContact must be used within ContactProvider');
  return ctx;
};
