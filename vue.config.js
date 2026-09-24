const { defineConfig } = require('@vue/cli-service')

const { version } = require('./package.json')

module.exports = defineConfig({
  // Keep the deployment path for production, but make local preview work at /.
  publicPath: process.env.NODE_ENV === 'production' ? '/website/' : '/',
  // The app's dependencies are already browser-compatible. Transpiling every
  // dependency makes the first local compile unnecessarily slow.
  transpileDependencies: false,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].APP_VERSION = JSON.stringify(version)
      args[0]['process.env'].BUILD_TIME = JSON.stringify(new Date().toISOString())
      return args
    })
  },
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    open: false,
    proxy: {
      // 代理配置
      '/baseServer': {
        // target: 'http://8.136.1.23:48080/', // 后端开发服务器地址
        // target: 'https://test.education.fetalmedicine.org/', // 后端开发服务器地址
        target: 'http://118.31.236.145/', // aliyun
        // target: 'http://localhost:48080/', // aliyun
        
        // target: 'http://13.41.130.131:48080/', // 后端测试服务器地址

        // http://118.31.236.145
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
