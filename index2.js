import fs from 'fs/promises';
import fetch from 'node-fetch'; // Use node-fetch for ES modules
import {image_descriptions} from "./required_data.js"

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
            headers: {
                Authorization: "Bearer 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", // Your API token
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob(); // Get the image Blob from response
    return result; // Return the Blob object itself
}

// Function to generate multiple images and save them in a folder
async function generateImages(prompts) {
    // Create an array of promises for each prompt
    const promises = prompts.map(prompt => query({ inputs: prompt }));

    // Wait for all the images to be generated
    const blobs = await Promise.all(promises);

    // Ensure the images directory exists
    try {
        await fs.mkdir('./images', { recursive: true });
    } catch (error) {
        console.error('Error creating directory:', error.message);
    }

    // Save each image Blob to the local file system
    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];

        // Convert Blob to ArrayBuffer to save to disk
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Write the buffer to a file (save images with appropriate names)
        try {
            await fs.writeFile(`./images/img_${i}.png`, buffer);
            console.log(`Image img_${i}.png saved.`);
        } catch (error) {
            console.error(`Error saving image img_${i}.png:`, error.message);
        }
    }
}

// Prompts for generating different images
// const prompts = image_descriptions;

// The array now contains 50 descriptions, and you can continue adding more positive, creative, and respectful scenarios.


// Call the function to generate multiple images
generateImages(image_descriptions);
