import { fileURLToPath } from 'url';
import { readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static'; // Import ffmpeg-static
import sharp from 'sharp'; // Import sharp

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory containing the images
const imagesDir = join(__dirname, 'images');

// Function to check if an image is valid
const isValidImage = async (filePath) => {
  try {
    await sharp(filePath).metadata(); // Try to get metadata to check if image is valid
    return true;
  } catch (err) {
    console.error(`Invalid image: ${filePath}`);
    return false;
  }
};

// Read the directory and filter out invalid images
const filterValidImages = async () => {
  const files = readdirSync(imagesDir).filter(file => file.endsWith('.png') || file.endsWith('.jpg'));
  const validImages = [];

  for (const file of files) {
    const filePath = join(imagesDir, file);
    if (await isValidImage(filePath)) {
      validImages.push(file);
    } else {
      unlinkSync(filePath); // Optionally delete invalid images
    }
  }

  return validImages;
};

// Set the ffmpeg path to the static binary
ffmpeg.setFfmpegPath(ffmpegStatic);

// Create video from valid images using fluent-ffmpeg
const createVideoFromImages = async () => {
  const videoOutput = join(__dirname, 'output.mp4');
  const validImages = await filterValidImages();

  console.log('Valid images found:', validImages);

  const ffmpegCommand = ffmpeg();

  // Add each valid image to ffmpeg command
  validImages.forEach((image) => {
    const inputPath = join(imagesDir, image);
    ffmpegCommand.input(inputPath);
  });

  // Set output options to display each image for 3 seconds
  ffmpegCommand
    .outputOptions([
      '-vf fps=1/3',     // Set 1 frame every 3 seconds (each image will last 3 seconds)
      '-c:v libx264',    // Use H.264 codec
      '-pix_fmt yuv420p' // Pixel format for compatibility
    ])
    .on('end', () => {
      console.log('Video created successfully:', videoOutput);
    })
    .on('error', (err) => {
      console.error('Error while creating video:', err);
    })
    .save(videoOutput);
};

// Call the function to create video from images
createVideoFromImages();
