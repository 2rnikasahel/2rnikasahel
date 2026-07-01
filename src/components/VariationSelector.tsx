import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface VariationSelectorProps {
  variation: any;
  selectedValue: string;
  onSelect: (optionName: string) => void;
  productId: number;
  productName: string;
  productImage: string;
  productOriginalPrice: number;
  productBasePrice: number;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 10000;
}

export default function VariationSelector({
  variation, selectedValue, onSelect,
  productId, productName, productImage, productOriginalPrice, productBasePrice,
}: VariationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const getQty = (idx: number) => quantities[idx] || 1;
  const setQty = (idx: number, val: number) => {
    setQuantities((prev) => ({ ...prev, [idx]: Math.max(1, val) }));
  };

  const handleAddOptionToCart = (optIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const opt = variation.options[optIdx];
    const qty = getQty(optIdx);
    const price = opt.price && opt.price > 0 ? opt.price : productBasePrice;
    const displayName = `${productName} - ${opt.name}`;
    const uniqueId = productId * 10000 + hashCode(`${variation.name}|${opt.name}`);

    for (let i = 0; i < qty; i++) {
      addItem({
        id: uniqueId,
        productId,
        name: displayName,
        price,
        originalPrice: productOriginalPrice,
        image: productImage,
        variations: [{
          variationName: variation.name,
          optionName: opt.name,
          sku: opt.sku,
        }],
      });
    }
    setQty(optIdx, 1);
  };

  // Prevent buttons from triggering drag on parent
  const stopDrag = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const selectedOption = variation.options.find((o: any) => o.name === selectedValue);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-bold text-primary mb-2">{variation.name}</label>

      {/* Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 bg-white border rounded-2xl px-4 py-3.5 text-right transition-all ${
          isOpen ? 'border-accent ring-2 ring-accent/20 shadow-lg' : 'border-border hover:border-accent/50'
        }`}
      >
        <div className="flex-1 min-w-0">
          {selectedValue ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary">{selectedValue}</span>
              {selectedOption?.sku && (
                <span className="text-[10px] bg-light-bg text-text-secondary px-2 py-0.5 rounded-full" dir="ltr">
                  {selectedOption.sku}
                </span>
              )}
              {selectedOption?.price && selectedOption.price > 0 && (
                <span className="text-[10px] text-accent font-bold">
                  {formatPrice(selectedOption.price)} ریال
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-text-secondary">انتخاب {variation.name}...</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-2 z-50 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="px-4 py-2.5 border-b border-border bg-light-bg/50">
            <p className="text-xs font-bold text-primary">{variation.name} را انتخاب کنید</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{variation.options.length} گزینه موجود</p>
          </div>

          <div
            ref={listRef}
            className="max-h-[350px] overflow-y-auto overscroll-contain"
          >
            {variation.options.map((opt: any, idx: number) => {
              const isSelected = opt.name === selectedValue;
              const optPrice = opt.price && opt.price > 0 ? opt.price : productBasePrice;

              return (
                <div
                  key={idx}
                  className={`border-b border-border/30 last:border-b-0 transition-colors ${
                    isSelected ? 'bg-accent/5' : 'hover:bg-light-bg/50'
                  }`}
                >
                  {/* Option name row - clickable */}
                  <button
                    type="button"
                    onClick={() => onSelect(opt.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-right"
                  >
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${isSelected ? 'text-accent' : 'text-primary'}`}>
                        {opt.name}
                      </span>
                    </div>
                    {opt.sku && (
                      <span className="text-[10px] bg-light-bg text-text-secondary px-2 py-0.5 rounded-full flex-shrink-0" dir="ltr">
                        {opt.sku}
                      </span>
                    )}
                    <span className="text-xs font-bold text-accent flex-shrink-0">
                      {formatPrice(optPrice)} ریال
                    </span>
                  </button>

                  {/* Quick add row with quantity and cart button */}
                  <div className="flex items-center gap-2 px-4 pb-3 pr-4">
                    <div className="flex items-center bg-light-bg border border-border rounded-xl p-0.5">
                      <button
                        type="button"
                        onMouseDown={stopDrag}
                        onClick={(e) => { e.stopPropagation(); setQty(idx, getQty(idx) - 1); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-text-secondary hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-7 text-center text-primary">{getQty(idx).toLocaleString('fa-IR')}</span>
                      <button
                        type="button"
                        onMouseDown={stopDrag}
                        onClick={(e) => { e.stopPropagation(); setQty(idx, getQty(idx) + 1); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-text-secondary hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onMouseDown={stopDrag}
                      onClick={(e) => handleAddOptionToCart(idx, e)}
                      className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-accent transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      افزودن به سبد
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
