// const path = require('path');

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  devtool: 'cheap-eval-source-map',
  // watch: true,
  output: {
    publicPath: '/arquivos/', // string
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [['latest', { modules: false }]],
        },
      },
    ],
  },
};
