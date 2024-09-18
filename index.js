
import {image_descriptions} from "./required_data.js";
// Function to query Hugging Face API and generate an image
async function query(data) {
    try {
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

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.blob();
        return URL.createObjectURL(result); // Return the object URL for the image
    } catch (error) {
        console.error("Error fetching image:", error);
        return null; // Return null or a placeholder image URL in case of an error
    }
}

// Function to generate and display multiple images
async function generateImages(prompts) {
    const imagesContainer = document.querySelector('.images');
    imagesContainer.innerHTML = ''; // Clear previous images

    // Create an array of promises for each prompt
    const promises = prompts.map(prompt => query({ inputs: prompt }));

    // Wait for all the images to be generated
    const imageUrls = await Promise.all(promises);

    // Display each image in the container
    imageUrls.forEach(imageUrl => {
        if (imageUrl) {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = 'Generated image';
            imagesContainer.appendChild(img);
        }
    });
}

// Prompts for generating different images
// const prompts =  
// image_descriptions;



// Call the function to generate multiple images
generateImages(image_descriptions);
