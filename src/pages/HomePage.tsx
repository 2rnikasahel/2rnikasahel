import { Helmet } from 'react-helmet-async';
import HeroSlider from '../components/slider/HeroSlider';
import { useSlider } from '../context/SliderContext';
import TrustBadges from '../components/TrustBadges';
import Categories from '../components/Categories';
import SpecialOffers from '../components/SpecialOffers';
import Brands from '../components/Brands';
import AboutSection from '../components/AboutSection';

export function HomePage() {
  const { slides, settings } = useSlider();

  // تبدیل داده‌های اسلایدر قدیمی به اینترفیس جدید
  const mappedSlides = slides.map((slide) => ({
    id: slide.id,
    image: slide.image,
    alt: slide.title,
    badge: slide.badge,
    title: slide.title,
    subtitle: slide.subtitle,
    ctaPrimary: {
      label: slide.buttonText,
      href: slide.buttonLink,
    },
    align: 'right' as const,
  }));

  return (
    <>
      <Helmet>
        <title>فروشگاه درنیکا | مرجع تخصصی تأسیسات و تجهیزات ساختمان و استخر</title>
        <meta name="description" content="خرید آنلاین انواع لوله و اتصالات، شیرآلات، پکیج، رادیاتور، لوازم استخر و تجهیزات تأسیساتی با بهترین قیمت و ضمانت اصالت کالا در فروشگاه درنیکا." />
        <meta property="og:title" content="فروشگاه درنیکا | مرجع تخصصی تأسیسات و تجهیزات ساختمان" />
        <meta property="og:description" content="خرید آنلاین انواع لوله و اتصالات، شیرآلات، پکیج، رادیاتور و لوازم استخر با بهترین قیمت." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dornika.com" />
        <meta property="og:image" content="https://dornika.com/og-image.jpg" />
      </Helmet>
      <div>
        <HeroSlider 
          slides={mappedSlides} 
          autoplayDelay={settings.autoPlayDelay} 
        />
        <TrustBadges />
        <Categories />
        <SpecialOffers />
        <Brands />
        <AboutSection />
      </div>
    </>
  );
}
