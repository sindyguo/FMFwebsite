import api from '@/api/index'


// 1. 提取为独立工具方法（放在module外部，可直接调用）
// result[moduleKey][blockKey] 为 blockKey 相同的项组成的数组
function transformContentData(originalList) {
  if (!Array.isArray(originalList) || originalList.length === 0) {
    return {};
  }
  const result = {};
  originalList.forEach(item => {
    const moduleKey = item.module || 'defaultModule';
    const blockKey = item.block || 'defaultBlock';
    if (!result[moduleKey]) {
      result[moduleKey] = {};
    }
    if (!result[moduleKey][blockKey]) {
      result[moduleKey][blockKey] = [];
    }
    result[moduleKey][blockKey].push({ ...item });
  });
  return { content: result };
}

const contentModule = {
  namespaced: true,
  
  state: () => ({
    contentData: localStorage.getItem('contentData') || {}
  }),

  getters: {
    contentData: state => state.contentData
  },
  
  mutations: {
    SET_CONTENT_DATA(state, contentData) {
      state.contentData = contentData
      localStorage.setItem('contentData', contentData)
    },
    CLEAR_CONTENT(state){
      state.contentData = {}
      localStorage.removeItem('contentData')
    }
  },
  
  actions: {
    // 用户退出
    async getContentData({ commit }) {
      try {
        const response = await api.getConfiguration().catch(err => err)
        console.log('getContentData:', response)
        commit('SET_CONTENT_DATA', JSON.stringify(transformContentData(response.data.list)))
        return Promise.resolve(response)
      } catch (error) {
        commit('CLEAR_CONTENT')
        return Promise.reject(error)
      }
    },
    
  },
}

export default contentModule