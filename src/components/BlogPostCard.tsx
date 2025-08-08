'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Card from './ui/Card';
import Tag from './ui/Tag';

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

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card variant="elevated" className="group transition-transform duration-200 hover:-translate-y-1">
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={post.featuredImage} 
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category, index) => (
              <Link key={index} href={`/?category=${category.slug}`}>
                <Tag 
                  variant="primary" 
                  size="sm"
                >
                  {category.name}
                </Tag>
              </Link>
            ))}
          </div>
        )}
        
        {/* Title */}
        <h2 className="text-section-header text-primary line-clamp-2 font-heading">
          <Link 
            href={`/${post.slug}`}
            className="hover-purple transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-body text-secondary line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        {/* Meta */}
        <div className="flex-center-between text-metadata text-secondary">
          <span className="font-medium">Por {post.author.name}</span>
          <time dateTime={post.publishedAt} className="font-body">
            {formatDistanceToNow(new Date(post.publishedAt), { 
              addSuffix: true,
              locale: es 
            })}
          </time>
        </div>
        
        {/* Read More */}
        <div className="pt-2">
          <Link 
            href={`/${post.slug}`}
            className="flex-center text-nav-card font-semibold text-gray-700 hover-purple transition-colors group"
          >
            Leer más 
            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
}