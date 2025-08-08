import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: any = {};
    
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

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, categoryId, status = 'DRAFT', imageUrl } = body;

    if (!title || !excerpt || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and categoryId are required' },
        { status: 400 }
      );
    }

    // Get admin user ID from the database
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 500 }
      );
    }

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
        authorId: adminUser.id,
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
}