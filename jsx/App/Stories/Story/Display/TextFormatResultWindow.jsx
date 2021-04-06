import React from 'react';

export default class TextFormatResultWindow extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
        this.latexSectionNames = ["original sentence", "morphemes", "morpheme translations", "sentence translation"];
    }

    componentDidMount() {
        this.main(); 
    }

    /* 
      Calls on individual helper functions to gather the morphemes,
      gloss, translation, and title of the selected sentence. 
      */
    processSentences() {

      // TODO: there might be multiple sentences in this timestamp 
      // (according to LabeledTimeBlock from Timed.jsx)
      let dependents = this.props.sentence["dependents"];

      // Get each Latex section's corresponding tier name.
      const wordTier = this.props.tierMap["original sentence"];
      const morphemeTier = this.props.tierMap["morphemes"];
      const glossTier = this.props.tierMap["morpheme translations"];
      const sentenceTranslationTier = this.props.tierMap["sentence translation"];

      let wordList = [];
      let morphemeList = [];
      let glossList = [];
      let sentenceTranslation = []; 

      // Loop through dependents to match each Latex section's tier name to the actual content of that tier. 
      for (var idx in dependents) {
          const tierName = dependents[idx]["tier"];
          if (tierName === wordTier) {
            wordList = dependents[idx]["values"];
          }
          if (tierName === morphemeTier) {
            morphemeList = dependents[idx]["values"];
          }
          if (tierName === glossTier) {
            glossList = dependents[idx]["values"];
          }
          if (tierName === sentenceTranslationTier) {
            sentenceTranslation = dependents[idx]["values"];
          }
          
      }

      const morphAndGloss = this.organizeWords(wordList, morphemeList, glossList);
      const morphemeMap = morphAndGloss["morphemes"];
      const glossMap = morphAndGloss["gloss"];

      // Some metadata
      const title = this.getTitle();
      const storyId = this.getStoryId();
      const sentenceUrl = this.getSentenceUrl();

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
    organizeWords(wordList, morphemeList, glossList) {
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

    /* Retrives the title of the story from metadata. */
    getTitle() {
        const title = this.props.metadata["title"]["_default"];
        return title; 
    }

    /* Retrives the story ID. */
    getStoryId() {
        return this.props.metadata["story ID"];
    }

    /* Retrives the sentence's URL. */ 
    getSentenceUrl() {
        const isStoryTimed = this.props.metadata["timed"];
        const indexID = isStoryTimed ? (this.props.sentence["start_time_ms"]-1) : (this.props.sentence["sentence_id"]);
        const url = window.location.href.replace(/\?.*$/,'') + `?${indexID}`;
        return url;
    }

    /* Convert a sentence into LaTeX format with gb4e-modified package style. */
    convertToLatex(material) {
        const begin = "\\begin{exe} \n  \\ex \\label{example} \n  ";
        const end = "\\end{exe} \n";
        
        const morphLines = this.getMorphemeLines(material["morphemes"])
        const glossLine = this.getMorphologicalAnalysisLine(material["gloss"]);
        const translationLine = this.getSentenceTranslationLine(material["sentenceTranslation"]);
        // Replace _ with \_ so that it is recognized as underscore in LaTeX
        const storyTitle = material["title"].replace(/_/g, "\\_") + "\n"; 
        
        const toDisplay = begin + morphLines + glossLine + translationLine + storyTitle + end;
        return toDisplay; 
    }

    /* Combines the glossing and morphological analysis into their corresponding lines. */
    getMorphemeLines(morphemes) {
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
        
        return wordList.join(" ") + " \n  " + morphemeList.join(" ");
    }

    getMorphologicalAnalysisLine(gloss) {
        const textscStart = "\\textsc{";
        const textscClose = "}";

        let glossList = []; // This has the morphological analysis line.
        for (const [id, entry] of Object.entries(gloss)) {
            for (const [wholeWord, glossItems] of Object.entries(entry)) {
                let glossForThisWord = [];
                for (const [id, glossItem] of Object.entries(glossItems)) {
                    // Only the suffices and clitics need \textsc
                    if (this.isSuffix(glossItem)) {
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
    getSentenceTranslationLine(sentenceObject) {
        const sentence = sentenceObject[0]["value"];
        const translationStart = "\\glt `";
        const translationEnd = "' \\\\ \n  ";
        return translationStart + sentence + translationEnd;
    }

    /* Checks if an item is a suffix or clitic. */
    isSuffix(item) {
        // Suffix or clitic starts with = or -, or the entire word is capitalized.
        return item.startsWith("=") || item.startsWith("-") || item === item.toUpperCase();
    }

    /* Displays the created material in a popup window. */
    displayResult(processedMaterial, latexLines) {
        const headerLine = "Format result: ";
        const storyTitleLine = "Story title: " + processedMaterial["title"].replace(/\_/g, " ") + "\n"; 
        const storyIdLine = "Story ID: " + processedMaterial["storyId"].replace(/_/g, "\\_") + "\n"; 
        const sentenceUrlLine = "Sentence URL: " + processedMaterial["sentenceUrl"].replace(/_/g, "\\_") + "\n"; 
        const latexLibraryLine = "Formatted for gb4e and gb4e-modified LaTeX packages: ";


        // let resultContainer;
        // let resultContainers = document.querySelectorAll(`div[className="formatResultContainer"][sentenceId=${this.props.sentenceId}]`); 
        // if (resultContainers.length === 1) {
        //     resultContainer = resultContainers[0];
        // }
        let resultContainer;
        let resultContainers = document.getElementsByClassName("formatResultContainer");
        for (var e of resultContainers) {
          if (e.getAttribute("sentenceId") == this.props.sentenceId) {
            resultContainer = e;
            break;
          }
        }
        this.createParagraphElement(resultContainer, headerLine); 
        this.createParagraphElement(resultContainer, storyTitleLine); 
        this.createParagraphElement(resultContainer, storyIdLine); 
        this.createParagraphElement(resultContainer, sentenceUrlLine); 
        this.createParagraphElement(resultContainer, latexLibraryLine); 
        this.createParagraphElement(resultContainer, latexLines); 
    }

    createParagraphElement(resultContainer, content) {
      const newParagraphElement = document.createElement("pre");
      newParagraphElement.innerHTML = content;
      resultContainer.appendChild(newParagraphElement);
    }

    main() {
        const processedMaterial = this.processSentences();
        const latexLines = this.convertToLatex(processedMaterial);
        this.displayResult(processedMaterial, latexLines);
    }

    handleCloseButtonClick(e) {
        e.preventDefault();

        let resultSections = document.getElementsByClassName("formatResultSection");
        for (var e of resultSections) {
          if (e.getAttribute("sentenceId") == this.props.sentenceId) {
            e.innerHTML = '';
            break;
          }
        }
    }

    render() {
      return (
          <diiv className="formatResultSection" sentenceId={this.props.sentenceId}>
              <div className="formatResultContainer" sentenceId={this.props.sentenceId}></div>
              <button class="confirmButton" onClick={this.handleCloseButtonClick}>Close</button>
          </diiv>
          
      );
    }; 

} 