import React from 'react';

export default class TierSelectionWindow extends React.Component {
    constructor(props) {
        super(props);
      }

      render() {
        return (
            <div className="tierSelectionContainer">
                <p> select {this.props.sentence[0]} </p>
            </div>
        );
      }; 
    
}