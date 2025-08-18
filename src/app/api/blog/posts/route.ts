import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PostStatus } from '@prisma/client';

// GET /api/blog/posts - List blog posts with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const status = searchParams.get('status') || 'PUBLISHED';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * pageSize;
    
    // Build where clause
    const where: Record<string, unknown> = {};
    
    // Status filter
    if (status !== 'ALL') {
      where.status = status as PostStatus;
    }
    
    // Category filter
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Fetch posts with pagination
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip,
      take: pageSize,
    });
    
    // Get total count for pagination
    const totalPosts = await prisma.post.count({
      where,
    });
    
    const totalPages = Math.ceil(totalPosts / pageSize);
    
    // Format response
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      publishedAt: post.publishedAt?.toISOString(),
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name,
      },
      categories: post.categories.map(cat => ({
        name: cat.category.name,
        slug: cat.category.slug,
      })),
    }));
    
    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalPosts,
        hasMore: page < totalPages,
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      slug, 
      content, 
      excerpt, 
      featuredImage, 
      categories, 
      authorId, 
      status = 'DRAFT' 
    } = body;
    
    // Basic validation
    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: 'Title, slug, content, and authorId are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the post
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
        status: status as PostStatus,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Connect categories if provided
    if (categories && categories.length > 0) {
      for (const categoryName of categories) {
        // Find or create category
        let category = await prisma.category.findFirst({
          where: { name: categoryName },
        });

        if (!category) {
          const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          category = await prisma.category.create({
            data: {
              name: categoryName,
              slug: categorySlug,
            },
          });
        }

        // Connect to post
        await prisma.postCategory.create({
          data: {
            postId: newPost.id,
            categoryId: category.id,
          },
        });
      }
    }

    // Fetch the post with categories
    const postWithCategories = await prisma.post.findUnique({
      where: { id: newPost.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const formattedPost = {
      id: postWithCategories!.id,
      title: postWithCategories!.title,
      slug: postWithCategories!.slug,
      content: postWithCategories!.content,
      excerpt: postWithCategories!.excerpt,
      featuredImage: postWithCategories!.featuredImage,
      publishedAt: postWithCategories!.publishedAt?.toISOString(),
      status: postWithCategories!.status,
      author: {
        id: postWithCategories!.author.id,
        name: postWithCategories!.author.name,
      },
      categories: postWithCategories!.categories.map(c => ({
        name: c.category.name,
        slug: c.category.slug,
      })),
    };
    
    return NextResponse.json({ post: formattedPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}