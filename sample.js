import { GoogleGenerativeAI } from "@google/generative-ai";
import { input_data } from "./input_data_from_user.js";
import fs from 'fs';

// Replace with your actual API key
const genAI = new GoogleGenerativeAI("AIzaSyD95-QXYZkz0iFIhcBtoDGDcjxVf5wb6ts");

const image_des = async (input_data) => {
  // Load the generative model
  const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Generalized prompt for generating a video script with descriptions and voice-over
  const prompt = `Generate a video script based on the following criteria for the scenario: "${input_data}":

1. Generate a script based on the provided scenario with appropriate dialogue, actions, and interactions.

2. Provide an array of detailed image descriptions, including:
   - Camera angles (e.g., wide shots, POV, close-ups).
   - Character expressions and actions.
   - Cinematic effects such as dynamic movements, focus shifts, and zooms.
   
3. Write captions with exact timestamps to match the timing of the script. Ensure the captions sync perfectly with the dialogue and actions.
   
4. Provide a plain voice-over script that can be directly converted into speech. The script should align with the dialogue and events in the scenario, and be clear enough for text-to-speech conversion.

5. Suggest background music that fits the mood and flow of the video, with transitions that match key moments in the scene.

6. Only return JSON response object in response.

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
    const response = result.response.text();
    const image_des = JSON.parse(response.slice(7, -3)); // Remove leading/trailing unnecessary characters

    // Check if the response.js file exists
    if (!fs.existsSync('response.js')) {
      // Save the response to a .js file if it doesn't exist
      const jsContent = `const response = ${JSON.stringify(image_des, null, 2)};
export { response };`;
      fs.writeFileSync('response.js', jsContent, 'utf-8');
      console.log('First response saved to response.js');
    } else {
      // File exists, so keep the first response and do not overwrite it
      console.log('response.js already exists. Keeping the first response.');
    }

    // return image_des;
  } catch (error) {
    // Handle errors
    console.error('Error generating content:', error);
  }
};


   image_des(input_data);


// // Logic for video generation
// const checkVideoFile = async () => {
//   const videoPath = './video/final_output_with_music.mp4';
//   const videoExists = fs.existsSync(videoPath);

//   // Check if the video has been generated
//   if (videoExists) {
//     // Delete the response.js file
//     fs.unlinkSync('response.js');
//     console.log('Video generated. response.js file deleted.');
//   } else {
//     console.log('Video not yet generated. response.js file retained.');
//   }
// };

// // Periodically check if the video file exists (every 5 seconds)
// setInterval(checkVideoFile, 5000);

// export default data;
