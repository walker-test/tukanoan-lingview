
export function TextFormatButton({ sentences, metadata }) {

    // functions for processing sentences (maps of words to morphemes and glossings, etc)
    function processSentences() {
        const dependents = sentences[0]["dependents"];
        const aingaeWordList = dependents[0]["values"];
        console.log(aingaeWordList);
        const morphemeList = dependents[1]["values"];
        console.log(morphemeList);

        const word2morpheme = wordToMorpheme(aingaeWordList, morphemeList);
        console.log(word2morpheme);
        return "hi";
    }

    function wordToMorpheme(wordList, morphemeList) {
        let wordListCounter = 0;
        let word2Morpheme = {};
        let morphemeListIndex = 0;
        let wordCounterIndex = 0; // Each word gets a unique id

        while (wordListCounter < wordList.length) {
            const wordEntry = wordList[wordListCounter];
            const word = wordEntry["value"];
            word2Morpheme[wordCounterIndex] = { word : [] };

            const wordStartSlot = wordEntry["start_slot"];
            const wordEndSlot = wordEntry["end_slot"];
            // TODO: Check these start and end slots 
            let morphemes = [];
            while (morphemeListIndex < morphemeList.length) {
                const morphemeEntry = morphemeList[morphemeListIndex];
                if (morphemeEntry["start_slot"] >= wordStartSlot && morphemeEntry["end_slot"] < wordEndSlot) {
                    morphemes.push(morphemeEntry["value"]);
                }
                morphemeListIndex += 1;
            }
            word2Morpheme[wordCounterIndex][word] = morphemes;
            wordCounterIndex += 1;
            wordListCounter += 1;
        }

        return word2Morpheme;
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