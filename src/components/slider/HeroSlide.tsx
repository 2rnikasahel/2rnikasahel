import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SlideData } from '../../types/slider';
import { fadeIn, slideUp, duration } from '../../lib/motion';

interface HeroSlideProps {
  data: SlideData;
  isActive: boolean;
  priority: boolean;
}

export const HeroSlide = ({ data, isActive, priority }: HeroSlideProps) => {
  const alignClass = {
    right: 'text-right justify-start',
    left: 'text-left justify-end',
    center: 'text-center justify-center',
  }[data.align || 'right'];

  return (
    <div className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden select-none" role="group" aria-label={data.alt}>
      {/* Background Image */}
      <img
        src={data.image}
        alt={data.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        draggable={false}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-l from-primary/80 via-primary/40 to-transparent`} />

      {/* Content */}
      <div className={`relative h-full container mx-auto px-8 flex items-center ${alignClass}`}>
        <div className="max-w-2xl">
          {isActive && (
            <motion.div
              initial="initial"
              animate="animate"
              className="space-y-4 sm:space-y-6"
            >
              {data.badge && (
                <motion.span
                  variants={fadeIn}
                  className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[8px] sm:text-xs font-bold uppercase tracking-wider"
                >
                  {data.badge}
                </motion.span>
              )}

              <motion.h2
                variants={slideUp}
                transition={{ delay: 0.08, duration: duration.normal }}
                className="font-black text-white leading-tight"
                style={{ fontSize: 'clamp(0.9rem, 4vw, 3.75rem)' }}
              >
                {data.title}
              </motion.h2>

              {data.subtitle && (
                <motion.p
                  variants={slideUp}
                  transition={{ delay: 0.16, duration: duration.normal }}
                  className="text-gray-300 font-medium leading-relaxed"
                  style={{ fontSize: 'clamp(0.65rem, 1.8vw, 1.25rem)' }}
                >
                  {data.subtitle}
                </motion.p>
              )}

              <motion.div
                variants={slideUp}
                transition={{ delay: 0.28, duration: duration.normal }}
                className="flex items-center gap-4 pt-1 sm:pt-4"
              >
                {data.ctaPrimary && (
                  <a
                    href={data.ctaPrimary.href}
                    className="inline-flex items-center gap-1 sm:gap-2 bg-accent text-white rounded-lg sm:rounded-2xl font-bold hover:bg-accent-dark transition-all shadow-lg"
                    style={{ 
                      padding: 'clamp(0.4rem, 1.2vw, 0.875rem) clamp(0.75rem, 2.5vw, 2rem)',
                      fontSize: 'clamp(0.6rem, 1vw, 1rem)'
                    }}
                  >
                    {data.ctaPrimary.label}
                    <ArrowLeft style={{ width: 'clamp(0.8rem, 1.2vw, 1.25rem)', height: 'clamp(0.8rem, 1.2vw, 1.25rem)' }} />
                  </a>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
