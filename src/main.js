import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 自适应
import 'amfe-flexible'

// 全局样式
import '@/assets/style/index.scss'

// 引入 Element UI
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'


// import 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
// import 'https://fonts.googleapis.com/css?family=Do+Hyeon'

// 使用 Element UI
Vue.use(ElementUI, { locale })

// 或者挂载配置好的实例
import api from '@/api/index'
Vue.prototype.$api = api

import utils from '@/utils/index'
Vue.prototype.$utils = utils

import moment  from 'moment'
Vue.prototype.$moment = moment

Vue.config.errorHandler = (err, vm, info) => {
  console.log('[vue err]: ', err, vm, info)
  return true
}
window.onunhandledrejection = (event) => {
  console.error('[Promise err]:', event.reason)
  event.preventDefault()
  return false
}
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[global err]:', {
    message,
    source,
    lineno,
    colno,
    error
  })
  return true
}

if (localStorage.getItem('appVersion') !== process.env.VUE_APP_VERSION) {
  console.log(process.env);
  localStorage.setItem('appVersion', process.env.VUE_APP_VERSION);
  
  // Check if caches API is available (browser environment)
  if ('caches' in window) {
    // Clear all caches
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
  
  // Optional: Prompt user to refresh
  if (confirm('Detect new version, refresh immediately？')) {
    location.reload(true); // Force reload from server
  }
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')