const webpack = require('webpack')
const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')
// const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const envs = require('./utils/loadEnvs')

module.exports = merge(base, {
  target: 'node',
  devtool: '#source-map',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      'create-api': './create-api-server.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(less|styl(us)?)$/,
        use: 'null-loader'
      }
    ]
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  // externals: nodeExternals({
  //   // do not externalize CSS files in case we need to import it from a dep
  //   allowlist: /\.css$/
  // }),
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      ...envs,
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
})
