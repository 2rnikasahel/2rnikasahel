import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronDown } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useTheme } from '../context/ThemeContext';

type AnyNode = any;

function CategoryTreeNode({ node, isDark, onClose }: { node: AnyNode; isDark: boolean; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const children = (node.children || []) as AnyNode[];
  const hasChildren = children.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group">
        <Link
          to={`/shop?category=${encodeURIComponent(node.name)}`}
          onClick={onClose}
          className={`block text-sm font-medium hover:text-accent transition-colors py-1 ${isDark ? 'text-slate-300' : 'text-text-secondary'}`}
        >
          {node.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-light-bg rounded-full transition-colors"
          >
            <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="pr-4 border-r border-border/50 mr-2 space-y-1 mt-1">
          {children.map((child: any) => (
            <CategoryTreeNode key={child.id} node={child} isDark={isDark} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { categories } = useCategories();
  const { isDark } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter to only show visible categories in mega menu
  const visibleCategories = categories.filter((c: any) => c.visible);

  useEffect(() => {
    if (isOpen && visibleCategories.length > 0 && activeCategory === null) {
      setActiveCategory(visibleCategories[0].id);
    }
  }, [isOpen, visibleCategories, activeCategory]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const activeCategoryData = visibleCategories.find((c: any) => c.id === activeCategory);

  return (
    <div className="relative" ref={menuRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isOpen
            ? isDark
              ? 'bg-accent text-white shadow-[0_10px_30px_-16px_rgba(59,130,246,0.9)]'
              : 'bg-primary text-white'
            : isDark
              ? 'bg-slate-900/80 text-slate-200 border border-slate-800 hover:border-accent hover:text-accent'
              : 'bg-white text-primary border border-border hover:border-accent hover:text-accent'
        }`}
        aria-expanded={isOpen}
        aria-controls="mega-menu"
        aria-label="همه دسته‌بندی‌ها"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        <span>همه دسته‌بندی‌ها</span>
      </button>

      {/* Mega Menu Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mega-menu"
            className={`absolute top-full right-0 mt-2 z-50 rounded-2xl shadow-2xl border overflow-hidden animate-fade-in-up
                       w-[90vw] max-w-[720px] md:w-[720px] ${
                         isDark
                           ? 'bg-slate-950 border-slate-800 shadow-[0_30px_90px_-38px_rgba(59,130,246,0.75)]'
                           : 'bg-white border-border/50'
                       }`}
            role="menu"
          >
            {visibleCategories.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-sm">
                دسته‌بندی فعالی برای نمایش وجود ندارد
              </div>
            ) : (
              <div className="flex flex-row min-h-[400px] max-h-[70vh]">
                {/* Main Categories - Right Side */}
                <div className={`w-[200px] sm:w-[240px] border-l overflow-y-auto flex-shrink-0 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-light-bg border-border'}`}>
                  <ul className="py-2">
                    {visibleCategories.map((cat: any) => (
                      <li key={cat.id}>
                        <button
                          onMouseEnter={() => setActiveCategory(cat.id)}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-xs sm:text-sm transition-all text-right ${
                            activeCategory === cat.id
                              ? isDark
                                ? 'bg-slate-950 text-accent font-semibold border-r-2 border-accent'
                                : 'bg-white text-accent font-semibold border-r-2 border-accent'
                              : isDark
                                ? 'text-slate-300 hover:bg-slate-950/70'
                                : 'text-primary hover:bg-white/60'
                          }`}
                          role="menuitem"
                        >
                          <span>{cat.name}</span>
                          <ChevronLeft
                            className={`w-3.5 h-3.5 transition-transform ${
                              activeCategory === cat.id ? 'text-accent' : 'text-text-secondary'
                            }`}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub Categories - Left Side */}
                <div className={`flex-1 p-4 sm:p-6 overflow-y-auto ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                  {activeCategoryData ? (
                    <div className="animate-fade-in">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
                        <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-primary'}`}>
                          {activeCategoryData.name}
                        </h3>
                        <Link
                          to={`/shop?category=${encodeURIComponent(activeCategoryData.name)}`}
                          onClick={() => setIsOpen(false)}
                          className="text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1"
                        >
                          مشاهده همه
                          <ChevronLeft className="w-3 h-3" />
                        </Link>
                      </div>

                      {activeCategoryData.children.filter((s: any) => s.visible).length === 0 ? (
                        <p className="text-sm text-text-secondary text-center py-8">
                          زیرگروهی برای این دسته‌بندی ثبت نشده است
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {activeCategoryData.children
                            .filter((sub: any) => sub.visible)
                            .map((sub: any) => (
                              <div key={sub.id}>
                                <Link
                                  to={`/shop?category=${encodeURIComponent(sub.name)}`}
                                  onClick={() => setIsOpen(false)}
                                  className={`block text-sm font-bold hover:text-accent transition-colors mb-3 pb-2 border-b ${isDark ? 'text-slate-100 border-slate-800' : 'text-primary border-border/50'}`}
                                >
                                  {sub.name}
                                </Link>
                                <div className="space-y-1">
                                  {sub.children
                                    .filter((ss: any) => ss.visible)
                                    .map((ss: any) => (
                                      <CategoryTreeNode key={ss.id} node={ss} isDark={isDark} onClose={() => setIsOpen(false)} />
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary text-sm">
                      دسته‌بندی را انتخاب کنید
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
