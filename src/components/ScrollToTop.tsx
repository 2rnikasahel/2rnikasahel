import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * با هر تغییر مسیر، صفحه را به بالا اسکرول می‌کند.
 * این کامپوننت باید داخل Router و قبل از Routes قرار گیرد.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // اسکرول فوری به بالای صفحه با هر تغییر مسیر
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
