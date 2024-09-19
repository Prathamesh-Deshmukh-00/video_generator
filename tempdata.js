// Simulate a temporary storage (in-memory)
let tempData = null;

// Function to import data from another file and store it temporarily
function importAndSaveData(data) {
  if (tempData === null) {
    tempData = data;
    console.log('Data saved temporarily:', tempData);
  } else {
    console.log('Cannot import new data. Clear the old data first.');
  }
}

// Function to get the temporarily saved data
function getTempData() {
  return tempData;
}

// Function to clear the temporary data
function clearTempData() {
  tempData = null;
  console.log('Temporary data cleared.');
}

export { importAndSaveData, getTempData, clearTempData };
