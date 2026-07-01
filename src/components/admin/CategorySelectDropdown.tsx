import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check, Search, FolderTree } from 'lucide-react';
import { Category } from '../../context/CategoriesContext';

interface CategorySelectDropdownProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelectDropdown({ categories, value, onChange }: CategorySelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const visibleCategories = categories.filter((cat: any) => cat.visible);

  const categoryPaths = useMemo(() => {
    const paths: Array<{
      id: string;
      label: string;
      value: string;
      level: 1 | 2 | 3;
      parent?: string;
    }> = [];

    visibleCategories.forEach((cat: any) => {
      // سطح ۱: دسته اصلی
      paths.push({
        id: `cat-${cat.id}`,
        label: cat.name,
        value: cat.name,
        level: 1,
      });

      cat.children.filter((sub: any) => sub.visible).forEach((sub: any) => {
        // سطح ۲: دسته اصلی - زیرگروه
        const subPath = `${cat.name} - ${sub.name}`;
        paths.push({
          id: `sub-${sub.id}`,
          label: sub.name,
          value: subPath,
          level: 2,
          parent: cat.name,
        });

        sub.children.filter((ss: any) => ss.visible).forEach((ss: any) => {
          // سطح ۳: دسته اصلی - زیرگروه - زیرگروه فرعی
          paths.push({
            id: `ss-${ss.id}`,
            label: ss.name,
            value: `${cat.name} - ${sub.name} - ${ss.name}`,
            level: 3,
            parent: subPath,
          });
        });
      });
    });

    return paths;
  }, [visibleCategories]);

  const filteredPaths = useMemo(() => {
    if (!query.trim()) return categoryPaths;
    const q = query.trim().toLowerCase();
    return categoryPaths.filter((item) => item.value.toLowerCase().includes(q));
  }, [query, categoryPaths]);

  const choose = (name: string) => {
    onChange(name);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 bg-light-bg border rounded-xl px-4 py-2.5 text-sm transition-all ${
          open ? 'border-accent ring-2 ring-accent/15' : 'border-border hover:border-accent/40'
        }`}
      >
        <span className={`truncate ${value ? 'text-primary font-medium' : 'text-text-secondary'}`}>
          {value || 'انتخاب دسته‌بندی...' }
        </span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 mt-2 z-50 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-border bg-light-bg/60">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو در دسته‌بندی‌ها..."
                className="w-full bg-white border border-border rounded-xl px-4 pr-9 py-2 text-xs focus:outline-none focus:border-accent"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[340px] overflow-y-auto cart-scroll p-2 space-y-1">
            {filteredPaths.length === 0 && (
              <p className="text-center text-xs text-text-secondary py-6">دسته‌بندی پیدا نشد</p>
            )}

            {filteredPaths.map((item) => (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => choose(item.value)}
                  className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-colors ${
                    value === item.value
                      ? 'bg-accent/10 text-accent font-bold'
                      : item.level === 1
                        ? 'bg-white text-primary hover:bg-light-bg font-bold'
                        : 'text-text-secondary hover:bg-light-bg hover:text-primary'
                  }`}
                >
                  <span className={`flex items-center gap-2 min-w-0 ${item.level === 2 ? 'pr-4 text-xs' : item.level === 3 ? 'pr-8 text-[11px]' : 'text-sm'}`}>
                    {item.level === 1 && <FolderTree className="w-4 h-4 flex-shrink-0" />}
                    {item.level > 1 && <span className="text-text-secondary flex-shrink-0">—</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {value === item.value && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
