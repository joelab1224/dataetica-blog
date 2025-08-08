'use client';

import Link from 'next/link';
import Card from './ui/Card';
import Button from './ui/Button';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  description?: string;
}

interface TopicsSectionProps {
  categories: Category[];
  className?: string;
}

const getTopicIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes('inteligencia') || name.includes('ia') || name.includes('ai')) return '🤖';
  if (name.includes('privacidad') || name.includes('datos')) return '🔒';
  if (name.includes('ética') || name.includes('etica')) return '⚖️';
  if (name.includes('tecnología') || name.includes('tecnologia')) return '💻';
  if (name.includes('social') || name.includes('sociedad')) return '🌍';
  if (name.includes('algoritmo')) return '📊';
  if (name.includes('digital')) return '📱';
  if (name.includes('futuro')) return '🚀';
  return '📖';
};

export default function TopicsSection({ categories, className = '' }: TopicsSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={`container padding-responsive py-16 ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-section-header text-primary mb-4 font-heading">
          Explora por Temas
        </h2>
        <p className="text-body text-secondary max-w-2xl mx-auto">
          Navega a través de nuestras diferentes áreas de reflexión sobre ética digital
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/?category=${category.slug}`}>
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110">
                {getTopicIcon(category.name)}
              </div>
              <h3 className="font-semibold text-primary mb-2 font-heading text-nav-card">
                {category.name}
              </h3>
              <p className="text-xs text-secondary font-body">
                {category.postCount === 1 
                  ? `${category.postCount} artículo` 
                  : `${category.postCount} artículos`
                }
              </p>
              {category.description && (
                <p className="text-xs text-secondary font-body mt-2 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
      
      {categories.length > 8 && (
        <div className="text-center mt-8">
          <Link href="/categories">
            <Button variant="secondary" size="md">
              Ver Todas las Categorías
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}