import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key
const genAI = new GoogleGenerativeAI("AIzaSyD95-QXYZkz0iFIhcBtoDGDcjxVf5wb6ts");

const image_des  = await (async () => {
  // Load the generative model
  const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Set the sample prompt (replace this with any dynamic user prompt)
  const sample_prompt = "small kid";

  // Generalized prompt for generating a video script with descriptions and voice-over
  const prompt = `Generate a comedy video script based on the following criteria for the scenario: "${sample_prompt}":

1. Generate a script based on the provided scenario with appropriate dialogue, actions, and interactions.

2. Provide an array of detailed image descriptions, including:
   - Camera angles (e.g., wide shots, POV, close-ups).
   - Character expressions and actions.
   - Cinematic effects such as dynamic movements, focus shifts, and zooms.
   
3. Write captions with exact timestamps to match the timing of the script. Ensure the captions sync perfectly with the dialogue and actions.
   
4. Provide a plain voice-over script that can be directly converted into speech. The script should align with the dialogue and events in the scenario, and be clear enough for text-to-speech conversion.

5. Suggest background music that fits the mood and flow of the video, with transitions that match key moments in the scene.

6. only return json response object in response 


The response should be formatted like this:

{
  "image": [
    {
      "description": "Image description (e.g., wide shot of a character walking through the park)", 
      "image_number": 1, 
      "start_time": "00:00", 
      "end_time": "00:05"
    }
    // Add more images as needed
  ],

  "caption": [
    {
      "description": "Caption text (e.g., 'Character: What a beautiful day!')", 
      "start_time": "00:05", 
      "end_time": "00:07"
    }
    // Add more captions as needed
  ],

  "voice_over": {
    "description": "Plain voice-over script that can be converted into speech, matching the actions and dialogue in the scene."
  },

  "background_music": {
    "description": "Background music description, indicating transitions, mood, and intensity changes at key moments."
  }
}
`;

  try {
    // Generate the content from the model
    const result = await model.generateContent(prompt);
       
//     let responseText = result.response.text(); // Get the text response
// let responseJson = JSON.parse(responseText); // Parse the text into JSON
      const response = result.response.text() ; 
    // Log the result
    const image_des = JSON.parse(response.slice(7, -3));
   return image_des ;
    
// async function query(data) {
//   const response = await fetch(
//       "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
//       {
//           headers: {
//               Authorization: "Bearer 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", // Your API token
//               "Content-Type": "application/json",
//           },
//           method: "POST",
//           body: JSON.stringify(data),
//       }
//   );
//   const result = await response.blob();
//   return URL.createObjectURL(result); // Return the object URL for the image
// }



//  // Create an array of promises for each prompt
//  const promises = descriptions.map(prompt => query({ inputs: prompt }));

//  // Wait for all the images to be generated
//  const imageUrls = await Promise.all(promises);

//  console.log("This is images url link :- ",imageUrls);



    // console.log("Generated response:", responseJson);
  } catch (error) {
    // Handle errors
    console.error('Error generating content:', error);
  }
})();


export {image_des};