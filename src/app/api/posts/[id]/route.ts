import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        author: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Transform response for admin compatibility
    const transformedPost = {
      ...post,
      category: post.categories[0]?.category || null,
      categoryId: post.categories[0]?.categoryId || null,
      imageUrl: post.featuredImage,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Error fetching post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, excerpt, content, categoryId, status, imageUrl } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists (excluding current post)
      const slugExists = await prisma.post.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        const timestamp = Date.now();
        slug = `${slug}-${timestamp}`;
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }
    if (imageUrl !== undefined) updateData.featuredImage = imageUrl || null;
    if (slug !== existingPost.slug) updateData.slug = slug;

    // Update post
    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        author: true,
      },
    });

    // Update category relationship if changed
    if (categoryId !== undefined) {
      const currentCategoryId = existingPost.categories[0]?.categoryId;
      
      if (currentCategoryId !== categoryId) {
        // Remove existing category relationships
        await prisma.postCategory.deleteMany({
          where: { postId: params.id },
        });
        
        // Add new category relationship
        if (categoryId) {
          await prisma.postCategory.create({
            data: {
              postId: params.id,
              categoryId: categoryId,
            },
          });
        }
      }
    }

    // Fetch updated post with relationships
    const updatedPost = await prisma.post.findUnique({
      where: { id: params.id },
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
      ...updatedPost,
      category: updatedPost?.categories[0]?.category || null,
      categoryId: updatedPost?.categories[0]?.categoryId || null,
      imageUrl: updatedPost?.featuredImage,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Error updating post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Error deleting post' },
      { status: 500 }
    );
  }
}