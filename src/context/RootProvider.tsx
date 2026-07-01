import { ReactNode } from 'react';
import { HistoryProvider, AppState } from './HistoryContext';
import { HeaderProvider, defaultHeaderSettings } from './HeaderContext';
import { SliderProvider, defaultSliderState } from './SliderContext';
import { CategoriesProvider, defaultCategories } from './CategoriesContext';
import { HomeProvider, defaultHomeSettings } from './HomeContext';
import { AboutProvider, defaultAboutSettings } from './AboutContext';
import { FooterProvider, defaultFooterSettings } from './FooterContext';
import { ProductsProvider, defaultProducts } from './ProductsContext';
import { ContactProvider } from './ContactContext';
import { PaymentProvider } from './PaymentContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { ComparisonProvider } from './ComparisonContext';
import { NotificationsProvider } from './NotificationsContext';
import { ThemeProvider } from './ThemeContext';
import { VariationsLibraryProvider } from './VariationsLibraryContext';
import { defaultPaymentSettings } from '../types/PaymentGateway';

const initialState: AppState = {
  header: defaultHeaderSettings,
  slider: defaultSliderState,
  categories: defaultCategories,
  home: defaultHomeSettings,
  about: defaultAboutSettings,
  footer: defaultFooterSettings,
  products: defaultProducts,
  contact: {},
  paymentSettings: defaultPaymentSettings,
};

export const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <HistoryProvider initialState={initialState}>
      <ThemeProvider>
        <NotificationsProvider>
          <VariationsLibraryProvider>
            <HeaderProvider>
              <SliderProvider>
                <CategoriesProvider>
                  <HomeProvider>
                    <AboutProvider>
                      <FooterProvider>
                        <ProductsProvider>
                          <ContactProvider>
                            <PaymentProvider>
                              <CartProvider>
                                <WishlistProvider>
                                  <ComparisonProvider>
                                    {children}
                                  </ComparisonProvider>
                                </WishlistProvider>
                              </CartProvider>
                            </PaymentProvider>
                          </ContactProvider>
                        </ProductsProvider>
                      </FooterProvider>
                    </AboutProvider>
                  </HomeProvider>
                </CategoriesProvider>
              </SliderProvider>
            </HeaderProvider>
          </VariationsLibraryProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </HistoryProvider>
  );
};
