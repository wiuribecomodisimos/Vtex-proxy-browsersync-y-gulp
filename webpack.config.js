// const path = require('path');

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  devtool: 'cheap-eval-source-map',
  // watch: true,
  output: {
    publicPath: '/', // string
    filename: 'bundle.js',
  },
};
