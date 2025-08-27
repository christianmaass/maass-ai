import Link from 'next/link';

interface BreadcrumbData {
  root_label: string;
  current_path_label: string;
}

interface BreadcrumbProps {
  data: BreadcrumbData;
}

export function Breadcrumb({ data }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        href="/"
        className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
      >
        {data.root_label}
      </Link>
      <span className="text-navaa-gray-400">/</span>
      <span className="text-navaa-gray-900 font-medium">{data.current_path_label}</span>
    </nav>
  );
}
