# Image Optimization Guide

## Quick Start

To optimize all PNG images in your project:

```bash
npm run optimize-images
```

This will:
- Convert all PNG images to WebP format (smaller file sizes)
- Keep original PNGs as fallback for older browsers
- Show compression statistics

## Manual Optimization

If you prefer to optimize images manually or use online tools:

### Option 1: Online Tools
1. Visit [Squoosh](https://squoosh.app/) or [TinyPNG](https://tinypng.com/)
2. Upload your PNG images
3. Convert to WebP format
4. Save as `.webp` files next to your original PNGs

### Option 2: Using Sharp (Already Installed)
```bash
npm run optimize-images
```

## Image Sizes

Current image sizes in `public/images/workly/`:
- workly1.png: ~70 KB
- workly2.png: ~156 KB
- workly3.png: ~993 KB ⚠️ (Very large!)
- workly4.png: ~183 KB
- workly5.png: ~99 KB

**Expected WebP savings:** 25-35% smaller file sizes

## How It Works

The `OptimizedImage` component automatically:
1. Tries to load WebP version first (if available)
2. Falls back to PNG if WebP fails or doesn't exist
3. Shows a blur placeholder while loading
4. Uses lazy loading for non-critical images
5. Preloads critical images (first image in carousel)

## Best Practices

1. **Optimize before committing**: Run `npm run optimize-images` before pushing changes
2. **Keep originals**: Don't delete PNG files - they're used as fallback
3. **Check file sizes**: Large images (>500KB) should be optimized
4. **Use appropriate quality**: WebP quality 85 is a good balance

## Troubleshooting

**Images not loading?**
- Make sure both `.png` and `.webp` files exist
- Check file paths in `projectsData.js`
- Verify images are in `public/images/` directory

**Build errors?**
- Ensure `sharp` is installed: `npm install --save-dev sharp`
- Check Node.js version (sharp requires Node 14+)
