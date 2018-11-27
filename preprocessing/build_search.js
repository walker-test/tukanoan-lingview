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
    let data = []
    for (i in sentences) {
        const sentence = sentences[i]
        let reformatted = {};
        console.log(sentence);
        reformatted["num_slots"] = sentence["num_slots"];
        reformatted["text"] = sentence["text"];
        reformatted["dependents"] = {};
        for (j in sentence["dependents"]) {
            const tier = sentence["dependents"][j];
            const tierName = tier.tier;
            reformatted["dependents"][tierName] = tier.values;
        }
        data.push(reformatted);
    }

    data = JSON.stringify(data)
    console.log(data)
    fs.writeFile(searchFileName, data, function (err) {
        if (err) throw err;
        console.log("Successfully wrote to search_index.json")
    })
}

build_search()