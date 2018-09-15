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
  [types.GET_FRIEND_INFO] (state, {friendName, friendInfo}) {
    Vue.set(state.friendsInfo, friendName, friendInfo)
  },
  [types.CLEAR_FRIEND_INFO] (state) {
    state.friendsInfo = {}
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
  [types.SET_GENDER] (state, {gender}) {
    state.gender = gender
    try {
      if (gender === null) {
        localStorage.removeItem('gender')
      } else {
        localStorage.gender = gender
      }
    } catch (e) {
      alertTips(state)
    }
  },
  [types.SET_REAL_NAME] (state, {realName}) {
    state.realName = realName
    try {
      localStorage.realName = realName
    } catch (e) {
      alertTips(state)
    }
  },
  [types.SET_WHAT_UP] (state, {whatUp}) {
    state.whatUp = whatUp
    try {
      localStorage.whatUp = whatUp
    } catch (e) {
      alertTips(state)
    }
  },
  [types.SET_PROFILE_PHOTO] (state, {profilePhoto}) {
    state.profilePhoto = profilePhoto
    try {
      localStorage.profilePhoto = profilePhoto
    } catch (e) {
      alertTips(state)
    }
  },
  [types.SET_PHONE_NUMBER] (state, {phoneNumber}) {
    state.phoneNumber = phoneNumber
    try {
      localStorage.phoneNumber = phoneNumber
    } catch (e) {
      alertTips(state)
    }
  },
  [types.SET_MASK] (state, {friendName, remark}) {
    let info = state.friendsInfo[friendName]
    if (info) {
      Vue.set(state.friendsInfo[friendName], 'remark', remark)
    } else {
      Vue.set(state.friendsInfo, friendName, {remark})
    }
  },
  [types.ADD_REQ_CONTACT] (state, username) {
    if (username instanceof Array) {
      username.forEach(u => {
        state.requestContacts.push(u)
        ++state.unreadReqCount
      })
      return
    }
    state.requestContacts.push(username)
    ++state.unreadReqCount
  },
  [types.DEAL_FRIEND_REQ] (state, username) {
    state.requestContacts = state.requestContacts.filter(u => u !== username)
    --state.unreadReqCount
  },
  [types.ACCEPTED_FRIEND_REQ] (state, message) {
    let contact = {friendName: message.from}
    let index = state.contacts[message.content]
    if (index) {
      state.contacts[message.content].push(contact)
    } else {
      Vue.set(state.contacts, message.content, [contact])
    }
    Vue.set(state.friendsInfo, message.from, {username: message.from})
  },
  [types.DELETE_FRIEND] (state, message) {
    const removed = state.contacts[message.content].filter(c => {
      return c.friendName !== message.from
    })
    if (removed.length === 0) {
      Vue.delete(state.contacts, message.content)
    } else {
      Vue.set(state.contacts, message.content, removed)
    }
  },
  [types.LOST_CONNECT] (state, lost) {
    state.lostConnect = lost
  },
  [types.ADD_UN_SEND_MSG] (state, message) {
    state.unSendMsg.push(message)
  },
  [types.SET_MESSAGE_SENT] (state, id) {
    state.messages[id].sent = true
  },
  [types.SET_MESSAGE_TIMEOUT] (state, {id, timeout, timestamp}) {
    state.messages[id].timeout = timeout
    if (timestamp) {
      state.messages[id].timestamp = timestamp
    }
  },
  [types.REMOVE_UNSENT_MESSAGE] (state, id) {
    state.unSendMsg.splice(id, 1)
  },
  [types.GET_NEARBY_PEOPLE] (state, nearbyPeoples) {
    state.nearbyPeoples = nearbyPeoples
  },
  setActive(state, active) {
    state.active = active
  },
  setProfilePhotoVersion(state, profilePhotoVersion) {
    state.profilePhotoVersion = profilePhotoVersion
    try {
      localStorage.profilePhotoVersion = profilePhotoVersion
    } catch (e) {
    }
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
  console.log(message)

  // add a `isRead` field before adding the message
  let from = message.isMe ? message.to : message.from
  message.isRead = from === state.currentFrom
  // add it to the session it belongs to
  const session = state.sessions[from]

  if (!session.messages.some(id => id === message.id)) {
    session.messages.push(message.id)
    session.lastMessage = message
    if (!message.isRead) {
      ++session.unreadMsgCount
      ++state.unreadMsgCount
    }
  }
  if (!message.isMe && message.isRead) {
    apis.remarkHasRead(from)
  }

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
    apis.remarkHasRead(from)
  }

  state.sessions[from].unreadMsgCount = 0
}

function login(state, userToken) {
  state.username = userToken.username
  state.token = userToken.accessToken
  state.expiredTime = userToken.expiredTime
  state.gender = userToken.gender
  state.whatUp = userToken.whatUp || ''
  state.realName = userToken.realName || ''
  state.phoneNumber = userToken.phoneNumber || ''
  state.profilePhoto = userToken.profilePhoto || ''

  try {
    localStorage.token = userToken.accessToken
    localStorage.username = userToken.username
    localStorage.expiredTime = userToken.expiredTime
    if (userToken.gender !== null) {
      localStorage.gender = userToken.gender
    }
    if (userToken.whatUp) {
      localStorage.whatUp = userToken.whatUp
    }
    if (userToken.realName) {
      localStorage.realName = userToken.realName
    }
    if (userToken.phoneNumber) {
      localStorage.phoneNumber = userToken.phoneNumber
    }
    if (userToken.profilePhoto) {
      localStorage.profilePhoto = userToken.profilePhoto
    }
  } catch (e) {
    alertTips(state)
  }
}

function logout(state) {
  state.token = ''
  state.username = ''
  state.expiredTime = 0
  state.gender = null
  state.whatUp = ''
  state.realName = ''
  state.phoneNumber = ''
  state.profilePhoto = ''

  state.currentFrom = null
  state.sessions = {}
  state.messages = {}
  state.unreadMsgCount = 0
  state.unreadReqCount = 0
  state.contacts = {}
  state.friendsInfo = {}
  state.requestContacts = []
  state.connected = false
  state.lostConnect = false
  state.unSendMsg = []

  try {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('expiredTime')
    localStorage.removeItem('gender')
    localStorage.removeItem('whatUp')
    localStorage.removeItem('realName')
    localStorage.removeItem('phoneNumber')
    localStorage.removeItem('profilePhoto')
  } catch (e) {
    alertTips(state)
  }
}

function alertTips(state) {
  if (!state.isAlertTips) {
    alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
    state.isAlertTips = true
  }
}