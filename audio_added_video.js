import { exec } from 'child_process';
import fs from 'fs';

// Define paths
const videoPath = './output_with_captions.mp4';
const speechAudioPath = './audio/speech.mp3';
const musicPath = './music.mp4';
const outputPath = './video/final_output_with_music.mp4';

// Function to check if all files exist
const allFilesAvailable = (files) => {
    return new Promise((resolve, reject) => {
        const checkFiles = () => {
            const missingFiles = files.filter(file => !fs.existsSync(file));
            if (missingFiles.length === 0) {
                resolve();
            } else {
                setTimeout(checkFiles, 10000); // Check again after 10 second
            }
        };
        checkFiles();
    });
};

// FFmpeg command
const createVideo = () => {
    const ffmpegCommand = `ffmpeg -i ${videoPath} -i ${speechAudioPath} -i ${musicPath} -filter_complex "[1:a][2:a]amix=inputs=2:duration=shortest[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -shortest ${outputPath}`;

    // Execute the FFmpeg command
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`FFmpeg stderr: ${stderr}`);
        }

        // Check if the output video was created
        fs.access(outputPath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Video creation failed or output file not found');
                return;
            }

            console.log(`Video with speech and background music created successfully at ${outputPath}`);

            // Delete the files after successful video creation
            const filesToDelete = [speechAudioPath, videoPath, musicPath];

            filesToDelete.forEach((filePath) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file ${filePath}: ${err.message}`);
                        return;
                    }
                    console.log(`Successfully deleted file: ${filePath}`);
                });
            });
        });
    });
};

// Wait until all files are available
const filesToCheck = [videoPath, speechAudioPath, musicPath];
allFilesAvailable(filesToCheck).then(() => {
    createVideo();
}).catch(err => {
    console.error(`Error checking files: ${err.message}`);
});
