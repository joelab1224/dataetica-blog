import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAdminAuth, logAdminAction, type AuthenticatedUser } from '@/lib/apiAuth';

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const post = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
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

// PUT /api/posts/[id] - Update post (Protected)
const updatePostHandler = async (
  request: NextRequest,
  user: AuthenticatedUser,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, excerpt, content, categoryId, status, imageUrl } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
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
          id: { not: resolvedParams.id },
        },
      });

      if (slugExists) {
        const timestamp = Date.now();
        slug = `${slug}-${timestamp}`;
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
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
    await prisma.post.update({
      where: { id: resolvedParams.id },
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
          where: { postId: resolvedParams.id },
        });
        
        // Add new category relationship
        if (categoryId) {
          await prisma.postCategory.create({
            data: {
              postId: resolvedParams.id,
              categoryId: categoryId,
            },
          });
        }
      }
    }

    // Fetch updated post with relationships
    const updatedPost = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
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
    logAdminAction('POST_UPDATE', user, {
      postId: resolvedParams.id,
      title: updatedPost?.title,
      status: updatedPost?.status,
      changes: updateData
    }, request);

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

// DELETE /api/posts/[id] - Delete post (Protected)
const deletePostHandler = async (
  request: NextRequest,
  user: AuthenticatedUser,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
      select: {
        id: true,
        title: true,
        status: true
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: resolvedParams.id },
    });

    // Log admin action for audit trail
    logAdminAction('POST_DELETE', user, {
      postId: resolvedParams.id,
      title: existingPost.title,
      status: existingPost.status
    }, request);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Error deleting post' },
      { status: 500 }
    );
  }
};

// Export secured handlers
export const PUT = withAdminAuth(updatePostHandler);
export const DELETE = withAdminAuth(deletePostHandler);
