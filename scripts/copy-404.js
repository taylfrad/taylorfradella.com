import { copyFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const indexHtml = join(distDir, 'index.html');
const notFoundHtml = join(distDir, '404.html');

try {
  copyFileSync(indexHtml, notFoundHtml);
  console.log('✓ Created 404.html for GitHub Pages SPA routing');
} catch (error) {
  console.error('✗ Failed to create 404.html:', error.message);
  process.exit(1);
}
