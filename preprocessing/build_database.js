const fs = require('fs');

function build(storyFilesDir, indexFileName, dbFileName) {
  const db = {
    'index': JSON.parse(fs.readFileSync(indexFileName, 'utf8')),
    'stories': [],
    'search_index': []
  };

  const storyFileNames = fs.readdirSync(storyFilesDir).filter(f => f[0] != "."); // excludes hidden files
  for (const storyFileName of storyFileNames) {
    // console.log("Reading " + storyFileName);
    db['stories'].push(JSON.parse(fs.readFileSync(storyFilesDir + storyFileName, 'utf8')));
  }

  db['search_index'] = db['search_index'].concat(build_search());

  const dbPrettyString = JSON.stringify(db, null, 2);
  fs.writeFileSync(dbFileName, dbPrettyString);
  console.log("📤  The database was updated.");
}

module.exports = {
  build: build
};

function build_search() {
  const jsonFileNames = fs.readdirSync("data/json_files");
  const searchFileName = "data/search_index.json";
  
  // Concatenate sentences from each story together
  let sentences = [];
  for (const jsonFileName of jsonFileNames) {
      const jsonPath = "data/json_files/" + jsonFileName;
      const f = JSON.parse(fs.readFileSync(jsonPath))
      const storyID = f.metadata["story ID"]
      let newSentences = f["sentences"]
      for (sentence in newSentences) {
          newSentences[sentence]["story"] = storyID;
      }
      sentences = sentences.concat(newSentences);
  }

  // Write sentences into search_index.json
  let data = []
  for (i in sentences) {
      const sentence = sentences[i]
      let reformatted = {
        "num_slots" : sentence["num_slots"],
        "text" : sentence["text"],
        "story" : sentence["story"],
        "start_time_ms" : sentence["start_time_ms"],
        "dependents" : {}
      };
      for (j in sentence["dependents"]) {
          const tier = sentence["dependents"][j];
          const tierName = tier.tier;
          reformatted["dependents"][tierName] = tier.values;
      }
      data.push(reformatted);
  }

  return data
}
