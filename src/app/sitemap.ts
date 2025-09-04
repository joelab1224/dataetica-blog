import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dataetica.info';
  
  try {
    // Get all published posts
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { 
        slug: true, 
        updatedAt: true,
        publishedAt: true 
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    // Get all categories with posts
    const categories = await prisma.category.findMany({
      where: {
        posts: {
          some: {
            post: {
              status: 'PUBLISHED'
            }
          }
        }
      },
      select: { 
        slug: true, 
        updatedAt: true 
      }
    });

    const sitemap: MetadataRoute.Sitemap = [
      // Homepage
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      // About page (if it exists)
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      // Blog posts
      ...posts.map((post) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      // Category pages
      ...categories.map((category) => ({
        url: `${baseUrl}/?category=${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ];

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if database query fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
