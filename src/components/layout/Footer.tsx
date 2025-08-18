'use client';

import Link from 'next/link';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const { t } = useClientTranslation(['blog', 'navigation']);
  
  return (
    <footer className={`footer-gradient-blur mt-16 ${className}`}>
      <div className="container padding-responsive py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-section-header text-primary font-heading">dataetica</h3>
            <p className="text-body text-secondary">
              {t('blog:tagline')}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-nav-card text-primary font-semibold">{t('blog:footer.links')}</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-secondary hover-purple transition-colors">{t('navigation:home')}</Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-nav-card text-primary font-semibold">{t('blog:footer.contact')}</h4>
            <p className="text-body text-secondary">admin@dataetica.info</p>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-8">
          <p className="text-center text-secondary text-metadata font-body">
            {t('blog:footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}