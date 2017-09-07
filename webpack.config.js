let path = require('path');

module.exports = {
     entry: './src/app.js',
     output: {
         path: path.join(__dirname, 'public'),
       filename: 'app.bundle.js',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     }
 }
