import api from '../api'
import * as types from './mutation-types'

export const login = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    api.login(payload, userToken => {
      if (userToken && userToken.accessToken) {
        commit(types.LOGIN, userToken)
        resolve(userToken)
      } else {
        reject()
      }
    })
  })
}

export const subscribe = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    api.subscribe(payload, (connected) => {
      if (connected) {
        getUnreadFriendReq({commit})
        resolve()
      } else {
        reject()
      }
    })
  })
}

export const getContacts = ({commit}) => {
  api.getContacts(contacts => {
    if (contacts) {
      commit(types.GET_CONTACTS, contacts)
    }
  })
}

export const setRemark = ({commit}, payload) => {
  api.setRemark(payload, (res) => {
    if (res) {
      commit(types.SET_MASK, payload)
    }
  })
}

export const getUnreadFriendReq = ({commit}) => {
  api.getUnreadFriendReq((data) => {
    commit(types.ADD_REQ_CONTACT, data)
  })
}

export const getUnReadMessages = ({commit}) => {
  api.getUnReadMessages(messages => {
    if (messages && messages.length > 0) {
      commit(types.RECEIVE_ALL, {messages})
    }
  })
}

export const dealFriendReq = ({commit}, payload) => {
  return new Promise((resolve) => {
    api.dealFriendReq(payload, (res) => {
      if (res && payload.status !== 4) {
        commit(types.DEAL_FREIND_REQ, payload.friendName)
      }
      resolve()
    })
  })
}

export const createSession = ({commit}, payload) => {
  commit(types.CREATE_SESSION, payload)
}

export const onMessage = ({commit}, payload) => {
  commit(types.RECEIVE_MESSAGE, payload)
}

export const sendMessage = ({commit}, payload) => {
  api.createMessage(payload, message => {
    commit(types.RECEIVE_MESSAGE, {
      message
    })
  })
}

export const switchSession = ({commit}, payload) => {
  commit(types.SWITCH_SESSION, payload)
}

export const clearSession = ({commit}) => {
  commit(types.CLEAR_SESSION)
}

export const logout = ({commit}, payload) => {
  return new Promise((resolve) => {
    api.disconnect(() => {
      commit(types.LOGOUT, payload)
      resolve()
    })
  })
}

