import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/blog/posts/[slug] - Get single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const includeAll = request.nextUrl.searchParams.get('includeAll') === 'true';
    
    const post = await prisma.post.findUnique({
      where: { 
        slug,
        ...(includeAll ? {} : { status: 'PUBLISHED' }),
      },
      include: {
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
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      publishedAt: post.publishedAt?.toISOString(),
      status: post.status,
      author: {
        id: post.author.id,
        name: post.author.name,
      },
      categories: post.categories.map(c => ({
        name: c.category.name,
        slug: c.category.slug,
      })),
    };
    
    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/[slug] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, content, excerpt, featuredImage, categories, status } = body;

    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: title ?? existingPost.title,
        content: content ?? existingPost.content,
        excerpt: excerpt ?? existingPost.excerpt,
        featuredImage: featuredImage ?? existingPost.featuredImage,
        status: status ?? existingPost.status,
        publishedAt: status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' 
          ? new Date() 
          : existingPost.publishedAt,
      },
    });

    // Handle category updates if provided
    if (categories && Array.isArray(categories)) {
      // Remove existing categories
      await prisma.postCategory.deleteMany({
        where: { postId: existingPost.id },
      });

      // Add new categories
      for (const categoryName of categories) {
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

        await prisma.postCategory.create({
          data: {
            postId: existingPost.id,
            categoryId: category.id,
          },
        });
      }
    }

    // Fetch updated post with categories
    const postWithCategories = await prisma.post.findUnique({
      where: { id: existingPost.id },
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

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[slug] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: existingPost.id },
    });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}