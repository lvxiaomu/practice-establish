const path = require('path')
const webpack = require('webpack')
const cdn = require('./config').cdn


module.exports = {
  entry: {
    bundle: './app/javascripts/index.jsx'
  },
  output: {
    path: path.join(__dirname, '/public/app/[hash]'),
    filename: '[name].js',
    publicPath: `${cdn}/app/[hash]/`,
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      //'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    // TODO 代码的进一步压缩混淆, 能在现在基础上减少300k容量
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
    require('./writeStatsToFile'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0', 'stage-1']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.jpe?g$|\.gif$|\.png|\.svg|\.woff2$/i,
        loader: "file"
      }
    ]
  }
}
