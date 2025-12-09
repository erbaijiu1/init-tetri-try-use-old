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
        overlay: false  // 完全禁用错误覆盖层
      }
    }
  }
}