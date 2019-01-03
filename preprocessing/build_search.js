const fs = require('fs');

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
            console.log(storyID);
        }
        sentences = sentences.concat(newSentences);
    }

    // Write sentences into search_index.json
    const data = JSON.stringify(sentences)
    // console.log(data)
    fs.writeFile(searchFileName, data, function (err) {
        if (err) throw err;
        console.log("Successfully wrote to search_index.json")
    })
}

build_search()