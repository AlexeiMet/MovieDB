const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './source/index.tsx'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
};