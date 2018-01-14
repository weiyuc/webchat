import Vue from 'vue'
import * as types from './mutation-types'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import * as messageType from '../api/messageType'
import { MessageBox } from 'mint-ui'


export default {
  [types.RECEIVE_ALL] (state, {messages}) {
    let latestMessage
    messages.forEach(message => {
      // create new session if the session doesn't exist
      if (!state.sessions[message.sessionID]) {
        createSession(state, message.sessionID, message.sessionName)
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
    addMessage(state, message)
  },

  [types.SWITCH_SESSION] (state, {id}) {
    setCurrentSession(state, id)
  },

  [types.CLEAR_SESSION] (state) {
    state.currentSessionID = null
  },

  [types.LOGIN] (state, userToken) {
    login(state, userToken)
  },

  [types.LOGOUT] (state) {
    logout(state)
  }
}

function createSession(state, id, name) {
  Vue.set(state.sessions, id, {
    id,
    name,
    messages: [],
    lastMessage: null,
    unreadCount: 0
  })
}

function addMessage(state, message) {
  // add a `isRead` field before adding the message
  message.isRead = message.sessionID === state.currentSessionID
  // add it to the session it belongs to
  const session = state.sessions[message.sessionID]
  if (!session.messages.some(id => id === message.id)) {
    session.messages.push(message.id)
    session.lastMessage = message
  }
  if (!message.isRead) {
    ++session.unreadCount
    ++state.unreadCount
  }
  // add it to the messages map
  Vue.set(state.messages, message.id, message)
}

function setCurrentSession(state, id) {
  state.currentSessionID = id
  if (!state.sessions[id]) {
    debugger
  }
  // mark session as read
  state.sessions[id].lastMessage.isRead = true
  state.unreadCount -= state.sessions[id].unreadCount
  state.sessions[id].unreadCount = 0
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
  let sockJs = new SockJS('/apis/webchat')
  state.websocketSession = Stomp.over(sockJs)
  const headers = {};
  headers['token'] = userToken.accessToken
  state.websocketSession.connect(headers, function () {
    state.websocketSession.subscribe('/message/' + userToken.username, function (res) {
      console.log(res)
      if (res.body) {
        let body = $.parseJSON(res.body)
        switch (body.messageType) {
          case messageType.ADD_FRIEND:

            break
            return
          case messageType.DEAL_ADD_FRIEND_REQ:
            break
            return

          case messageType.PUSH_OUT:
            MessageBox.alert(body.content).then(() => {
              logout(state)
              window.location.href = '/'
            })
            break
            return

          case messageType.SMS:
            break
            return

          case messageType.DELETE_FRIEND:
            break
            return

          default:
            break
            return
        }
      }
    });
  });

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
