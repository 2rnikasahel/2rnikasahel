import { useHeader } from '../context/HeaderContext';

interface BrandLogoProps {
  variant?: 'header' | 'footer';
  isDark?: boolean;
}

// لوگوی پیش‌فرض SVG
function DefaultLogoMark({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-sm" fill="none">
      <rect width="48" height="48" rx="8" fill={fill} />
      <path d="M12 16l12-6 12 6v12l-12 6-12-6V16z" stroke="white" strokeWidth="2" fill="none" />
      <path d="M12 16l12 6 12-6" stroke="white" strokeWidth="2" />
      <path d="M24 22v12" stroke="white" strokeWidth="2" />
      <path d="M12 28l12 6 12-6" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export default function BrandLogo({ variant = 'header', isDark = false }: BrandLogoProps) {
  const { settings } = useHeader();

  const isFooter = variant === 'footer';
  const titleClass = isFooter
    ? 'text-xl font-bold text-white'
    : `text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-primary'}`;
  const subtitleClass = isFooter
    ? 'text-[10px] text-gray-400'
    : `text-[10px] leading-tight ${isDark ? 'text-slate-400' : 'text-text-secondary'}`;

  return (
    <div className="flex items-center gap-3">
      {settings.logoImage ? (
        <img
          src={settings.logoImage}
          alt={settings.logoTitle}
          className="w-10 h-10 object-contain rounded-lg"
        />
      ) : (
        <DefaultLogoMark fill={isFooter ? '#1e293b' : isDark ? '#2563eb' : '#0f172a'} />
      )}
      <div>
        <h1 className={titleClass}>{settings.logoTitle}</h1>
        <p className={subtitleClass}>{settings.logoSubtitle}</p>
      </div>
    </div>
  );
}
