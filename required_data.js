// import image_des from  "./sample.js";
import fs from 'fs/promises';  // For checking if file exists
// import {importAndSaveData,getTempData,clearTempData} from "./tempdata.js";
import {response} from "./response.js";


// // Function to check if the video file exists
// async function checkVideoFile() {
//   try {
//     await fs.access('./video/final_output_with_music.mp4');
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// // Function to delete the temporary data if the video file is generated
// async function deleteTempDataIfVideoExists() {
//   const fileExists = await checkVideoFile();
//   if (fileExists) {
//     clearTempData();
//     console.log('Video file exists, temporary data cleared.');
//   }
// }

// //calling function to delete tempory stored data 
// deleteTempDataIfVideoExists();

// //add data in tempory varable if not any data present in variable
// if (getTempData() == null){
// importAndSaveData(await image_des);
// }


const video_desc =  response; 

console.log("Generated proper json response:",video_desc);

const  image_descriptions = video_desc.image.map((object) => object.description);
console.log("images description :- " ,image_descriptions);

const  caption_descriptions = video_desc.caption.map((object) => object.description);
console.log("captions description :- " ,caption_descriptions);


// this function return array of image timing 
function calculateImageDurations(response) {
  // Helper function to convert time string to seconds
  function timeToSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  // Extract image data
  const images = response.image;

  // Calculate time differences between consecutive images
  const images_seconds = images.map((image) => {
    const prevEndTime = image.end_time;
    const currStartTime = image.start_time;

    return timeToSeconds(prevEndTime) - timeToSeconds(currStartTime);
  });

  return images_seconds;
}


// this function return array of caption timing 
function calculateCaptionDurations(response) {
  // Helper function to convert time string to seconds
  function timeToSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }

     // Extract caption  data
     const captions = response.caption;

  // Calculate time differences between consecutive images
  const captions_seconds = captions.map((caption) => {
    const prevEndTime = caption.end_time;
    const currStartTime = caption.start_time;

    return timeToSeconds(prevEndTime) - timeToSeconds(currStartTime);
  });

  return captions_seconds;
}

//call function those return timing for each image in video
const ImageDurations = calculateImageDurations(video_desc);
console.log("ImageDurations :- ", ImageDurations);


//call function those return timing for each caption in video
const captionDurations = calculateCaptionDurations(video_desc);
console.log("captionDurations :- ", captionDurations);

// voice over script for making video 
const voice_over_description = video_desc.voice_over.description ;
 console.log("voice over description for video is : - ", voice_over_description);

// baground music description script for making video 
const baground_music_description = video_desc.background_music.description ;
 console.log("baground music description for video is : - ", baground_music_description);


export {ImageDurations,image_descriptions,captionDurations,caption_descriptions,voice_over_description,baground_music_description} 