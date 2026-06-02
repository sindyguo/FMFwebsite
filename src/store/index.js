import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/user'
import contentModule from './modules/content'
import congressModule from './modules/congress'

Vue.use(Vuex)

// 主 store 模块
export default new Vuex.Store({
  modules: {
    user: userModule,
    content: contentModule,
    congress: congressModule
  }
})