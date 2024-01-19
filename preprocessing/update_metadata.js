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

let yamlObj = {};

const indexObj = tryCatch(
  () => JSON.parse(fs.readFileSync("data/index.json", "utf8")),
  "Failed to read or parse index.json"
);

tryCatch(() => {
  for (let uniqueId in indexObj) {
    yamlObj[uniqueId] = {
      title: indexObj[uniqueId].title._default,
      "audio filepath": indexObj[uniqueId].media.audio,
      "video filepath": indexObj[uniqueId].media.video,
      description: indexObj[uniqueId].description,
      genre: indexObj[uniqueId].genre,
      author: indexObj[uniqueId].author || "",
      glosser: indexObj[uniqueId].glosser,
      "date recorded": indexObj[uniqueId].date_created,
      //In the current "source" code, it doesn't look like _default is populated
      source: indexObj[uniqueId].source._default,
    };
  }
}, "Failed to update metadata.yaml with data from index.json");

tryCatch(
  () => fs.writeFileSync("data/metadata.yaml", yaml.stringify(yamlObj), "utf8"),
  "Failed to write to metadata.yaml"
);
