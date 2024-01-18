/**
 * Reads and updates the index.json file with metadata from metadata.yaml.
 * Also checks if the audio and video files specified in metadata.yaml exist.
 */

const fs = require("fs");
const yaml = require("yaml");

/**
 * Executes a function and handles any errors that occur by logging an error message and exiting the process.
 * @param {Function} func - The function to execute.
 * @param {string} errorMessage - The error message to log if an error occurs.
 * @returns {*} - The result of the executed function.
 */
function tryCatch(func, errorMessage) {
  try {
    return func();
  } catch (error) {
    console.error(`${errorMessage}: ${error.message}`);
    process.exit(1);
  }
}

// Read and parse metadata.yaml
const yamlObj = tryCatch(
  () => yaml.parse(fs.readFileSync("data/metadata.yaml", "utf8")),
  "Failed to read or parse metadata.yaml"
);

// Parse index.json
let indexObj = tryCatch(
  () => JSON.parse(fs.readFileSync("data/index.json", "utf8")),
  "Failed to read or parse index.json"
);

// Process each unique ID in metadata.yaml
for (let uniqueId in yamlObj) {
  if (!indexObj[uniqueId]) {
    console.warn(`Unique ID ${uniqueId} not found in index.json`);
  } else {
    // Check if audio file exists
    tryCatch(() => {
      const audio = yamlObj[uniqueId]["audio filepath"];
      if (audio) {
        fs.accessSync(`data/media_files/${audio}`, fs.constants.F_OK);
      }
    }, `Audio file ${yamlObj[uniqueId]["audio filepath"]} not found`);

    // Check if video file exists
    tryCatch(() => {
      const video = yamlObj[uniqueId]["video filepath"];
      if (video) {
        fs.accessSync(`data/media_files/${video}`, fs.constants.F_OK);
      }
    }, `Video file ${yamlObj[uniqueId]["video filepath"]} not found`);

    // Update index.json with metadata from metadata.yaml
    tryCatch(() => {
      indexObj[uniqueId].title._default = yamlObj[uniqueId].title;
      indexObj[uniqueId].media.audio = yamlObj[uniqueId]["audio filepath"];
      indexObj[uniqueId].media.video = yamlObj[uniqueId]["video filepath"];
      indexObj[uniqueId].description = yamlObj[uniqueId].description;
      indexObj[uniqueId].genre = yamlObj[uniqueId].genre;
      indexObj[uniqueId].author = yamlObj[uniqueId].author;
      indexObj[uniqueId].glosser = yamlObj[uniqueId].glosser;
      indexObj[uniqueId].date_created = yamlObj[uniqueId]["date recorded"];
      indexObj[uniqueId].source._default = yamlObj[uniqueId].source;
    }, "Failed to update index.json with metadata.yaml data");
  }
}
// Write updated index.json back to file
tryCatch(
  () =>
    fs.writeFileSync(
      "data/index.json",
      JSON.stringify(indexObj, null, 2),
      "utf8"
    ),
  "Failed to write to index.json"
);
