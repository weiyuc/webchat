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

export const subscribe_msg = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    api.subscribe(payload, (connected) => {
      if (connected) {
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
      commit(types.CLEAR_FRIEND_INFO)
      for (let index in contacts) {
        let contact = contacts[index]
        contact.forEach(c => {
          if (c.friendInfo) {
            const friendName = c.friendInfo.username
            const friendInfo = c.friendInfo
            friendInfo.remark = c.remark
            commit(types.GET_FRIEND_INFO, {friendName, friendInfo})
          }
        })
      }
    }
  })
}

export const setRemark = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    api.setRemark(payload, (res) => {
      if (res) {
        commit(types.SET_MASK, payload)
        resolve()
      } else {
        reject()
      }
    })
  })
}

export const setRealName = ({commit}, payload) => {
  api.setRealName(payload, (res) => {
    if (res) {
      commit(types.SET_REAL_NAME, payload)
    }
  })
}

export const setGender = ({commit}, payload) => {
  api.setGender(payload, (res) => {
    if (res) {
      commit(types.SET_GENDER, payload)
    }
  })
}

export const setWhatUp = ({commit}, payload) => {
  api.setWhatUp(payload, (res) => {
    if (res) {
      commit(types.SET_WHAT_UP, payload)
    }
  })
}

export const setProfilePhoto = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    api.setProfilePhoto(payload, (res) => {
      if (res) {
        commit(types.SET_PROFILE_PHOTO, payload)
        resolve()
      } else {
        reject()
      }
    })
  })
}

export const getUnreadFriendReq = ({commit}) => {
  api.getUnreadFriendReq((data) => {
    commit(types.ADD_REQ_CONTACT, data)
  })
}

export const getUnReadMessages = ({commit}) => {
  return new Promise((resolve) => {
    api.getUnReadMessages(messages => {
      if (messages === -1) {
        resolve(false)
      } else {
        if (messages && messages.length > 0) {
          commit(types.RECEIVE_ALL, {messages})
        }
        resolve(true)
      }
    })
  })
}

export const getNearbyPeoples = ({commit}, payload) => {
  return new Promise((resolve) => {
    api.getNearbyPeoples(payload, nearbyPeoples => {
      if (nearbyPeoples === -1) {
        resolve(false)
      } else {
        if (nearbyPeoples && nearbyPeoples.length > 0) {
          commit(types.GET_NEARBY_PEOPLE, nearbyPeoples)
        }
        resolve(true)
      }
    })
  })
}

export const dealFriendReq = ({commit}, payload) => {
  return new Promise((resolve) => {
    api.dealFriendReq(payload, (res) => {
      if (res && payload.status !== 4) {
        commit(types.DEAL_FRIEND_REQ, payload.friendName)
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

export const resend = ({}, payload) => {
  api.resend(payload)
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

