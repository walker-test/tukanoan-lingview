import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { App } from './App/App.jsx';

$.getJSON('./data/database.json', function(data) {

  //buttonClicked(){
    //console.log("yes");
//  }

  //  document.getElementById("spanButton") = {this.buttonClicked};
    ReactDOM.render(
        <Router>
            <App data={data} />
        </Router>,
        document.getElementById("main")
    );
});
