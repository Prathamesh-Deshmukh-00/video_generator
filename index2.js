import fs from 'fs/promises';
import fetch from 'node-fetch'; // Use node-fetch for ES modules
import sharp from 'sharp'; // For image validation
import { image_descriptions } from "./required_data.js";

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

// Function to validate image using sharp
async function validateImage(filePath) {
    try {
        await sharp(filePath).metadata(); // This will throw an error if the image is not valid
        return true;
    } catch (error) {
        console.error(`Invalid image ${filePath}:`, error.message);
        return false;
    }
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

    // Save each image Blob to the local file system and validate them
    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];

        // Convert Blob to ArrayBuffer to save to disk
        const buffer = Buffer.from(await blob.arrayBuffer());

        const filePath = `./images/img_${i}.png`;

        // Write the buffer to a file (save images with appropriate names)
        try {
            await fs.writeFile(filePath, buffer);
            console.log(`Image img_${i}.png saved.`);

            // Validate the image
            const isValid = await validateImage(filePath);
            if (!isValid) {
                console.log(`Deleting invalid image img_${i}.png and regenerating...`);
                await fs.unlink(filePath); // Delete the invalid image

                // Regenerate the image
                const newBlob = await query({ inputs: prompts[i] });
                const newBuffer = Buffer.from(await newBlob.arrayBuffer());
                await fs.writeFile(filePath, newBuffer); // Save the regenerated image
                console.log(`Regenerated and saved img_${i}.png.`);
            }
        } catch (error) {
            console.error(`Error saving or validating image img_${i}.png:`, error.message);
        }
    }
}

// Call the function to generate and validate multiple images
generateImages(image_descriptions);


// export {generateImages}