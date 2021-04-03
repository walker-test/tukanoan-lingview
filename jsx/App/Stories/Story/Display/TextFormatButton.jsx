import React from 'react';
import TierSelectionWindow from "./TierSelectionWindow.jsx";

/* Models a text format button. */
export class TextFormatButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonClicked : false
        }
        this.handleClick = this.handleClick.bind(this);
      }


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
            <div>
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
