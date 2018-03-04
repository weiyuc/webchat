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
  username: localStorage ? localStorage.username : '',
  token: localStorage ? localStorage.token : '',
  expiredTime: localStorage ? localStorage.expiredTime : 0,
  connected: false,
  active: 'message',
  lostConnect: false
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
