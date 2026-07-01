import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../lib/motion';

interface SliderArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  isRTL: boolean;
}

export const SliderArrows = ({ onPrev, onNext, isRTL }: SliderArrowsProps) => {
  return (
    <AnimatePresence>
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
        <motion.button
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onPrev}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-white/20 transition-colors shadow-xl"
          aria-label="اسلاید قبلی"
        >
          {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </motion.button>
        <motion.button
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onNext}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-white/20 transition-colors shadow-xl"
          aria-label="اسلاید بعدی"
        >
          {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </motion.button>
      </div>
    </AnimatePresence>
  );
};
