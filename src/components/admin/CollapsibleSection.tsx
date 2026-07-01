import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string;
}

export default function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-light-bg/50 transition-colors text-right"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
              {icon}
            </div>
          )}
          <h3 className="font-bold text-primary">{title}</h3>
          {badge && (
            <span className="text-xs bg-light-bg text-text-secondary px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 pt-0 border-t border-border/30">{children}</div>
        </div>
      </div>
    </div>
  );
}
