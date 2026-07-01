import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Moon, Sun, MapPin, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import MegaMenu from './MegaMenu';
import { useTheme } from '../context/ThemeContext';
import { useHeader } from '../context/HeaderContext';
import { useWishlist } from '../context/WishlistContext';
import CartPopup from './CartPopup';
import AboutPopup from './AboutPopup';
import ContactModal from './ContactModal';
import AuthModal from './AuthModal';
import UserProfileModal from './UserProfileModal';
import SearchOverlay from './SearchOverlay';
import BrandLogo from './BrandLogo';
import WishlistPopup from './WishlistPopup';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [aboutPopupOpen, setAboutPopupOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('auth_token');
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, totalPrice, setShowBottomBar } = useCart();
  const { wishlist } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const { settings } = useHeader();
  const location = useLocation();
  const navigate = useNavigate();

  const [scale, setScale] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [renderedHeight, setRenderedHeight] = useState(0);

  const DESKTOP_WIDTH = 1280;
  const MOBILE_CANVAS_WIDTH = 850;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      setIsSmallScreen(isMobile);

      let currentScale = 1;
      if (width < DESKTOP_WIDTH) {
        const targetWidth = isMobile ? MOBILE_CANVAS_WIDTH : 980;
        currentScale = width / targetWidth;
      }
      setScale(currentScale);

      if (innerRef.current) {
        const height = innerRef.current.offsetHeight * currentScale;
        setRenderedHeight(height);
        document.documentElement.style.setProperty('--site-header-height', `${height}px`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [settings.topBarEnabled, scale]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAboutClick = (e: React.MouseEvent, path: string) => {
    if (path === '/about') {
      e.preventDefault();
      if (location.pathname === '/') {
        const aboutEl = document.getElementById('about-section');
        if (aboutEl) {
          const headerHeight = renderedHeight;
          const elementTop = aboutEl.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementTop - headerHeight, behavior: 'smooth' });
        }
      } else {
        setAboutPopupOpen(true);
      }
    } else {
      e.preventDefault();
      navigate(path);
    }
  };

  const handleContactClick = (e: React.MouseEvent, path: string) => {
    if (path === '/contact') {
      e.preventDefault();
      if (location.pathname === '/') navigate(path);
      else setContactModalOpen(true);
    } else {
      e.preventDefault();
      navigate(path);
    }
  };

  const navItems = settings.navItems || [];

  const headerSurface = isDark
    ? 'bg-slate-950/90 border-slate-800 shadow-2xl backdrop-blur-xl'
    : 'bg-white border-border shadow-sm';

  return (
    <header ref={headerRef} className="sticky top-0 z-[100] w-full" style={{ height: `${renderedHeight}px` }}>
      <div 
        ref={innerRef}
        style={{ 
          transform: scale < 1 ? `scale(${scale})` : 'none', 
          transformOrigin: 'top right',
          width: scale < 1 ? (isSmallScreen ? `${MOBILE_CANVAS_WIDTH}px` : `${DESKTOP_WIDTH}px`) : '100%',
          position: 'absolute',
          right: 0,
          top: 0
        }}
        className="transition-transform duration-100 ease-out"
      >
        {/* Top Bar */}
        {settings.topBarEnabled && (
          <div className={`text-white text-xs py-2.5 ${isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-primary'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-medium text-sm">{settings.topBarRightText}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm">{settings.topBarLeftText}</span>
                </div>
                <div className="h-4 w-px bg-white/20 mx-2"></div>
                <span className="font-bold text-sm tracking-widest" dir="ltr">{settings.supportPhone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Row */}
        <div className={`transition-all border-b ${headerSurface} ${scrolled ? 'py-2' : 'py-4'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between gap-8 h-12">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <BrandLogo variant="header" isDark={isDark} />
              </Link>

              {/* Search Bar Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex-1 max-w-2xl flex items-center gap-4 bg-light-bg border border-border rounded-2xl py-3 px-5 text-sm text-text-secondary hover:border-accent transition-all group"
              >
                <Search className="w-5 h-5" />
                <span className="flex-1 text-right">جستجوی هوشمند کالا، برند یا دسته‌بندی...</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={toggleTheme}
                  className={`group relative h-11 w-[100px] overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isDark ? 'border-slate-700 bg-slate-900' : 'border-amber-200 bg-white shadow-sm'
                  }`}
                >
                  <span className={`absolute inset-0 ${isDark ? 'bg-blue-500/10' : 'bg-amber-500/5'}`} />
                  <span className={`absolute top-1 h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDark ? 'right-[54px] bg-blue-500/20 text-blue-300' : 'right-1 bg-amber-50 text-amber-500 shadow-sm'
                  }`}>
                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </span>
                  <span className={`absolute top-1/2 -translate-y-1/2 text-[11px] font-black ${isDark ? 'right-3.5 text-slate-200' : 'left-3.5 text-slate-700'}`}>
                    {isDark ? 'تیره' : 'روشن'}
                  </span>
                </button>

                <button
                  onClick={() => setWishlistOpen(true)}
                  className="group relative flex items-center justify-center w-11 h-11 rounded-2xl border border-border bg-light-bg hover:border-red-50 transition-all flex-shrink-0"
                >
                  <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-text-secondary group-hover:text-red-500'}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center font-bold ring-4 ring-white dark:ring-slate-950">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setShowBottomBar(false); setCartOpen(true); }}
                  className="group relative flex items-center gap-3 h-11 rounded-2xl border border-border bg-light-bg hover:border-accent px-4 transition-all"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-primary group-hover:text-accent" />
                    {totalItems > 0 && (
                      <span className="absolute -top-3 -left-3 bg-danger text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-text-secondary mb-0.5">سبد خرید</span>
                    <span className="text-sm font-black text-primary">
                      {totalItems > 0 ? `${totalPrice.toLocaleString('fa-IR')} ریال` : 'خالی'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => isLoggedIn ? setProfileModalOpen(true) : setAuthModalOpen(true)}
                  className={`flex items-center gap-2.5 h-11 rounded-2xl px-5 text-sm font-black transition-all ${
                    isLoggedIn ? 'bg-accent text-white hover:bg-accent-dark' : 'bg-primary text-white hover:bg-primary-light'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>{isLoggedIn ? 'پنل کاربری' : 'ورود / عضویت'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Row */}
        <nav className={`border-b transition-colors ${isDark ? 'bg-slate-950/85 border-slate-800' : 'bg-white border-border'} backdrop-blur-md`}>
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4">
            <MegaMenu />
            <div className="h-6 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-2">
              {navItems.map((item: any) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => item.path === '/contact' ? handleContactClick(e, item.path) : handleAboutClick(e, item.path)}
                  className={`px-5 py-2.5 text-sm font-bold transition-all rounded-xl ${
                    location.pathname === item.path ? 'text-accent bg-accent/10' : 'text-text-primary hover:text-accent hover:bg-light-bg'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <CartPopup isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AboutPopup isOpen={aboutPopupOpen} onClose={() => setAboutPopupOpen(false)} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(true)} />
      <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <WishlistPopup isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </header>
  );
}
