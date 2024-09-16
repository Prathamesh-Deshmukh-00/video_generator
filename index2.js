import fs from 'fs/promises';
import fetch from 'node-fetch'; // Use node-fetch for ES modules

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
const prompts = [
    "Wide shot of three girls, ANNA, CHLOE, and MIA, standing in front of a mirror in a dressing room. They're trying on different outfits, giggling, and posing for each other.",
    "Close-up on Anna, who's holding up a sparkly pink dress. She's looking at it with a skeptical expression, then throws it back on the rack with a dramatic sigh.",
    'Chloe is holding up a pair of bright green pants, looking confused. Mia points at the pants, then points at her own head in a gesture of disbelief.',
    'Mia holds up a neon yellow crop top, twirling it around and striking a confident pose. Chloe and Anna look at each other, their eyes wide with amusement.',
    "Close-up on Anna's face. She's trying to contain her laughter, but her shoulders are shaking.",
    'Mia suddenly throws her head back and laughs loudly, the neon top flying off her shoulder. Chloe joins in, doubling over with laughter. Anna tries to maintain a straight face, but eventually cracks a smile.',
    'The girls are now huddled together, laughing hysterically. The camera zooms out, showing their reflections in the mirror, distorted by their laughter.',
    
    // Additional prompts
    "A young woman stands at a bus stop, her hair blowing gently in the wind. She's holding a coffee cup, lost in thought as she watches the sunset.",
    "Two friends are sitting in a park, chatting and laughing while sharing a picnic. They are surrounded by nature, and the mood is relaxed and joyful.",
    "A group of women jogs together along the beach, the waves crashing nearby. They are energized, supporting each other in their fitness journey.",
    "A confident businesswoman steps into a meeting room, holding a tablet. She's ready to present her ideas to a group of colleagues.",
    "A woman is sitting by the window in a cozy cafe, reading a book and sipping tea. The soft light creates a peaceful atmosphere around her.",
    "A fashion designer is carefully working on her latest creation, pinning fabric onto a mannequin. Her workspace is full of color and creativity.",
    "A group of women is at a yoga class, focusing on their breathing and stretching in sync. The atmosphere is calm and meditative.",
    "A photographer captures a candid moment of a woman laughing with her friends at a birthday party, balloons and confetti filling the background.",
    "A young woman is hiking up a mountain trail, her backpack slung over one shoulder. The landscape around her is breathtakingly beautiful.",
    "A chef is in the kitchen, expertly chopping vegetables and preparing a delicious meal. Her expression is one of focus and passion.",
    "A woman stands on stage at a music festival, microphone in hand, her voice carrying through the crowd. The audience is cheering and dancing along.",
    "A mother and daughter are sitting on a couch, looking through an old photo album. They smile and reminisce about past memories.",
    "A group of women is gathered around a table, working together on a community project. Their teamwork and dedication are evident.",
    "A woman is painting a mural on a city wall, her vibrant colors bringing life to the street. People pass by and admire her work.",
    "A scientist is in a lab, carefully analyzing samples under a microscope. Her focus and expertise are clear as she records her findings.",
    "A woman is practicing her guitar in a quiet room, her fingers strumming the strings as she hums along to the melody.",
    "A group of women is enjoying a road trip together, singing along to their favorite songs as the car cruises down an open highway.",
    "A woman stands on the balcony of a high-rise apartment, gazing out at the city lights below. The night sky is filled with stars.",
    "A woman is volunteering at an animal shelter, gently petting a dog and making sure it feels loved and cared for.",
    "A female athlete is crossing the finish line at a marathon, her face full of determination and pride in her achievement.",
    "A woman is organizing her art studio, preparing for an upcoming gallery exhibition. Canvases and brushes are neatly arranged around her.",
    "A group of women is on a camping trip, sitting around a bonfire and roasting marshmallows under the starry sky.",
    "A young woman is sitting in a dance studio, tying her ballet shoes. She stands and begins to practice her graceful movements.",
    "A woman is standing in her garden, tending to a variety of blooming flowers. The sun is shining, and she feels at peace.",
    "A woman is at a bookstore, flipping through the pages of a novel. She smiles as she finds a passage that resonates with her.",
    "A group of women is sitting at a cozy restaurant, enjoying a meal and sharing stories from their day. The atmosphere is warm and lively.",
    "A woman is sketching in her notebook while sitting in a park, drawing inspiration from the nature around her.",
    "A woman is at the gym, lifting weights and focusing on her strength training routine. She is motivated and pushing herself.",
    "A woman is decorating her home for a holiday, hanging lights and arranging festive decorations with a smile on her face.",
    "A woman is standing on a beach, looking out at the ocean. The wind is in her hair, and she feels a sense of freedom and serenity.",
    "A group of women is at a dance class, moving together in rhythm with the music. Their energy is contagious, and they are having fun.",
    "A woman is at an art gallery, admiring a collection of modern paintings. She stands quietly, taking in the creativity around her.",
    "A woman is on a nature hike, pausing to take a photo of a beautiful waterfall. The sound of the rushing water fills the air.",
    "A woman is in a pottery studio, carefully shaping a clay vase on a spinning wheel. Her hands are covered in clay as she works.",
    "A woman is sitting at a piano, her fingers gracefully moving over the keys as she plays a soothing melody.",
    "A woman is preparing for a marathon, stretching and warming up at the starting line with other runners around her.",
    "A woman is teaching a group of children how to plant flowers in a community garden. She smiles as they eagerly dig into the soil.",
    "A woman is kayaking on a peaceful lake, surrounded by trees and the gentle sounds of nature.",
    "A woman is decorating cupcakes in her kitchen, carefully adding icing and sprinkles. The kitchen smells delicious, and she is proud of her work.",
    "A woman is dancing in the rain, her arms outstretched and her face turned up to the sky. She feels alive and joyful in the moment.",
    "A woman is sitting on a bench by a lake, watching ducks swim by. The scene is tranquil, and she feels a deep sense of calm.",
    "A woman is attending a concert, her hands raised in the air as she sings along with the band. The crowd around her is buzzing with energy.",
    "A woman is standing at the edge of a cliff, looking out at the expansive view below. The wind blows gently through her hair as she takes in the beauty of the landscape.",
    "A woman is in a flower shop, selecting a bouquet of colorful blooms. She smiles as she inhales the fresh scent of the flowers."
];

// The array now contains 50 descriptions, and you can continue adding more positive, creative, and respectful scenarios.


// Call the function to generate multiple images
generateImages(prompts);
