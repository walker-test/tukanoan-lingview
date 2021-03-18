
export function TextFormatButton({ sentences, metadata }) {

    /* 
    Calls on individual helper functions to gather the morphemes,
    gloss, translation, and title of the selected sentence. 
    */
    function processSentences() {
        const dependents = sentences[0]["dependents"];
        //console.log(dependents);
        const aingaeWordList = dependents[0]["values"];
        const morphemeList = dependents[1]["values"];
        const glossList = dependents[3]["values"];

        const morphAndGloss = organizeWords(aingaeWordList, morphemeList, glossList);
        const morphemeMap = morphAndGloss["morphemes"];
        const glossMap = morphAndGloss["gloss"];
        //console.log(morphemeMap);
        //console.log(glossMap);

        const sentenceTranslation = getSentenceTranslation();     
        const title = getTitle();

        return {
            title : title,
            morphemes : morphemeMap,
            gloss : glossMap,
            sentenceTranslation : sentenceTranslation  
        };
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

    function getSentenceTranslation() {
        return sentences[0]["dependents"][5]["values"][0]["value"];
    }

    function getTitle() {
        const title = metadata["title"]["_default"];
        return title; 
    }

    /* Put the list of morphemes and gloss into LaTeX format with gb4e package style. */
    function convertToLatex(material) {
        // Some literal symbols used as latex markups.
        const begin = "\\begin{exe} \n  \\ex ";
        const end = "\\end{exe}";
        
        const glossLines = getGlossLines(material["morphemes"]);
        console.log(glossLines);

        const translationLine = getTranslationLatexLine(material["sentenceTranslation"]);
        console.log(translationLine);

        return begin + glossLines + translationLine;
    }

    function getGlossLines(morphemes) {
        const glossStart = "\\gll";
        const glossEnd = ".\\\\ \n";
        const textscStart = "\\textsc{";
        const textscClose = "}";

        let wordList = []; // This will contain the complete sentence without - or == 
        let glossList = [glossStart];
        let morphemeList = [];
        for (const [id, entry] of Object.entries(morphemes)) {
            for (const [wholeWord, morphs] of Object.entries(entry)) {
                wordList.push(wholeWord);
                glossList.push(morphs.join(""));
                for (const morph in morphs) {
                    morphemeList.push(textscStart + morph + textscClose + " ");
                }
            }
        }
        glossList.push(glossEnd);

        return wordList.join(" ") + " \\\\\n" + glossList.join(" ");
    }

    /* Puts the sentence translation into LaTeX format. */
    function getTranslationLatexLine(sentence) {
        const translationStart = "\\glt `";
        const translationEnd = "'\n";
        return translationStart + sentence + translationEnd;
    }

    /* Displays the created material in a popup window. */
    function displayInPopup(material) {
        let textFormatWindow = window.open("", "TextFormatWindow", "width=500,height=600");
        textFormatWindow.document.write(material);
    }

    function handleClick(e) {
        e.preventDefault();
        const processedMaterial = processSentences();
        const latexLines = convertToLatex(processedMaterial);
        displayInPopup(latexLines);
    }

    return (
        <div>
            <button onClick={handleClick}>
                Format
            </button>
        </div>)
    ; 
}