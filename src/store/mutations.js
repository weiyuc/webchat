import Vue from 'vue'
import * as types from './mutation-types'
import apis from '../api'

export default {
  [types.CREATE_SESSION] (state, {remark, from}) {
    createSession(state, from, remark)
  },
  [types.RECEIVE_ALL] (state, {messages}) {
    let latestMessage
    messages.forEach(message => {
      // create new session if the session doesn't exist
      if (!state.sessions[message.from]) {
        createSession(state, message.from)
      }
      // mark the latest message
      if (!latestMessage || message.timestamp > latestMessage.timestamp) {
        latestMessage = message
      }
      // add message
      addMessage(state, message)
    })
  },

  [types.RECEIVE_MESSAGE] (state, {message}) {
    if (!state.sessions[message.from]) {
      createSession(state, message.from)
    }
    addMessage(state, message)
  },

  [types.GET_CONTACTS] (state, contacts) {
    state.contacts = contacts
  },

  [types.SWITCH_SESSION] (state, {from, remark}) {
    setCurrentSession(state, from, remark)
  },

  [types.CLEAR_SESSION] (state) {
    state.currentFrom = null
  },

  [types.LOGIN] (state, userToken) {
    login(state, userToken)
  },

  [types.LOGOUT] (state) {
    logout(state)
  },
  [types.SET_CONNECTED] (state, connected) {
    state.connected = connected
  },
  [types.SET_MASK] (state, {group, index, remark}) {
    state.contacts[group][index].remark = remark
  },
  [types.ADD_REQ_CONTACT] (state, username) {
    if (username instanceof Array) {
      username.forEach(u => {
        state.requestContacts.push(u)
        ++ state.unreadReqCount
      })
      return
    }
    state.requestContacts.push(username)
    ++ state.unreadReqCount
  },
  [types.DEAL_FREIND_REQ] (state, username) {
    state.requestContacts = state.requestContacts.filter(u => u !== username)
    -- state.unreadReqCount
  },
  [types.ACCEPTED_FRIEND_REQ] (state, message) {
    let contact = {friendName: message.from}
    let index = state.contacts[message.content]
    if (index) {
      state.contacts[message.content].push(contact)
    } else {
      Vue.set(state.contacts, message.content, [contact])
    }
  },
  [types.DELETE_FRIEND] (state, message) {
    const removed = state.contacts[message.content].filter(c => { return c.friendName !== message.from })
    if (removed.length === 0) {
      Vue.delete(state.contacts, message.content)
    } else {
      Vue.set(state.contacts, message.content, removed)
    }
  },
  setActive(state, active) {
    state.active = active
  }
}

function createSession(state, from, remark) {
  Vue.set(state.sessions, from, {
    from,
    remark,
    messages: [],
    lastMessage: null,
    unreadMsgCount: 0
  })
}

function addMessage(state, message) {
  // add a `isRead` field before adding the message
  console.log(message)

  let from = message.isMe ? message.to : message.from
  message.isRead = from === state.currentFrom
  // add it to the session it belongs to
  const session = state.sessions[from]

  if (!session.messages.some(id => id === message.id)) {
    session.messages.push(message.id)
    session.lastMessage = message
  }
  if (!message.isRead) {
    ++session.unreadMsgCount
    ++state.unreadMsgCount
  }

  if (!message.isMe && message.isRead) {
    console.log('remarkHasRead: ', from)
    apis.remarkHasRead(from)
  }

  console.log(session)
  // add it to the messages map
  Vue.set(state.messages, message.id, message)
}

function setCurrentSession(state, from, remark) {
  state.currentFrom = from
  if (!state.sessions[from]) {
    createSession(state, from, remark)
  }
  // mark session as read
  if (state.sessions[from].lastMessage) {
    state.sessions[from].lastMessage.isRead = true
  }
  state.unreadMsgCount -= state.sessions[from].unreadMsgCount
  if (state.sessions[from].unreadMsgCount > 0) {
      console.log('remarkHasRead: ', from)
      apis.remarkHasRead(from)
  }

  state.sessions[from].unreadMsgCount = 0
}

function login(state, userToken) {
  state.username = userToken.username
  state.token = userToken.accessToken
  state.expiredTime = userToken.expiredTime
  if (localStorage) {
    localStorage.token = userToken.accessToken
    localStorage.username = userToken.username
    localStorage.expiredTime = userToken.expiredTime
  }
}

function logout(state) {
  state.token = ''
  state.username = ''
  state.expiredTime = 0
  if (localStorage) {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('expiredTime')
  }
}
