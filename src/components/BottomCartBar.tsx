import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function BottomCartBar() {
  const { items, totalPrice, totalItems, showBottomBar, setShowBottomBar, updateQuantity, removeItem } = useCart();
  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  // --- Drag to scroll ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;
    // در RTL هم همین فرمول درست عمل می‌کند چون scrollLeft نسبی است
    el.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    setIsDragging(false);
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // جلوگیری از کلیک ناخواسته روی دکمه‌ها بعد از درگ
  const preventClickAfterDrag = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const stopDrag = (e: React.PointerEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!showBottomBar || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/20" onClick={() => setShowBottomBar(false)} />

      {/* Bar */}
      <div className="relative bg-white border-t border-border shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.18)]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Close button */}
            <button
              onClick={() => setShowBottomBar(false)}
              className="p-1.5 sm:p-2 text-text-secondary hover:bg-light-bg rounded-lg transition-colors flex-shrink-0"
              aria-label="بستن"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Cart summary - hidden on very small screens */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <div className="relative w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <span className="absolute -top-1.5 -left-1.5 bg-danger text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-xs text-text-secondary">جمع سبد</p>
                <p className="text-sm font-bold text-primary">{formatPrice(totalPrice)} ریال</p>
              </div>
            </div>

            {/* Mobile total - compact */}
            <div className="sm:hidden flex-shrink-0 bg-accent/10 rounded-lg px-2 py-1">
              <p className="text-[10px] font-bold text-primary whitespace-nowrap">{formatPrice(totalPrice)}</p>
              <p className="text-[8px] text-text-secondary -mt-0.5">ریال</p>
            </div>

            {/* Scrollable items list - drag to scroll */}
            <div
              ref={scrollRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onClickCapture={preventClickAfterDrag}
              className={`flex-1 min-w-0 overflow-x-auto cart-scroll select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ touchAction: 'pan-x' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 py-1 w-max">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1.5 sm:gap-2 bg-light-bg rounded-xl p-1.5 sm:p-2 flex-shrink-0 border border-border/50"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      draggable={false}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0 pointer-events-none"
                    />
                    {/* Name + price - hidden on mobile */}
                    <div className="hidden sm:block min-w-0 max-w-[120px]">
                      <p className="text-[11px] text-primary truncate font-medium">{item.name}</p>
                      <p className="text-[11px] text-accent font-bold">{formatPrice(item.price)} ریال</p>
                    </div>
                    {/* Quantity controls */}
                    <div
                      className="flex items-center gap-0.5 sm:gap-1 bg-white border border-border rounded-lg p-0.5 flex-shrink-0"
                      onPointerDown={stopDrag}
                      style={{ cursor: 'default' }}
                    >
                      <button
                        onPointerDown={stopDrag}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-light-bg rounded-md transition-colors text-text-secondary"
                        aria-label="افزایش"
                      >
                        <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                      <span className="text-[10px] sm:text-xs font-bold w-4 sm:w-5 text-center text-primary">{item.quantity}</span>
                      <button
                        onPointerDown={stopDrag}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-light-bg rounded-md transition-colors text-text-secondary"
                        aria-label="کاهش"
                      >
                        <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                    {/* Delete */}
                    <button
                      onPointerDown={stopDrag}
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout button - compact on mobile */}
            <Link
              to="/cart"
              onClick={() => setShowBottomBar(false)}
              className="bg-primary text-white px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-primary-light transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0 shadow-lg"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">تکمیل سفارش</span>
              <span className="sm:hidden text-[11px]">پرداخت</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
