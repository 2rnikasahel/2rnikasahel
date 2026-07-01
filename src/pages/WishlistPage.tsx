import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';

export function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { products } = useProducts();

  const wishlistProducts = products.filter((p: any) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          لیست علاقه‌مندی‌ها
          <span className="text-sm font-normal text-text-secondary bg-light-bg px-3 py-1 rounded-full mr-2">
            {wishlist.length.toLocaleString('fa-IR')} محصول
          </span>
        </h1>
        <Link to="/shop" className="text-sm text-accent hover:text-accent-dark flex items-center gap-1 font-medium">
          بازگشت به فروشگاه
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product: any) => (
            <div key={product.id} className="relative group">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.images[0]}
                rating={product.rating}
                discount={product.discount}
              />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 left-2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                aria-label="حذف از علاقه‌مندی‌ها"
              >
                <Heart className="w-4 h-4 fill-red-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-border/50 shadow-sm">
          <div className="w-24 h-24 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-text-secondary/30" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">لیست علاقه‌مندی‌های شما خالی است</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            محصولاتی که دوست دارید را با کلیک روی آیکون قلب ذخیره کنید تا بعداً راحت‌تر آن‌ها را پیدا کنید.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="w-5 h-5" />
            مشاهده فروشگاه
          </Link>
        </div>
      )}
    </div>
  );
}
