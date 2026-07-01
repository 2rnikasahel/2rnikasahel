import { useState } from 'react';
import { Trash2, ChevronDown, Edit3, X, Check } from 'lucide-react';
import { VariationOption } from '../../context/ProductsContext';
import { useVariationsLibrary } from '../../context/VariationsLibraryContext';

interface VariationOptionRowProps {
  categoryId?: number;
  option: VariationOption;
  onUpdate: (data: Partial<VariationOption>) => void;
  onRemove: () => void;
}

export default function VariationOptionRow({
  categoryId,
  option,
  onUpdate,
  onRemove,
}: VariationOptionRowProps) {
  const { categories, addCategoryValue } = useVariationsLibrary();
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [addToLibrary, setAddToLibrary] = useState(false);

  const currentCategory = categories.find((c: any) => c.id === categoryId);
  const availableValues = currentCategory?.values || [];
  const isPresetValue = availableValues.includes(option.name);

  const handleSelectFromLibrary = (value: string) => {
    onUpdate({ name: value });
  };

  const handleCustomSubmit = () => {
    if (!customValue.trim()) return;
    onUpdate({ name: customValue.trim() });
    if (addToLibrary && categoryId) {
      addCategoryValue(categoryId, customValue.trim());
    }
    setCustomValue('');
    setIsCustomMode(false);
    setAddToLibrary(false);
  };

  return (
    <div className="bg-white border border-border/60 rounded-xl p-3 space-y-2.5">
      {/* Row 1: Value Selector */}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        {isCustomMode ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="مقدار سفارشی را وارد کنید..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                className="flex-1 bg-light-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleCustomSubmit}
                disabled={!customValue.trim()}
                className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
                title="تأیید"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomValue('');
                }}
                className="px-3 py-2 bg-light-bg text-text-secondary rounded-lg hover:bg-gray-200 transition-colors"
                title="انصراف"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {categoryId && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addToLibrary}
                  onChange={(e) => setAddToLibrary(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-xs text-text-secondary">
                  این مقدار به دسته‌بندی «{currentCategory?.name}» اضافه شود (برای استفاده بعدی)
                </span>
              </label>
            )}
          </div>
        ) : (
          <div className="relative">
            <select
              value={isPresetValue ? option.name : ''}
              onChange={(e) => handleSelectFromLibrary(e.target.value)}
              className="w-full bg-light-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer"
            >
              <option value="" disabled>
                {option.name || 'انتخاب مقدار...'}
              </option>
              {availableValues.map((value: string) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            {/* نمایش مقدار وارد شده دستی */}
            {option.name && !isPresetValue && (
              <div className="absolute inset-0 flex items-center px-3 bg-light-bg rounded-lg pointer-events-none">
                <span className="text-sm text-primary truncate flex-1">{option.name}</span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-2 mr-7">سفارشی</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-1">
          {!isCustomMode && (
            <button
              onClick={() => setIsCustomMode(true)}
              className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
              title="ورود دستی مقدار"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: SKU and Price */}
      {option.name && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-text-secondary mb-1">کد کالا (SKU)</label>
            <input
              type="text"
              value={option.sku || ''}
              onChange={(e) => onUpdate({ sku: e.target.value })}
              placeholder="مثلاً: DR-PIPE-16"
              dir="ltr"
              className="w-full bg-light-bg border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] text-text-secondary mb-1">قیمت (ریال)</label>
            <input
              type="number"
              value={option.price || ''}
              onChange={(e) => onUpdate({ price: Number(e.target.value) })}
              placeholder="مثلاً: 50000"
              dir="ltr"
              className="w-full bg-light-bg border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
