import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  currentFrom: null,
  sessions: {},
  messages: {},
  unreadMsgCount: 0,
  unreadReqCount: 0,
  contacts: {},
  requestContacts: [],
  username: localStorage.username || '',
  token: localStorage.token || '',
  expiredTime: localStorage.expiredTime || 0,
  connected: false,
  active: 'message',
  lostConnect: false
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations
})
