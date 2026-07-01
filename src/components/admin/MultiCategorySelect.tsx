import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check, Search, FolderTree, X } from 'lucide-react';
import { Category } from '../../context/CategoriesContext';

interface MultiCategorySelectProps {
  categories: Category[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

type TreeNode = Category | { id: number; name: string; visible: boolean; children?: TreeNode[] };

function TreeNodeItem({
  node,
  level,
  selected,
  onToggle,
}: {
  node: TreeNode;
  level: number;
  selected: boolean;
  onToggle: (name: string) => void;
}) {
  const children = (node.children || []) as TreeNode[];
  const hasChildren = children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors cursor-pointer hover:bg-light-bg ${
          selected ? 'bg-accent/10 text-accent' : 'text-primary'
        }`}
        style={{ paddingRight: `${12 + level * 16}px` }}
        onClick={() => onToggle(node.name)}
      >
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
            selected ? 'bg-accent border-accent' : 'border-border bg-white'
          }`}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="text-sm truncate flex-1">{node.name}</span>
        {hasChildren && <FolderTree className="w-3.5 h-3.5 text-text-secondary" />}
      </div>
      {hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MultiCategorySelect({
  categories,
  value,
  onChange,
  placeholder = 'انتخاب دسته‌بندی...',
}: MultiCategorySelectProps) {
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

  const visibleCategories = useMemo(() => categories.filter((c: any) => c.visible), [categories]);

  const toggleCategory = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const removeCategory = (name: string) => {
    onChange(value.filter((v) => v !== name));
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-light-bg border rounded-xl px-4 py-2.5 text-sm transition-all min-h-[42px] ${
          open ? 'border-accent ring-2 ring-accent/15' : 'border-border hover:border-accent/40'
        }`}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 justify-start">
          {value.length === 0 ? (
            <span className="text-text-secondary">{placeholder}</span>
          ) : (
            value.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {v}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(v);
                  }}
                  className="hover:text-accent-dark"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
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

          <div className="max-h-[340px] overflow-y-auto cart-scroll p-2">
            {visibleCategories.length === 0 && (
              <p className="text-center text-xs text-text-secondary py-6">دسته‌بندی پیدا نشد</p>
            )}
            {visibleCategories.map((cat) => (
              <TreeNodeItem
                key={cat.id}
                node={cat}
                level={0}
                selected={value.includes(cat.name)}
                onToggle={toggleCategory}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
