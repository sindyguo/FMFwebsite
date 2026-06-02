import api from '@/api/index'

const userModule = {
  namespaced: true,
  
  state: () => ({
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')) || '',
    activeId: localStorage.getItem('activeId') || '/',
    loginCount: Number(localStorage.getItem('loginCount')) || 0,
    refreshToken: localStorage.getItem('refreshToken') || '',
    needLogin: false,
  }),

  getters: {
    isLogin: state => !!state.token,
    username: state => state.userInfo?.username || state.userInfo?.nickname || '',
    userName: state => (state.userInfo?.firstName && state.userInfo?.lastName) ? `${state.userInfo?.firstName} ${state.userInfo?.lastName}` : '',
  },
  
  mutations: {
    SET_NEED_LOGIN(state, needLogin) {
      state.needLogin = needLogin
    },
    SET_TOKEN(state, token) {
      state.token = token
      state.needLogin = false
      localStorage.setItem('token', token)
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
      state.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    },
    SET_USER_ID(state, userId) {
      state.userId = userId
      localStorage.setItem('userId', userId)
    },  
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    SET_ACTIVE_ID(state, activeId) {
      state.activeId = activeId
      localStorage.setItem('activeId', activeId)
    },
    SET_LOGIN_COUNT(state, loginCount) {
      state.loginCount = loginCount
      localStorage.setItem('loginCount', loginCount)
    },
    CLEAR_USER(state) {
      state.token = ''
      state.refreshToken = ''
      state.needLogin = false
      state.userId = ''
      state.userInfo = null
      state.loginCount = 0
      this.activeId = ''
      localStorage.removeItem('activeId')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('loginCount')
      localStorage.removeItem('refreshToken')
    }
  },
  
  actions: {
    // 用户登录
    async login({ dispatch, commit }, loginForm) {
      try {
        const response = await api.emailLogin(loginForm)
        if((response.code == 200 || response.code == 0) && response.data.accessToken) {
          commit('SET_TOKEN', response.data.accessToken)
          commit('SET_REFRESH_TOKEN', response.data.refreshToken)
          commit('SET_USER_ID', response.data.userId)
          if (response.data.loginCount !== undefined) {
            commit('SET_LOGIN_COUNT', response.data.loginCount)
          }
          await dispatch('getUserInfo')
        }
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 邮箱验证码登录
    async emailCodeLogin({ dispatch, commit }, loginForm) {
      try {
        const response = await api.emailCodeLogin(loginForm)
        if((response.code == 200 || response.code == 0) && response.data.accessToken) {
          commit('SET_TOKEN', response.data.accessToken)
          commit('SET_REFRESH_TOKEN', response.data.refreshToken)
          commit('SET_USER_ID', response.data.userId)
          if (response.data.loginCount !== undefined) {
            commit('SET_LOGIN_COUNT', response.data.loginCount)
          }
          await dispatch('getUserInfo')
        }
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