'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import Card from '@/components/ui/Card';
import MainNavigation from '@/components/navigation/MainNavigation';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import ReadingProgress from '@/components/ui/ReadingProgress';
import { LoadingError } from '@/components/ui/ErrorState';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post from the API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/posts/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MainNavigation />
        <div className="container padding-responsive py-12">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle different error types
  if (error || !post) {
    const retryFetch = () => {
      setError(null);
      setLoading(true);
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/blog/posts/${slug}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Post not found');
            }
            throw new Error('Failed to fetch post');
          }
          
          const data = await response.json();
          setPost(data.post);
        } catch (err) {
          console.error('Error fetching post:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MainNavigation />
        <div className="container padding-responsive py-12">
          {error === 'Post not found' ? (
            <LoadingError 
              onRetry={retryFetch}
              className="py-24"
            />
          ) : (
            <LoadingError 
              onRetry={retryFetch}
              className="py-24"
            />
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // Custom breadcrumb items for the post
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title, href: `/${post.slug}` }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ReadingProgress />
      <Header />
      <MainNavigation />
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Post Header */}
      <header className="bg-card shadow-soft">
        <div className="container padding-responsive py-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex justify-center flex-wrap gap-2">
              {post.categories.map((category, index) => (
                <Link key={index} href={`/?category=${category.slug}`}>
                  <Tag variant="primary" size="sm">
                    {category.name}
                  </Tag>
                </Link>
              ))}
            </div>
            
            <h1 className="text-hero text-primary font-heading max-w-3xl mx-auto">
              {post.title}
            </h1>
            
            <div className="flex justify-center items-center text-metadata text-secondary font-body gap-2">
              <span>Por {post.author.name}</span>
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image 
            src={post.featuredImage} 
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <main className="container padding-responsive py-12">
        <Card variant="elevated" className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12">
            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none text-body text-secondary"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: '300'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-subtle">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="text-section-header text-primary font-heading">
                    Compartir este artículo
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-nav-card font-medium text-secondary bg-white border border-subtle rounded-large hover:bg-hero-gradient hover:text-white hover:border-transparent transition-all duration-200"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-nav-card font-medium text-secondary bg-white border border-subtle rounded-large hover:bg-hero-gradient hover:text-white hover:border-transparent transition-all duration-200"
                    >
                      Facebook
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-nav-card font-medium text-secondary bg-white border border-subtle rounded-large hover:bg-hero-gradient hover:text-white hover:border-transparent transition-all duration-200"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="primary"
                >
                  Ver más artículos
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}