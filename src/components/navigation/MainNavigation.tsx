'use client';

import { useState } from 'react';
import Link from 'next/link';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

interface NavigationProps {
  className?: string;
}

export default function MainNavigation({ className = '' }: NavigationProps) {
  const { t } = useClientTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { 
      label: t('menuItems.articles'), 
      href: '/', 
      description: t('menuDescriptions.articles'), 
      icon: '📰' 
    },
    { 
      label: t('menuItems.topics'), 
      href: '/#topics', 
      description: t('menuDescriptions.topics'), 
      icon: '📚' 
    },
    { 
      label: t('menuItems.about'), 
      href: '/about', 
      description: t('menuDescriptions.about'), 
      icon: '🔍' 
    },
    { 
      label: t('menuItems.knowledgeTest'), 
      href: '/test', 
      description: t('menuDescriptions.knowledgeTest'), 
      icon: '🎯' 
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`bg-white border-t border-b border-subtle ${className}`}>
      <div className="container padding-responsive">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="nav-button px-6 py-2 text-nav-card font-semibold text-primary bg-white border border-subtle rounded-full hover:bg-hero-gradient hover:text-white hover:border-transparent transition-all duration-200 hover:shadow-medium group"
                title={item.description}
              >
                <span className="relative flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-3">
            <span className="text-nav-card font-semibold text-primary">{t('menu')}</span>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 transform transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 text-nav-card font-medium text-primary bg-gray-50 hover:bg-hero-gradient hover:text-white rounded-large transition-all duration-200 group"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs opacity-70 group-hover:opacity-90">
                      {item.description}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}