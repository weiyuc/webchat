export const sessions = state => state.sessions

export const currentSession = state => {
  return state.currentSessionID
    ? state.sessions[state.currentSessionID]
    : {}
}

export const currentMessages = state => {
  const session = currentSession(state)
  return session.messages
    ? session.messages.map(id => state.messages[id])
    : []
}

export const contacts = state => state.contacts

export const token = state => state.token

export const expiredTime = state => state.expiredTime

export const username = state => state.username
