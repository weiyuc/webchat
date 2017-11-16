import api from '../api'
import * as types from './mutation-types'

export const getAllMessages = ({commit}) => {
    api.getAllMessages(messages => {
        commit(types.RECEIVE_ALL, {
            messages
        })
    })
}

export const getMessages = ({commit}) => {
    api.getMessages(message => {
        commit(types.RECEIVE_MESSAGE, {
            message
        })
    })
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

