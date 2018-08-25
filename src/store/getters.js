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

export const gender = state => state.gender === null ? null : parseInt(state.gender)

export const whatUp = state => state.whatUp

export const realName = state => state.realName

export const phoneNumber = state => state.phoneNumber

export const connected = state => state.connected

export const lostConnect = state => state.lostConnect

export const unSendMsg = state => state.unSendMsg

export const profilePhoto = state => state.profilePhoto

export const profilePhotoVersion = state => state.profilePhotoVersion

export const friendsInfo = state => state.friendsInfo

export const isAlertTips = state => state.isAlertTips

export const nearbyPeoples = state => state.nearbyPeoples