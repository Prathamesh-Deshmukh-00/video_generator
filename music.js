import fetch from 'node-fetch';  // Make sure you have node-fetch installed
import fs from 'fs';             // Native Node.js module for file operations
import {baground_music_description} from "./required_data.js";

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
            headers: {
                Authorization: "Bearer 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", // Replace with your Hugging Face API key
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();  // Returns the audio in the form of a Blob
    return result;
}

// Query the model with your input and save the audio as "music.mp4"
query({ "inputs":await baground_music_description }).then(async (audioBlob) => {
    const buffer = await audioBlob.arrayBuffer();  // Convert Blob to ArrayBuffer
    const audioBuffer = Buffer.from(buffer);       // Convert ArrayBuffer to Buffer

    // Save the Buffer as a file
    fs.writeFile('./music.mp4', audioBuffer, (err) => {
        if (err) {
            console.error('Error writing the file:', err);
        } else {
            console.log('Audio file saved successfully as ./music.mp4');
        }
    });
});
