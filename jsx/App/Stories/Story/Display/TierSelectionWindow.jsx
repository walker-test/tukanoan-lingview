import React from 'react';
import TextFormatResultWindow from "./TextFormatResultWindow.jsx";

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
      which tier corresponds to which section in the LaTeX example.
    */
    displayTierSelectionWindow() {
        let tierNames = this.getTierNames();

        let selectionContainer;
        let selectionContainers = document.getElementsByClassName("tierSelectionForm");
        for (var e of selectionContainers) {
          if (e.getAttribute("id") == this.props.sentenceId) {
            selectionContainer = e;
            break;
          }
        }
       
        for (var latexSectionName of this.latexSectionNames) {
            const header = document.createElement("p");
            header.innerHTML = `Which tier should formatted as the ${latexSectionName} section in the LaTeX example?`;
            selectionContainer.appendChild(header);

            // Create a list of radio buttons for this Latex section's selection.
            const buttonListContainer = document.createElement("div");  
            for (var tierName of tierNames) {
              const selectionButton = document.createElement("input");
              const groupName = `button-${this.props.sentenceId}-for-${latexSectionName}`;
              const buttonId = `button-${this.props.sentenceId}-${tierName}-for-${latexSectionName}`;
              selectionButton.setAttribute("type", "radio");
              selectionButton.setAttribute("groupName", groupName);
              selectionButton.setAttribute("id", buttonId);
              selectionButton.setAttribute("value", `${tierName}`);
              selectionButton.setAttribute("name", `${latexSectionName}`);

              const buttonLabel = document.createElement("label");
              buttonLabel.setAttribute("for", buttonId);
              buttonLabel.innerHTML = `${tierName}`;

              buttonListContainer.appendChild(selectionButton);
              buttonListContainer.appendChild(buttonLabel);
            }
            selectionContainer.appendChild(buttonListContainer);
        }
    }

    /* Saves a map between latex section names and their selected tier names in state. */
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

      // TODO: make the selection window invisible
      document.getElementsByClassName("tierSelectionWrapper")[0].style.display = "none";;

    }

    componentDidMount() {
      this.displayTierSelectionWindow();
    }

    render() {
      return (
          <div className="tierSelectionContainer">
              <div className="tierSelectionWrapper">
                <form className="tierSelectionForm" id={this.props.sentenceId}></form>
                <button class="confirmButton" onClick={this.handleConfirmButtonClick}>
                    Confirm
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
