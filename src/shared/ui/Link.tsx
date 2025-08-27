import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ReactNode } from 'react';

interface LinkProps extends Omit<NextLinkProps, 'className'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export function Link({ children, className = '', variant = 'default', ...props }: LinkProps) {
  const variantClasses = {
    default: 'text-indigo-600 hover:text-indigo-800',
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md',
  };

  return (
    <NextLink className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </NextLink>
  );
}
