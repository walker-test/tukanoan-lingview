import React from 'react';
import TextFormatResultWindow from "./TextFormatResultWindow.jsx";
import { TranslatableText } from "../../../locale/TranslatableText.jsx";
import { tierSelectionConfirmButtonText } from "../../../locale/LocaleConstants.jsx";

var htmlEscape = require("html-es6cape");


/*
  This class models a window where the user tells LingView which tier should 
  be matched to which LaTeX section during the conversion. 
  The user does this by selecting the tier out of a list of radio buttons.
  When the Confirm button is clicked, the text is processed to be formatted,
  and the result is shown in a TextFormatResultWindow that gets rendered after 
  the confirm button is clicked. 
*/ 
export default class TierSelectionWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          buttonClicked : false,
          tierMap : {}
        }

        this.handleConfirmButtonClick = this.handleConfirmButtonClick.bind(this);
        this.latexSectionNames = ["original sentence", "morphemes", "morpheme translations", "sentence translation"];
    }

    /* Retrieves all the tier names for this story. */
    getTierNames() {
      let tierNames = [];
      for (var tierEntry of this.props.sentence["dependents"]) {
        tierNames.push(tierEntry["tier"]);
      }
      return tierNames;
    }

    /* 
      Displays the tier selection window where the user tells LingView 
      which tier corresponds to which section in the LaTeX example through
      selecting from a radio button list form.
    */
    displayTierSelectionWindow() {
        let selectionContainer;
        let selectionContainers = document.getElementsByClassName("tierSelectionForm");
        for (var e of selectionContainers) {
          if (e.getAttribute("id") == this.props.sentenceId) {
            selectionContainer = e;
            break;
          }
        }
        
        // Add a header line that shows the purpose of this selection form. 
        const header = document.createElement("p");
        header.innerHTML = "Please select the tier that corresponds to each section in the LaTeX formating."
        selectionContainer.appendChild(header);

        // For each LaTeX section that needs to be formatted, create a list of radio buttons
        // so that the user can select which tier is matched to this section.
        let tierNames = this.getTierNames();
        for (var latexSectionName of this.latexSectionNames) {
          const tierSelectionRow = this.createButtonList(tierNames, latexSectionName); 
          selectionContainer.appendChild(tierSelectionRow);
        }
    }

    /* 
     Creates a list of radio buttons for all the tier names. 
     The tierNames passed in here have not been escaped. They may contain special characters.
    */
    createButtonList(tierNames, latexSectionName) {

      const tierSelectionRow = document.createElement("div");
      tierSelectionRow.setAttribute("className", "tierSelectionRow");

      const sectionName = document.createElement("div");
      sectionName.innerHTML = `${latexSectionName}`;
      tierSelectionRow.appendChild(sectionName);

      // Create a list of radio buttons for this Latex section's selection.
      const buttonListContainer = document.createElement("div");  
      // Iterate through tier names and create a list of radio buttons corresponding to each tier. 
      for (let i = 0; i < tierNames.length; i++) {
        // Call escape function on tier names so that special characters can be used as HTML property names.
        const escapedTierName = htmlEscape(tierNames[i]);

        const selectionButton = document.createElement("input");
        const groupName = `button-${this.props.sentenceId}-for-${latexSectionName}`;
        const buttonId = `button-${this.props.sentenceId}-${escapedTierName}-for-${latexSectionName}`;
        selectionButton.setAttribute("type", "radio");
        selectionButton.setAttribute("groupName", groupName);
        selectionButton.setAttribute("id", buttonId);
        selectionButton.setAttribute("value", `${escapedTierName}`);
        selectionButton.setAttribute("name", `${latexSectionName}`);

        // Default select the first tier.
        if (i === 0) {
          selectionButton.setAttribute("checked", true);
        }

        const buttonLabel = document.createElement("label");
        buttonLabel.setAttribute("for", buttonId);
        buttonLabel.innerHTML = `${escapedTierName}`;

        buttonListContainer.appendChild(selectionButton);
        buttonListContainer.appendChild(buttonLabel);
      }
      tierSelectionRow.appendChild(buttonListContainer);
      return tierSelectionRow;
    }

    /* 
     When the confirm button is clicked, 
     saves a map between latex section names and their selected tier names in state. 
    */
    handleConfirmButtonClick(e) {
      e.preventDefault();

      let tierMap = {};
      // Go through the selected radio buttons for this sentence and retrieve their value.
      for (var latexSectionName of this.latexSectionNames) {
        const buttons = document.querySelectorAll(
              `input[name="${latexSectionName}"][groupName="button-${this.props.sentenceId}-for-${latexSectionName}"]`);
        let selectedValue;
        for (const button of buttons) {
            if (button.checked) {
                selectedValue = button.value;
                break;
            }
        }
        tierMap[`${latexSectionName}`] = selectedValue;
      }

      // Add the tierMap to the state so that this object can be passed
      // on to the result window.
      this.setState({
        buttonClicked : true,
        tierMap : tierMap
      }); 

    }

    componentDidMount() {
      this.displayTierSelectionWindow();
    }

    render() {
      return (
          <div className="tierSelectionSection">
              <div className="tierSelectionWrapper">
                <form className="tierSelectionForm" id={this.props.sentenceId}></form>
                <button class="confirmButton" onClick={this.handleConfirmButtonClick}>
                  <TranslatableText dictionary={tierSelectionConfirmButtonText} />
                </button>
              </div>
              
              {this.state.buttonClicked ? 
                <TextFormatResultWindow 
                  sentenceId={this.props.sentenceId} 
                  tierMap={this.state.tierMap} 
                  sentence={this.props.sentence}
                  metadata={this.props.metadata}/> : null}
          </div>
      );
    }; 
    
}
