const fs = require('fs');

function build_search() {
    const jsonFileNames = fs.readdirSync("data/json_files");
    const searchFileName = "data/search_index.json";
    
    // Concatenate sentences from each story together
    let sentences = [];
    for (const jsonFileName of jsonFileNames) {
        const jsonPath = "data/json_files/" + jsonFileName;;
        sentences = sentences.concat(JSON.parse(fs.readFileSync(jsonPath))["sentences"]);
    }

    // Write sentences into search_index.json
    const data = JSON.stringify(sentences)
    console.log(data)
    fs.writeFile(searchFileName, data, function (err) {
        if (err) throw err;
        console.log("Successfully wrote to search_index.json")
    })
}

build_search()