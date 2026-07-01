import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Heart, Share2, Truck, ShieldCheck, RotateCcw, Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import VariationSelector from '../components/VariationSelector';
import GalleryModal from '../components/GalleryModal';
import OptimizedImage from '../components/OptimizedImage';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const { addItem } = useCart();
  
  const product = id ? getProductById(Number(id)) : products[0]; // Fallback to first product if not found
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariations, setSelectedVariations] = useState<Record<number, string>>({});
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const thumbContainerRef = useRef<HTMLDivElement>(null);
  const thumbDragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const currentPrice = (() => {
    if (!product) return 0;
    let basePrice = product.price;
    if (product.variations) {
      for (const variation of product.variations) {
        const selectedName = selectedVariations[variation.id];
        if (selectedName) {
          const option = variation.options.find((o: any) => o.name === selectedName);
          if (option?.price && option.price > 0) {
            basePrice = option.price;
            break; 
          }
        }
      }
    }
    return basePrice;
  })();

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | فروشگاه تأسیسات درنیکا`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      const rawText = product.description.replace(/<[^>]*>/g, ''); 
      metaDesc.setAttribute('content', rawText.substring(0, 160));
    }
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedVariations({});
  }, [id]);

  if (!product) return <div className="text-center py-20">محصول یافت نشد</div>;

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description.replace(/<[^>]*>/g, ''),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'درنیکا',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: currentPrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount || 1,
    },
  };

  const formatPrice = (p: number) => p.toLocaleString('fa-IR');

  const handleAddToCart = () => {
    const selectedVariationDetails = product.variations
      ?.filter((v: any) => selectedVariations[v.id])
      .map((v: any) => {
        const optName = selectedVariations[v.id];
        const opt = v.options.find((o: any) => o.name === optName);
        return {
          variationName: v.name,
          optionName: optName,
          sku: opt?.sku,
        };
      }) || [];

    const variationSuffix = selectedVariationDetails.map((v: any) => v.optionName).join(' / ');
    const displayName = variationSuffix
      ? `${product.name} - ${variationSuffix}`
      : product.name;

    const variationKey = selectedVariationDetails.map((v: any) => v.optionName).join('|');
    const uniqueId = variationKey
      ? product.id * 10000 + Math.abs(hashCode(variationKey))
      : product.id;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: uniqueId,
        productId: product.id,
        name: displayName,
        price: currentPrice,
        originalPrice: product.originalPrice,
        image: product.images[0],
        variations: selectedVariationDetails,
      });
    }
  };

  function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash) % 10000;
  }

  const handleVariationChange = (variationId: number, optionName: string) => {
    setSelectedVariations(prev => ({ ...prev, [variationId]: optionName }));
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | خرید از فروشگاه درنیکا</title>
        <meta name="description" content={product.shortDescription || `خرید ${product.name} با بهترین قیمت و ضمانت اصالت کالا در فروشگاه درنیکا.`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.shortDescription || `خرید ${product.name} با بهترین قیمت.`} />
        <meta property="og:image" content={product.images?.[0] || '/default-og.jpg'} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={currentPrice.toString()} />
        <meta property="product:price:currency" content="IRR" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-10">
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>

      <nav className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-text-secondary mb-4 sm:mb-6 flex-wrap" aria-label="مسیر">
        <Link to="/" className="hover:text-accent transition-colors">خانه</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-accent transition-colors">فروشگاه</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-accent transition-colors">{product.categories?.[0] || 'تجهیزات'}</Link>
        <span>/</span>
        <span className="text-primary font-medium truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 mb-8 sm:mb-16">
        <div className="lg:col-span-5 flex flex-col gap-2 sm:gap-4">
          <div 
            className="aspect-square bg-white rounded-2xl sm:rounded-3xl border border-border/50 overflow-hidden flex items-center justify-center p-4 sm:p-6 group relative shadow-sm hover:shadow-md transition-shadow duration-300"
            style={{ contentVisibility: 'auto' }}
          >
            {product.discount > 0 && (
              <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-danger text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl z-10 shadow-md">
                %{product.discount} تخفیف
              </span>
            )}
            
            <div 
              className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-zoom-in"
              onClick={() => setGalleryModalOpen(true)}
            >
              <OptimizedImage
                src={product.images[selectedImage] || product.images[0]}
                alt={`${product.name} - تصویر اصلی (برای بزرگنمایی کلیک کنید)`}
                className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-125"
                loading="eager"
              />
            </div>

            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
              <button 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-text-secondary hover:text-danger hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-md border border-border/20" 
                aria-label="افزودن به علاقه‌مندی‌ها"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-text-secondary hover:text-accent hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-md border border-border/20" 
                aria-label="اشتراک‌گذاری محصول"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex justify-between items-center px-1.5 sm:px-2 pointer-events-none select-none">
              <span className="text-[8px] sm:text-[10px] font-bold text-text-secondary bg-white/80 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-border/30">
                {(selectedImage + 1).toLocaleString('fa-IR')} از {product.images.length.toLocaleString('fa-IR')}
              </span>
            </div>
          </div>

          <div
            ref={thumbContainerRef}
            className="flex gap-1.5 sm:gap-2.5 overflow-x-auto pb-2 pt-1 scroll-smooth select-none category-horizontal-scroll cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={(e) => {
              const el = thumbContainerRef.current;
              if (!el) return;
              thumbDragState.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft };
              el.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const el = thumbContainerRef.current;
              if (!el || !thumbDragState.current.active) return;
              const dx = e.clientX - thumbDragState.current.startX;
              el.scrollLeft = thumbDragState.current.scrollLeft - dx;
            }}
            onPointerUp={(e) => {
              const el = thumbContainerRef.current;
              if (!el) return;
              thumbDragState.current.active = false;
              try { el.releasePointerCapture(e.pointerId); } catch {}
            }}
            onPointerLeave={(e) => {
              const el = thumbContainerRef.current;
              if (!el) return;
              thumbDragState.current.active = false;
              try { el.releasePointerCapture(e.pointerId); } catch {}
            }}
          >
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl sm:rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  selectedImage === idx 
                    ? 'border-accent ring-2 sm:ring-4 ring-accent/15 scale-95 shadow-sm' 
                    : 'border-border/60 hover:border-accent/40 bg-white hover:scale-102'
                }`}
                aria-label={`نمایش تصویر ${idx + 1}`}
                aria-current={selectedImage === idx ? 'true' : 'false'}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <OptimizedImage 
                  src={img} 
                  alt={`${product.name} - بندانگشتی ${idx + 1}`} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${selectedImage === idx ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} 
                  onPointerDown={(e) => e.stopPropagation()}
                />
                {selectedImage === idx && (
                  <span className="absolute inset-0 bg-accent/5 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-primary mb-2 sm:mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-amber-700">{product.rating}</span>
              <span className="text-[10px] sm:text-xs text-amber-600/80">({product.reviewsCount} دیدگاه)</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-text-secondary">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span>{product.inStock ? 'موجود در انبار' : 'ناموجود'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-text-secondary">
              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span>ضمانت اصالت کالا</span>
            </div>
          </div>

          {product.shortDescription && (
            <div className="mb-4 sm:mb-8">
              <h3 className="text-xs sm:text-sm font-bold text-primary mb-2 sm:mb-3 flex items-center gap-2">
                <span className="w-0.5 sm:w-1 h-3 sm:h-5 bg-accent rounded-full" />
                معرفی کوتاه محصول
              </h3>
              <div
                className="text-[10px] sm:text-sm text-text-secondary leading-relaxed bg-light-bg/50 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-border/30"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            </div>
          )}

          {product.variations && product.variations.length > 0 && (
            <div className="mb-4 sm:mb-8 space-y-2 sm:space-y-4">
              {product.variations.map((variation: any) => (
                <VariationSelector
                  key={variation.id}
                  variation={variation}
                  selectedValue={selectedVariations[variation.id] || ''}
                  onSelect={(optName) => handleVariationChange(variation.id, optName)}
                  productId={product.id}
                  productName={product.name}
                  productImage={product.images[0]}
                  productOriginalPrice={product.originalPrice}
                  productBasePrice={product.price}
                />
              ))}
            </div>
          )}

          {product.variations && product.variations.length > 0 ? (
            <div className="bg-accent/5 rounded-2xl sm:rounded-3xl border border-accent/20 p-3 sm:p-5 md:p-6 mb-4 sm:mb-8 text-center">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm font-bold text-primary mb-1">
                برای خرید، تنوع مورد نظر را انتخاب کنید
              </p>
              <p className="text-[10px] sm:text-xs text-text-secondary">
                از منوهای بالا تنوع محصول را باز کنید و با دکمه «افزودن به سبد» کنار هر گزینه، آن را به سبد خرید اضافه کنید.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-border/60 p-3 sm:p-5 md:p-6 shadow-sm mb-4 sm:mb-8">
              <div className="flex items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
                <div>
                  {product.originalPrice > product.price && (
                    <p className="text-xs sm:text-sm text-text-secondary line-through mb-0.5 sm:mb-1">{formatPrice(product.originalPrice)} ریال</p>
                  )}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-primary">{formatPrice(product.price)}</p>
                    <span className="text-xs sm:text-sm text-text-secondary font-medium">ریال</span>
                  </div>
                  {product.sku && (
                    <p className="text-[8px] sm:text-[10px] text-text-secondary mt-1 sm:mt-2">کد کالا: <span dir="ltr" className="font-mono">{product.sku}</span></p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="flex items-center justify-between bg-light-bg rounded-xl sm:rounded-2xl border border-border/50 p-1 sm:p-1.5 sm:w-32 md:w-40">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-lg sm:rounded-xl shadow-sm text-text-secondary hover:text-primary transition-colors"
                    aria-label="کاهش تعداد"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-base sm:text-lg font-bold text-primary w-6 sm:w-8 text-center">{quantity.toLocaleString('fa-IR')}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-lg sm:rounded-xl shadow-sm text-text-secondary hover:text-primary transition-colors"
                    aria-label="افزایش تعداد"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-4 sm:px-6 font-bold text-xs sm:text-base hover:bg-accent transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 bg-light-bg/50 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-border/30">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-primary">ارسال سریع</p>
                <p className="text-[8px] sm:text-[10px] text-text-secondary">{product.shippingTime || 'تحویل ۲۴ تا ۷۲ ساعته'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-light-bg/50 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-border/30">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 text-green-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-primary">ضمانت اصالت</p>
                <p className="text-[8px] sm:text-[10px] text-text-secondary">تضمین ۱۰۰٪ کالا</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-light-bg/50 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-border/30">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 text-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-primary">گارانتی</p>
                <p className="text-[8px] sm:text-[10px] text-text-secondary">{product.warranty || '۷ روز ضمانت بازگشت'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 sm:mb-16">
        <div className="flex items-center gap-3 sm:gap-6 border-b border-border mb-4 sm:mb-8 overflow-x-auto">
          {[
            { id: 'description', label: 'توضیحات محصول' },
            { id: 'specs', label: 'مشخصات فنی' },
            { id: 'reviews', label: 'نظرات کاربران' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 sm:pb-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-accent' : 'text-text-secondary hover:text-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[150px] sm:min-h-[200px]">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none text-text-secondary leading-7 sm:leading-8 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <div className="border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden">
                {product.specs.map((feature: any, idx: number) => (
                  <div key={idx} className={`flex items-center p-2 sm:p-4 ${idx !== product.specs.length - 1 ? 'border-b border-border/50' : ''} ${idx % 2 === 0 ? 'bg-light-bg/30' : 'bg-white'}`}>
                    <span className="w-1/3 text-xs sm:text-sm font-bold text-primary">{feature.key}</span>
                    <span className="w-2/3 text-xs sm:text-sm text-text-secondary">{feature.value}</span>
                  </div>
                ))}
                {product.specs.length === 0 && <p className="p-4 sm:p-8 text-center text-text-secondary text-xs sm:text-sm">مشخصات فنی ثبت نشده است.</p>}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 sm:py-12 bg-light-bg/30 rounded-2xl border border-border/30 border-dashed">
              <p className="text-text-secondary mb-2 sm:mb-4 text-xs sm:text-sm">هنوز نظری برای این محصول ثبت نشده است.</p>
              <button className="text-accent font-medium text-xs sm:text-sm hover:underline">اولین نفری باشید که نظر می‌دهد</button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-base sm:text-xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-1 sm:w-1.5 h-4 sm:h-6 bg-accent rounded-full" />
          محصولات مرتبط
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {products.filter((p: any) => p.id !== product.id).slice(0, 4).map((p: any) => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} originalPrice={p.originalPrice} image={p.images[0]} rating={p.rating} discount={p.discount} badge="محصول مرتبط" />
          ))}
        </div>
      </div>

      <GalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        images={product.images}
        activeIndex={selectedImage}
        onIndexChange={(idx) => setSelectedImage(idx)}
      />
      </div>
    </>
  );
}
