import * as React from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`relative overflow-hidden ${className || ''}`} {...props}>
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  ),
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
