import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminHeaderProps {
  // Für zukünftige Erweiterungen
  currentPage?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentPage }) => {
  return (
    <header className="w-full bg-[#fcfdfe] sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo-navaa.png"
              alt="navaa.ai Admin"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">navaa.ai</span>
              <span className="text-sm text-[#00bfae] font-medium">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link
              href="/admin"
              className={`text-gray-800 font-medium hover:text-[#00bfae] transition-colors font-sans ${
                currentPage === 'dashboard' ? 'text-[#00bfae] border-b-2 border-[#00bfae]' : ''
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`text-gray-800 font-medium hover:text-[#00bfae] transition-colors font-sans ${
                currentPage === 'users' ? 'text-[#00bfae] border-b-2 border-[#00bfae]' : ''
              }`}
            >
              User Management
            </Link>
          </li>
          <li>
            <Link
              href="/admin/monitoring"
              className={`text-gray-800 font-medium hover:text-[#00bfae] transition-colors font-sans ${
                currentPage === 'monitoring' ? 'text-[#00bfae] border-b-2 border-[#00bfae]' : ''
              }`}
            >
              Monitoring
            </Link>
          </li>
          <li>
            <Link
              href="/admin/cases"
              className={`text-gray-800 font-medium hover:text-[#00bfae] transition-colors font-sans ${
                currentPage === 'cases' ? 'text-[#00bfae] border-b-2 border-[#00bfae]' : ''
              }`}
            >
              Case Management
            </Link>
          </li>
          <li>
            <Link
              href="/admin/logs"
              className={`text-gray-800 font-medium hover:text-[#00bfae] transition-colors font-sans ${
                currentPage === 'logs' ? 'text-[#00bfae] border-b-2 border-[#00bfae]' : ''
              }`}
            >
              📊 Logs
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#00bfae] text-white rounded-lg font-medium hover:bg-[#009688] transition-colors"
            >
              Back to navaa
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AdminHeader;
