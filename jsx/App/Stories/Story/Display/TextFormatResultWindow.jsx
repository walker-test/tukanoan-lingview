import React from 'react';

export default class TextFormatResultWindow extends React.Component {

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
        //console.log(this.props.sentence);
    }

    render() {
      return (
          <div className="formatResultContainer">
              <p> Result </p>
          </div>
      );
    }; 

} 