const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: './src/index.js',
   plugins: [
    new HtmlWebpackPlugin({
      title: 'Video Game',
    }),
   ],
   output: {
    filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
   module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(wav|mp3)$/i,
        type: 'asset/resource',
      },
    ],
  },
 };