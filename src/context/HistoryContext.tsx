import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

// وضعیت کامل تمام تنظیمات قابل ویرایش سایت
export interface AppState {
  header: any;
  slider: any;
  categories: any;
  home: any;
  about: any;
  footer: any;
  products: any;
  contact: any;
  paymentSettings: any;
}

interface HistoryStore {
  past: AppState[];
  present: AppState;
  future: AppState[];
}

interface HistoryContextType {
  state: AppState;
  updateState: (key: keyof AppState, value: any) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  historyLength: number;
  currentIndex: number;
  lastSaved: number | null;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'dornika-admin-state-v2';

export const HistoryProvider = ({
  initialState,
  children,
}: {
  initialState: AppState;
  children: ReactNode;
}) => {
  const loadInitial = (): AppState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // ادغام امن: هر بخش با مقدار پیش‌فرض ادغام می‌شود تا فیلدهای جدید گم نشوند
        return {
          header: { ...initialState.header, ...(parsed.header || {}) },
          slider: { ...initialState.slider, ...(parsed.slider || {}) },
          categories: parsed.categories || initialState.categories,
          home: { ...initialState.home, ...(parsed.home || {}) },
          about: { ...initialState.about, ...(parsed.about || {}) },
          footer: { ...initialState.footer, ...(parsed.footer || {}) },
          products: parsed.products || initialState.products,
          contact: { ...initialState.contact, ...(parsed.contact || {}) },
          paymentSettings: parsed.paymentSettings || initialState.paymentSettings,
        };
      }
    } catch {
      // در صورت خطا، مقدار پیش‌فرض استفاده می‌شود
    }
    return initialState;
  };

  const [store, setStore] = useState<HistoryStore>(() => ({
    past: [],
    present: loadInitial(),
    future: [],
  }));
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((s: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      // ignore
    }
    // نمایش وضعیت ذخیره با کمی تاخیر تا انیمیشن طبیعی باشد
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setLastSaved(Date.now()), 150);
  }, []);

  const updateState = useCallback(
    (key: keyof AppState, value: any) => {
      setStore((prev) => {
        const newPresent = { ...prev.present, [key]: value };
        persist(newPresent);
        return {
          past: [...prev.past, prev.present],
          present: newPresent,
          future: [], // هر تغییر جدید، redoهای آینده را پاک می‌کند
        };
      });
    },
    [persist]
  );

  const undo = useCallback(() => {
    setStore((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      persist(previous);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, [persist]);

  const redo = useCallback(() => {
    setStore((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      persist(next);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, [persist]);

  const canUndo = store.past.length > 0;
  const canRedo = store.future.length > 0;
  const historyLength = store.past.length + 1 + store.future.length;
  const currentIndex = store.past.length;

  return (
    <HistoryContext.Provider
      value={{
        state: store.present,
        updateState,
        canUndo,
        canRedo,
        undo,
        redo,
        historyLength,
        currentIndex,
        lastSaved,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
};
