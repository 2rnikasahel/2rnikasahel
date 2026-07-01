import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo,
  Link as LinkIcon, Quote, Minus, Palette, Eraser,
  Maximize, Minimize, IndentIncrease, IndentDecrease, Upload
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

function ToolBtn({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="p-1.5 rounded-lg transition-colors text-text-secondary hover:bg-white hover:text-primary active:scale-95"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-border mx-0.5 flex-shrink-0" />;
}

// فونت‌های پیش‌فرض
const defaultFonts = [
  { name: 'وزیرمتن', family: 'Vazirmatn, sans-serif' },
  { name: 'تاهوما', family: 'Tahoma, sans-serif' },
  { name: 'ب‌نازنین', family: 'B Nazanin, serif' },
  { name: 'ب‌زر', family: 'B Zar, serif' },
  { name: 'ب‌میترا', family: 'B Mitra, serif' },
  { name: 'ایران‌سنس', family: 'IRANSans, sans-serif' },
  { name: 'دانا', family: 'Dana, sans-serif' },
  { name: 'یکان', family: 'Yekan, sans-serif' },
  { name: 'ساحل', family: 'Sahel, sans-serif' },
  { name: 'فرهنگ', family: 'Farhang, sans-serif' },
  { name: 'Arial', family: 'Arial, sans-serif' },
  { name: 'Times New Roman', family: 'Times New Roman, serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Courier New', family: 'Courier New, monospace' },
  { name: 'Verdana', family: 'Verdana, sans-serif' },
];

const fontSizes = [
  { label: '۸', value: '1' },
  { label: '۱۰', value: '2' },
  { label: '۱۲', value: '3' },
  { label: '۱۴', value: '4' },
  { label: '۱۸', value: '5' },
  { label: '۲۴', value: '6' },
  { label: '۳۶', value: '7' },
];

const colors = [
  '#0f172a', '#374151', '#6b7280', '#9ca3af',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
  '#2563eb', '#7c3aed', '#db2777', '#0d9488',
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontUpload, setShowFontUpload] = useState(false);
  const [customFonts, setCustomFonts] = useState<{ name: string; family: string }[]>([]);
  const isInitialized = useRef(false);
  const fontUploadRef = useRef<HTMLInputElement>(null);

  const allFonts = [...defaultFonts, ...customFonts];

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, [value]);

  const syncToParent = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    }
  }, [onChange, value]);

  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    syncToParent();
  }, [syncToParent]);

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    exec('createLink', url);
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontName = file.name.replace(/\.(woff2?|ttf|otf|eot)$/i, '').replace(/[-_]/g, ' ');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;

      // ساخت @font-face و تزریق به صفحه
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url('${dataUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);

      setCustomFonts((prev) => [...prev, { name: fontName, family: `'${fontName}', sans-serif` }]);
      setShowFontUpload(false);
    };
    reader.readAsDataURL(file);
    if (fontUploadRef.current) fontUploadRef.current.value = '';
  };

  const containerClass = isFullscreen
    ? 'fixed inset-4 z-[200] bg-white rounded-2xl shadow-2xl border border-border flex flex-col'
    : `border rounded-xl overflow-hidden bg-white transition-colors ${isFocused ? 'border-accent ring-1 ring-accent/30' : 'border-border'}`;

  return (
    <div className={containerClass}>
      {/* Toolbar Row 1 */}
      <div className="flex items-center gap-0.5 p-2 border-b border-border bg-light-bg/50 flex-wrap">
        {/* Heading */}
        <select
          defaultValue=""
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              editorRef.current?.focus();
              document.execCommand('formatBlock', false, val);
              syncToParent();
            }
            e.target.value = '';
          }}
          className="bg-white border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="" disabled>سرتیتر</option>
          <option value="h1">عنوان ۱</option>
          <option value="h2">عنوان ۲</option>
          <option value="h3">عنوان ۳</option>
          <option value="h4">عنوان ۴</option>
          <option value="p">متن عادی</option>
        </select>

        <Sep />

        {/* Font Family */}
        <div className="relative">
          <select
            defaultValue=""
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__upload__') {
                setShowFontUpload(true);
                e.target.value = '';
                return;
              }
              if (val) {
                editorRef.current?.focus();
                document.execCommand('fontName', false, val);
                syncToParent();
              }
              e.target.value = '';
            }}
            className="bg-white border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-accent cursor-pointer max-w-[110px]"
          >
            <option value="" disabled>فونت</option>
            {allFonts.map((f, idx) => (
              <option key={idx} value={f.family} style={{ fontFamily: f.family }}>
                {f.name}
              </option>
            ))}
            <option value="__upload__">📁 آپلود فونت...</option>
          </select>
        </div>

        {/* Font Size */}
        <select
          defaultValue=""
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              editorRef.current?.focus();
              document.execCommand('fontSize', false, val);
              syncToParent();
            }
            e.target.value = '';
          }}
          className="bg-white border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-accent cursor-pointer w-[72px]"
        >
          <option value="" disabled>سایز</option>
          {fontSizes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Sep />

        <ToolBtn icon={Bold} title="ضخیم (Ctrl+B)" onClick={() => exec('bold')} />
        <ToolBtn icon={Italic} title="مورب (Ctrl+I)" onClick={() => exec('italic')} />
        <ToolBtn icon={Underline} title="زیرخط (Ctrl+U)" onClick={() => exec('underline')} />
        <ToolBtn icon={Strikethrough} title="خط‌خورده" onClick={() => exec('strikeThrough')} />

        <Sep />

        {/* Text Color */}
        <div className="relative">
          <ToolBtn icon={Palette} title="رنگ متن" onClick={() => setShowColorPicker(!showColorPicker)} />
          {showColorPicker && (
            <div className="absolute top-full right-0 mt-1 z-50 bg-white border border-border rounded-xl shadow-2xl p-2.5 grid grid-cols-5 gap-1.5 w-[160px]">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editorRef.current?.focus();
                    document.execCommand('foreColor', false, color);
                    syncToParent();
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-md border border-border/50 hover:scale-125 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <ToolBtn icon={Eraser} title="پاک کردن قالب‌بندی" onClick={() => exec('removeFormat')} />

        <Sep />

        <ToolBtn icon={AlignRight} title="راست‌چین" onClick={() => exec('justifyRight')} />
        <ToolBtn icon={AlignCenter} title="وسط‌چین" onClick={() => exec('justifyCenter')} />
        <ToolBtn icon={AlignLeft} title="چپ‌چین" onClick={() => exec('justifyLeft')} />
        <ToolBtn icon={AlignJustify} title="تراز شده" onClick={() => exec('justifyFull')} />

        <Sep />

        <ToolBtn icon={List} title="لیست نقطه‌ای" onClick={() => exec('insertUnorderedList')} />
        <ToolBtn icon={ListOrdered} title="لیست شماره‌ای" onClick={() => exec('insertOrderedList')} />
        <ToolBtn icon={IndentIncrease} title="افزایش تورفتگی" onClick={() => exec('indent')} />
        <ToolBtn icon={IndentDecrease} title="کاهش تورفتگی" onClick={() => exec('outdent')} />

        <Sep />

        <ToolBtn icon={Quote} title="نقل قول" onClick={() => exec('formatBlock', 'blockquote')} />
        <ToolBtn icon={Minus} title="خط افقی" onClick={() => exec('insertHorizontalRule')} />
        <ToolBtn icon={LinkIcon} title="درج لینک" onClick={() => setShowLinkInput(!showLinkInput)} />

        <Sep />

        <ToolBtn icon={Undo} title="بازگشت (Ctrl+Z)" onClick={() => exec('undo')} />
        <ToolBtn icon={Redo} title="انجام مجدد (Ctrl+Y)" onClick={() => exec('redo')} />

        <div className="mr-auto">
          <ToolBtn
            icon={isFullscreen ? Minimize : Maximize}
            title={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </div>

      {/* Font Upload Bar */}
      {showFontUpload && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-accent/5">
          <Upload className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-xs text-primary font-medium">آپلود فونت:</span>
          <input
            ref={fontUploadRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFontUpload}
            className="flex-1 text-xs file:bg-accent file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:ml-2 file:cursor-pointer file:text-xs"
          />
          <button
            type="button"
            onClick={() => setShowFontUpload(false)}
            className="text-xs text-text-secondary hover:text-danger"
          >
            ✕
          </button>
        </div>
      )}

      {/* Installed Custom Fonts Info */}
      {customFonts.length > 0 && showFontUpload && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-green-50 text-[10px] text-green-700">
          فونت‌های نصب شده: {customFonts.map((f) => f.name).join('، ')}
        </div>
      )}

      {/* Link Input Bar */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-accent/5">
          <LinkIcon className="w-4 h-4 text-accent flex-shrink-0" />
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && insertLink()}
            placeholder="https://example.com"
            dir="ltr"
            className="flex-1 bg-white border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent"
            autoFocus
          />
          <button type="button" onClick={insertLink} className="bg-accent text-white px-3 py-1.5 rounded-lg text-xs">
            درج
          </button>
          <button type="button" onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} className="text-xs text-text-secondary hover:text-danger">
            ✕
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncToParent}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
              case 'b': e.preventDefault(); exec('bold'); break;
              case 'i': e.preventDefault(); exec('italic'); break;
              case 'u': e.preventDefault(); exec('underline'); break;
              case 'z': e.preventDefault(); exec(e.shiftKey ? 'redo' : 'undo'); break;
              case 'y': e.preventDefault(); exec('redo'); break;
            }
          }
          if (e.key === 'Tab') {
            e.preventDefault();
            exec(e.shiftKey ? 'outdent' : 'indent');
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); setShowColorPicker(false); syncToParent(); }}
        className={`w-full px-5 py-4 text-sm focus:outline-none leading-7 overflow-y-auto
          [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:my-3
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2
          [&_h4]:text-base [&_h4]:font-bold [&_h4]:my-1
          [&_blockquote]:border-r-4 [&_blockquote]:border-accent [&_blockquote]:bg-light-bg [&_blockquote]:pr-4 [&_blockquote]:py-2 [&_blockquote]:my-2 [&_blockquote]:rounded-lg [&_blockquote]:text-text-secondary [&_blockquote]:italic
          [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:my-2
          [&_li]:my-1
          [&_a]:text-accent [&_a]:underline
          [&_hr]:my-4 [&_hr]:border-border
          [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2
          empty:before:content-[attr(data-placeholder)] empty:before:text-text-secondary/40 empty:before:pointer-events-none
          ${isFullscreen ? 'flex-1' : 'min-h-[180px] max-h-[500px]'}
        `}
        dir="rtl"
        data-placeholder={placeholder || 'متن خود را اینجا بنویسید...'}
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-light-bg/30 text-[10px] text-text-secondary select-none">
        <span>Ctrl+B ضخیم • Ctrl+I مورب • Ctrl+U زیرخط • Tab تورفتگی</span>
        <span>فونت‌ها: {allFonts.length} • ویرایشگر درنیکا</span>
      </div>
    </div>
  );
}
