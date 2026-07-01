import { useAbout } from '../context/AboutContext';
import OptimizedImage from './OptimizedImage';

export default function AboutSection() {
  const { settings } = useAbout();

  return (
    <section id="about-section" className="section-spacing select-none scroll-mt-44 overflow-hidden" aria-label="درباره ما" role="region">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-primary text-white rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl relative aspect-video min-h-[180px] sm:min-h-[350px]">
          
          {/* Decorative background elements - Hidden on tiny screens to prevent clutter */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-accent/10 blur-[60px] sm:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500/10 blur-[60px] sm:blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 h-full items-center overflow-hidden">
            
            {/* Content Side */}
            <div 
              className="flex flex-col justify-center h-full text-right overflow-hidden"
              style={{ padding: 'clamp(0.75rem, 4vw, 4rem)' }}
            >
              <h2 
                className="font-black mb-1 sm:mb-6 leading-tight truncate sm:whitespace-normal"
                style={{ fontSize: 'clamp(0.85rem, 3.5vw, 3rem)' }}
              >
                {settings.title}
              </h2>
              <p 
                className="text-gray-300 leading-relaxed mb-2 sm:mb-10 line-clamp-2 sm:line-clamp-4 lg:line-clamp-none opacity-90"
                style={{ fontSize: 'clamp(0.55rem, 1.2vw, 1rem)' }}
              >
                {settings.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-1 sm:gap-6 mt-1 sm:mt-0 border-t border-white/5 pt-2 sm:pt-0 sm:border-none">
                {settings.stats.map((stat: any) => (
                  <div key={stat.id} className="text-right">
                    <p 
                      className={`font-black leading-none mb-0.5 sm:mb-1 ${stat.color}`}
                      style={{ fontSize: 'clamp(0.75rem, 3vw, 2.5rem)' }}
                    >
                      {stat.value}
                    </p>
                    <p 
                      className="text-gray-400 font-bold uppercase tracking-tighter"
                      style={{ fontSize: 'clamp(0.4rem, 1vw, 0.75rem)' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side */}
            <div className="relative h-full overflow-hidden group">
              <OptimizedImage
                src={settings.image}
                alt={settings.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/20 to-transparent" />
              {/* Overlay highlight */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
