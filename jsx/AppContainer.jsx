import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { App } from './App/App.jsx';

import('../data/database.json').then((data) => {
    ReactDOM.render(
        <Router>
            <App data={data} />
        </Router>,
        document.getElementById("main")
    );
});