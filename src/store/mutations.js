import Vue from 'vue'
import * as types from './mutation-types'

export default {
    [types.RECEIVE_ALL] (state, {messages}) {
        let latestMessage
        messages.forEach(message => {
            // create new thread if the thread doesn't exist
            if (!state.threads[message.threadID]) {
                createThread(state, message.threadID, message.threadName)
            }
            // mark the latest message
            if (!latestMessage || message.timestamp > latestMessage.timestamp) {
                latestMessage = message
            }
            // add message
            addMessage(state, message)
        })
    },

    [types.RECEIVE_MESSAGE] (state, {messages}) {
        addMessage(state, messages)
    },

    [types.SWITCH_THREAD] (state, {id}) {
        setCurrentThread(state, id)
    }
}

function createThread(state, id, name) {
    Vue.set(state.threads, id, {
        id,
        name,
        messages: [],
        lastMessage: null
    })
}

function addMessage(state, message) {
    // add a `isRead` field before adding the message
    message.isRead = message.threadID === state.currentThreadID
    // add it to the thread it belongs to
    const thread = state.threads[message.threadID]
    if (!thread.messages.some(id => id === message.id)) {
        thread.messages.push(message.id)
        thread.lastMessage = message
    }
    if (!message.isRead) {
        if (thread.unreadCount) {
            thread.unreadCount += 1
        } else {
            thread.unreadCount = 1
        }
        state.unreadCount += 1
    }
    // add it to the messages map
    Vue.set(state.messages, message.id, message)
}

function setCurrentThread(state, id) {
    state.currentThreadID = id
    if (!state.threads[id]) {
        debugger
    }
    // mark thread as read
    state.threads[id].lastMessage.isRead = true
    state.unreadCount -= state.threads[id].unreadCount
    state.threads[id].unreadCount = 0
}
