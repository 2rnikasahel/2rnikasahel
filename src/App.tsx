import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { AdminPanel } from './pages/AdminPanel';
import { NotFoundPage } from './pages/NotFoundPage';

import { RootProvider } from './context/RootProvider';
import { HelmetProvider } from 'react-helmet-async';

import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { BlogPage } from './pages/BlogPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ComparePage } from './pages/ComparePage';
import { ContactPage } from './pages/ContactPage';
import { PaymentPage } from './pages/PaymentPage';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';
import { WishlistPage } from './pages/WishlistPage';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomCartBar from './components/BottomCartBar';
import AIChatbot from './components/AIChatbot';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      <RootProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <BottomCartBar />
            <AIChatbot />
            
            {/* Temporary Admin Quick Access Button */}
            <Link 
              to="/admin" 
              className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-2xl hover:bg-primary-light transition-all border-2 border-white/20 group"
              title="ورود به پنل مدیریت"
            >
              <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          </div>
        </Router>
      </RootProvider>
    </HelmetProvider>
  );
}

export default App;
