import { motion } from 'framer-motion';

interface SliderDotsProps {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}

export const SliderDots = ({ count, current, onSelect }: SliderDotsProps) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
      {Array.from({ length: count }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className="relative h-2 rounded-full transition-all duration-300 bg-white/30"
          style={{ width: idx === current ? '32px' : '8px' }}
          aria-label={`رفتن به اسلاید ${(idx + 1).toLocaleString('fa-IR')}`}
          aria-current={idx === current ? 'true' : 'false'}
        >
          {idx === current && (
            <motion.div
              layoutId="activeDot"
              className="absolute inset-0 bg-accent rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
