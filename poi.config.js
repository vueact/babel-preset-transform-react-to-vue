const pkg = require('./package')

module.exports = options => ({
  entry: 'repl/index.js',
  dist: 'repl/dist',
  html: {
    title: 'Transform React to Vue online REPL',
    description: pkg.description
  },
  // Disable sourceMap in production mode
  sourceMap: options.mode === 'development',
  extendWebpack(config) {
    config.module.noParse.add(/babel-standalone/)
    config.module.rule('js')
      .include.add(/babel-plugin/)
  },
  presets: [
    require('poi-preset-offline')(),
    require('poi-preset-bundle-report')()
  ],
  postcss: [
    require('postcss-nested')()
  ]
})
