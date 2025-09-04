import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dataetica.info';
  
  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug: resolvedParams.slug,
        status: 'PUBLISHED'
      },
      include: {
        author: true,
        categories: {
          include: { category: true }
        }
      }
    });

    if (!post) {
      return {
        title: 'Article Not Found | DataÉtica Blog',
        description: 'The requested article could not be found on DataÉtica Blog.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const url = `${baseUrl}/${post.slug}`;
    const keywords = post.categories.map(c => c.category.name);
    const categoryName = post.categories[0]?.category.name || 'Digital Ethics';
    
    return {
      title: post.title,
      description: post.excerpt || undefined,
      keywords: [
        ...keywords,
        'digital ethics',
        'technology ethics',
        'AI ethics',
        'data privacy',
        'ethical technology'
      ],
      authors: [{ name: post.author.name, url: baseUrl }],
      creator: post.author.name,
      publisher: 'DataÉtica',
      category: categoryName,
      classification: 'Blog Article',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'article',
        url,
        title: post.title,
        description: post.excerpt || undefined,
        siteName: 'DataÉtica Blog',
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author.name],
        section: categoryName,
        tags: keywords,
        locale: 'en_US',
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/jpeg',
          }
        ] : [
          {
            url: `${baseUrl}/logo1.png`,
            width: 400,
            height: 400,
            alt: 'DataÉtica Logo',
            type: 'image/png',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@dataetica',
        creator: '@dataetica',
        title: post.title,
        description: post.excerpt || undefined,
        images: post.featuredImage ? {
          url: post.featuredImage,
          alt: post.title,
        } : {
          url: `${baseUrl}/logo1.png`,
          alt: 'DataÉtica Logo',
        },
      },
      alternates: {
        canonical: url,
      },
      other: {
        ...(post.publishedAt ? { 'article:published_time': post.publishedAt.toISOString() } : {}),
        'article:modified_time': post.updatedAt.toISOString(),
        'article:author': post.author.name,
        'article:section': categoryName,
        'article:tag': keywords.join(', '),
      },
    };
  } catch (error) {
    console.error('Error generating blog post metadata:', error);
    return {
      title: 'DataÉtica Blog',
      description: 'Exploring ethics in the digital age',
    };
  }
}

export default async function BlogPostLayout({ children, params }: Props) {
  // Get post data for JSON-LD
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { 
      slug: resolvedParams.slug,
      status: 'PUBLISHED'
    },
    include: {
      author: true,
      categories: {
        include: { category: true }
      }
    }
  });

  if (!post) {
    notFound();
  }

  const articleData = {
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    featuredImage: post.featuredImage || undefined,
    author: { name: post.author.name },
    categories: post.categories.map(c => ({ category: { name: c.category.name } })),
  };

  return (
    <>
      <JsonLd type="article" data={articleData} />
      {children}
    </>
  );
}
