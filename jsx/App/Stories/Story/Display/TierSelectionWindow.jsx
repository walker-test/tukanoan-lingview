import React from 'react';
import TextFormatResultWindow from "./TextFormatResultWindow.jsx";

export default class TierSelectionWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          buttonClicked : false
        }

        this.handleClick = this.handleClick.bind(this);
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
        let tierMap = {};

        let latexSectionNames = ["original sentence", "morphemes", "morpheme translations", "sentence translation"];
        console.log(this.props.sentenceId);
        let selectionContainer = document.getElementById(this.props.sentenceId);

        for (var latexSectionName of latexSectionNames) {
            const header = document.createElement("p");
            header.innerHTML = `Which tier should formatted as the ${latexSectionName} in the LaTeX example?`;
            selectionContainer.appendChild(header);

            // Create a list of buttons for this Latex section's selection.
            const buttonListContainer = document.createElement("div");  
            for (var tierName of tierNames) {
              const selectionButton = document.createElement("input");
              selectionButton.setAttribute("type", "button");
              selectionButton.setAttribute("id", `${tierName}-for-${latexSectionName}`);
                // buttonListString += 
                //     `<li><input type="button" 
                //                 id="${tierName}-for-${latexSectionName}" 
                //                 value="${tierName}" 
                //                 onClick="processTierSelection(this.id)"></li>`;
              buttonListContainer.append(selectionButton);
            }
        }
        return tierMap;
    }


    handleClick(e) {
      e.preventDefault();

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
              <p> select </p>
              <div className="tierSelectionWrapper" id={this.props.sentenceId}>

              </div>
              <button class="confirmButton" onClick={this.handleClick}>
                  Confirm
              </button>
              {this.state.buttonClicked ? <TextFormatResultWindow /> : null}
          </div>
      );
    }; 
    
}