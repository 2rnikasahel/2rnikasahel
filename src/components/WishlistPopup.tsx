import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import OptimizedImage from './OptimizedImage';

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistPopup({ isOpen, onClose }: WishlistPopupProps) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { products } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startY: 0, scrollTop: 0, moved: false });

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // --- Drag to scroll logic ---
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // We allow starting drag from anywhere now
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = {
      startY: e.clientY,
      scrollTop: el.scrollTop,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging) return;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dy) > 5) dragState.current.moved = true;
    el.scrollTop = dragState.current.scrollTop - dy;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      scrollRef.current?.releasePointerCapture(e.pointerId);
    } catch { /* ignore */ }
  };

  const preventClickAfterDrag = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-[2.5rem] shadow-2xl border border-border/50 w-full max-w-2xl overflow-hidden animate-fade-in-up max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-light-bg/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-black text-primary text-lg">علاقه‌مندی‌های من</h2>
              <p className="text-[10px] text-text-secondary">{wishlist.length.toLocaleString('fa-IR')} محصول ذخیره شده</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with Drag Scroll */}
        <div 
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={preventClickAfterDrag}
          className={`flex-1 overflow-y-auto custom-scrollbar p-6 select-none touch-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishlistProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative bg-white border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Remove Button Overlay */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWishlist(product.id); }}
                    className="absolute top-1.5 left-1.5 z-10 w-7 h-7 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Link 
                    to={`/product/${product.id}`} 
                    onClick={onClose}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="aspect-square bg-light-bg overflow-hidden flex-shrink-0 no-drag"
                  >
                    <OptimizedImage 
                      src={product.images[0]} 
                      alt={product.name} 
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none select-none" 
                    />
                  </Link>

                  <div className="p-3 flex flex-col flex-1 no-drag">
                    <Link 
                      to={`/product/${product.id}`} 
                      onClick={onClose}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className="text-[10px] sm:text-xs font-bold text-primary line-clamp-2 hover:text-accent transition-colors min-h-[2.5rem] no-drag"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-auto pt-2">
                      <p className="text-[10px] sm:text-xs font-black text-accent">
                        {product.price.toLocaleString('fa-IR')} <span className="text-[8px] font-normal text-text-secondary">ریال</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-text-secondary/20" />
              </div>
              <p className="text-text-secondary text-sm mb-6">لیست علاقه‌مندی‌های شما خالی است.</p>
              <Link 
                to="/shop" 
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-light transition-all shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                مشاهده فروشگاه
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-border/50 bg-light-bg/30 flex items-center justify-between">
            <button 
              onClick={clearWishlist}
              className="text-xs text-danger hover:underline font-medium"
            >
              پاک کردن همه
            </button>
            <button 
              onClick={onClose}
              className="bg-white border border-border text-primary px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              بستن
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
