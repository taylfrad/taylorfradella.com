/**
 * Image optimization script
 * Converts PNG images to WebP format for better compression
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * Requires: sharp (npm install sharp --save-dev)
 * 
 * This script will:
 * 1. Find all PNG images in public/images
 * 2. Convert them to WebP format
 * 3. Keep original PNGs as fallback
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const IMAGES_DIR = join(process.cwd(), 'public', 'images');

async function findPngFiles(dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findPngFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.png') {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

async function optimizeImage(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  
  // Skip if WebP already exists and is newer
  if (existsSync(webpPath)) {
    const pngStat = await stat(pngPath);
    const webpStat = await stat(webpPath);
    
    if (webpStat.mtime > pngStat.mtime) {
      console.log(`⏭️  Skipping ${pngPath} (WebP already exists and is newer)`);
      return;
    }
  }
  
  try {
    const pngStat = await stat(pngPath);
    const originalSize = pngStat.size;
    
    await sharp(pngPath)
      .webp({ 
        quality: 85, // Good balance between quality and file size
        effort: 6, // Higher effort = better compression but slower
      })
      .toFile(webpPath);
    
    const webpStat = await stat(webpPath);
    const newSize = webpStat.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✅ ${pngPath}`);
    console.log(`   ${(originalSize / 1024).toFixed(2)} KB → ${(newSize / 1024).toFixed(2)} KB (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error optimizing ${pngPath}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  if (!existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }
  
  const pngFiles = await findPngFiles(IMAGES_DIR);
  
  if (pngFiles.length === 0) {
    console.log('ℹ️  No PNG files found to optimize.');
    return;
  }
  
  console.log(`Found ${pngFiles.length} PNG file(s) to optimize:\n`);
  
  for (const pngFile of pngFiles) {
    await optimizeImage(pngFile);
  }
  
  console.log('\n✨ Image optimization complete!');
}

main().catch(console.error);
