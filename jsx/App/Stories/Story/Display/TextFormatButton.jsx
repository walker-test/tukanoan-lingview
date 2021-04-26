import React from 'react';
import TierSelectionWindow from "./TierSelectionWindow.jsx";

/* 
  A text format button that renders a window for tier selection on clicked. 
  This tier selection window then leads to a new block displaying the result of LaTeX format conversion.
*/
export class TextFormatButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonClicked : false
        }
        this.handleClick = this.handleClick.bind(this);
      }

    /* Updates the flag when button is clicked so that the tier selection component gets rendered. */
    handleClick(e) {
        e.preventDefault();

        this.setState({
            buttonClicked : true
        });

    }

    componentDidMount() {
        this.setState({ 
            sentence : this.props.sentence,
            metadata : this.props.metadata
        });
    }

    render() {
        return (
            <div class="textFormatSection">
                <button class="textFormatButton" onClick={this.handleClick}>
                    Format
                </button>
                {this.state.buttonClicked ? 
                    <TierSelectionWindow 
                        sentence={this.state.sentence} 
                        metadata={this.state.metadata} 
                        sentenceId = {this.state.metadata["timed"] ? (this.state.sentence["start_time_ms"]-1) : (this.state.sentence["sentence_id"])} /> 
                    : null}
            </div>); 
    }
    
}
