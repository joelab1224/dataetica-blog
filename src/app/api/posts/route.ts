import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { sanitizeMarkdown, sanitizeTitle, sanitizeExcerpt, sanitizeImageUrl } from '@/lib/sanitize';
import { withAdminAuth, logAdminAction, type AuthenticatedUser } from '@/lib/apiAuth';

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};
    
    if (category && category !== 'all') {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }
    
    if (status) {
      where.status = status;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    // Transform the response to include a primary category for admin compatibility
    const transformedPosts = posts.map(post => ({
      ...post,
      category: post.categories[0]?.category || null,
      categoryId: post.categories[0]?.categoryId || null,
      imageUrl: post.featuredImage,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post (Protected)
const createPostHandler = async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Rate limiting para creación de posts
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`create-post-${clientIP}`, {
      windowMs: 5 * 60 * 1000, // 5 minutos
      maxRequests: 3 // 3 posts cada 5 minutos por IP
    });
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many posts created. Please wait before creating another.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title: rawTitle, excerpt: rawExcerpt, content: rawContent, categoryId, status = 'DRAFT', imageUrl: rawImageUrl } = body;
    
    // Sanitizar entradas
    const title = sanitizeTitle(rawTitle);
    const excerpt = sanitizeExcerpt(rawExcerpt);
    const content = sanitizeMarkdown(rawContent);
    const imageUrl = sanitizeImageUrl(rawImageUrl);

    if (!title || !excerpt || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and categoryId are required' },
        { status: 400 }
      );
    }

    // Use authenticated user as author
    const authorId = user.id;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    let finalSlug = slug;
    if (existingPost) {
      const timestamp = Date.now();
      finalSlug = `${slug}-${timestamp}`;
    }

    // Create post with proper relationships
    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        featuredImage: imageUrl || null,
        status,
        authorId,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        categories: {
          create: {
            categoryId: categoryId,
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        author: true,
      },
    });

    // Log admin action for audit trail
    logAdminAction('POST_CREATE', user, {
      postId: post.id,
      title: post.title,
      status: post.status
    }, request);

    // Transform response for admin compatibility
    const transformedPost = {
      ...post,
      category: post.categories[0]?.category || null,
      categoryId: post.categories[0]?.categoryId || null,
      imageUrl: post.featuredImage,
    };

    return NextResponse.json(transformedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error creating post' },
      { status: 500 }
    );
  }
};

// Export secured POST handler
export const POST = withAdminAuth(createPostHandler);
