module.exports = {
    // baseUrl:'./',
    assetsDir:'static',
    assetsPublicPath: './',
    productionSourceMap:false,
    devServer: {
      port: 80,
      // proxy: {
      //   '/novel': {
      //     target: 'http://shuapi.jiaston.com/',
      //     pathRewrite: {
      //       '/novel': ''
      //     },
      //     changeOrigin: true,
      //   }
      // },
      proxy: {
        '/api': {
          // target: 'http://127.0.0.1:8888/api/private/v1/',
          target: 'http://shuapi.jiaston.com/',
          pathRewrite: {
            '/api': ''
          },
          changeOrigin: true,
        }
      },
    },
    

  }