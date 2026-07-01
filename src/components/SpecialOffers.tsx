import { useRef, useEffect } from 'react';
import { Flame, ChevronLeft } from 'lucide-react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, name: 'پمپ تصفیه استخر ۱.۵ اسب بخار استریم', price: 7013500, originalPrice: 10300000, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop', rating: 4.8, discount: 31, badge: 'تخفیف ویژه' },
  { id: 2, name: 'لوله پنج لایه نیوپایپ سایز ۱۶ میلی‌متر', price: 39150, originalPrice: 52000, image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0b6b?w=400&h=400&fit=crop', rating: 4.5, discount: 25, badge: 'تخفیف ویژه' },
  { id: 3, name: 'پکیج دیواری گرمایشی بوتان مدل Perla Pro ۲۴۰۰', price: 16300000, originalPrice: 19500000, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop', rating: 4.9, discount: 24, badge: 'تخفیف ویژه' },
  { id: 4, name: 'شیرآلات اهرمی روشویی مدل لوکس کروم', price: 2850000, originalPrice: 3800000, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop', rating: 4.6, discount: 25, badge: 'تخفیف ویژه' },
  { id: 5, name: 'اسپلیت ۲۴۰۰۰ اینورتر', price: 32000000, originalPrice: 38000000, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop', rating: 4.8, discount: 16, badge: 'تخفیف ویژه' },
  { id: 6, name: 'فیلتر شنی استخر هایوارد', price: 8900000, originalPrice: 11000000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', rating: 4.4, discount: 19, badge: 'تخفیف ویژه' },
];

export default function SpecialOffers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, velX: 0, lastX: 0, lastT: 0, rafId: 0, wasDragged: false });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      cancelAnimationFrame(drag.current.rafId);
      drag.current.active = true;
      drag.current.wasDragged = false;
      drag.current.startX = e.clientX;
      drag.current.scrollLeft = el.scrollLeft;
      drag.current.velX = 0;
      drag.current.lastX = e.clientX;
      drag.current.lastT = performance.now();
      el.style.cursor = 'grabbing';
      el.style.scrollBehavior = 'auto';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dx) > 5) drag.current.wasDragged = true;
      const now = performance.now();
      const dt = now - drag.current.lastT || 1;
      drag.current.velX = (e.clientX - drag.current.lastX) / dt;
      drag.current.lastX = e.clientX;
      drag.current.lastT = now;
      el.scrollLeft = drag.current.scrollLeft - dx;
    };

    const onMouseUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      el.style.cursor = 'grab';
      if (drag.current.wasDragged) {
        const blockClick = (evt: Event) => {
          evt.stopPropagation();
          evt.preventDefault();
          el.removeEventListener('click', blockClick, true);
        };
        el.addEventListener('click', blockClick, true);
        setTimeout(() => el.removeEventListener('click', blockClick, true), 200);
      }
      let vel = -drag.current.velX * 14;
      const momentum = () => {
        if (Math.abs(vel) < 0.5) return;
        el.scrollLeft += vel;
        vel *= 0.92;
        drag.current.rafId = requestAnimationFrame(momentum);
      };
      drag.current.rafId = requestAnimationFrame(momentum);
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(drag.current.rafId);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 section-spacing" aria-label="پیشنهادهای ویژه" role="region">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div 
            className="bg-danger/10 rounded-2xl flex items-center justify-center shadow-inner"
            style={{ width: 'clamp(2.5rem, 4.5vw, 3.5rem)', height: 'clamp(2.5rem, 4.5vw, 3.5rem)' }}
          >
            <Flame className="text-danger" style={{ width: '50%', height: '50%' }} />
          </div>
          <div>
            <h2 className="font-black text-primary" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.75rem)' }}>پیشنهادهای ویژه</h2>
            <p className="text-text-secondary" style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.9rem)' }}>محصولات منتخب با تخفیف طلایی</p>
          </div>
        </div>
        <a href="/shop" className="text-accent hover:text-accent-dark font-black flex items-center gap-1 transition-all" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}>
          مشاهده همه
          <ChevronLeft style={{ width: 'clamp(0.8rem, 1.5vw, 1.2rem)' }} />
        </a>
      </div>

      <div
        ref={scrollRef}
        className="offers-scroll overflow-x-auto pb-6 select-none no-drag"
        style={{ cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-stretch gap-4 px-1 py-2 w-max">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0"
              style={{ width: 'clamp(150px, 18vw, 260px)' }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
