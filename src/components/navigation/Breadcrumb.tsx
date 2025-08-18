'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumb items if not provided
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment;
      if (segment === 'admin') {
        label = 'Administración';
      } else if (segment === 'posts') {
        label = 'Artículos';
      } else if (segment === 'categories') {
        label = 'Categorías';
      } else if (segment === 'create') {
        label = 'Crear';
      } else if (segment === 'edit') {
        label = 'Editar';
      } else if (segment === 'login') {
        label = 'Iniciar Sesión';
      } else if (segment === 'dashboard') {
        label = 'Panel';
      } else {
        // Capitalize first letter and replace hyphens with spaces
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      breadcrumbItems.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className={`bg-gray-50 border-b border-subtle ${className}`} aria-label="Breadcrumb">
      <div className="container padding-responsive py-3">
        <ol className="flex items-center space-x-2 text-nav-card text-secondary">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 mx-2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {isLast ? (
                  <span className="font-medium text-primary" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover-purple transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
