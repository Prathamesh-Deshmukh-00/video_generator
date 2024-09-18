import { fileURLToPath } from 'url'; 
import { readdirSync, writeFileSync, existsSync, unlinkSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import ffmpeg from 'fluent-ffmpeg';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory containing the images
const imagesDir = join(__dirname, 'images');

// Read the directory and filter out image files
const images = readdirSync(imagesDir).filter(file => file.endsWith('.png') || file.endsWith('.jpg'));

if (images.length === 0) {
  console.error('No images found in the images folder.');
  process.exit(1);
}

console.log('Images found:', images);

// Custom display durations for each image
const ImageDurations = [
  5, 7, 5,
  5, 5, 10
]; // Example durations for each image

// Ensure there are as many durations as images, or use a default duration for remaining images
const defaultDuration = 3;
const durations = images.map((_, index) => ImageDurations[index] || defaultDuration);

// Set paths to ffmpeg and ffprobe
const ffmpegPath = 'C:/Users/91766/Downloads/ffmpeg-7.0.2-essentials_build/ffmpeg-7.0.2-essentials_build/bin/ffmpeg.exe';
const ffprobePath = 'C:/Users/91766/Downloads/ffmpeg-7.0.2-essentials_build/ffmpeg-7.0.2-essentials_build/bin/ffprobe.exe';

// Define the path for filelist.txt
const fileListPath = join(__dirname, 'filelist.txt');

// Check if filelist.txt exists, if so, delete it
if (existsSync(fileListPath)) {
  console.log('filelist.txt already exists. Deleting it.');
  unlinkSync(fileListPath);
}

// Create a new filelist.txt with custom durations for each image
const fileListContent = images.map((img, index) => 
  `file '${join(imagesDir, img).replace(/\\/g, '/')}'\nduration ${durations[index]}`
).join('\n') + '\n';
writeFileSync(fileListPath, fileListContent);

// Log the file list path for debugging
console.log('New filelist.txt created at:', fileListPath);

// Debug: Print filelist.txt content
console.log('filelist.txt content:', readFileSync(fileListPath, 'utf8'));

// Create video from images using fluent-ffmpeg
const createVideoFromImages = async () => {
  const videoOutput = join(__dirname, 'output.mp4');

  const ffmpegCommand = ffmpeg()
    .setFfmpegPath(ffmpegPath)
    .setFfprobePath(ffprobePath);

  // Use the file list for input with proper inputOptions handling
  ffmpegCommand.input(fileListPath)
    .inputFormat('concat')  // Specify input format
    .inputOptions(['-safe', '0', '-f', 'concat'])  // Allow the use of absolute paths
    .outputOptions([
      '-c:v libx264',
      '-r 30',  // Frame rate
      '-pix_fmt yuv420p'  // Pixel format for wide compatibility
    ])
    .on('end', () => {
      console.log('Video created successfully:', videoOutput);
    })
    .on('error', (err) => {
      console.error('Error while creating video:', err);
    })
    .save(videoOutput);
};

// Call the function to create the video
createVideoFromImages();