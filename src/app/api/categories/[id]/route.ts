import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAdminAuth, logAdminAction, type AuthenticatedUser } from '@/lib/apiAuth';

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const category = await prisma.category.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Error fetching category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category (Protected)
const updateCategoryHandler = async (
  request: NextRequest,
  user: AuthenticatedUser,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { name, description } = body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists (excluding current category)
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: resolvedParams.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slug;
    }
    if (description !== undefined) updateData.description = description || null;

    const category = await prisma.category.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    // Log admin action for audit trail
    logAdminAction('CATEGORY_UPDATE', user, {
      categoryId: resolvedParams.id,
      name: category.name,
      changes: updateData
    }, request);

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category (Protected)
const deleteCategoryHandler = async (
  request: NextRequest,
  user: AuthenticatedUser,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has posts
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: resolvedParams.id },
    });

    // Log admin action for audit trail
    logAdminAction('CATEGORY_DELETE', user, {
      categoryId: resolvedParams.id,
      name: existingCategory.name,
      postCount: existingCategory._count.posts
    }, request);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Error deleting category' },
      { status: 500 }
    );
  }
};

// Export secured handlers
export const PUT = withAdminAuth(updateCategoryHandler);
export const DELETE = withAdminAuth(deleteCategoryHandler);
