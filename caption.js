import fs from 'fs';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';
import { captionDurations, caption_descriptions } from './required_data.js';

const waitForFile = async (filePath, timeout = 600000, interval = 500) => {
    const fileExists = promisify(fs.access);
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            await fileExists(filePath, fs.constants.F_OK);
            return true; // File exists
        } catch (err) {
            console.log('Waiting for file:', filePath);
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }

    throw new Error(`File not found within timeout: ${filePath}`);
};

// Function to generate SRT content from captions and durations
function generateSRT(captions, durations) {
    let srtContent = '';
    let startTime = 0;
    let endTime = 0;

    captions.forEach((caption, index) => {
        startTime = index === 0 ? 0 : endTime;
        endTime = startTime + durations[index];

        const startHours = String(Math.floor(startTime / 3600)).padStart(2, '0');
        const startMinutes = String(Math.floor((startTime % 3600) / 60)).padStart(2, '0');
        const startSeconds = String(Math.floor(startTime % 60)).padStart(2, '0');
        const endHours = String(Math.floor(endTime / 3600)).padStart(2, '0');
        const endMinutes = String(Math.floor((endTime % 3600) / 60)).padStart(2, '0');
        const endSeconds = String(Math.floor(endTime % 60)).padStart(2, '0');

        srtContent += `${index + 1}\n`;
        srtContent += `${startHours}:${startMinutes}:${startSeconds},000 --> ${endHours}:${endMinutes}:${endSeconds},000\n`;
        srtContent += `${caption}\n\n`;
    });

    return srtContent;
}

(async () => {
    // Wait for the output.mp4 file (with a longer timeout of 10 minutes)
    try {
        await waitForFile('./output.mp4', 600000); // 600,000ms = 10 minutes

        // Generate SRT content
        const srtContent = generateSRT(await caption_descriptions, await captionDurations);

        // Write SRT file
        fs.writeFile('./captions.srt', srtContent, (err) => {
            if (err) {
                console.error('Error writing SRT file:', err);
            } else {
                console.log('captions.srt file has been saved!');

                // Add captions to video
                ffmpeg('./output.mp4')
                    .outputOptions('-vf', 'subtitles=captions.srt')
                    .save('./output_with_captions.mp4')
                    .on('end', () => {
                        console.log('Captioned video has been created!');
                        
                        // Delete the original output.mp4 file
                        fs.unlink('./output.mp4', (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting original video file:', unlinkErr);
                            } else {
                                console.log('Original video file deleted.');
                            }
                        });
                    })
                    .on('error', (err) => {
                        console.error('Error creating captioned video:', err);
                    });
            }
        });
    } catch (error) {
        console.error(error.message);
    }


    console.log("captions duration in caption foulder is :- " , captionDurations);
    console.log("captions description in caption foulder is :- " , caption_descriptions);
    
})();
