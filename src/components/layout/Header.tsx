'use client';

import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
  className?: string;
  variant?: 'default' | 'hero';
}

export default function Header({ 
  showBackButton = false,
  backButtonHref = '/',
  className = '',
  variant = 'default'
}: HeaderProps) {
  const { t } = useClientTranslation('navigation');
  const getHeaderClasses = () => {
    if (variant === 'hero') {
      return 'header-gradient-blur';
    }
    return 'bg-card shadow-soft';
  };

  return (
    <header className={`${getHeaderClasses()} ${className}`}>
      <div className="container padding-responsive py-3">
        {showBackButton && (
          <Link href={backButtonHref} className="flex-center text-nav-card hover-purple mb-4 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToBlog')}
          </Link>
        )}
        
        <div className="flex items-center justify-between h-full">
          {/* Logo - Left aligned and smaller */}
          <div className="flex items-center">
            <Link href="/" className="logo-container-compact block">
              <Image
                src="/logo1.png"
                alt="DataÉtica"
                width={180}
                height={40}
                className="logo-compact"
                priority
              />
            </Link>
          </div>
          
          {/* Right side - Language switcher */}
          <div className="flex items-center">
            <LanguageSwitcher variant="toggle" showLabels={false} />
          </div>
        </div>
      </div>
    </header>
  );
}