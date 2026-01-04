'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from './Icon';

/**
 * Props for the DynamicBreadcrumb component
 * @typedef {Object} DynamicBreadcrumbProps
 * @property {string} basePath - The base path for the breadcrumb navigation (e.g., "/decisions")
 * @property {string} activeColor - CSS class for styling the active breadcrumb item (e.g., "text-navaa-accent")
 */
interface DynamicBreadcrumbProps {
  basePath: string;
  activeColor: string;
}

/**
 * DynamicBreadcrumb component that automatically generates breadcrumb navigation
 * based on the current URL path using Next.js App Router.
 *
 * Features:
 * - Automatically segments the current path relative to the base path
 * - Converts kebab-case segments to readable names (e.g., "decisions" → "Decisions")
 * - Highlights the active/current page with custom styling
 * - Uses semantic HTML with proper ARIA labels for accessibility
 * - Includes chevron separators between breadcrumb items
 *
 * @param {DynamicBreadcrumbProps} props - Component props
 * @param {string} props.basePath - The base path for breadcrumb navigation
 * @param {string} props.activeColor - CSS class for active item styling
 * @returns {JSX.Element | null} Breadcrumb navigation or null if no segments
 *
 * @example
 * ```tsx
 * <DynamicBreadcrumb
 *   basePath="/decisions"
 *   activeColor="text-navaa-accent"
 * />
 * ```
 */
export function DynamicBreadcrumb({ basePath, activeColor }: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Remove basePath from pathname and split into segments
  const relativePath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;

  const segments = relativePath.split('/').filter((segment) => segment.length > 0);

  // Create breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = basePath + '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;

    // Convert segment to readable format (replace hyphens with spaces and capitalize)
    const displayName = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      name: displayName,
      href,
      isLast,
    };
  });

  // Add base path as first item if we have segments
  if (breadcrumbItems.length > 0) {
    const baseDisplayName =
      basePath
        .split('/')
        .filter((segment) => segment.length > 0)
        .pop()
        ?.split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Home';

    breadcrumbItems.unshift({
      name: baseDisplayName,
      href: basePath,
      isLast: false,
    });
  }

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <Icon name="chevron-right" className="w-4 h-4 text-navaa-gray-600 mx-2" />
            )}
            {item.isLast ? (
              <span className={`font-medium ${activeColor}`}>{item.name}</span>
            ) : (
              <Link
                href={item.href}
                className="text-navaa-gray-600 hover:text-navaa-gray-900 transition-colors duration-200"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
