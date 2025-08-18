'use client';

import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

interface StatisticsSectionProps {
  totalPosts: number;
  totalCategories: number;
  className?: string;
}

export default function StatisticsSection({ 
  totalPosts, 
  totalCategories, 
  className = '' 
}: StatisticsSectionProps) {
  const { t } = useClientTranslation('blog');
  
  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="container padding-responsive">
        <div className="text-center mb-12">
          <h2 className="text-section-header text-primary mb-4 font-heading">
            {t('stats.ourImpact')}
          </h2>
          <p className="text-body text-secondary max-w-2xl mx-auto">
            {t('stats.buildingCommunity')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-primary transition-colors group-hover:text-purple-600">
              {totalPosts}+
            </div>
            <div className="text-secondary font-medium">{t('stats.articlesPublished')}</div>
            <div className="text-xs text-secondary font-body">
              {t('stats.deepReflections')}
            </div>
          </div>
          
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-primary transition-colors group-hover:text-purple-600">
              {totalCategories}+
            </div>
            <div className="text-secondary font-medium">{t('stats.topicsCovered')}</div>
            <div className="text-xs text-secondary font-body">
              {t('stats.fromAiToPrivacy')}
            </div>
          </div>
          
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-primary transition-colors group-hover:text-purple-600">
              2024
            </div>
            <div className="text-secondary font-medium">{t('stats.foundingYear')}</div>
            <div className="text-xs text-secondary font-body">
              {t('stats.committedToEthics')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}