module.exports = {
    devServer: {
      port: 80,
      proxy: {
        '^/api': {
          target: 'http://127.0.0.1:8888/api/private/v1/',
          pathRewrite: {
            '^/api': ''
          },
          changeOrigin: true
        }
      }
    }
  }