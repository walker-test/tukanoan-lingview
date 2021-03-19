
/* Models a text format button. */
export function TextFormatButton({ sentences, metadata }) {

    /* 
    Calls on individual helper functions to gather the morphemes,
    gloss, translation, and title of the selected sentence. 
    */
    function processSentences() {
        let dependents;
        if (! sentences[0]) {
            dependents = sentences["dependents"]
        } else {
            dependents = sentences[0]["dependents"];
        }

        const aingaeWordList = dependents[0]["values"];
        const morphemeList = dependents[1]["values"];
        const glossList = dependents[3]["values"];

        const morphAndGloss = organizeWords(aingaeWordList, morphemeList, glossList);
        const morphemeMap = morphAndGloss["morphemes"];
        const glossMap = morphAndGloss["gloss"];
        const sentenceTranslation = getSentenceTranslation(dependents);  

        // Some metadata
        const title = getTitle();
        const storyId = getStoryId();
        const sentenceUrl = getSentenceUrl();

        return {
            storyId : storyId,
            title : title,
            sentenceUrl : sentenceUrl,
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
                // Add the "Undefined" strings just in case that some texts have glossing misaligned.
                // For texts with aligned morphemes and glossing, "Undefined" shouldn't show up,
                // but they do to avoid an error being thrown and as a way to let the user know 
                // that something is off with this sentence so they should edit the generated LaTeX code. 
                const morphemeEntry = morphemeList[morphemeListIndex] || "Undefined";;
                const glossEntry = glossList[morphemeListIndex] || "Undefined";
                if (morphemeEntry["start_slot"] >= wordStartSlot && morphemeEntry["end_slot"] <= wordEndSlot) {
                    // If a morpheme item has the whole word, eg. "cundyi-'je='fa", we need to
                    // split the current morpheme on = or -, so that each root or suffix or clitic is on its own. 
                    const morphemeValue = morphemeEntry["value"] || "Undefined";
                    const glossValue = glossEntry["value"] || "Undefined";
                    // First, add a space in front of = and - so that we can split on space later and preserve both = and -
                    const currentMorpheme = morphemeValue.replace("=", " =").replace("-", " -");
                    const currentGloss = glossValue.replace("=", " =").replace("-", " -");;          
                    const currentMorphemeSplit = currentMorpheme.split(" ");
                    const currentGlossSplit = currentGloss.split(" ");

                    for (const e of currentMorphemeSplit) {
                        if (e !== "") {
                            morphemes.push(e);
                        }
                    }
                    for (const e of currentGlossSplit) {
                        if (e !== "") {
                            gloss.push(e);
                        }
                    }
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

    /* Retrieves the English translation for the sentence. */
    function getSentenceTranslation(dependents) {
        // Find the tier that corresponds to the English translation. 
        for (let i = 0; i < dependents.length; i+=1) {
            const tierName = dependents[i]["tier"].toLowerCase();
            if (tierName == "frase en inglés" || tierName == "english") {
                return dependents[i]["values"][0]["value"];
            }
        }
    }

    /* Retrives the title of the story from metadata. */
    function getTitle() {
        const title = metadata["title"]["_default"];
        return title; 
    }

    /* Retrives the story ID. */
    function getStoryId() {
        return metadata["story ID"];
    }

    /* Retrives the sentence's URL. */ 
    function getSentenceUrl() {
        const isStoryTimed = metadata["timed"];
        const indexID = isStoryTimed ? (sentences[0]["start_time_ms"]-1) : (sentences["sentence_id"]);
        const url = window.location.href.replace(/\?.*$/,'') + `?${indexID}`;
        return url;
    }

    /* Convert a sentence into LaTeX format with gb4e-modified package style. */
    function convertToLatex(material) {
        const begin = "\\begin{exe} \n  \\ex \\label{example} \n  ";
        const end = "\\end{exe} \n";
        
        const morphLines = getMorphemeLines(material["morphemes"])
        const glossLine = getMorphologicalAnalysisLine(material["gloss"]);
        const translationLine = getSentenceTranslationLine(material["sentenceTranslation"]);
        // Replace _ with \_ so that it is recognized as underscore in LaTeX
        const storyTitle = material["title"].replace(/_/g, "\\_") + "\n"; 
        
        const toDisplay = begin + morphLines + glossLine + translationLine + storyTitle + end;
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
            }
        }
        glossList.push("\\\\ \n  ");

        return glossList.join(" ");
    }

    /* Puts the sentence translation into LaTeX format. */
    function getSentenceTranslationLine(sentence) {
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
    function displayInPopup(processedMaterial, latexLines) {
        const headerLine = "=============== New Sentence ================ <br>";
        const storyTitleLine = "Story title: " + processedMaterial["title"].replace(/\_/g, " ") + "\n"; 
        const storyIdLine = "Story ID: " + processedMaterial["storyId"].replace(/_/g, "\\_") + "\n"; 
        const sentenceUrlLine = "Sentence URL: " + processedMaterial["sentenceUrl"].replace(/_/g, "\\_") + "\n"; 
        const latexLibraryLine = "Formatted for gb4e and gb4e-modified LaTeX packages: <br>";

        let popupWindow = window.open("", "TextFormatWindow", "width=700,height=500");
        popupWindow.document.write(headerLine);
        // The <pre> tag is used for any pre-formatted texts. 
        popupWindow.document.write("<pre>" + storyTitleLine + "</pre>");
        popupWindow.document.write("<pre>" + storyIdLine + "</pre>");
        popupWindow.document.write("<pre>" + sentenceUrlLine + "</pre>");
        popupWindow.document.write("<br>");
        popupWindow.document.write(latexLibraryLine);
        popupWindow.document.write("<pre>" + latexLines + "</pre>");
    }

    function handleClick(e) {
        e.preventDefault();
        const processedMaterial = processSentences();
        const latexLines = convertToLatex(processedMaterial);
        displayInPopup(processedMaterial, latexLines);
    }

    return (
        <div>
            <button class="textFormatButton" onClick={handleClick}>
                Format
            </button>
        </div>); 
}
