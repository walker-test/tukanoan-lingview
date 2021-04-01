import React from 'react';
import TextFormatResultWindow from "./TextFormatResultWindow.jsx";

export default class TierSelectionWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          buttonClicked : false
        }

        this.handleClick = this.handleClick.bind(this);
        this.latexSectionNames = ["original sentence", "morphemes", "morpheme translations", "sentence translation"];
    }

    getTierNames() {
      let tierNames = [];
      for (var tierEntry of this.props.sentence["dependents"]) {
          tierNames.push(tierEntry["tier"]);
      }
      return tierNames;
    }

    displayTierSelectionWindow() {
        let tierNames = this.getTierNames();

        let selectionContainer = document.getElementById(this.props.sentenceId);
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

    processTierSelection(buttonId) {
      console.log(buttonId);
    }

    handleClick(e) {
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
      
      console.log(tierMap);
      this.setState({
        buttonClicked : true
      }); 
    }

    componentDidMount() {
      this.displayTierSelectionWindow();
    }

    render() {
      return (
          <div className="tierSelectionContainer">
              <form className="tierSelectionWrapper" id={this.props.sentenceId}></form>
              <button class="confirmButton" onClick={this.handleClick}>
                  Confirm
              </button>
              {this.state.buttonClicked ? <TextFormatResultWindow /> : null}
          </div>
      );
    }; 
    
}