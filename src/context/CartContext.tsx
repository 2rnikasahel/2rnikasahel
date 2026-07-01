import { createContext, useContext, useState, ReactNode } from 'react';

interface CartVariation {
  variationName: string; // مثلاً: سایز (میلی‌متر)
  optionName: string;    // مثلاً: ۱۶ میلی‌متر
  sku?: string;
}

interface CartItem {
  id: number;          // شناسه یکتا (ترکیب محصول + تنوع)
  productId: number;   // شناسه محصول مادر
  name: string;        // نام محصول + تنوع
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variations?: CartVariation[]; // تنوع‌های انتخاب شده
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showBottomBar: boolean;
  setShowBottomBar: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showBottomBar, setShowBottomBar] = useState(false);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      // شناسه یکتا بر اساس id (که شامل تنوع هم هست)
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowBottomBar(true);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => { setItems([]); setShowBottomBar(false); };
  const hideBottomBar = () => setShowBottomBar(false);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, showBottomBar, setShowBottomBar: hideBottomBar }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
