import { exec } from 'child_process';

const videoPath = './output_with_captions.mp4';
const speechAudioPath = './audio/speech.mp3';
const musicPath = './music.mp4';
const outputPath = './video/final_output_with_music.mp4';

const ffmpegCommand = `ffmpeg -i ${videoPath} -i ${speechAudioPath} -i ${musicPath} -filter_complex "[1:a][2:a]amix=inputs=2:duration=shortest[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -shortest ${outputPath}`;

// Execute the FFmpeg command
exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`FFmpeg stderr: ${stderr}`);
        return;
    }
    console.log(`Video with speech and background music created successfully at ${outputPath}`);
});
