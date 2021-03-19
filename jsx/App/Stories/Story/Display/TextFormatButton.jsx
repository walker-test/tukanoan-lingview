
export function TextFormatButton({ sentences, metadata }) {

    /* 
    Calls on individual helper functions to gather the morphemes,
    gloss, translation, and title of the selected sentence. 
    */
    function processSentences() {
        const dependents = sentences[0]["dependents"];

        const aingaeWordList = dependents[0]["values"];
        const morphemeList = dependents[1]["values"];
        const glossList = dependents[3]["values"];

        const morphAndGloss = organizeWords(aingaeWordList, morphemeList, glossList);
        const morphemeMap = morphAndGloss["morphemes"];
        const glossMap = morphAndGloss["gloss"];

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

    /* Convert a sentence into LaTeX format with gb4e-modified package style. */
    function convertToLatex(material) {
        // Some literal symbols used as latex markups.
        const begin = "\\begin{exe} \n  \\ex \\label{example} \n  ";
        const end = "\\end{exe}";
        
        const morphLines = getMorphemeLines(material["morphemes"])
        const glossLine = getMorphologicalAnalysisLine(material["gloss"]);
        const translationLine = getTranslationLatexLine(material["sentenceTranslation"]);
        // Replace _ with \_ so that it is recognized as underscore in LaTeX
        const storyTitle = material["title"].replace(/_/g, "\\_") + "\n"; 
        const toDisplay = begin + morphLines + glossLine + translationLine + storyTitle + end;
        console.log(toDisplay);
        return toDisplay; 
    }

    /* Combines the glossing and morphological analysis into their corresponding lines. */
    function getMorphemeLines(morphemes) {
        const morphemeStart = "\\gll";
        const morphemeEnd = "\\\\ \n  ";
        
        let wordList = []; // This will contain the complete sentence without - or == 
        let morphemeList = [morphemeStart]; // This has each word decomposed into suffices and clitics.
        for (const [id, entry] of Object.entries(morphemes)) {
            for (const [wholeWord, morphs] of Object.entries(entry)) {
                wordList.push(wholeWord);
                morphemeList.push(morphs.join(""));
            }
        }
        morphemeList.push(morphemeEnd);
        
        return wordList.join(" ") + " \\\\\n  " + morphemeList.join(" ");
    }

    function getMorphologicalAnalysisLine(gloss) {
        const textscStart = "\\textsc{";
        const textscClose = "}";

        let glossList = []; // This has the morphological analysis line.
        for (const [id, entry] of Object.entries(gloss)) {
            for (const [wholeWord, glossItems] of Object.entries(entry)) {
                let glossForThisWord = [];
                for (const [id, glossItem] of Object.entries(glossItems)) {
                    // Only the suffices and clitics need \textsc
                    if (isSuffix(glossItem)) {
                        glossForThisWord.push(textscStart + glossItem.toLowerCase() + textscClose);
                    } else {
                        glossForThisWord.push(glossItem); 
                    } 
                }
                // Reason for using the replace with "_" is that some glossed word is two words in
                // the translation, but two words with a space in between will be recognized as two
                // separate glossed word by the LaTeX package, so adding the underscore makes sure 
                // that a phrase made up with multiple words can still be grouped together after being rendered in LaTeX. 
                glossList.push(glossForThisWord.join("").replace(" ", "\\_"));
                console.log(glossList);
            }
        }
        glossList.push("\\\\ \n  ");

        return glossList.join(" ");
    }

    /* Puts the sentence translation into LaTeX format. */
    function getTranslationLatexLine(sentence) {
        const translationStart = "\\glt `";
        const translationEnd = "' \\\\ \n  ";
        return translationStart + sentence + translationEnd;
    }

    /* Checks if an item is a suffix or clitic. */
    function isSuffix(item) {
        // Suffix or clitic starts with = or -, or the entire word is capitalized.
        return item.startsWith("=") || item.startsWith("-") || item === item.toUpperCase();
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