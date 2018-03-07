export const sessions = state => state.sessions

export const currentSession = state => {
  return state.currentFrom
    ? state.sessions[state.currentFrom]
    : {}
}

export const currentMessages = state => {
  const session = currentSession(state)
  return session.messages
    ? session.messages.map(id => state.messages[id])
    : []
}

export const unreadReqCount = state => state.unreadReqCount

export const unreadMsgCount = state => state.unreadMsgCount

export const contacts = state => state.contacts

export const requestContacts = state => state.requestContacts

export const token = state => state.token

export const active = state => state.active

export const expiredTime = state => state.expiredTime

export const username = state => state.username

export const connected = state => state.connected

export const lostConnect = state => state.lostConnect

export const isLogin = state => {
  return state.token && state.expiredTime && state.expiredTime > Date.now()
}
