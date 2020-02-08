# LingView
A web interface for viewing glossed ELAN and FLEx files, optionally with time-synced video and audio. Developed at Brown University as part of the A'ingae Language Documentation initiative, this fork is a generalization of the A'ingae-specific website [here](https://github.com/Designist/Korpus).

Front-end code written with [ReactJS](https://reactjs.org/).

For a high-level description of the software, its potential uses, and the circumstances and design principles of its creation, see our [paper](http://nflrc.hawaii.edu/ldc/vol-14-2020/).

## Getting Started
To begin using this site, you'll need to have NPM and Node.js installed. [Details can be found on the NPM website.](http://blog.npmjs.org/post/85484771375/how-to-install-npm) Then, clone this repository and run the command:
    npm install
    
This will install all the node modules required by our program. After making changes to a file, you'll need to bundle the code with [Webpack](https://webpack.js.org/). To do so, simply type the command "webpack" in the repository's root directory.

**WARNING: Current offline version not compatible with Chrome. See here:  https://stackoverflow.com/questions/20904098/react-js-example-in-tutorial-not-working**

To view the website in Chrome, use a SimpleHTTPServer by typing the following command from your local copy of the Korpus repository:
~~~~
npm install http-server -g
http-server -p 8000
~~~~

To compile the JSX into JS, run:
~~~~
npm install --save-dev babel-plugin-transform-react-jsx -g
babel --plugins transform-react-jsx text_display.jsx --out-file text_display.js
~~~~
