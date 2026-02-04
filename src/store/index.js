import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/user'

Vue.use(Vuex)

// 主 store 模块
export default new Vuex.Store({
  modules: {
    // 可以在这里添加模块
    user: userModule
  }
})