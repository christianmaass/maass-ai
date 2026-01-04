import { cn } from '@/shared/lib/utils';
import { Icon } from './components/Icon';

interface CalloutProps {
  variant?: 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

type IconName = 'lightbulb' | 'book' | 'lightning' | 'chevron-right';

export function Callout({ variant = 'info', title, children, className }: CalloutProps) {
  const variantStyles = {
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  };

  const iconMap: Record<NonNullable<CalloutProps['variant']>, IconName> = {
    error: 'lightning',
    warning: 'lightbulb',
    info: 'book',
  };

  return (
    <div className={cn('border rounded-lg p-4', variantStyles[variant], className)}>
      <div className="flex items-start gap-3">
        <Icon name={iconMap[variant]} className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
