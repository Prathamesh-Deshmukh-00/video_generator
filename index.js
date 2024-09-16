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
const prompts =  
    [
        "Wide shot of a messy apartment. Balloons are deflated and strewn across the floor. A half-eaten cake sits on a table, surrounded by empty wine glasses. Two women, clearly hungover, are slumped on the couch in pajamas. One is trying to brush her hair, but it's a tangled mess.",
        'Close-up on the woman brushing her hair. Her eyes are bloodshot, and she looks exhausted. She sighs dramatically and throws the brush down.',
        'Medium shot of the two women on the couch. One is holding a glass of water, the other is holding a bottle of aspirin. They both look miserable.',
        'Close-up on the woman holding the aspirin. She pops one into her mouth and grimaces.',
        "Medium shot of the two women. One is making a dramatic 'death' gesture with her hands, the other is laughing.",
        "Close-up on the laughing woman. She's holding her stomach and tears are streaming down her face.",
        "Wide shot of the two women, now standing. They are both wearing sunglasses and holding cocktails. They are doing a 'model walk' around the apartment, looking glamorous and confident.",
        'Close-up on the woman holding a cocktail. She takes a sip and winks at the camera.',
        "Medium shot of the two women, now dressed in fancy outfits, standing in front of a mirror. They're adjusting their hair and makeup, giggling and posing.",
        "Close-up on the mirror, showing the two women's reflection. The image blurs and distorts, then suddenly cuts to a shot of them back on the couch, looking miserable, with the half-eaten cake in front of them. The camera zooms in on the cake, which is now covered in crumbs and lipstick.",
        'Wide shot of the apartment, now completely trashed. Balloons are deflated and strewn everywhere. Wine glasses are overturned, and the cake is now smeared across the table.'
      ];



// Call the function to generate multiple images
generateImages(prompts);
