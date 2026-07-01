import { Variants, Transition, useReducedMotion } from 'framer-motion';

/**
 * مقیاس زمان‌بندی انیمیشن‌ها (ثانیه)
 */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

/**
 * تنظیمات Easing (Cubic Bezier)
 */
export const easing = {
  smooth: [0.4, 0, 0.2, 1],
  snappy: [0.4, 0, 0, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.34, 1.56, 0.64, 1],
  linear: [0, 0, 1, 1],
} as const;

/**
 * تنظیمات Spring برای حرکت‌های فیزیک‌محور
 */
export const spring = {
  gentle: { type: 'spring', stiffness: 200, damping: 25 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  bouncy: { type: 'spring', stiffness: 500, damping: 20 },
  slow: { type: 'spring', stiffness: 100, damping: 20 },
} as const;

/**
 * تابع کمکی برای تشخیص جهت اسلاید بر اساس RTL/LTR
 * @param direction جهت منطقی (شروع یا پایان)
 * @returns مقدار عددی برای جابجایی در محور X
 */
export const getSlideDirection = (direction: 'start' | 'end'): number => {
  const isRTL = typeof document !== 'undefined' ? document.documentElement.dir === 'rtl' : true;
  if (direction === 'start') {
    return isRTL ? 100 : -100;
  }
  return isRTL ? -100 : 100;
};

/**
 * انیمیشن ظهور تدریجی (Fade In)
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * انیمیشن محو شدن (Fade Out)
 */
export const fadeOut: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
};

/**
 * انیمیشن حرکت به بالا
 */
export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

/**
 * انیمیشن حرکت به پایین
 */
export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

/**
 * انیمیشن ورود از سمت شروع (راست در RTL، چپ در LTR)
 */
export const slideInStart: Variants = {
  initial: { x: getSlideDirection('start') + '%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: getSlideDirection('start') + '%', opacity: 0 },
};

/**
 * انیمیشن ورود از سمت پایان (چپ در RTL، راست در LTR)
 */
export const slideInEnd: Variants = {
  initial: { x: getSlideDirection('end') + '%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: getSlideDirection('end') + '%', opacity: 0 },
};

/**
 * انیمیشن بزرگنمایی ورودی
 */
export const scaleIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

/**
 * انیمیشن کوچک‌نمایی خروجی
 */
export const scaleOut: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 0.95, opacity: 0 },
};

/**
 * انیمیشن مخصوص مودال‌ها و دیالوگ‌ها
 */
export const modalScale: Variants = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 20 },
};

/**
 * تنظیمات کانتینر برای انیمیشن‌های پله‌ای (Stagger)
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * المان داخلی برای سیستم Stagger
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

/**
 * ساخت انیمیشن Stagger سفارشی
 */
export const createStagger = (staggerTime: number, delayTime: number = 0): Transition => ({
  staggerChildren: staggerTime,
  delayChildren: delayTime,
});

/**
 * افکت Hover برای دکمه‌ها
 */
export const buttonHover = {
  scale: 1.02,
  transition: { duration: duration.fast, ease: easing.smooth },
};

/**
 * افکت Tap (کلیک) برای دکمه‌ها
 */
export const buttonTap = {
  scale: 0.97,
};

/**
 * افکت Hover برای کارت‌ها
 */
export const cardHover = {
  scale: 1.015,
  y: -2,
  transition: { duration: duration.normal, ease: easing.smooth },
};

/**
 * زوم تصاویر
 */
export const imageZoom = {
  scale: 1.05,
  transition: { duration: duration.slow, ease: easing.smooth },
};

/**
 * افکت Pop-up برای آیکون‌ها
 */
export const iconPop: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.2, 1],
    transition: { duration: duration.normal }
  }
};

/**
 * تنظیمات Viewport برای اجرای یک‌باره انیمیشن
 */
export const viewportOnce = {
  once: true,
  margin: '-50px',
};

/**
 * تنظیمات Viewport برای تکرار انیمیشن
 */
export const viewportRepeat = {
  once: false,
  margin: '-50px',
};

/**
 * هوک هوشمند برای مدیریت دسترسی (Reduced Motion)
 * اگر کاربر در سیستم‌عامل خود انیمیشن‌ها را محدود کرده باشد، انیمیشن‌ها آنی یا ساده می‌شوند.
 */
export function useMotionSafe() {
  const shouldReduceMotion = useReducedMotion();

  const safeTransition = (baseTransition: Transition): Transition => {
    if (shouldReduceMotion) {
      return { ...baseTransition, duration: 0, staggerChildren: 0 };
    }
    return baseTransition;
  };

  const safeVariants = (variants: Variants): Variants => {
    if (!shouldReduceMotion) return variants;

    const reduced: Variants = {};
    for (const key in variants) {
      const variant = variants[key];
      if (typeof variant === 'object' && !Array.isArray(variant)) {
        reduced[key] = {
          ...variant,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          transition: { duration: 0 },
        };
      } else {
        reduced[key] = variant;
      }
    }
    return reduced;
  };

  return {
    shouldReduceMotion,
    safeTransition,
    safeVariants,
  };
}
