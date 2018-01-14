import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  currentSessionID: null,
  sessions: {},
  messages: {},
  unreadCount: 0,
  contacts: {},
  username: '',
  token: '',
  expiredTime: 0,
  websocketSession: null
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
