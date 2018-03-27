import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import * as messageType from './messageType'
import * as mutationTypes from '../store/mutation-types'
import { MessageBox, Toast } from 'mint-ui'
import store from '../store'
import axios from 'axios'
import i18n from '../i18n'
import {uuidv4} from '../utils'

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
  disconnect(cb) {
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
    setTimeout(() => {
      store.dispatch('subscribe_msg',
        {
          accessToken: store.getters.token,
          username: store.getters.username
        }
      ).then(
        () => {
          store.commit(mutationTypes.LOST_CONNECT, false)
          store.dispatch('getContacts')
          store.dispatch('getUnReadMessages')
        }).catch(() => {
          //ignore
        }
      )
    }, 1000 * 5)
  },
  onMessage(message) {
    if (debug) {
      console.log('onMessage: ', message)
    }
    let type = message.messageType

    switch (type) {
      case messageType.DELETE_FRIEND:
        store.commit(mutationTypes.DELETE_FRIEND, message)
        return
        break
      case messageType.ADD_FRIEND:
        this.onAddFriendMsg(message)
        return
        break
      case messageType.SMS:
        store.dispatch('onMessage', {message})
        return
        break
      case messageType.PUSH_OUT:
        this.onPushOut()
        return
        break
      case messageType.DEAL_ADD_FRIEND_REQ:
        return
        break
      case messageType.ACCEPTED_FRIEND_REQ:
        store.commit(mutationTypes.ACCEPTED_FRIEND_REQ, message)
        return
        break
      default:
        new Error('Unknow message type')
        break
    }
  },
  onPushOut() {
    store.commit(mutationTypes.LOGOUT)
    if (this.webSocket) {
      this.webSocket.unsubscribe()
    }
    MessageBox.close()
    let config = {
      confirmButtonText: i18n.t('msg.confirm'),
      cancelButtonText: i18n.t('msg.cancel')
    }
    MessageBox.alert(
      i18n.t('msg.accountLoginOthPlace'),
      i18n.t('msg.tips'),
      config
    ).then(
      () => {
        window.location.reload()
      }
    )
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
  setRealName({realName}, cb) {
    axios.post('/apis/user/setRealName', {realName}).then(
      () => {
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  setGender({gender}, cb) {
    axios.post('/apis/user/setGender', {gender}).then(
      () => {
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  setWhatUp({whatUp}, cb) {
    axios.post('/apis/user/setWhatUp', {whatUp}).then(
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
        cb(-1)
      }
    )
  },
  createMessage ({content, session}, cb) {
    const message = {
      id: 'm_' + uuidv4(),
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
    let param = {from: friendName, to: username, messageType: messageType.HAS_READ}
    this.webSocket.send('/notify', {}, JSON.stringify(param))
  }
}

window.onbeforeunload = function() {
  api.disconnect()
}

export default api
