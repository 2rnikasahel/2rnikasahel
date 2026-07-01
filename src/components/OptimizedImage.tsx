import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * کامپوننت استاندارد تصویر برای بهینه‌سازی لود شدن تصاویر
 * - استفاده از lazy loading پیش‌فرض
 * - استفاده از decoding="async" برای عدم مسدود کردن رشته اصلی
 */
export default function OptimizedImage({ src, alt, className, loading = 'lazy', ...props }: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      draggable="false"
      {...props}
    />
  );
}
