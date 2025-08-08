'use client';

import BlogPostCard from './BlogPostCard';
import Button from './ui/Button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  author: {
    name: string;
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

interface FeaturedArticlesSectionProps {
  posts: BlogPost[];
  onViewAllClick: () => void;
  className?: string;
}

export default function FeaturedArticlesSection({ 
  posts, 
  onViewAllClick, 
  className = '' 
}: FeaturedArticlesSectionProps) {
  const featuredPosts = posts.slice(0, 3);

  return (
    <section className={`container padding-responsive py-16 ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-section-header text-primary mb-4 font-heading">
          Artículos Destacados
        </h2>
        <p className="text-body text-secondary max-w-2xl mx-auto">
          Descubre nuestras reflexiones más recientes sobre ética digital y transformación tecnológica
        </p>
      </div>
      
      {featuredPosts.length > 0 ? (
        <div className="grid-responsive gap-8 mb-8">
          {featuredPosts.map((post) => (
            <BlogPostCard 
              key={post.id} 
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-secondary text-section-header space-y-4">
            <p className="font-body">Próximamente publicaremos nuestros primeros artículos.</p>
            <div className="text-4xl opacity-50">📚</div>
          </div>
        </div>
      )}
      
      <div className="text-center">
        <Button 
          variant="primary" 
          size="lg"
          onClick={onViewAllClick}
          className="font-semibold"
        >
          Ver Todos los Artículos
        </Button>
      </div>
    </section>
  );
}