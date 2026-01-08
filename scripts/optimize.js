import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images_optimized');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
    console.log('Starting image optimization...');
    console.log(`Input Dir: ${imagesDir}`);
    console.log(`Output Dir: ${outputDir}`);

    try {
        const files = fs.readdirSync(imagesDir);

        // Filter only image files
        const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i));
        console.log(`Found ${imageFiles.length} images.`);

        for (const file of imageFiles) {
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(outputDir, file);

            // console.log(`Optimizing ${file}...`);

            try {
                await sharp(inputPath)
                    .resize({ width: 1600, withoutEnlargement: true })
                    .webp({ quality: 75, effort: 4 }) // Effort 4 is faster
                    .toFile(outputPath); // Use toFile instead of buffer+write to avoid memory issues with large batches

                // console.log(`✓ ${file}`);
            } catch (err) {
                console.error(`Failed to optimize ${file}:`, err.message);
                // Copy original if optimization fails
                fs.copyFileSync(inputPath, outputPath);
            }

            // Log progress every 10 images
            // if (imageFiles.indexOf(file) % 10 === 0) process.stdout.write('.');
        }
        console.log('\nAll images optimized to images_optimized/');
    } catch (error) {
        console.error('Fatal error:', error);
    }
}

optimizeImages();
