import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import {captionDurations, caption_descriptions} from "./required_data.js";

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

// Input data
// const captions = caption_descriptions;

// const captionDurations = captionDurations;

// Generate SRT content
const srtContent = generateSRT(caption_descriptions, captionDurations);

// Write to file
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
            })
            .on('error', (err) => {
                console.error('Error creating captioned video:', err);
            });
    }
});
