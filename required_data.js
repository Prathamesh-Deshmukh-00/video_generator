import {video_desc} from  "./sample.js";


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


export {ImageDurations,image_descriptions,captionDurations,caption_descriptions,voice_over_description}