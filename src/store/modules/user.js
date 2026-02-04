import api from '@/api/index'

const userModule = {
  namespaced: true,
  
  state: () => ({
    token: sessionStorage.getItem('token') || '',
    userId: sessionStorage.getItem('userId') || '',
    userInfo: sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo')) || '',
    activeId: sessionStorage.getItem('activeId') || '/'
  }),

  getters: {
    isLogin: state => !!state.token,
    username: state => state.userInfo?.username || state.userInfo?.nickname || ''
  },
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      sessionStorage.setItem('token', token)
    },
    SET_USER_ID(state, userId) {
      state.userId = userId
      sessionStorage.setItem('userId', userId)
    },  
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    SET_ACTIVE_ID(state, activeId) {
      state.activeId = activeId
      sessionStorage.setItem('activeId', activeId)
    },
    CLEAR_USER(state) {
      state.token = ''
      state.userId = ''
      state.userInfo = null
      this.activeId = ''
      sessionStorage.removeItem('activeId')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('userInfo')
    }
  },
  
  actions: {
    // 用户登录
    async login({ dispatch, commit }, loginForm) {
      try {
        const response = await api.login(loginForm).catch(err => err)
        commit('SET_TOKEN', response.data.accessToken)
        commit('SET_USER_ID', response.data.userId)
        await dispatch('getUserInfo')
        console.log('login success:', response)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 获取用户信息
    async getUserInfo({ commit, state }) {
      if (!state.token) {
        return Promise.reject(new Error('not login'))
      }
      
      try {
        const response = await api.getUserInfo().catch(err => err)
        commit('SET_USER_INFO', response.data)
        return Promise.resolve(response)
      } catch (error) {
        commit('CLEAR_USER')
        return Promise.reject(error)
      }
    },
    
    // 用户退出
    async logout({ commit }) {
      try {
        const response = await api.logout().catch(err => err)
        return Promise.resolve(response)
      } catch (error) {
        console.error('logout error:', error)
      } finally {
        commit('CLEAR_USER')
      }
    },
    changeActiveId({ commit }, activeId) {
      console.log(activeId, 'activeId',111)
      commit('SET_ACTIVE_ID', activeId)
    }
  },
}

export default userModule