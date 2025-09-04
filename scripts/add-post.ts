import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * AI-FRIENDLY BLOG POST CREATION SCRIPT
 * 
 * This script allows adding new blog posts to the DataÉtica blog database.
 * It handles category creation/assignment and generates proper slugs.
 * 
 * AVAILABLE CATEGORIES (as defined in blog_structure.md):
 * - "Digitalization": Digital transformation, technology adoption, digital society
 * - "Digital Ethics": AI ethics, moral considerations, ethical frameworks  
 * - "Privacy": Data protection, surveillance, personal information rights
 * - "Digital Identity": Online presence, identity management, authentication
 * - "Family": Technology impact on families, relationships, children
 * - "Misinformation": Fake news, information warfare, media literacy
 * 
 * USAGE INSTRUCTIONS:
 * 1. Modify the POST_DATA object below with your content
 * 2. Set title, content (markdown), excerpt, and categories
 * 3. Optionally set a custom publication date (defaults to random date in range)
 * 4. Run: npx tsx scripts/add-post.ts
 */

// =============================================================================
// POST CONFIGURATION - MODIFY THIS SECTION
// =============================================================================

const POST_DATA = {
  // Main post information
  title: "The Great Shrinking: How AI and Automation Are Quietly Erasing Millions of Jobs Worldwide",
  
  // SEO-friendly excerpt (150-200 characters recommended)
  excerpt: "From call centers to factories, an unprecedented wave of technological displacement is reshaping the global workforce—and most workers don't see it coming.",
  
  // Full markdown content (will be read from file if contentFile is specified, otherwise use content field)
  contentFile: "the-great-shrinking-post.md", // Optional: read content from markdown file
  content: "", // Use this if not reading from file
  
  // Categories (1-2 from the list above)
  categories: ["Digitalization", "Digital Ethics"],
  
  // Publication settings
  publishedDate: null, // null = random date, or specify date like: new Date('2024-08-20')
  status: 'PUBLISHED', // 'DRAFT', 'PUBLISHED', or 'SCHEDULED'
  
  // Optional featured image URL
  featuredImage: null,
};

// Date range for random publication (if publishedDate is null)
const RANDOM_DATE_RANGE = {
  start: new Date('2024-08-18'),
  end: new Date('2024-08-22')
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a random date between two dates
 */
function getRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Read markdown content from file
 */
function readContentFromFile(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), filename);
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading content file ${filename}:`, error);
    throw error;
  }
}

/**
 * Ensure categories exist in database, create if they don't
 */
async function ensureCategoriesExist(categoryNames: string[]) {
  const categories = [];
  
  for (const categoryName of categoryNames) {
    // Generate slug from category name
    const slug = generateSlug(categoryName);
    
    // Get category description based on blog_structure.md definitions
    const categoryDescriptions: { [key: string]: string } = {
      'digitalization': 'Digital transformation, technology adoption, digital society',
      'digital-ethics': 'AI ethics, moral considerations, ethical frameworks',
      'privacy': 'Data protection, surveillance, personal information rights', 
      'digital-identity': 'Online presence, identity management, authentication',
      'family': 'Technology impact on families, relationships, children',
      'misinformation': 'Fake news, information warfare, media literacy'
    };
    
    const description = categoryDescriptions[slug] || `Articles about ${categoryName}`;
    
    // Upsert category (create if doesn't exist, otherwise return existing)
    const category = await prisma.category.upsert({
      where: { slug: slug },
      update: {}, // Don't update if exists
      create: {
        name: categoryName,
        slug: slug,
        description: description
      }
    });
    
    categories.push(category);
    console.log(`✓ Category ensured: ${category.name} (${category.slug})`);
  }
  
  return categories;
}

/**
 * Get the admin user (Joel Alvarado) from the database
 */
async function getAdminUser() {
  // Try to find existing admin user
  let adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'joel@dataetica.com' },
        { email: 'admin@dataetica.info' },
        { role: 'ADMIN' }
      ]
    }
  });
  
  // If no admin user found, create default one
  if (!adminUser) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    adminUser = await prisma.user.create({
      data: {
        email: 'joel@dataetica.com',
        name: 'Joel Alvarado',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✓ Created admin user: joel@dataetica.com');
  }
  
  return adminUser;
}

// =============================================================================
// MAIN EXECUTION FUNCTION
// =============================================================================

async function addPost() {
  try {
    console.log('🚀 Starting blog post creation...\n');
    
    // Validate required fields
    if (!POST_DATA.title) {
      throw new Error('Title is required');
    }
    
    if (!POST_DATA.contentFile && !POST_DATA.content) {
      throw new Error('Either contentFile or content must be provided');
    }
    
    if (!POST_DATA.categories || POST_DATA.categories.length === 0) {
      throw new Error('At least one category is required');
    }
    
    // Get content
    let content = POST_DATA.content;
    if (POST_DATA.contentFile) {
      console.log(`📖 Reading content from: ${POST_DATA.contentFile}`);
      content = readContentFromFile(POST_DATA.contentFile);
    }
    
    // Generate slug
    const slug = generateSlug(POST_DATA.title);
    console.log(`🏷️  Generated slug: ${slug}`);
    
    // Check if post with this slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: slug }
    });
    
    if (existingPost) {
      throw new Error(`A post with slug "${slug}" already exists. Please modify the title or use a different one.`);
    }
    
    // Get admin user
    const adminUser = await getAdminUser();
    
    // Ensure categories exist
    console.log('📁 Processing categories...');
    const categories = await ensureCategoriesExist(POST_DATA.categories);
    
    // Determine publication date
    const publishedAt = POST_DATA.publishedDate || getRandomDate(RANDOM_DATE_RANGE.start, RANDOM_DATE_RANGE.end);
    console.log(`📅 Publication date: ${publishedAt.toISOString().split('T')[0]}`);
    
    // Create the post
    console.log('✍️  Creating post in database...');
    const newPost = await prisma.post.create({
      data: {
        title: POST_DATA.title,
        slug: slug,
        content: content,
        excerpt: POST_DATA.excerpt,
        featuredImage: POST_DATA.featuredImage,
        status: POST_DATA.status as any,
        publishedAt: POST_DATA.status === 'PUBLISHED' ? publishedAt : null,
        authorId: adminUser.id
      }
    });
    
    // Connect categories
    console.log('🔗 Connecting categories...');
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: newPost.id,
          categoryId: category.id
        }
      });
      console.log(`  ✓ Connected to: ${category.name}`);
    }
    
    console.log('\n🎉 Post created successfully!');
    console.log('=================================');
    console.log(`📰 Title: ${newPost.title}`);
    console.log(`🏷️  Slug: ${newPost.slug}`);
    console.log(`📅 Published: ${publishedAt.toISOString().split('T')[0]}`);
    console.log(`📁 Categories: ${POST_DATA.categories.join(', ')}`);
    console.log(`✏️  Author: ${adminUser.name} (${adminUser.email})`);
    console.log(`📊 Status: ${newPost.status}`);
    console.log(`📄 Content length: ${content.length} characters`);
    console.log('=================================\n');
    
    // Display URL where post will be available
    console.log(`🌐 Post will be available at: /${slug}`);
    
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
}

// =============================================================================
// SCRIPT EXECUTION
// =============================================================================

async function main() {
  try {
    await addPost();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export { addPost, POST_DATA };
