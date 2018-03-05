import data from './mock-data'
const LATENCY = 10
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import * as messageType from './messageType'
import * as mutationType from '../store/mutation-types'
import { MessageBox, Toast } from 'mint-ui'
import * as mutationTypes from '../store/mutation-types'
import store from '../store'

import axios from 'axios'

const debug = true

let api = {
  webSocket: null,
  login({username, password}, cb) {
    axios.post('/apis/user/login', {username, password}).then(
      res => {
        cb(res.responseData)
      },
      () => {
        cb()
      }
    )
  },
  logout(cb) {
    if (this.webSocket) {
      const headers = {};
      headers['token'] = store.getters.token
      this.webSocket.unsubscribe()
      this.webSocket.disconnect(() => {}, headers)
      this.webSocket = null
    }
    if (cb && typeof cb === 'function') {
      cb()
    }
  },
  register({username, password}) {
    return new Promise((resolve, reject) => {
      axios.post('/apis/user/register', {username, password}).then(
        () => {
          resolve()
        },
        () => {
          reject()
        }
      )
    })
  },
  getContacts(cb) {
    axios.post('/apis/friend/getFriendList').then(
      res => {
        cb(res.responseData)
      },
      () => {
        cb()
      }
    )
  },
  dealFriendReq(payload, cb) {
    axios.post('/apis/friend/dealFriendReq', payload).then(
      () => {
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  subscribe(userToken, cb) {
    let sockJs = new SockJS('/webchat')
    this.webSocket = Stomp.over(sockJs)
    const headers = {}
    headers['token'] = userToken.accessToken
    let vm = this
    this.webSocket.connect(headers, function() {
      vm.connectCallback(userToken, cb)
    }, function() {
      cb(false)
      vm.errorCallback()
    })
  },
  connectCallback(userToken, cb) {
    let vm = this
    store.commit(mutationTypes.SET_CONNECTED, true)
    if (cb && typeof cb === 'function') {
      cb(true)
    }
    vm.webSocket.subscribe('/message/' + userToken.username, function (res) {
      if (res.body) {
        let message = $.parseJSON(res.body)
        vm.onMessage(message)
      }
    })
  },
  errorCallback() {
    store.commit(mutationTypes.LOST_CONNECT, true)
    const cleanId = setInterval(() => {
      store.dispatch('subscribe', {accessToken: store.getters.token, username: store.getters.username}).then(() => {
        clearInterval(cleanId)
        store.commit(mutationTypes.LOST_CONNECT, false)
        store.dispatch('getContacts').then(
          () => {
            store.dispatch('getUnReadMessages').then(
              //do nothing
            )
          }
        )
      }).catch(() => {
        //ignore
      })
    }, 1000 * 30)
  },
  onMessage(message) {
    if (debug) {
      console.log('onMessage: ', message)
    }
    let type = message.messageType

    switch (type) {
      case messageType.DELETE_FRIEND:
        store.commit(mutationType.DELETE_FRIEND, message)
        return
        break
      case messageType.ADD_FRIEND:
        this.onAddFriendMsg(message)
        return
        break
      case messageType.SMS:
        store.dispatch('onMessage', {message}).then(
          //ignore
        )
        return
        break
      case messageType.PUSH_OUT:
        return
        break
      case messageType.DEAL_ADD_FRIEND_REQ:
        return
        break
      case messageType.ACCEPTED_FRIEND_REQ:
        store.commit(mutationType.ACCEPTED_FRIEND_REQ, message)
        return
        break
      default:
        new Error('Unknow message type')
        break
    }
  },
  onAddFriendMsg(message) {
    store.commit(mutationTypes.ADD_REQ_CONTACT, message.from)
  },
  getUnreadFriendReq(cb) {
    axios.post('/apis/friend/getFriendReq').then(
      (res) => {
        cb(res.responseData)
      },
      () => {
        cb([])
      }
    )
  },
  setRemark({remark, friendName}, cb) {
    axios.post('/apis/friend/setRemark', {remark: remark, friendName}).then(
      () => {
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  getUnReadMessages(cb) {
    axios.get('/apis/message/getUnReadMessages').then(
      (res) => {
        cb(res.responseData)
      },
      () => {
        cb(false)
      }
    )
  },
  getAllMessages (cb) {
    setTimeout(() => {
      cb(data)
    }, LATENCY)
  },
  getMessages (cb) {
    setTimeout(() => {
      let random = Math.floor(Math.random() * 5)
      let t = {
        id: `m_${new Date().getTime()}`,
        sessionID: data[random].sessionID,
        sessionName: data[random].sessionName,
        authorName: data[random].authorName,
        text: `hello ${Date.now()}`,
        timestamp: Date.now()
      }
      cb(t)
    }, LATENCY)
  },
  createMessage ({content, session}, cb) {
    const message = {
      id: 'm_' + Math.random() * Math.random(),
      from: store.getters.username,
      isMe: true,
      to: session.from,
      content,
      remark: session.remark,
      timestamp: Date.now(),
      messageType: messageType.SMS
    }
    this.webSocket.send('/notify', {}, JSON.stringify(message))
    cb(message)
  },
  remarkHasRead(friendName) {
    let username = store.getters.username
    this.webSocket.send('/notify', {}, JSON.stringify({from: friendName, to: username, messageType: messageType.HAS_READ}))
  }
}

window.onbeforeunload = function() {
  api.logout()
}

export default api
