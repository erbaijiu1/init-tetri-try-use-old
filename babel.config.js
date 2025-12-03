// babel.config.js
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: false
    }]
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}