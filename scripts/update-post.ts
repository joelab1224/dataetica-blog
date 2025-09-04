import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * UPDATE EXISTING BLOG POST SCRIPT
 * 
 * This script updates an existing blog post in the database.
 * Useful for content corrections, link fixes, or content improvements.
 */

// =============================================================================
// UPDATE CONFIGURATION
// =============================================================================

const UPDATE_CONFIG = {
  // Identify the post to update by slug
  postSlug: "the-infinite-resource-why-data-economics-will-define-the-21st-century-while-energy-remains-our-achilles-heel",
  
  // Content source
  contentFile: "data-economics-infinite-resource.md", // Read updated content from file
  
  // What to update (set to true to update that field)
  updateContent: true,
  updateTitle: false,
  updateExcerpt: false,
  
  // New values (only used if corresponding update flag is true)
  newTitle: "",
  newExcerpt: "",
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

// =============================================================================
// MAIN UPDATE FUNCTION
// =============================================================================

async function updatePost() {
  try {
    console.log('🔄 Starting post update...\n');
    
    // Find the existing post
    const existingPost = await prisma.post.findUnique({
      where: { slug: UPDATE_CONFIG.postSlug },
      include: { categories: { include: { category: true } } }
    });
    
    if (!existingPost) {
      throw new Error(`Post with slug "${UPDATE_CONFIG.postSlug}" not found`);
    }
    
    console.log(`📰 Found post: ${existingPost.title}`);
    console.log(`📅 Original publish date: ${existingPost.publishedAt?.toISOString().split('T')[0]}`);
    
    // Prepare update data
    const updateData: any = {};
    
    if (UPDATE_CONFIG.updateContent) {
      console.log(`📖 Reading updated content from: ${UPDATE_CONFIG.contentFile}`);
      const newContent = readContentFromFile(UPDATE_CONFIG.contentFile);
      updateData.content = newContent;
      console.log(`📄 New content length: ${newContent.length} characters`);
    }
    
    if (UPDATE_CONFIG.updateTitle && UPDATE_CONFIG.newTitle) {
      updateData.title = UPDATE_CONFIG.newTitle;
      console.log(`🏷️  Updating title to: ${UPDATE_CONFIG.newTitle}`);
    }
    
    if (UPDATE_CONFIG.updateExcerpt && UPDATE_CONFIG.newExcerpt) {
      updateData.excerpt = UPDATE_CONFIG.newExcerpt;
      console.log(`📝 Updating excerpt`);
    }
    
    // Update timestamp
    updateData.updatedAt = new Date();
    
    // Perform the update
    console.log('\n✍️  Updating post in database...');
    const updatedPost = await prisma.post.update({
      where: { slug: UPDATE_CONFIG.postSlug },
      data: updateData,
      include: { categories: { include: { category: true } } }
    });
    
    console.log('\n🎉 Post updated successfully!');
    console.log('=================================');
    console.log(`📰 Title: ${updatedPost.title}`);
    console.log(`🏷️  Slug: ${updatedPost.slug}`);
    console.log(`📅 Published: ${updatedPost.publishedAt?.toISOString().split('T')[0]}`);
    console.log(`🔄 Updated: ${updatedPost.updatedAt.toISOString().split('T')[0]}`);
    console.log(`📁 Categories: ${updatedPost.categories.map(c => c.category.name).join(', ')}`);
    console.log(`📊 Status: ${updatedPost.status}`);
    if (UPDATE_CONFIG.updateContent) {
      console.log(`📄 Content length: ${updatedPost.content.length} characters`);
    }
    console.log('=================================\n');
    
    console.log(`🌐 Post available at: /${updatedPost.slug}`);
    
  } catch (error) {
    console.error('❌ Error updating post:', error);
    throw error;
  }
}

// =============================================================================
// SCRIPT EXECUTION
// =============================================================================

async function main() {
  try {
    await updatePost();
  } catch (error) {
    console.error('Update script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export { updatePost };
