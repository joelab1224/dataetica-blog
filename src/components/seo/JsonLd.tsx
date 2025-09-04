interface Article {
  title: string;
  excerpt: string | null;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: string;
  author: { name: string };
  categories: Array<{ category: { name: string } }>;
}

interface JsonLdProps {
  type: 'website' | 'article' | 'organization';
  data?: Article;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dataetica.info';
  
  let jsonLd;
  
  if (type === 'website') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DataÉtica Blog',
      description: 'Exploring ethics in the digital age through critical analysis and research',
      url: baseUrl,
      publisher: {
        '@type': 'Organization',
        name: 'DataÉtica',
        description: 'Digital ethics research and analysis',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo1.png`,
          width: 400,
          height: 400
        },
        sameAs: [
          'https://www.linkedin.com/company/dataetica'
        ],
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      inLanguage: 'en-US',
      copyrightYear: new Date().getFullYear(),
      genre: ['Technology', 'Ethics', 'Digital Rights', 'AI Ethics', 'Data Privacy']
    };
  } else if (type === 'organization') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DataÉtica',
      description: 'Exploring ethics in the digital age through independent research and critical analysis',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo1.png`,
        width: 400,
        height: 400
      },
      foundingDate: '2024',
      founders: [
        {
          '@type': 'Person',
          name: 'DataÉtica Team'
        }
      ],
      knowsAbout: [
        'Digital Ethics',
        'Artificial Intelligence Ethics',
        'Data Privacy',
        'Technology Policy',
        'Digital Rights',
        'Algorithm Transparency'
      ],
      areaServed: {
        '@type': 'Place',
        name: 'Global'
      },
      sameAs: [
        'https://www.linkedin.com/company/dataetica'
      ]
    };
  } else if (type === 'article' && data) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.excerpt || data.title,
      url: `${baseUrl}/${data.slug}`,
      datePublished: data.publishedAt,
      dateModified: data.updatedAt,
      author: {
        '@type': 'Person',
        name: data.author.name,
        url: baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'DataÉtica',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo1.png`,
          width: 400,
          height: 400
        },
        url: baseUrl
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${data.slug}`
      },
      image: data.featuredImage ? {
        '@type': 'ImageObject',
        url: data.featuredImage,
        width: 1200,
        height: 630
      } : {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo1.png`,
        width: 400,
        height: 400
      },
      articleSection: data.categories[0]?.category.name || 'Digital Ethics',
      keywords: data.categories.map(c => c.category.name).join(', '),
      genre: ['Technology', 'Ethics', 'Analysis'],
      inLanguage: 'en-US',
      copyrightHolder: {
        '@type': 'Organization',
        name: 'DataÉtica'
      },
      about: {
        '@type': 'Thing',
        name: data.categories[0]?.category.name || 'Digital Ethics'
      }
    };
  }

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
}
