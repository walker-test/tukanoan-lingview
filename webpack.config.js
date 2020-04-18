var path = require('path');

module.exports = {
  entry: './jsx/AppContainer.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js'),
    publicPath: './js/'
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: ['syntax-dynamic-import']
      }
    }]
  }
};
