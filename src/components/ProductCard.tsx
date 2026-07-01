import { memo } from 'react';
import { ShoppingCart, Layers3, Heart, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useWishlist } from '../context/WishlistContext';
import { useComparison } from '../context/ComparisonContext';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating?: number;
  discount?: number;
  badge?: string;
}

const ProductCard = memo(function ProductCard({
  id, name, price, originalPrice, image,
  discount = 25, badge = 'پیشنهاد ویژه',
}: ProductCardProps) {
  const { addItem } = useCart();
  const { getProductById } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useComparison();
  const navigate = useNavigate();
  const formatPrice = (p: number) => p.toLocaleString('fa-IR');
  const isLiked = isInWishlist(id);
  const isCompared = isInCompare(id);

  const sourceProduct = getProductById(id);
  const hasVariations = !!sourceProduct?.variations && sourceProduct.variations.length > 0;
  
  const displayPrice = price;

  return (
    <article
      className="product-card bg-white rounded-2xl overflow-hidden border border-border/60 hover:border-accent/35 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer group"
      role="article"
      aria-label={name}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Image Area - Much taller like desktop (Aspect 3:4) */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0 border-b border-border/30">
        <OptimizedImage
          src={image}
          alt={name}
          draggable={false}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none no-drag"
        />
        
        {/* Floating Icons - Scaled for Mobile */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1.5 sm:gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(id);
            }}
            className="w-6 h-6 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
            aria-label={isLiked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          >
            <Heart 
              className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-text-secondary hover:text-red-500'}`} 
              style={{ width: '50%', height: '50%' }}
            />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(id);
            }}
            className={`w-6 h-6 sm:w-10 sm:h-10 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all ${isCompared ? 'bg-accent text-white' : 'bg-white/90 text-text-secondary hover:text-accent'}`}
            aria-label={isCompared ? "حذف از مقایسه" : "افزودن به مقایسه"}
          >
            <GitCompare style={{ width: '50%', height: '50%' }} />
          </button>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex flex-col gap-1">
            <span className="bg-danger text-white font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-sm select-none" style={{ fontSize: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
              %{discount}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2 sm:p-4 flex flex-col min-h-0 bg-white relative z-10">
        <h3 
          className="font-bold text-primary leading-tight mb-2 product-title-clamp select-none no-drag"
          style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.9rem)' }}
        >
          {name}
        </h3>

        <div className="mt-auto pt-2 border-t border-border/30">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex flex-col min-w-0">
              {originalPrice > price && (
                <span className="text-text-secondary line-through mb-0.5 select-none opacity-60" style={{ fontSize: 'clamp(0.5rem, 0.9vw, 0.75rem)' }}>
                  {formatPrice(originalPrice)}
                </span>
              )}
              <div className="flex items-center gap-0.5">
                <span className="font-black text-primary select-none truncate" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1.125rem)' }}>
                  {formatPrice(displayPrice)}
                </span>
                <span className="text-text-secondary font-medium" style={{ fontSize: 'clamp(0.45rem, 0.8vw, 0.65rem)' }}>ریال</span>
              </div>
            </div>
            {hasVariations ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${id}`);
                }}
                className="bg-light-bg text-primary border border-border rounded-lg sm:rounded-xl hover:border-accent hover:text-accent transition-all duration-300 flex-shrink-0 flex items-center justify-center"
                style={{ width: 'clamp(1.75rem, 3.5vw, 2.75rem)', height: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
              >
                <Layers3 style={{ width: '50%', height: '50%' }} />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addItem({ id, productId: id, name, price: displayPrice, originalPrice, image });
                }}
                className="bg-primary text-white rounded-lg sm:rounded-xl hover:bg-accent transition-all duration-300 flex-shrink-0 shadow-sm flex items-center justify-center"
                style={{ width: 'clamp(1.75rem, 3.5vw, 2.75rem)', height: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
              >
                <ShoppingCart style={{ width: '50%', height: '50%' }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
