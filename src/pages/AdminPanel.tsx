import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, ShoppingBag, Users, Settings, Package,
  LayoutDashboard, ChevronRight, LogOut, BarChart3,
  Truck, Shield, Monitor, FileText, CreditCard,
  FolderTree, Sliders, LayoutPanelTop, MessageSquare, Mail, Key
} from 'lucide-react';
import CategoriesManager from '../components/admin/CategoriesManager';
import SliderManager from '../components/admin/SliderManager';
import HeaderManager from '../components/admin/HeaderManager';
import UndoRedoBar from '../components/admin/UndoRedoBar';
import CollapsibleSection from '../components/admin/CollapsibleSection';
import HomeCategorySectionManager from '../components/admin/HomeCategorySectionManager';
import HomeBrandsManager from '../components/admin/HomeBrandsManager';
import AboutManager from '../components/admin/AboutManager';
import FooterManager from '../components/admin/FooterManager';
import ProductsManager from '../components/admin/ProductsManager';
import ContactManager from '../components/admin/ContactManager';
import NotificationBell from '../components/admin/NotificationBell';
import PaymentGatewayManager from '../components/admin/PaymentGatewayManager';
import UsersManager from '../components/admin/UsersManager';
import SmsManager from '../components/admin/SmsManager';
import EmailManager from '../components/admin/EmailManager';
import GoogleOAuthManager from '../components/admin/GoogleOAuthManager';

const adminTabs = [
  { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard, section: 'تب داشبورد' },
  { id: 'header', label: 'هدر', icon: LayoutPanelTop, section: 'تب هدر' },
  { id: 'home', label: 'صفحه ۱ (خانه)', icon: Home, section: 'تب صفحه ۱' },
  { id: 'footer', label: 'فوتر و درباره ما', icon: LayoutDashboard, section: 'تب فوتر' },
  { id: 'slider', label: 'اسلایدر', icon: Sliders, section: 'تب اسلایدر' },
  { id: 'products', label: 'مدیریت محصولات', icon: Package, section: 'تب محصولات' },
  { id: 'users', label: 'مدیریت کاربران', icon: Users, section: 'تب کاربران' },
  { id: 'google', label: 'Google OAuth', icon: Key, section: 'تب گوگل' },
  { id: 'sms', label: 'مدیریت پیامک', icon: MessageSquare, section: 'تب پیامک' },
  { id: 'email', label: 'مدیریت ایمیل', icon: Mail, section: 'تب ایمیل' },
  { id: 'shop', label: 'صفحه ۳ (فروشگاه)', icon: ShoppingBag, section: 'تب صفحه ۳' },
  { id: 'categories', label: 'دسته‌بندی‌ها', icon: FolderTree, section: 'تب دسته‌بندی‌ها' },
  { id: 'about', label: 'صفحه درباره ما', icon: Users, section: 'تب درباره ما' },
  { id: 'contact', label: 'تماس با ما', icon: PhoneIcon, section: 'تب تماس با ما' },
  { id: 'blog', label: 'بلاگ', icon: FileText, section: 'تب بلاگ' },
  { id: 'orders', label: 'سفارشات', icon: Truck, section: 'تب سفارشات' },
  { id: 'payment', label: 'درگاه‌های پرداخت', icon: CreditCard, section: 'تب درگاه‌های پرداخت' },
  { id: 'settings', label: 'تنظیمات', icon: Settings, section: 'تب تنظیمات' },
];

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  );
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productActions, setProductActions] = useState<any>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">داشبورد ادمین</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'فروش امروز', value: '۱۲,۵۰۰,۰۰', change: '+۱۵%', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
                { label: 'سفارشات', value: '۲۴', change: '+۸%', icon: Package, color: 'from-green-500 to-green-600' },
                { label: 'محصولات', value: '۲,۴۵۶', change: '+۳', icon: ShoppingBag, color: 'from-purple-500 to-purple-600' },
                { label: 'مشتریان', value: '۵,۱۲', change: '+۱۲%', icon: Users, color: 'from-orange-500 to-orange-600' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-border/50">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{item.value}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.label}</p>
                  <span className="text-xs text-green-500 font-medium">{item.change}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">تنظیمات صفحه ۱ (خانه)</h2>
            <p className="text-sm text-text-secondary">تمامی تنظیمات مربوط به صفحه اصلی سایت از اینجا قابل ویرایش است.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
              <p className="font-bold mb-1">💡 توجه:</p>
              <p>برای مدیریت اسلایدر (افزودن، ویرایش، حذف اسلاید و تنظیم افکت‌ها) به <b>تب «اسلایدر»</b> در منوی سمت راست مراجعه کنید.</p>
            </div>

            <CollapsibleSection
              title="بخش دسته‌بندی محصولات صفحه خانه"
              icon={<FolderTree className="w-4 h-4" />}
              defaultOpen
            >
              <HomeCategorySectionManager />
            </CollapsibleSection>

            <CollapsibleSection
              title="برندهای ما (صفحه خانه)"
              icon={<Shield className="w-4 h-4" />}
            >
              <HomeBrandsManager />
            </CollapsibleSection>

            {/* Trust Badges Settings */}
            <div className="bg-white rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                تنظیمات باکس‌های اعتماد
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'عنوان باکس ۱', value: 'ارسال سریع' },
                  { label: 'توضیحات باکس ۱', value: 'ارسال به سراسر کشور در کوتاه‌ترین زمان ممکن' },
                  { label: 'عنوان باکس ۲', value: 'ضمانت اصالت کالا' },
                  { label: 'توضیحات باکس ۲', value: 'تضمین اصل بودن تمامی محصولات و برندها' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-primary mb-1">{item.label}</label>
                    <input type="text" defaultValue={item.value} className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'shop':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">تنظیمات صفحه ۳ (فروشگاه)</h2>
            <p className="text-sm text-text-secondary">تنظیمات صفحه فروشگاه و نمایش محصولات</p>
            <div className="bg-white rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-primary mb-4">نمایش محصولات</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">تعداد محصولات در هر صفحه</label>
                  <input type="number" defaultValue="12" className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div className="flex items-center justify-between p-3 bg-light-bg rounded-xl">
                  <span className="text-sm text-primary">نمایش فیلتر دسته‌بندی</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return <CategoriesManager />;

      case 'header':
        return <HeaderManager />;

      case 'slider':
        return <SliderManager />;

      case 'products':
        return <ProductsManager />;

      case 'users':
        return <UsersManager />;

      case 'google':
        return <GoogleOAuthManager />;

      case 'sms':
        return <SmsManager />;

      case 'email':
        return <EmailManager />;

      case 'footer':
        return (
          <div className="space-y-6">
            <FooterManager />
            <div className="border-t border-border/40 pt-6">
              <AboutManager />
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">تنظیمات صفحه درباره ما</h2>
            <div className="bg-white rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-primary mb-4">محتوای صفحه</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">عنوان اصلی</label>
                  <input type="text" defaultValue="درباره فروشگاه درنیکا" className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">متن معرفی</label>
                  <textarea rows={4} defaultValue="فروشگاه درنیکا با بیش از ۱۰ سال تجربه..." className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return <ContactManager />;

      case 'blog':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">تنظیمات بلاگ</h2>
            <div className="bg-white rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-primary mb-4">مدیریت مقالات</h3>
              <button className="bg-accent text-white px-4 py-2 rounded-xl text-sm hover:bg-accent-dark transition-colors">
                + ایجاد مقاله جدید
              </button>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">مدیریت سفارشات</h2>
            <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-light-bg">
                  <tr>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">شماره سفارش</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">مشتری</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">مبلغ</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#۱۲۳۴', name: 'علی محمدی', amount: '۷,۵۰۰,۰۰', status: 'تحویل شده' },
                    { id: '#۱۲۳۵', name: 'سارا احمدی', amount: '۳,۲۰۰,۰۰۰', status: 'در حال ارسال' },
                    { id: '#۱۲۳۶', name: 'رضا کریمی', amount: '۱۲,۸۰۰,۰۰', status: 'در انتظار پرداخت' },
                  ].map((order) => (
                    <tr key={order.id} className="border-t border-border/50">
                      <td className="px-4 py-3 text-primary font-medium">{order.id}</td>
                      <td className="px-4 py-3">{order.name}</td>
                      <td className="px-4 py-3">{order.amount} ریال</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs ${
                          order.status === 'تحویل شده' ? 'bg-green-100 text-green-700' :
                          order.status === 'در حال ارسال' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">مدیریت درگاه‌های پرداخت</h2>
            <p className="text-sm text-text-secondary">درگاه‌های پرداخت را فعال کنید و تنظیمات هر کدام را وارد کنید.</p>
            <PaymentGatewayManager />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">تنظیمات سایت</h2>
            <div className="bg-white rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                تنظیمات عمومی
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">نام سایت</label>
                  <input type="text" defaultValue="فروشگاه درنیکا" className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">توضیحات سایت (SEO)</label>
                  <textarea rows={3} defaultValue="فروشگاه درنیکا - مرجع تخصصی تاسیسات لوله‌کشی ساختمان و استخر" className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">کلیدواژه‌ها (SEO)</label>
                  <input type="text" defaultValue="تاسیسات, لوله کشی, استخر, لوازم استخری, گرمایش, سرمایش" className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-primary mb-4">نماد اعتماد (eNAMAD)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">کد نماد اعتماد</label>
                  <input type="text" defaultValue="" placeholder="کد نماد اعتماد خود را وارد کنید" className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">لینک تأییدیه</label>
                  <input type="url" defaultValue="" placeholder="https://enamad.ir/..." className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" dir="ltr" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-text-secondary">محتوای این بخش در حال توسعه است.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg" dir="rtl">
      {/* Admin Header - Sticky below site header */}
      <div
        className="sticky z-40 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
        style={{ top: 'var(--site-header-height, 0px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-light-bg transition-colors"
              aria-label="باز/بسته کردن منو"
            >
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-bold text-primary">پنل مدیریت درنیکا</h1>
          </div>
          <div className="flex items-center gap-3">
            {productActions ? (
              <>
                <button
                  onClick={productActions.cancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-light-bg transition-colors"
                >
                  <span>انصراف</span>
                </button>
                <button
                  onClick={productActions.save}
                  className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  <span>ذخیره پیش‌نویس</span>
                </button>
                <button
                  onClick={productActions.publish}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <span>انتشار محصول</span>
                </button>
              </>
            ) : (
              <>
                <UndoRedoBar />
                <NotificationBell />
                <Link to="/" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-light transition-colors">
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">مشاهده سایت</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-16'}`}>
          <nav
            className="bg-white rounded-2xl border border-border/50 p-3 sticky"
            style={{ top: 'calc(var(--site-header-height, 0px) + 64px)' }}
            aria-label="منوی ادمین"
          >
            {/* Sidebar Header with Toggle */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
              {sidebarOpen && <span className="text-sm font-bold text-primary">منوی ادمین</span>}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 rounded-xl bg-light-bg hover:bg-accent/10 text-text-secondary hover:text-accent transition-colors flex items-center justify-center"
                aria-label={sidebarOpen ? 'جمع کردن منو' : 'باز کردن منو'}
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {sidebarOpen ? (
              <div className="space-y-4">
                {/* Group 1: مدیریت اصلی */}
                <CollapsibleSection title="مدیریت اصلی" defaultOpen>
                  <ul className="space-y-1 pt-2">
                    {adminTabs.filter(tab => ['dashboard', 'header', 'home', 'footer', 'slider', 'users'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id !== 'products') setProductActions(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'bg-accent/10 text-accent font-medium'
                              : 'text-text-secondary hover:bg-light-bg hover:text-primary'
                          }`}
                        >
                          <tab.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{tab.label}</span>
                          {activeTab === tab.id && <ChevronRight className="w-4 h-4 mr-auto" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>

                {/* Group 2: فروشگاه و محصولات */}
                <CollapsibleSection title="فروشگاه و محصولات" defaultOpen>
                  <ul className="space-y-1 pt-2">
                    {adminTabs.filter(tab => ['products', 'shop', 'categories', 'orders', 'payment', 'sms', 'email', 'google'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id !== 'products') setProductActions(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'bg-accent/10 text-accent font-medium'
                              : 'text-text-secondary hover:bg-light-bg hover:text-primary'
                          }`}
                        >
                          <tab.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{tab.label}</span>
                          {activeTab === tab.id && <ChevronRight className="w-4 h-4 mr-auto" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>

                {/* Group 3: صفحات و محتوا */}
                <CollapsibleSection title="صفحات و محتوا" defaultOpen>
                  <ul className="space-y-1 pt-2">
                    {adminTabs.filter(tab => ['about', 'contact', 'blog', 'settings'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id !== 'products') setProductActions(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'bg-accent/10 text-accent font-medium'
                              : 'text-text-secondary hover:bg-light-bg hover:text-primary'
                          }`}
                        >
                          <tab.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{tab.label}</span>
                          {activeTab === tab.id && <ChevronRight className="w-4 h-4 mr-auto" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              </div>
            ) : (
              /* Collapsed State - only icons */
              <div className="space-y-2">
                {adminTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id !== 'products') setProductActions(null);
                    }}
                    className={`w-full h-11 rounded-xl flex items-center justify-center transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:bg-light-bg hover:text-primary'
                    }`}
                    title={tab.label}
                  >
                    <tab.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-border mt-4 pt-4">
              <Link
                to="/"
                className={`w-full ${sidebarOpen ? 'flex items-center gap-3 px-3 py-2.5 justify-start' : 'flex items-center justify-center h-11'} rounded-xl text-sm text-text-secondary hover:bg-light-bg hover:text-danger transition-colors`}
                title="خروج"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>خروج</span>}
              </Link>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-border/50 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
