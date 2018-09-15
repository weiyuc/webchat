import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import * as messageType from './messageType'
import * as mutationTypes from '../store/mutation-types'
import { MessageBox, Toast, Indicator } from 'mint-ui'
import store from '../store'
import axios from 'axios'
import i18n from '../i18n'
import {uuidv4} from '../utils'

const debug = true

let api = {
  webSocket: null,
  reconnecting: false,
  cleanId: -1,
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
    if (this.cleanId !== -1) {
      clearInterval(this.cleanId)
      this.cleanId = -1
    }
    if (this.webSocket && this.webSocket.connected) {
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
        let message = JSON.parse(res.body)
        vm.onMessage(message)
      }
    })
    this.resendAllMsg()
  },
  errorCallback() {
    if (!store.getters.expiredTime || store.getters.expiredTime < Date.now()) {
      return
    }
    store.commit(mutationTypes.LOST_CONNECT, true)
    store.commit(mutationTypes.SET_CONNECTED, false)
    this.checkUnsentMsgTimeout()
    if (this.cleanId === -1) {
      this.reconnect()
    }

  },
  reconnect() {
    this.cleanId = setInterval(() => {
      if (this.reconnecting || this.cleanId === -1) {
        return
      }
      this.reconnecting = true
      let vm = this
      store.dispatch('subscribe_msg',
        {
          accessToken: store.getters.token,
          username: store.getters.username
        }
      ).then(
        () => {
          clearInterval(vm.cleanId)
          vm.cleanId = -1
          store.commit(mutationTypes.LOST_CONNECT, false)
          store.dispatch('getContacts')
          store.dispatch('getUnReadMessages')
          vm.reconnecting = false
        }).catch(() => {
          vm.reconnecting = false
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
      case messageType.MEDIA:
        store.dispatch('onMessage', {message})
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
    this.disconnect()
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
    Indicator.open()
    axios.post('/apis/friend/setRemark', {remark: remark, friendName}).then(
      () => {
        Indicator.close()
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  setRealName({realName}, cb) {
    Indicator.open()
    axios.post('/apis/user/setRealName', {realName}).then(
      () => {
        Indicator.close()
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  setGender({gender}, cb) {
    Indicator.open()
    axios.post('/apis/user/setGender', {gender}).then(
      () => {
        Indicator.close()
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  setWhatUp({whatUp}, cb) {
    Indicator.open()
    axios.post('/apis/user/setWhatUp', {whatUp}).then(
      () => {
        Indicator.close()
        cb(true)
      },
      () => {
        cb(false)
      }
    )
  },
  setProfilePhoto({profilePhoto}, cb) {
    axios.post('/apis/user/setProfilePhoto', {profilePhoto}).then(
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
  getNearbyPeoples({x, y}, cb) {
    axios.post('/apis/user/getNearbyPeoples', {x, y}).then(
      (res) => {
        cb(res.responseData)
      },
      () => {
        cb(-1)
      }
    )
  },
  clearLocation(cb) {
    axios.post('/apis/user/clearLocation').then(
      () => {
        cb(true)
      },
      (err) => {
        console.error(err)
        cb(false)
      }
    )
  },
  createMessage ({content, session, data, duration}, cb) {
    const message = {
      id: 'm_' + uuidv4(),
      from: store.getters.username,
      isMe: true,
      to: session.from,
      content,
      remark: session.remark,
      timestamp: Date.now(),
      messageType: duration ? messageType.MEDIA : messageType.SMS,
      data,
      duration,
      sent: false,
      timeout: false
    }
    if (!store.getters.lostConnect) {
      if (duration) {
        this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
      } else {
        this.webSocket.send('/notify', {}, JSON.stringify(message))
      }
      message.sent = true
    } else {
      store.commit(mutationTypes.ADD_UN_SEND_MSG, message)
    }
    cb(message)
  },
  resend(message) {
    store.commit(mutationTypes.SET_MESSAGE_TIMEOUT, {id: message.id, timeout: false, timestamp: Date.now()})
    if (!store.getters.lostConnect) {
      if (message.duration) {
        this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
      } else {
        this.webSocket.send('/notify', {}, JSON.stringify(message))
      }
      message.sent = true
    } else {
      store.commit(mutationTypes.ADD_UN_SEND_MSG, message)
    }
  },
  remarkHasRead(friendName) {
    let username = store.getters.username
    let param = {from: friendName, to: username, messageType: messageType.HAS_READ}
    this.webSocket.send('/notify', {}, JSON.stringify(param))
  },
  resendAllMsg() {
    let messages = store.getters.unSendMsg
    if (messages.length > 0) {
      for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i]
        if (Date.now() - message.timestamp > 60000) {
          store.commit(mutationTypes.SET_MESSAGE_TIMEOUT, {id: message.id, timeout: true})
          store.commit(mutationTypes.REMOVE_UNSENT_MESSAGE, i)
          continue
        }
        if (store.getters.connected) {

          if (message.duration) {
            this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
          } else {
            this.webSocket.send('/notify', {}, JSON.stringify(message))
          }

          store.commit(mutationTypes.SET_MESSAGE_SENT, message.id)
          store.commit(mutationTypes.REMOVE_UNSENT_MESSAGE, i)
          continue
        }
        break
      }
    }
  },
  checkUnsentMsgTimeout() {
    let messages = store.getters.unSendMsg
    if (messages.length > 0) {
      for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i]
        if (Date.now() - message.timestamp > 60000) {
          store.commit(mutationTypes.SET_MESSAGE_TIMEOUT, {id: message.id, timeout: true})
          store.commit(mutationTypes.REMOVE_UNSENT_MESSAGE, i)
          continue
        }
      }
    }
  }
}

window.onbeforeunload = function() {
  api.disconnect()
}

export default api
