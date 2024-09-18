import fetch from 'node-fetch';  // Ensure you have node-fetch installed (npm install node-fetch)
import fs from 'fs';             // Native Node.js module for file operations

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/myshell-ai/MeloTTS-English",
        {
            headers: {
                Authorization: "Bearer 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", // Replace with your API key
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();  // Returns audio as a Blob object
    return result;
}

// Converting Blob to Buffer so that it can be written to a file in Node.js
query({ "inputs": "hii, how are you?" }).then(async (audioBlob) => {
    const buffer = await audioBlob.arrayBuffer();   // Convert Blob to ArrayBuffer
    const audioBuffer = Buffer.from(buffer);        // Convert ArrayBuffer to Buffer

    // Save the Buffer as a file
    fs.writeFile('./sample_Audio.mp4', audioBuffer, (err) => {
        if (err) {
            console.error('Error writing the file:', err);
        } else {
            console.log('Audio file saved successfully as ./sample_Audio.mp4');
        }
    });
});
