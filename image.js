import fetch from "node-fetch";
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}
query("Can you please let us know more details about your ").then((response) => {
    console.log(JSON.stringify(response));
});
// [{"generated_text":"Can you please let us know more details about your ids as a subscriber or other related project? Be sure to update your username and password or it will be stolen via email. Our information is only accessible through our website, and the payment support services"}]




  // Assuming `result.response.text()` returns a promise that resolves to the response text
//   result.response.text()
//   .then(text => {
//     // Convert the text response to a JSON object
//     const jsonResponse = JSON.parse(text);
  
//     // Extract image descriptions
//     const imageDescriptions = jsonResponse.image.map(img => img.description);
  
//     // Log or use the image descriptions as needed
//     console.log(imageDescriptions);
//   })
//   .catch(error => {
//     console.error('Error parsing JSON:', error);
//   });
  