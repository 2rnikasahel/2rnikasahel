import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

const trustItems = [
  {
    icon: Truck,
    title: 'ارسال سریع',
    description: 'ارسال به سراسر کشور در کوتاه‌ترین زمان ممکن',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'ضمانت اصالت کالا',
    description: 'تضمین اصل بودن تمامی محصولات و برندها',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CreditCard,
    title: 'پرداخت امن',
    description: 'درگاه پرداخت معتبر و امن بانکی',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴ ساعته',
    description: 'مشاوره و پشتیبانی تخصصی در تمام ساعات',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 mb-6 sm:mb-10" aria-label="ویژگی‌های فروشگاه" role="region">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
        {trustItems.map((item, index) => (
          <article
            key={index}
            className="bg-white rounded-lg min-[420px]:rounded-xl sm:rounded-2xl p-2 min-[420px]:p-3 sm:p-5 text-center shadow-sm border border-border/50 select-none flex flex-col items-center"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <div
              className={`rounded-lg sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-1.5 sm:mb-3 shadow-lg flex-shrink-0`}
              style={{ 
                width: 'clamp(2rem, 6vw, 3.5rem)', 
                height: 'clamp(2rem, 6vw, 3.5rem)' 
              }}
            >
              <item.icon 
                className="text-white" 
                style={{ width: '50%', height: '50%' }}
              />
            </div>
            <h3 className="font-black text-primary mb-0.5 sm:mb-1 leading-tight" style={{ fontSize: 'clamp(0.55rem, 1.2vw, 0.875rem)' }}>
              {item.title}
            </h3>
            <p className="text-text-secondary leading-tight hidden min-[540px]:block" style={{ fontSize: 'clamp(0.45rem, 1vw, 0.75rem)' }}>
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
