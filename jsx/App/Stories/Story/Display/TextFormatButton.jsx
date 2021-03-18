
export function TextFormatButton({ sentences, metadata }) {

    function processSentences() {
        const dependents = sentences[0]["dependents"];
        //console.log(dependents);
        const aingaeWordList = dependents[0]["values"];
        const morphemeList = dependents[1]["values"];
        const glossList = dependents[3]["values"];

        const morphAndGloss = organizeWords(aingaeWordList, morphemeList, glossList);
        const morphemeMap = morphAndGloss["morphemes"];
        const glossMap = morphAndGloss["gloss"];
        console.log("--------");
        console.log(morphemeMap);
        console.log(glossMap);
       
        return "hi";
    }

    /* Returns a map between each word and all of its sub-components (core and clitics, and gloss, etc.) */
    function organizeWords(wordList, morphemeList, glossList) {
        let wordListCounter = 0;
        let morphemeListIndex = 0;

        let word2Morpheme = {};
        let word2Gloss = {};

        while (wordListCounter < wordList.length) {
            word2Morpheme[wordListCounter] = {};
            word2Gloss[wordListCounter] = {};

            const wordEntry = wordList[wordListCounter];
            const word = wordEntry["value"];
            const wordStartSlot = wordEntry["start_slot"];
            const wordEndSlot = wordEntry["end_slot"];

            let morphemes = [];
            let gloss = [];
            let flag = true; 
            // Find the morphemes belonging to the current word, and add them and their gloss
            // into a list. 
            while (flag && morphemeListIndex < morphemeList.length) {
                const morphemeEntry = morphemeList[morphemeListIndex];
                const glossEntry = glossList[morphemeListIndex];
                if (morphemeEntry["start_slot"] >= wordStartSlot && morphemeEntry["end_slot"] <= wordEndSlot) {
                    morphemes.push(morphemeEntry["value"]);
                    gloss.push(glossEntry["value"]);
                    morphemeListIndex += 1;
                } else {   
                    flag = false;
                } 
            }

            word2Morpheme[wordListCounter][word] = morphemes;
            word2Gloss[wordListCounter][word] = gloss;
            wordListCounter += 1;
        }

        return {
            "morphemes" : word2Morpheme,
            "gloss" : word2Gloss
        };
    }

    function processMetadata() {

    }

    // functions for adding the formatter latex code 

    // functions to display these in a popup
    function displayInPopup(material) {
        let textFormatWindow = window.open("", "TextFormatWindow", "width=500,height=600");
        textFormatWindow.document.write(material);
    }

    function handleClick(e) {
        e.preventDefault();

        const processedSentences = processSentences();
        //displayInPopup(processedSentences);
    }

    return (
        <div>
            <button onClick={handleClick}>
                Format
            </button>
        </div>)
    ; 
}