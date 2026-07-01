import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'راهنمای کامل انتخاب پمپ استخر مناسب',
    excerpt: 'در این مقاله به بررسی نکات مهم در انتخاب پمپ تصفیه استخر می‌پردازیم و بهترین مدل‌ها را معرفی می‌کنیم.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop',
    date: '۱۵ آبان ۱۰۳',
    readTime: '۸ دقیقه مطالعه',
    category: 'استخر',
  },
  {
    id: 2,
    title: 'تفاوت لوله‌های PVC و پلی‌اتیلن چیست؟',
    excerpt: 'مقایسه جامع لوله‌های PVC و پلی‌اتیلن از نظر خواص فیزیکی، کاربرد و قیمت.',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0b6b?w=600&h=400&fit=crop',
    date: '۱۰ آبان ۱۴۰۳',
    readTime: '۶ دقیقه مطالعه',
    category: 'تأسیسات',
  },
  {
    id: 3,
    title: 'نکات مهم در نگهداری سیستم‌های گرمایشی',
    excerpt: 'راهنمای نگهداری و سرویس دوره‌ای پکیج، رادیاتور و سایر تجهیزات گرمایشی.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop',
    date: '۵ آبان ۱۴۰',
    readTime: '۱۰ دقیقه مطالعه',
    category: 'گرمایش',
  },
  {
    id: 4,
    title: 'بهترین تجهیزات فیلتراسیون استخر',
    excerpt: 'بررسی انواع فیلترهای شنی، کارتریجی و دیاتومه‌ای برای تصفیه آب استخر.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
    date: '۱ آبان ۱۴۳',
    readTime: '۷ دقیقه مطالعه',
    category: 'استخر',
  },
];

export function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6" aria-label="مسیر breadcrumb">
        <Link to="/" className="hover:text-accent">خانه</Link>
        <span>/</span>
        <span className="text-primary font-medium">بلاگ</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-3">بلاگ درنیکا</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">مطالب تخصصی و آموزشی درباره تأسیسات ساختمان، استخر و تجهیزات گرمایشی و سرمایشی</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-video overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-lg text-xs font-medium mb-3">{post.category}</span>
              <h2 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">{post.title}</h2>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                </div>
                <Link to="#" className="text-sm text-accent font-medium flex items-center gap-1 hover:text-accent-dark">
                  ادامه مطلب <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
