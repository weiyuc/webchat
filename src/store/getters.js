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
