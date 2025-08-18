import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAdminAuth, logAdminAction, type AuthenticatedUser } from '@/lib/apiAuth';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category (Protected)
const createCategoryHandler = async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    // Log admin action for audit trail
    logAdminAction('CATEGORY_CREATE', user, {
      categoryId: category.id,
      name: category.name,
      slug: category.slug
    }, request);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    );
  }
};

// Export secured POST handler
export const POST = withAdminAuth(createCategoryHandler);
