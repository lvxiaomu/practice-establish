var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: '#source-map',
  entry: {
    bundle: [
      'webpack-hot-middleware/client?reload=true',
      './app/javascripts/index.jsx'
    ]
  },
  output: {
    path: path.join(__dirname, '/public/app/'),
    filename: '[name].js',
    publicPath: '/app/',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
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
