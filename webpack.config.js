// const path = require('path');

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  devtool: 'source-map', // none | https://webpack.js.org/configuration/devtool/
  // watch: true,
  output: {
    publicPath: '/arquivos/', // string
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
