module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      hot: true,
      port: 10086,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    }
  }
}