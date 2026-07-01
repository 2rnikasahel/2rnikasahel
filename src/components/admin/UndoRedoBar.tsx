import { useEffect, useState } from 'react';
import { Undo2, Redo2, Check, Cloud } from 'lucide-react';
import { useHistory } from '../../context/HistoryContext';

export default function UndoRedoBar() {
  const { canUndo, canRedo, undo, redo, lastSaved, currentIndex, historyLength } = useHistory();
  const [showSaved, setShowSaved] = useState(false);

  // نمایش پیام "ذخیره شد" هنگام تغییر lastSaved
  useEffect(() => {
    if (lastSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);

  // میانبر صفحه‌کلید: Ctrl+Z برای undo و Ctrl+Y یا Ctrl+Shift+Z برای redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canUndo, canRedo, undo, redo]);

  return (
    <div className="flex items-center gap-2">
      {/* Auto-save indicator */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs">
        {showSaved ? (
          <span className="flex items-center gap-1 text-green-600 font-medium animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            ذخیره شد
          </span>
        ) : (
          <span className="flex items-center gap-1 text-text-secondary">
            <Cloud className="w-3.5 h-3.5" />
            ذخیره خودکار فعال
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-5 bg-border" />

      {/* Undo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-light-bg text-primary"
        title="بازگردانی (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
        <span className="hidden md:inline">بازگردانی</span>
      </button>

      {/* Redo */}
      <button
        onClick={redo}
        disabled={!canRedo}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-light-bg text-primary"
        title="انجام مجدد (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
        <span className="hidden md:inline">انجام مجدد</span>
      </button>

      {/* History counter */}
      <span className="hidden lg:inline text-[11px] text-text-secondary bg-light-bg px-2 py-1 rounded-lg">
        {currentIndex + 1} / {historyLength}
      </span>
    </div>
  );
}
