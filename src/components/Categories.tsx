import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Layers } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useHome } from '../context/HomeContext';

type AnyNode = any;

/**
 * مدیریت اسکرول عمودی داخل یک کارت
 */
function CardVerticalScroll({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  const listRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startY: 0, scrollTop: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    const el = listRef.current;
    if (!el) return;
    drag.current = { active: true, startY: e.clientY, scrollTop: el.scrollTop, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !listRef.current) return;
    const dy = e.clientY - drag.current.startY;
    
    // فقط اگر جابجایی قابل توجه بود اسکرول را شروع کن
    if (Math.abs(dy) > 10) {
      if (!drag.current.moved) {
        listRef.current.setPointerCapture(e.pointerId);
      }
      drag.current.moved = true;
      listRef.current.scrollTop = drag.current.scrollTop - dy;
      e.stopPropagation(); // جلوگیری از اسکرول افقی والد
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.active = false;
    try { listRef.current?.releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div
      ref={listRef}
      {...props}
      className="flex-1 min-h-0 overflow-y-auto cart-scroll select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="space-y-1 pr-1 pb-1">{children}</div>
    </div>
  );
}

function CategoryListItem({ node, level }: { node: AnyNode; level: number }) {
  const children = (node.children || []) as AnyNode[];
  const hasChildren = children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group py-0.5">
        <Link
          to={`/shop?category=${encodeURIComponent(node.name)}`}
          draggable={false}
          className={`inline-block hover:text-accent transition-colors py-1 no-drag ${level === 0 ? 'text-primary font-bold' : 'text-text-secondary'}`}
          style={{ 
            paddingRight: `${level * 8}px`,
            fontSize: 'clamp(0.7rem, 1.2vw, 0.95rem)' // فونت بزرگتر برای خوانایی
          }}
        >
          {level > 0 && <span className="text-text-secondary/40 ml-1.5">—</span>}
          {node.name}
        </Link>
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 hover:bg-light-bg rounded-full transition-colors ml-1 relative z-10 active:scale-90"
          >
            <ChevronDown 
              className={`text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              style={{ width: 'clamp(0.75rem, 1.1vw, 1.1rem)', height: 'clamp(0.75rem, 1.1vw, 1.1rem)' }}
            />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="space-y-0.5 mt-1 border-r-2 border-border/50 mr-2 pr-1 bg-light-bg/30 rounded-lg p-1">
          {children.map((child: any) => (
            <CategoryListItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Categories() {
  const { categories } = useCategories();
  const { settings } = useHome();
  const sectionSettings = settings.categorySection;
  const visibleCategories = categories.filter(
    (c: any) => c.visible && sectionSettings.selectedCategoryIds.includes(c.id)
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    const element = scrollRef.current;
    if (!element) return;
    setIsDragging(true);
    dragState.current = { startX: event.clientX, scrollLeft: element.scrollLeft, moved: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element || !isDragging) return;
    const deltaX = event.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 10) {
      if (!dragState.current.moved) {
        element.setPointerCapture(event.pointerId);
      }
      dragState.current.moved = true;
      element.scrollLeft = dragState.current.scrollLeft - deltaX;
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try { scrollRef.current?.releasePointerCapture(event.pointerId); } catch {}
  };

  const preventClickAfterDrag = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 section-spacing" aria-label="دسته‌بندی محصولات" role="region">
      <div className="flex items-end justify-between gap-4 mb-6 select-none">
        <div>
          <h2 className="font-black text-primary mb-2" style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}>دسته‌بندی محصولات</h2>
          <p className="text-text-secondary" style={{ fontSize: 'clamp(0.75rem, 1.25vw, 1rem)' }}>محصولات ما را بر اساس دسته‌بندی‌های تخصصی جستجو کنید</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={preventClickAfterDrag}
        className={`category-horizontal-scroll overflow-x-auto select-none no-drag ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          touchAction: 'pan-x pan-y',
          paddingTop: '10px',
          marginTop: '-10px'
        }}
      >
        <div className="flex items-stretch gap-4 pb-6 pt-2 w-max px-1">
          {visibleCategories.map((cat: any) => {
            const selectedChildren = cat.children.filter(
              (child: any) => child.visible && sectionSettings.selectedSubCategoryIds.includes(child.id)
            );
            const uploadedIcon = sectionSettings.categoryIcons[cat.id];

            return (
              <article
                key={cat.id}
                className="category-card snap-start bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-border/60 hover:border-accent/35 hover:shadow-xl transition-all flex flex-col flex-shrink-0 shadow-sm"
                style={{ 
                  width: 'clamp(170px, 20vw, 300px)', 
                  height: 'clamp(240px, 28vw, 340px)',
                  padding: 'clamp(0.85rem, 2vw, 1.75rem)'
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-4 pointer-events-none">
                  <div className="min-w-0">
                    <h3 className="font-black text-primary truncate" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)' }}>
                      {cat.name}
                    </h3>
                    <p className="text-text-secondary mt-1" style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)' }}>
                      {selectedChildren.length.toLocaleString('fa-IR')} زیرگروه
                    </p>
                  </div>
                  <div 
                    className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner"
                    style={{ width: 'clamp(2.5rem, 4.5vw, 4rem)', height: 'clamp(2.5rem, 4.5vw, 4rem)' }}
                  >
                    {uploadedIcon ? (
                      <img src={uploadedIcon} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layers className="text-accent" style={{ width: '50%', height: '50%' }} />
                    )}
                  </div>
                </div>

                <CardVerticalScroll>
                  {selectedChildren.map((child: any) => (
                    <CategoryListItem key={child.id} node={child} level={0} />
                  ))}
                </CardVerticalScroll>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
