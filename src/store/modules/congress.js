const STORAGE_KEY_CONGRESSES = 'congress_previousCongresses'
const STORAGE_KEY_DATA = 'congress_congressData'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage 写满时静默忽略
  }
}

const congressModule = {
  namespaced: true,

  state: () => ({
    previousCongresses: loadFromStorage(STORAGE_KEY_CONGRESSES, []),
    congressData: loadFromStorage(STORAGE_KEY_DATA, {})
  }),

  getters: {
    previousCongresses: state => state.previousCongresses,
    congressData: state => state.congressData,
    getCongressDataByYear: state => year => state.congressData[String(year)] || null
  },

  mutations: {
    SET_PREVIOUS_CONGRESSES(state, list) {
      state.previousCongresses = list
      saveToStorage(STORAGE_KEY_CONGRESSES, list)
    },
    SET_CONGRESS_DATA(state, data) {
      state.congressData = data
      saveToStorage(STORAGE_KEY_DATA, data)
    },
    CLEAR_CONGRESS(state) {
      state.previousCongresses = []
      state.congressData = {}
      localStorage.removeItem(STORAGE_KEY_CONGRESSES)
      localStorage.removeItem(STORAGE_KEY_DATA)
    }
  },

  actions: {
    setPreviousCongresses({ commit }, list) {
      commit('SET_PREVIOUS_CONGRESSES', list)
    },
    setCongressData({ commit }, data) {
      commit('SET_CONGRESS_DATA', data)
    },
    clearCongress({ commit }) {
      commit('CLEAR_CONGRESS')
    }
  }
}

export default congressModule
