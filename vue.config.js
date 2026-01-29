const { defineConfig } = require('@vue/cli-service')
const { version } = require('./package.json')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/website/',
  chainWebpack: config => {
    // 生成manifest.json文件
    config.plugin('define').tap(args => {
      args[0]['process.env'].APP_VERSION = JSON.stringify(version)
      args[0]['process.env'].BUILD_TIME = JSON.stringify(new Date().toISOString())
      return args
    })
  },
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      // 代理配置
      '/baseServer': {
        // target: 'http://8.136.1.23:48080/', // 后端开发服务器地址
        target: 'https://test.education.fetalmedicine.org/', // 后端开发服务器地址
        // target: 'http://13.41.130.131:48080/', // 后端测试服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/baseServer': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            // require('postcss-pxtorem')({
            //   rootValue: 192, 
            //   propList: ['*', '!font-size']
            // })
          ]
        }
      },
      scss: {
        additionalData: `
          @import "@/assets/style/variable.scss";
        `
      }
    }
  }
})
