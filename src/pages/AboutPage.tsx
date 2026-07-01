import { Link } from 'react-router-dom';
import { Users, Award, Package, TrendingUp } from 'lucide-react';

export function AboutPage() {
  const stats = [
    { icon: Users, value: '+۵۰۰۰', label: 'مشتری راضی' },
    { icon: Award, value: '+۱۰', label: 'سال تجربه' },
    { icon: Package, value: '+۲۰۰۰', label: 'محصول متنوع' },
    { icon: TrendingUp, value: '+۵۰', label: 'برند معتبر' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6" aria-label="مسیر breadcrumb">
        <Link to="/" className="hover:text-accent">خانه</Link>
        <span>/</span>
        <span className="text-primary font-medium">درباره ما</span>
      </nav>

      {/* Hero */}
      <div className="bg-primary text-white rounded-3xl overflow-hidden mb-10">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">درباره فروشگاه درنیکا</h1>
            <p className="text-gray-300 leading-relaxed mb-6">
              فروشگاه درنیکا با بیش از ۱۰ سال تجربه در زمینه تأمین تجهیزات تأسیسات ساختمانی، استخر و سیستم‌های گرمایشی و سرمایشی، یکی از معتبرترین فروشگاه‌های تخصصی در ایران است.
            </p>
            <p className="text-gray-300 leading-relaxed">
              ما متعهد به ارائه بهترین محصولات با قیمت مناسب و ضمانت اصالت هستیم. تیم تخصصی ما آماده ارائه مشاوره رایگان به شما عزیزان می‌باشد.
            </p>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=500&fit=crop" alt="درباره درنیکا" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 text-center border border-border/50 hover:border-accent/30 transition-all">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <stat.icon className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="bg-white rounded-2xl p-8 border border-border/50 mb-10">
        <h2 className="text-xl font-bold text-primary mb-4">مأموریت ما</h2>
        <p className="text-text-secondary leading-relaxed">
          مأموریت ما تأمین بهترین تجهیزات تأسیساتی و ساختمانی با کیفیت بالا و قیمت مناسب است. ما با همکاری مستقیم با برندهای معتبر داخلی و خارجی، محصولات اصیل و با کیفیت را به دست مشتریان خود می‌رسانیم. خدمات پس از فروش و مشاوره تخصصی از اولویت‌های اصلی ما است.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { title: 'اصالت کالا', desc: 'تمامی محصولات ما دارای ضمانت اصالت و گارانتی معتبر هستند.', icon: '🏆' },
          { title: 'قیمت مناسب', desc: 'با خرید مستقیم از نمایندگی‌ها، بهترین قیمت را به شما عرضه می‌کنیم.', icon: '💰' },
          { title: 'ارسال سریع', desc: 'ارسال به سراسر کشور در کوتاه‌ترین زمان ممکن با بسته‌بندی مناسب.', icon: '🚀' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-border/50 text-center">
            <span className="text-4xl mb-3 block">{item.icon}</span>
            <h3 className="font-bold text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-text-secondary">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
