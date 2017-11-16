import Vue from 'vue'
import * as types from './mutation-types'

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
