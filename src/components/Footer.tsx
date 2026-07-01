import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useFooter } from '../context/FooterContext';
import { useHeader } from '../context/HeaderContext';

export default function Footer() {
  const { settings } = useFooter();
  const { settings: headerSettings } = useHeader();
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scale, setScale] = useState(1);
  const [renderedHeight, setRenderedHeight] = useState(0);

  const DESKTOP_WIDTH = 1280;
  const MOBILE_CANVAS_WIDTH = 650;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      
      let currentScale = 1;
      if (width < DESKTOP_WIDTH) {
        const targetWidth = isMobile ? MOBILE_CANVAS_WIDTH : 980;
        currentScale = width / targetWidth;
      }
      setScale(currentScale);

      if (innerRef.current) {
        // محاسبه دقیق ارتفاع بر اساس محتوای واقعی
        const height = innerRef.current.getBoundingClientRect().height;
        setRenderedHeight(height);
        document.documentElement.style.setProperty('--site-footer-height', `${height}px`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 150); // زمان بیشتر برای اطمینان از رندر لایه‌ها
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [settings, headerSettings]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef} 
      className="bg-[#0B1120] text-white relative overflow-hidden" 
      role="contentinfo" 
      dir="rtl"
      style={{ height: renderedHeight > 0 ? `${renderedHeight}px` : 'auto' }}
    >
      <div 
        ref={innerRef}
        style={{ 
          transform: scale < 1 ? `scale(${scale})` : 'none', 
          transformOrigin: 'top right',
          width: scale < 1 ? (window.innerWidth < 768 ? `${MOBILE_CANVAS_WIDTH}px` : '980px') : '100%',
          position: 'absolute',
          right: 0,
          top: 0
        }}
        className="transition-transform duration-100 ease-out"
      >
        {/* حذف پدینگ پایینی برای چسبیدن متن کپی‌رایت به انتهای فوتر */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-0">
          <div className="grid grid-cols-4 gap-8 mb-12">
            
            {/* Column 1 */}
            <div className="space-y-6 text-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">درنیکا</h2>
                  <p className="text-xs text-gray-400 mt-1">تأسیسات و تجهیزات ساختمان</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                فروشگاه درنیکا، مرجع تخصصی تأمین تجهیزات تأسیسات لوله‌کشی ساختمان، استخر و لوازم استخری، سیستم‌های گرمایش و سرمایش.
              </p>
              <div className="space-y-4 pt-4 border-t border-white/5">
                {settings.phones.map((phone: any) => (
                  <div key={phone.id} className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-medium">{phone.label}</span>
                    <div className="flex items-center gap-2.5 text-gray-200 text-lg font-bold">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <span dir="ltr" className="tracking-wider">{phone.number}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span dir="ltr" className="font-mono">{settings.email}</span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-400 text-sm leading-relaxed">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span>{settings.address}</span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="text-right pr-8">
              <h3 className="font-bold text-lg text-white mb-8">دسترسی سریع</h3>
              <ul className="space-y-4">
                {[{ label: 'فروشگاه', path: '/shop' }, { label: 'بلاگ', path: '/blog' }, { label: 'درباره ما', path: '/about' }, { label: 'تماس با ما', path: '/contact' }, { label: 'حساب کاربری', path: '/admin' }].map((item) => (
                  <li key={item.path}><Link to={item.path} className="text-sm text-gray-400 hover:text-white transition-colors block">{item.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="text-right">
              <h3 className="font-bold text-lg text-white mb-8">دسته‌بندی‌ها</h3>
              <ul className="space-y-4 mb-10">
                {['تأسیسات و لوله‌کشی', 'لوازم و تجهیزات استخر', 'گرمایش ساختمان', 'سرمایش ساختمان', 'اتصالات و شیرآلات'].map((cat) => (
                  <li key={cat}><Link to="/shop" className="text-sm text-gray-400 hover:text-white transition-colors block">{cat}</Link></li>
                ))}
              </ul>
              <div className="flex justify-start">
                {settings.enamad?.code ? (
                  <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-2xl" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings.enamad.code) }} />
                ) : (
                  <div className="w-24 h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shadow-inner"><span className="text-3xl font-serif italic text-gray-500">e</span></div>
                )}
              </div>
            </div>

            {/* Column 4 */}
            <div className="text-right pl-4">
              <h3 className="font-bold text-lg text-white mb-8">خدمات مشتریان</h3>
              <ul className="space-y-4">
                {['پیگیری سفارش', 'رویه ارسال کالا', 'ضمانت بازگشت', 'سوالات متداول', 'حریم خصوصی'].map((item) => (
                  <li key={item}><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors block">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* نوار کپی‌رایت با حداقل فاصله از محتوا و لبه پایین */}
          <div className="border-t border-white/5 pt-6 pb-4">
            <p className="text-center text-[10px] text-gray-500 m-0">
              © {settings.copyrightText.replace('درنیکا', headerSettings.logoTitle)}
            </p>
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed right-6 bottom-6 z-[60] w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
}
